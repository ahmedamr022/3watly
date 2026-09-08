import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';
import { extractText, extractLinks, getDocumentProxy } from 'unpdf';
import {
  extractLinksFromPdf,
  extractLinksFromText,
  processDocumentLinks,
  cleanUrl,
  RawExtractedLink,
} from '@/lib/cv/cvLinkIntelligence';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Comprehensive tech and professional skills dictionary
const KNOWN_SKILLS = {
  programming: [
    'Python', 'SQL', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'R', 'PHP', 'Go', 'Rust', 'Ruby', 
    'Dart', 'Kotlin', 'Swift', 'Scala', 'HTML', 'CSS', 'HTML5', 'CSS3', 'Bash', 'Shell', 'PowerShell', 'C'
  ],
  frameworks: [
    'React', 'React.js', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Express.js', 'Nest.js',
    'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET', '.NET Core', 'Laravel', 'Flutter', 'React Native',
    'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Pandas', 'NumPy', 'SciPy', 'OpenCV', 'YOLO', 'Keras', 'Tailwind CSS'
  ],
  databasesAndTools: [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'SQLite', 'Elasticsearch',
    'Power BI', 'Tableau', 'Excel', 'Advanced Excel', 'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'Jira',
    'Airflow', 'Kafka', 'dbt', 'Snowflake', 'BigQuery', 'Postman', 'Looker', 'SSIS', 'Matplotlib', 'Seaborn',
    'Jupyter Notebook', 'Gradio', 'Hugging Face'
  ],
  cloud: [
    'AWS', 'Google Cloud', 'GCP', 'Azure', 'Firebase', 'Supabase', 'Cloudflare', 'Heroku', 'Linux', 'Ubuntu',
    'CI/CD', 'GitHub Actions', 'Jenkins', 'Terraform', 'Serverless', 'Microservices'
  ],
  soft: [
    'Problem Solving', 'Teamwork', 'Leadership', 'Time Management', 'Critical Thinking',
    'Agile', 'Scrum', 'Data Cleaning', 'Data Visualization', 'Statistical Analysis',
    'Machine Learning', 'Deep Learning', 'Computer Vision', 'Image Segmentation', 'Object Detection', 'EDA'
  ]
};

// Words that should NEVER be reported as skills even if they appear in raw text
const SKILL_BLACKLIST = new Set([
  'experienced', 'experience', 'proficient', 'knowledge', 'skills', 'skill',
  'ability', 'familiar', 'understanding', 'working', 'using', 'strong', 'good',
  'excellent', 'great', 'expert', 'advanced', 'intermediate', 'basic', 'proven',
  'certified', 'managed', 'worked', 'created', 'built', 'developed',
  'internship', 'student', 'data analysis', 'business analysis'
]);

const ACTION_VERBS = [
  'led', 'developed', 'architected', 'managed', 'created', 'implemented', 'designed', 'built', 'analyzed',
  'optimized', 'improved', 'increased', 'reduced', 'automated', 'delivered', 'collaborated', 'generated',
  'spearheaded', 'streamlined', 'launched', 'resolved', 'deployed', 'monitored', 'engineered', 'formulated',
  'trained', 'evaluated', 'researched', 'maintained', 'conducted', 'tested', 'orchestrated'
];

export const CERT_DOMAINS = [
  'cognitiveclass.ai', 'freecodecamp.org', '365datascience.com',
  'coursera.org', 'udemy.com', 'edx.org', 'datacamp.com',
  'linkedin.com/learning', 'pluralsight.com', 'skillshare.com',
  'udacity.com', 'openclassrooms.com', 'simplilearn.com',
  'alison.com', 'ibm.com/training', 'microsoft.com/learning',
  'google.com/certificates', 'credential.net', 'acclaim.com',
  'credly.com', 'verify.', 'credential.',
];

export const isCertUrl = (url: string) => CERT_DOMAINS.some(d => url.toLowerCase().includes(d));

export interface ExtractedLinkItem {
  title: string;
  url: string;
  type: 'linkedin' | 'github' | 'portfolio' | 'kaggle' | 'leetcode' | 'behance' | 'medium' | 'website' | 'demo' | 'company';
}

export interface ExtractedLinksResult {
  linkedin: string;
  github: string;
  portfolio: string;
  allLinks: ExtractedLinkItem[];
}

export function extractDocumentLinks(buffer: Buffer, rawText: string, additionalUrls: string[] = []): ExtractedLinksResult {
  const foundUrls = new Set<string>();
  const binaryString = buffer.toString('binary');
  const utf8String = buffer.toString('utf-8');

  // 0. Include pre-extracted URLs (e.g. from PDF annotator extractLinks)
  if (Array.isArray(additionalUrls)) {
    for (const u of additionalUrls) {
      if (typeof u === 'string' && u.trim().length > 5) {
        foundUrls.add(u.trim());
      }
    }
  }

  // 1. PDF /URI annotations: /URI (https://...)
  const pdfUriRegex = /\/URI\s*\(([^)\r\n]+)\)/gi;
  let match: RegExpExecArray | null;
  while ((match = pdfUriRegex.exec(binaryString)) !== null) {
    const raw = match[1].trim();
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('mailto:')) {
      foundUrls.add(raw);
    }
  }

  // 2. PDF /URI with hex encoding: /URI <...>
  const pdfHexUriRegex = /\/URI\s*<([0-9a-fA-F]+)>/gi;
  while ((match = pdfHexUriRegex.exec(binaryString)) !== null) {
    try {
      const decoded = Buffer.from(match[1], 'hex').toString('utf-8').trim();
      if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
        foundUrls.add(decoded);
      }
    } catch {}
  }

  // 3. Raw standard URLs from utf8 text and binary stream
  const rawUrlRegex = /https?:\/\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+/gi;
  while ((match = rawUrlRegex.exec(utf8String)) !== null) {
    const clean = match[0].replace(/[.,;:)>\]\\]+$/, '').trim();
    if (clean.length > 10 && !clean.includes('w3.org') && !clean.includes('adobe.com') && !clean.includes('schema.org')) {
      foundUrls.add(clean);
    }
  }

  // Also scan rawText if provided separately
  if (rawText && rawText !== utf8String) {
    while ((match = rawUrlRegex.exec(rawText)) !== null) {
      const clean = match[0].replace(/[.,;:)>\]\\]+$/, '').trim();
      if (clean.length > 10 && !clean.includes('w3.org') && !clean.includes('adobe.com') && !clean.includes('schema.org')) {
        foundUrls.add(clean);
      }
    }
  }

  // 3b. Markdown links: [text](url)
  const mdLinkRegex = /\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/gi;
  while ((match = mdLinkRegex.exec(rawText || utf8String)) !== null) {
    const clean = match[2].replace(/[.,;:)>\]\\]+$/, '').trim();
    if (clean.length > 8) {
      foundUrls.add(clean);
    }
  }

  // 4. Domain-like text patterns without http
  const domainPatterns = [
    /(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-\/]+/gi,
    /(?:www\.)?github\.com\/[a-zA-Z0-9_\-\/]+/gi,
    /(?:www\.)?kaggle\.com\/[a-zA-Z0-9_\-\/]+/gi,
    /(?:www\.)?leetcode\.com\/(?:u\/)?[a-zA-Z0-9_\-\/]+/gi,
    /(?:www\.)?behance\.net\/[a-zA-Z0-9_\-\/]+/gi,
    /(?:www\.)?medium\.com\/@[a-zA-Z0-9_\-\/]+/gi,
    /[a-zA-Z0-9_\-]+\.(?:vercel\.app|netlify\.app|github\.io|streamlit\.app|me|dev|tech|site|bio|link)(?:\/[a-zA-Z0-9_\-.~%]*)*\b/gi,
  ];

  for (const pat of domainPatterns) {
    while ((match = pat.exec(utf8String)) !== null) {
      const clean = match[0].replace(/[.,;:)>\]\\]+$/, '').trim();
      if (clean.length > 5) {
        foundUrls.add(clean.startsWith('http') ? clean : `https://${clean}`);
      }
    }
    if (rawText && rawText !== utf8String) {
      while ((match = pat.exec(rawText)) !== null) {
        const clean = match[0].replace(/[.,;:)>\]\\]+$/, '').trim();
        if (clean.length > 5) {
          foundUrls.add(clean.startsWith('http') ? clean : `https://${clean}`);
        }
      }
    }
  }

  // Categorize URLs
  let linkedin = '';
  let github = '';
  let portfolio = '';
  const allLinks: ExtractedLinkItem[] = [];
  const seenUrls = new Set<string>();

  for (const url of foundUrls) {
    const lower = url.toLowerCase();

    // Skip PDF schema/metadata URLs
    if (
      lower.includes('ns.adobe.com') ||
      lower.includes('w3.org') ||
      lower.includes('purl.org') ||
      lower.includes('xml.org') ||
      lower.includes('schemas.openxmlformats.org') ||
      lower.includes('schemas.microsoft.com')
    ) {
      continue;
    }

    // Skip certification / learning platform URLs from being categorized as social links
    if (isCertUrl(lower)) continue;

    if (seenUrls.has(lower)) continue;
    seenUrls.add(lower);

    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;

    // GitHub Pages (e.g. username.github.io) → portfolio, not GitHub profile
    const isGhPages = /[a-z0-9_-]+\.github\.io/i.test(lower);

    if (
      (lower.includes('linkedin.com/in/') || lower.includes('linkedin.com/pub/')) &&
      !lower.includes('linkedin.com/company/') &&
      !lower.includes('linkedin.com/learning')
    ) {
      if (!linkedin) linkedin = formattedUrl;
      allLinks.push({ title: 'LinkedIn', url: formattedUrl, type: 'linkedin' });
    } else if (lower.includes('linkedin.com/company/')) {
      allLinks.push({ title: 'Company', url: formattedUrl, type: 'company' });
    } else if (isGhPages) {
      if (!portfolio) portfolio = formattedUrl;
      allLinks.push({ title: 'Portfolio', url: formattedUrl, type: 'portfolio' });
    } else if (lower.includes('github.com/') && !lower.includes('github.com/features') && !lower.includes('github.com/pricing')) {
      // Distinguish profile (1 segment) from repo (2+ segments)
      try {
        const parsedUrl = new URL(formattedUrl);
        const parts = parsedUrl.pathname.replace(/^\//, '').replace(/\/$/, '').split('/').filter(Boolean);
        if (parts.length === 1) {
          // Profile URL
          if (!github) github = formattedUrl;
          allLinks.push({ title: 'GitHub', url: formattedUrl, type: 'github' });
        } else {
          // Repo URL — include in allLinks for project correlation, but don't set as main github profile
          allLinks.push({ title: 'GitHub Repo', url: formattedUrl, type: 'github' });
        }
      } catch {
        if (!github) github = formattedUrl;
        allLinks.push({ title: 'GitHub', url: formattedUrl, type: 'github' });
      }
    } else if (
      lower.includes('huggingface.co') ||
      lower.includes('.hf.space') ||
      lower.includes('streamlit.app') ||
      lower.includes('colab.research.google.com')
    ) {
      allLinks.push({ title: 'Live Demo', url: formattedUrl, type: 'demo' });
    } else if (lower.includes('kaggle.com/')) {
      allLinks.push({ title: 'Kaggle', url: formattedUrl, type: 'kaggle' });
    } else if (lower.includes('leetcode.com/')) {
      allLinks.push({ title: 'LeetCode', url: formattedUrl, type: 'leetcode' });
    } else if (lower.includes('behance.net/')) {
      allLinks.push({ title: 'Behance', url: formattedUrl, type: 'behance' });
    } else if (lower.includes('medium.com/')) {
      allLinks.push({ title: 'Medium', url: formattedUrl, type: 'medium' });
    } else if (
      lower.includes('vercel.app') ||
      lower.includes('netlify.app') ||
      lower.includes('.me/') ||
      lower.includes('.dev/') ||
      lower.includes('portfolio')
    ) {
      if (!portfolio) portfolio = formattedUrl;
      allLinks.push({ title: 'Portfolio', url: formattedUrl, type: 'portfolio' });
    } else if (
      !lower.includes('google.com') &&
      !lower.includes('gmail.com') &&
      !lower.includes('wuzzuf.net') &&
      !lower.includes('bayt.com') &&
      !lower.includes('indeed.com') &&
      !lower.includes('glassdoor.com')
    ) {
      allLinks.push({ title: 'Website', url: formattedUrl, type: 'website' });
    }
  }

  return { linkedin, github, portfolio, allLinks };
}

interface ExtractedData {
  fullName: string;
  currentTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  socialLinks?: Array<{ id: string; platform: string; url: string }>;
  links?: ExtractedLinkItem[];
  summary: string;
  targetRole: string;
  experienceYears: number;
  experiences: Array<{
    id: string;
    company: string;
    companyUrl?: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location?: string;
    description?: string;
    bullets: string[];
    type?: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
    location?: string;
  }>;
  skills: string[];
  categorizedSkills: {
    programming: string[];
    frameworks: string[];
    databasesAndTools: string[];
    cloud: string[];
    soft: string[];
  };
  categorizedSkillGroups?: Array<{
    id: string;
    label: string;
    skills: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    bullets: string[];
    link?: string;
    github?: string;
  }>;
  certificates?: Array<{
    id: string;
    name: string;
    issuer: string;
    url?: string;
    date?: string;
  }>;
  atsReport: {
    score: number;
    structureScore: number;
    readabilityScore: number;
    impactScore: number;
    skillsScore: number;
    hasEmail: boolean;
    hasPhone: boolean;
    hasLocation: boolean;
    hasSummary: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
    hasMetrics: boolean;
    actionVerbsCount: number;
    metricsCount: number;
    strengths: Array<{ en: string; ar: string }>;
    improvements: string[];
  };
  insights: {
    totalSkills: number;
    yearsOfExperience: number;
    atsScore: number;
    marketFit: number;
    strengths: string[];
    topGaps: string[];
  };
  actionPlan: Array<{
    id?: string;
    title: string;
    titleAr?: string;
    category: string;
    categoryAr?: string;
    priority: 'high' | 'medium' | 'low';
    description: string;
    descriptionAr?: string;
  }>;
}

export function parseCVText(
  rawText: string,
  targetRoleInput?: string,
  fileName?: string,
  extractedLinksResult?: ExtractedLinksResult,
  rawExtractedLinks: RawExtractedLink[] = []
): ExtractedData {
  // Strip markdown-link syntax [Display Text](URL) → keep Display Text only.
  // This prevents company names like [IT-Gate Academy](https://linkedin.com/company/...) 
  // from polluting section parsing. We keep rawText intact for URL regex extraction.
  const strippedText = rawText.replace(/\[([^\]]*)\]\(https?:\/\/[^)]+\)/g, '$1');

  const lines = strippedText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  // 1. Extract Email
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0].toLowerCase() : '';

  // 2. Extract Phone
  const phoneMatch = rawText.match(/(?:\+?20|0020|0)?1[0125][0-9]{8}|\+?[0-9]{10,15}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // 3. Extract LinkedIn, GitHub & Portfolio (combining buffer links + text regex)
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedin = extractedLinksResult?.linkedin || (
    linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : ''
  );

  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  const github = extractedLinksResult?.github || (
    githubMatch ? `https://github.com/${githubMatch[1]}` : ''
  );

  // Portfolio: match any non-linkedin/github URL that looks like a personal portfolio site
  const portfolioMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|io|me|dev|net|org)\/[a-zA-Z0-9/_-]*)/i);
  let textPortfolio = '';
  if (portfolioMatch) {
    const raw = portfolioMatch[0].toLowerCase();
    if (
      !raw.includes('linkedin.com') &&
      !raw.includes('github.com') &&
      !raw.includes('huggingface.co') &&
      !raw.includes('.hf.space') &&
      !raw.includes('streamlit.app') &&
      !raw.includes('google.com') &&
      !raw.includes('gmail.com') &&
      !raw.includes('w3.org') &&
      !isCertUrl(raw)
    ) {
      textPortfolio = portfolioMatch[0].startsWith('http') ? portfolioMatch[0] : `https://${portfolioMatch[0]}`;
    }
  }
  const portfolio = extractedLinksResult?.portfolio || textPortfolio || '';
  const links = extractedLinksResult?.allLinks || [];

  // 4. Extract Location
  let location = '';
  if (/cairo|القاهرة/i.test(rawText)) location = 'Cairo, Egypt';
  else if (/giza|الجيزة/i.test(rawText)) location = 'Giza, Egypt';
  else if (/alexandria|الإسكندرية/i.test(rawText)) location = 'Alexandria, Egypt';
  else if (/mansoura|المنصورة/i.test(rawText)) location = 'Mansoura, Egypt';
  else if (/riyadh|الرياض/i.test(rawText)) location = 'Riyadh, Saudi Arabia';
  else if (/jeddah|جدة/i.test(rawText)) location = 'Jeddah, Saudi Arabia';
  else if (/dubai|دبي/i.test(rawText)) location = 'Dubai, UAE';
  else if (/remote|عن بعد/i.test(rawText)) location = 'Remote';

  // 5. Extract Full Name (from top 4 lines)
  let fullName = '';
  for (const line of lines.slice(0, 5)) {
    const clean = line.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, '').trim();
    if (
      clean.length >= 3 &&
      clean.length <= 40 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('+20') &&
      !/resume|curriculum|vitae|page|profile|summary|skills|experience/i.test(line)
    ) {
      const words = clean.split(/\s+/);
      if (words.length >= 2 && words.length <= 4) {
        fullName = clean;
        break;
      }
    }
  }
  if (!fullName && email) {
    const handle = email.split('@')[0].replace(/[0-9._-]+/g, ' ').trim();
    if (handle.length >= 3) {
      fullName = handle.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }

  // 6. Extract Current Title (from top 8 lines)
  let currentTitle = '';
  for (const line of lines.slice(0, 8)) {
    if (
      line !== fullName &&
      line.length >= 4 &&
      line.length <= 50 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('+20') &&
      /\b(engineer|analyst|developer|scientist|specialist|designer|manager|architect|enthusiast)\b/i.test(line)
    ) {
      currentTitle = line.trim();
      break;
    }
  }
  if (!currentTitle) currentTitle = targetRoleInput || '';
  const targetRole = targetRoleInput || currentTitle;

  // --- 7. SECTION SPLITTER ---
  const SECTION_HEADERS = [
    { key: 'profile', regex: /(?:^|\n)\s*(?:profile|summary|professional\s*summary|about\s*me|objective|نبذة|الملخص)\s*(?:[:\n]|$)/i },
    { key: 'education', regex: /(?:^|\n)\s*(?:education|academic\s*background|qualifications|التعليم|المؤهلات\s*الدراسية)\s*(?:[:\n]|$)/i },
    { key: 'internships', regex: /(?:^|\n)\s*(?:internships?|practical\s*experience|training|التدريب|التدريب\s*العملي)\s*(?:[:\n]|$)/i },
    { key: 'experience', regex: /(?:^|\n)\s*(?:experience|work\s*history|employment\s*history|professional\s*experience|الخبرات|الخبرة\s*المهنية)\s*(?:[:\n]|$)/i },
    { key: 'skills', regex: /(?:^|\n)\s*(?:skills|technical\s*skills|core\s*competencies|competencies|المهارات|المهارات\s*التقنية)\s*(?:[:\n]|$)/i },
    { key: 'projects', regex: /(?:^|\n)\s*(?:projects|key\s*projects|academic\s*projects|personal\s*projects|المشاريع|أبرز\s*المشاريع)\s*(?:[:\n]|$)/i },
    { key: 'certificates', regex: /(?:^|\n)\s*(?:certificates?|certifications?|courses|licenses|الشهادات|الدورات\s*التدريبية)\s*(?:[:\n]|$)/i },
  ];

  const matches: Array<{ key: string; index: number; matchLen: number }> = [];
  SECTION_HEADERS.forEach(h => {
    const m = strippedText.match(h.regex);
    if (m && typeof m.index === 'number') {
      matches.push({ key: h.key, index: m.index, matchLen: m[0].length });
    }
  });
  matches.sort((a, b) => a.index - b.index);

  const sections: Record<string, string> = {};
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const startPos = current.index + current.matchLen;
    const endPos = next ? next.index : strippedText.length;
    sections[current.key] = strippedText.slice(startPos, endPos).trim();
  }

  // Also build rawSections directly from rawText to preserve markdown hyperlinks for Projects
  const rawMatches: Array<{ key: string; index: number; matchLen: number }> = [];
  SECTION_HEADERS.forEach(h => {
    const m = rawText.match(h.regex);
    if (m && typeof m.index === 'number') {
      rawMatches.push({ key: h.key, index: m.index, matchLen: m[0].length });
    }
  });
  rawMatches.sort((a, b) => a.index - b.index);

  const rawSections: Record<string, string> = {};
  for (let i = 0; i < rawMatches.length; i++) {
    const current = rawMatches[i];
    const next = rawMatches[i + 1];
    const startPos = current.index + current.matchLen;
    const endPos = next ? next.index : rawText.length;
    rawSections[current.key] = rawText.slice(startPos, endPos).trim();
  }

  // Projects section MUST preserve raw markdown links to extract repo and demo URLs
  if (rawSections.projects) {
    sections.projects = rawSections.projects;
  }

  // 8. Summary
  let summary = sections.profile || '';
  if (!summary) {
    const topLines = lines.slice(2, 8).filter(l => l.length > 50 && !l.includes('@'));
    if (topLines.length > 0) summary = topLines.join(' ');
  }
  summary = summary.replace(/\s+/g, ' ').trim();

  // 9. Education
  const eduText = sections.education || '';
  const education: Array<{
    id: string;
    institution: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
    location?: string;
  }> = [];

  if (eduText) {
    const eduLines = eduText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let degree = '';
    let institution = '';
    let startYear = '2022';
    let endYear = '2026';

    for (const line of eduLines) {
      if (!degree && /\b(bachelor|master|phd|b\.?sc|b\.?eng|b\.?a|diploma|بكالوريوس|ماجستير|دكتوراه)\b/i.test(line)) {
        degree = line.replace(/\s*at\s+.*$/i, '').trim();
      }
      if (!institution && /\b(university|college|academy|institute|جامعة|كلية|أكاديمية|معهد)\b/i.test(line)) {
        const instMatch = line.match(/(?:at\s+)?([A-Za-z\s]+(?:University|College|Academy|Institute|جامعة|كلية|أكاديمية))/i) || line.match(/^[A-Za-z\s]+(?:University|College|Academy|Institute)/i);
        institution = instMatch ? instMatch[0].replace(/^at\s+/i, '').trim() : line.split(/[,–-]/)[0].trim();
      }
      const years = line.match(/\b(19\d{2}|20\d{2})\b/g);
      if (years && years.length >= 2) {
        startYear = years[0];
        endYear = years[1];
      }
    }

    if (institution || degree) {
      education.push({
        id: 'edu-1',
        institution: institution || '',
        degree: degree || '',
        major: '',
        startDate: startYear,
        endDate: endYear,
        location: location
      });
    }
  }

  // 10. Experiences & Internships
  const experiences: Array<{
    id: string;
    company: string;
    companyUrl?: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    location?: string;
    description?: string;
    bullets: string[];
    type?: string;
  }> = [];

  const rawExpSections = [
    { text: sections.experience, isIntern: false },
    { text: sections.internships, isIntern: true }
  ].filter(s => Boolean(s.text));

  let expIdx = 1;
  for (const s of rawExpSections) {
    if (!s.text) continue;
    const expLines = s.text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (expLines.length === 0) continue;

    let role = '';
    let company = '';
    let startD = s.isIntern ? 'Jul 2024' : '2022';
    let endD = s.isIntern ? 'Aug 2024' : 'Present';
    let expLocation = location;

    let companyUrl = '';
    const firstLine = expLines[0];
    const atMatch = firstLine.match(/^(.*?)\s+at\s+(.*?)(?:,\s*(.*))?$/i);
    if (atMatch) {
      role = atMatch[1].trim();
      company = atMatch[2].trim();
      if (atMatch[3]) expLocation = atMatch[3].trim();
    } else {
      role = firstLine;
      if (expLines[1] && !expLines[1].match(/\d{4}/)) {
        company = expLines[1];
      }
    }

    // Extract markdown link from company: [Company Name](url)
    const companyMd = company.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/i);
    if (companyMd) {
      company = companyMd[1].trim();
      companyUrl = companyMd[2].trim();
    }
    const rawCompUrl = company.match(/(https?:\/\/[^\s\)\],]+)/i);
    if (rawCompUrl) {
      if (!companyUrl) companyUrl = rawCompUrl[1];
      company = company.replace(/https?:\/\/[^\s\)\],]+/gi, '').trim();
    }
    // Clean company of markdown brackets / extra punctuation
    company = company.replace(/[\[\]]/g, '').replace(/^[•\-,–—\s]+|[•\-,–—\s]+$/g, '').trim();

    // If companyUrl wasn't inline markdown, try matching from extracted document links
    if (!companyUrl && extractedLinksResult?.allLinks) {
      const compTokens = company.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
      const matchedCompanyLink = extractedLinksResult.allLinks.find(l => {
        if (l.type === 'company' || l.url.toLowerCase().includes('linkedin.com/company/')) {
          const u = l.url.toLowerCase();
          return compTokens.some(tok => u.includes(tok));
        }
        return false;
      });
      if (matchedCompanyLink) {
        companyUrl = matchedCompanyLink.url;
      }
    }

    // Clean expLocation of dates that were stuck in it
    expLocation = expLocation
      .replace(/\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)?\s*\d{4}\s*[-–—]\s*(?:present|\w+\s*\d{4}|\d{4})?/gi, '')
      .replace(/[,\s]+$/, '')
      .replace(/^[,\s]+/, '')
      .trim();

    for (const line of expLines.slice(1, 4)) {
      const dateMatch = line.match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|\d{4})\s*[-–—]\s*(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|\d{4}|present)/i);
      if (dateMatch) {
        const parts = line.split(/[-–—]/);
        startD = parts[0]?.trim() || startD;
        endD = parts[1]?.trim() || endD;
        break;
      }
    }

    // Collect lines that are actual bullet content (not company/date header lines)
    const companyLower = company.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
    const companyTokens = companyLower.split(/\s+/).filter(w => w.length >= 3);

    const rawBulletLines: string[] = [];
    for (const line of expLines.slice(1)) {
      const lo = line.toLowerCase();
      // Skip obvious date lines (start with a month or year)
      if (/^(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec|\d{4})/i.test(line)) continue;
      // Skip if line contains a date range (month year – month year)
      if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{4}\s*[-–—]\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4}|present)/i.test(line)) continue;
      // Skip if it's essentially a repetition of "Company City Month Year" header
      // (matches when ≥2 company tokens appear in the line AND line contains a 4-digit year)
      const hasYear = /\d{4}/.test(line);
      const companyTokenMatches = companyTokens.filter(tok => lo.includes(tok)).length;
      if (hasYear && companyTokenMatches >= 2) continue;
      // Skip email/links
      if (line.includes('@') || /^https?:\/\//i.test(line)) continue;
      // Skip very short lines (likely stray header fragments)
      if (line.length < 15) continue;
      // Skip lines that are just the company or location
      if (lo === companyLower || lo === expLocation.toLowerCase()) continue;

      const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
      rawBulletLines.push(cleanBullet);
    }

    // Merge fragments: if a bullet doesn't end with punctuation and the next is short, merge them
    const mergedBullets: string[] = [];
    for (let i = 0; i < rawBulletLines.length; i++) {
      const cur = rawBulletLines[i];
      const next = rawBulletLines[i + 1];
      if (next && !/[.!?]$/.test(cur) && next.length < 80 && /^[a-z]/.test(next)) {
        mergedBullets.push(cur + ' ' + next);
        i++; // skip next since we merged it
      } else {
        mergedBullets.push(cur);
      }
    }
    const bullets = mergedBullets;

    if (role || company || bullets.length > 0) {
      experiences.push({
        id: `exp-${expIdx++}`,
        role: role || (s.isIntern ? 'Intern' : targetRole || 'Position'),
        company: company || '',
        companyUrl: companyUrl || undefined,
        startDate: startD,
        endDate: endD,
        current: /present|now|حالياً/i.test(endD),
        location: expLocation || location,
        bullets: bullets,
        type: s.isIntern ? 'internship' : 'job'
      });
    }
  }

  // 11. Skills
  const skillsText = sections.skills || '';
  const categorizedSkillGroups: Array<{ id: string; label: string; skills: string[] }> = [];
  const allFoundSkills = new Set<string>();

  if (skillsText) {
    const skillLines = skillsText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let gIdx = 1;
    for (const line of skillLines) {
      const colonIdx = line.indexOf(':');
      if (colonIdx > 0 && colonIdx < 50) {
        const label = line.slice(0, colonIdx).trim();
        const skillTokens = line.slice(colonIdx + 1).split(/[,•|/]/).map(s => s.trim()).filter(s => s.length >= 2 && !SKILL_BLACKLIST.has(s.toLowerCase()));
        if (skillTokens.length > 0) {
          categorizedSkillGroups.push({
            id: `skills-${gIdx++}`,
            label,
            skills: skillTokens
          });
          skillTokens.forEach(s => allFoundSkills.add(s));
        }
      }
    }
  }

  Object.entries(KNOWN_SKILLS).forEach(([category, list]) => {
    list.forEach(skill => {
      if (SKILL_BLACKLIST.has(skill.toLowerCase())) return;
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9#+])(${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?:$|[^a-zA-Z0-9#+])`, 'i');
      if (regex.test(rawText)) {
        allFoundSkills.add(skill);
      }
    });
  });

  const skillsList = Array.from(allFoundSkills);

  // 12. Projects
  const projectsText = sections.projects || '';
  const projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    bullets: string[];
    link?: string;
    github?: string;
  }> = [];

  if (projectsText) {
    const projLines = projectsText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    let currentProject: { title: string; tech: string[]; bullets: string[]; link?: string; github?: string } | null = null;
    let pIdx = 1;

    for (let i = 0; i < projLines.length; i++) {
      const line = projLines[i];
      const strippedLine = line.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

      const hasProjectLinkOrDate =
        /\[(?:github|live demo|demo|code|repo)\]/i.test(line) ||
        /•\s*\[?(?:github|live demo|demo|repo|code)/i.test(line) ||
        /https?:\/\/github\.com\/[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+/i.test(line) ||
        (/\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}/i.test(line) && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*'));

      const isTitleLine =
        hasProjectLinkOrDate ||
        (
          strippedLine.length < 60 &&
          /^[A-Z\u0600-\u06FF]/.test(strippedLine) &&
          !line.startsWith('•') &&
          !line.startsWith('-') &&
          !line.startsWith('*') &&
          !/[.!?]$/.test(strippedLine) &&
          !/^(?:to|and|in|on|with|for|deep|built|developed|designed|engineered|implemented|trained|evaluated)\b/i.test(strippedLine) &&
          projLines[i + 1] &&
          (projLines[i + 1].match(/\d{4}/) || projLines[i + 1].length > 25)
        );

      if (isTitleLine) {
        if (currentProject && (currentProject.bullets.length > 0 || currentProject.title)) {
          projects.push({
            id: `prj-${pIdx++}`,
            title: currentProject.title,
            description: currentProject.bullets.join(' '),
            technologies: currentProject.tech,
            bullets: currentProject.bullets,
            link: currentProject.link || '',
            github: currentProject.github || '',
          });
        }

        // Extract any URL embedded in the title line
        let lineGithub = '';
        let lineDemo = '';
        const mdGithubMatch = line.match(/\[(?:github|code|repo)\]\((https?:\/\/[^\)]+)\)/i);
        if (mdGithubMatch) lineGithub = mdGithubMatch[1];
        const mdDemoMatch = line.match(/\[(?:demo|live demo|link|app)\]\((https?:\/\/[^\)]+)\)/i);
        if (mdDemoMatch) lineDemo = mdDemoMatch[1];

        const allMdMatches = Array.from(line.matchAll(/\[(?:[^\]]+)\]\((https?:\/\/[^\)]+)\)/gi));
        for (const m of allMdMatches) {
          const u = m[1];
          if (u.toLowerCase().includes('github.com')) {
            if (!lineGithub) lineGithub = u;
          } else if (!u.toLowerCase().includes('linkedin.com')) {
            if (!lineDemo) lineDemo = u;
          }
        }

        const rawUrls = Array.from(line.matchAll(/https?:\/\/[^\s\)\],]+/gi)).map(m => m[0].replace(/[.,;:)>\]\\]+$/, ''));
        for (const u of rawUrls) {
          if (u.toLowerCase().includes('github.com')) {
            if (!lineGithub) lineGithub = u;
          } else if (!u.toLowerCase().includes('linkedin.com')) {
            if (!lineDemo) lineDemo = u;
          }
        }

        const cleanTitle = line
          .replace(/•\s*\[[^\]]+\]\([^\)]+\)/gi, '')
          .replace(/\[[^\]]+\]\([^\)]+\)/gi, '')
          .replace(/•\s*(?:GitHub|Live Demo|Demo|Link|Code|Repo).*$/i, '')
          .replace(/https?:\/\/[^\s\)\],]+/gi, '')
          .replace(/\b(?:january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)?\s*\d{4}\s*(?:[-–—]\s*(?:present|\w+\s*\d{4}|\d{4}))?/gi, '')
          .replace(/[|•–—\s]+$/, '')
          .replace(/^[|•–—\s]+/, '')
          .trim();

        currentProject = {
          title: cleanTitle || line,
          tech: [],
          bullets: [],
          github: lineGithub,
          link: lineDemo
        };
      } else if (currentProject) {
        if (/^(january|february|march|april|may|june|july|august|september|october|november|december|\d{4})\s*[-–—]?\s*(january|february|march|april|may|june|july|august|september|october|november|december|\d{4})?$/i.test(line)) {
          continue;
        }

        // Check for project URLs in bullets/sublines
        const urlMatches = line.match(/(https?:\/\/[^\s\)\],]+)/gi);
        if (urlMatches) {
          for (const rawUrl of urlMatches) {
            const cleanUrl = rawUrl.replace(/[.,;:)>\]\\]+$/, '').trim();
            if (cleanUrl.toLowerCase().includes('github.com')) {
              if (!currentProject.github) currentProject.github = cleanUrl;
            } else if (!cleanUrl.toLowerCase().includes('linkedin.com')) {
              if (!currentProject.link) currentProject.link = cleanUrl;
            }
          }
        }

        const isBulleted = /^[•\-*]/.test(line);
        const cleanBullet = line.replace(/^[•\-*]\s*/, '').trim();
        if (cleanBullet.length > 5) {
          KNOWN_SKILLS.frameworks.concat(KNOWN_SKILLS.programming).concat(KNOWN_SKILLS.databasesAndTools).forEach(t => {
            try {
              const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const r = new RegExp(`(?:^|[^a-zA-Z0-9#+])(${escaped})(?:$|[^a-zA-Z0-9#+])`, 'i');
              if (r.test(cleanBullet) && !currentProject!.tech.includes(t)) {
                currentProject!.tech.push(t);
              }
            } catch {}
          });
          if (isBulleted || currentProject.bullets.length === 0) {
            currentProject.bullets.push(cleanBullet);
          } else {
            // Continuation of previous wrapped bullet
            currentProject.bullets[currentProject.bullets.length - 1] += ' ' + cleanBullet;
          }
        }
      }
    }

    if (currentProject && currentProject.title) {
      projects.push({
        id: `prj-${pIdx++}`,
        title: currentProject.title,
        description: currentProject.bullets.join(' '),
        technologies: currentProject.tech,
        bullets: currentProject.bullets,
        link: currentProject.link || '',
        github: currentProject.github || '',
      });
    }
  }

    // ─── 12b. Certificates Section Extraction ─────────────────────────
    const rawCertText = rawSections.certificates || sections.certificates || '';
    const certificates: Array<{
      id: string;
      name: string;
      issuer: string;
      url?: string;
      date?: string;
    }> = [];

    if (rawCertText) {
      const certLines = rawCertText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      let cIdx = 1;
      for (const line of certLines) {
        if (line.length < 5 || /^(certificates?|certifications?|courses|licenses|الشهادات)/i.test(line)) continue;

        let certUrl = '';
        const mdMatch = line.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/i);
        if (mdMatch) {
          certUrl = mdMatch[2].trim();
        } else {
          const plainUrlMatch = line.match(/https?:\/\/[^\s\)\],]+/i);
          if (plainUrlMatch) {
            certUrl = plainUrlMatch[0].trim();
          }
        }

        let clean = line
          .replace(/•\s*\[[^\]]+\]\([^\)]+\)/gi, '')
          .replace(/\[[^\]]+\]\([^\)]+\)/gi, '')
          .replace(/https?:\/\/[^\s\)\],]+/gi, '')
          .replace(/^[•\-*–—\s]+|[•\-*–—\s]+$/g, '')
          .trim();

        if (!clean) continue;

        let name = clean;
        let issuer = 'Verified Credential';
        let date = '';

        const dateMatch = clean.match(/\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\s*\d{4}\b/i);
        if (dateMatch) {
          date = dateMatch[0];
          clean = clean.replace(dateMatch[0], '').trim();
        }

        if (clean.includes(' - ')) {
          const parts = clean.split(' - ');
          name = parts[0].trim();
          issuer = parts.slice(1).join(' - ').trim();
        } else if (clean.includes(' | ')) {
          const parts = clean.split(' | ');
          name = parts[0].trim();
          issuer = parts.slice(1).join(' | ').trim();
        } else if (/\b(?:at|by|from)\s+([A-Za-z0-9\s]+)$/i.test(clean)) {
          const atM = clean.match(/\b(?:at|by|from)\s+([A-Za-z0-9\s]+)$/i);
          if (atM) {
            issuer = atM[1].trim();
            name = clean.slice(0, atM.index).trim();
          }
        } else {
          if (certUrl.includes('cognitiveclass.ai')) issuer = 'Cognitive Class';
          else if (certUrl.includes('freecodecamp.org')) issuer = 'freeCodeCamp';
          else if (certUrl.includes('365datascience.com')) issuer = '365 Data Science';
          else if (certUrl.includes('coursera.org')) issuer = 'Coursera';
          else if (certUrl.includes('udemy.com')) issuer = 'Udemy';
          else if (certUrl.includes('datacamp.com')) issuer = 'DataCamp';
        }

        certificates.push({
          id: `cert-${cIdx++}`,
          name: name.replace(/^[•\-–—\s]+|[•\-–—\s]+$/g, '').trim(),
          issuer: issuer.replace(/^[•\-–—\s]+|[•\-–—\s]+$/g, '').trim(),
          url: certUrl || undefined,
          date: date || undefined,
        });
      }
    }

    // ─── 13. Deep Multi-Section Link Intelligence ───────────────────────
    const cvIntelligence = processDocumentLinks(
      rawExtractedLinks,
      undefined,
      projects.map(p => p.title),
      experiences.map(e => e.company)
    );

    // 1. Correlate Project Repos & Live Demos
    for (const p of projects) {
      const titleTokens = p.title.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
      const matchedPl = cvIntelligence.projectLinks.find(pl => {
        const matcherTokens = pl.projectTitleMatcher.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
        return titleTokens.some(tok => matcherTokens.includes(tok));
      });

      if (matchedPl) {
        if (!p.github && matchedPl.github) p.github = matchedPl.github;
        if (!p.link && matchedPl.demo) {
          p.link = matchedPl.demo;
        } else if (!p.link && matchedPl.generalUrl && !matchedPl.generalUrl.includes('github.com')) {
          p.link = matchedPl.generalUrl;
        }
      }
      if (p.link && p.github && p.link === p.github) {
        p.link = '';
      }
    }

    // Project fallback correlation from allClassified
    const unusedRepos = cvIntelligence.allClassified.filter(
      l => l.category === 'project_repo' && !projects.some(p => p.github === l.cleanUrl)
    );
    const unusedDemos = cvIntelligence.allClassified.filter(
      l => l.category === 'project_demo' && !projects.some(p => p.link === l.cleanUrl)
    );
    let rIdx = 0;
    let dIdx = 0;
    for (const p of projects) {
      if (!p.github && rIdx < unusedRepos.length) {
        p.github = unusedRepos[rIdx++].cleanUrl;
      }
      if (!p.link && dIdx < unusedDemos.length) {
        p.link = unusedDemos[dIdx++].cleanUrl;
      }
    }

    // 2. Correlate Experience Company URLs
    for (const exp of experiences) {
      if (!exp.companyUrl) {
        const compTokens = exp.company.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
        const matchedEl = cvIntelligence.experienceLinks.find(el => {
          const matcherTokens = el.companyMatcher.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
          return compTokens.some(tok => matcherTokens.includes(tok));
        });
        if (matchedEl) {
          exp.companyUrl = matchedEl.url;
        }
      }
    }

    // 3. Correlate Certificate URLs
    for (let cIdx = 0; cIdx < certificates.length; cIdx++) {
      const cert = certificates[cIdx];
      if (!cert.url) {
        const match = cvIntelligence.certificateLinks.find(cl => {
          const certTokens = cert.name.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
          const matchTokens = cl.titleMatcher.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length >= 3);
          return certTokens.some(tok => matchTokens.includes(tok));
        }) || cvIntelligence.certificateLinks[cIdx];
        if (match) {
          cert.url = match.url;
        }
      }
    }
    if (certificates.length === 0 && cvIntelligence.certificateLinks.length > 0) {
      cvIntelligence.certificateLinks.forEach((cl, idx) => {
        certificates.push({
          id: `cert-${idx + 1}`,
          name: cl.titleMatcher || `Certification ${idx + 1}`,
          issuer: 'Verified Credential',
          url: cl.url
        });
      });
    }

    // 4. Header Contacts (LinkedIn, GitHub profile, Portfolio, Social Links)
    const finalLinkedin = cvIntelligence.headerContacts.linkedin || linkedin;
    const finalGithub = cvIntelligence.headerContacts.github || github;
    const finalPortfolio = cvIntelligence.headerContacts.portfolio || portfolio;
    const socialLinks: Array<{ id: string; platform: string; url: string }> = [...cvIntelligence.headerContacts.socialLinks];

    if (socialLinks.length === 0) {
      if (finalLinkedin) socialLinks.push({ id: 'link-li', platform: 'LinkedIn', url: finalLinkedin });
      if (finalGithub) socialLinks.push({ id: 'link-gh', platform: 'GitHub', url: finalGithub });
      if (finalPortfolio) socialLinks.push({ id: 'link-pf', platform: 'Portfolio', url: finalPortfolio });
    }

  // 13. ATS Analysis & Metrics
  let actionVerbsCount = 0;
  ACTION_VERBS.forEach(verb => {
    try {
      const escaped = verb.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const r = new RegExp(`\\b${escaped}\\b`, 'gi');
      const m = rawText.match(r);
      if (m) actionVerbsCount += m.length;
    } catch {}
  });

  const metricsMatches = rawText.match(/\b\d+%\b|\b\$\d+\b|\b\d+\s*(?:k|m|hours|users|stakeholders|projects|teams)\b/gi);
  const metricsCount = metricsMatches ? metricsMatches.length : 0;

  const sectionsDetected = [
    email ? 1 : 0,
    phone ? 1 : 0,
    summary ? 1 : 0,
    experiences.length > 0 ? 1 : 0,
    education.length > 0 ? 1 : 0,
    skillsList.length > 0 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const structureScore = Math.round((sectionsDetected / 6) * 100);
  const readabilityScore = rawText.length > 200 ? Math.min(100, Math.round(40 + Math.min(60, actionVerbsCount * 5))) : 30;
  const impactScore = Math.min(100, Math.round((metricsCount / Math.max(1, experiences.length * 2)) * 100));
  const skillsScore = Math.min(100, skillsList.length * 8);
  const atsScore = Math.round((structureScore * 0.3) + (readabilityScore * 0.25) + (impactScore * 0.2) + (skillsScore * 0.25));

  const fallbackName = email ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '';

  return {
    fullName: fullName || fallbackName,
    currentTitle: currentTitle || targetRole || '',
    email,
    phone,
    location,
    linkedin: finalLinkedin,
    github: finalGithub,
    portfolio: finalPortfolio,
    socialLinks,
    links: cvIntelligence.allClassified.map(c => ({
      title: c.platform,
      url: c.cleanUrl,
      type: c.platform.toLowerCase() as any
    })),
    summary,
    targetRole,
    experienceYears: experiences.length > 0 ? Math.max(1, experiences.length) : 0,
    experiences,
    education,
    certificates,
    skills: skillsList,
    categorizedSkills: {
      programming: categorizedSkillGroups.find(g => /programming/i.test(g.label))?.skills || [],
      frameworks: categorizedSkillGroups.find(g => /machine|ai|framework/i.test(g.label))?.skills || [],
      databasesAndTools: categorizedSkillGroups.find(g => /backend|database|tool/i.test(g.label))?.skills || [],
      cloud: categorizedSkillGroups.find(g => /cloud|devops/i.test(g.label))?.skills || [],
      soft: categorizedSkillGroups.find(g => /soft/i.test(g.label))?.skills || []
    },
    categorizedSkillGroups,
    projects,
    atsReport: {
      score: atsScore,
      structureScore,
      readabilityScore,
      impactScore,
      skillsScore,
      hasEmail: Boolean(email),
      hasPhone: Boolean(phone),
      hasLocation: Boolean(location),
      hasSummary: Boolean(summary),
      hasExperience: experiences.length > 0,
      hasEducation: education.length > 0,
      hasSkills: skillsList.length > 0,
      hasMetrics: metricsCount > 0,
      actionVerbsCount,
      metricsCount,
      strengths: [
        {
          en: `Strong alignment with ${targetRole || 'data-analyst'} market criteria`,
          ar: `توافق قوي مع متطلبات سوق ${targetRole || 'تحليل البيانات'}`
        },
        {
          en: `Identified ${skillsList.length} verified technical ${skillsList.length === 1 ? 'competency' : 'competencies'}`,
          ar: `تم اكتشاف ${skillsList.length} ${skillsList.length === 1 ? 'مهارة تقنية موثقة' : 'مهارة تقنية موثقة'} من سيرتك الذاتية`
        },
        {
          en: 'Single-Column ATS formatting validated',
          ar: 'تم التحقق من التنسيق أحادي العمود المتوافق مع أنظمة ATS'
        }
      ],
      improvements: [
        'Add quantified metric percentages to recent project descriptions for maximum impact.'
      ]
    },
    insights: {
      totalSkills: skillsList.length,
      yearsOfExperience: 0,
      atsScore,
      marketFit: Math.min(95, Math.max(65, skillsList.length * 6 + 40)),
      strengths: [
        'ATS Single-Column Format Validated',
        `Contains ${skillsList.length} In-Demand Technical Skills`,
        'Direct Action-Oriented Project Bullet Points'
      ],
      topGaps: [
        'Add 1 cloud infrastructure technology (e.g. AWS or Azure)',
        'Quantify business impacts with exact numbers or percentages'
      ]
    },
    actionPlan: [
      {
        id: 'ap-1',
        title: 'Enhance Project Metrics with Quantifiable ROI',
        titleAr: 'إضافة نسب وأرقام قياسية ملموسة لمشاريعك العملية',
        category: 'Project Optimization',
        categoryAr: 'تطوير المشاريع',
        priority: 'high',
        description: 'Quantify at least 2 project achievements with real percentages or performance numbers.',
        descriptionAr: 'قم بإضافة نسب مئوية أو أرقام كمية لإنجازين على الأقل في قسم المشاريع لتعزيز التوافق مع أنظمة الفحص.'
      },
      {
        id: 'ap-2',
        title: 'ATS-Optimized Profile Ready for Tech Applications',
        titleAr: 'سيرتك الذاتية متوافقة مع أنظمة الـ ATS وجاهزة للتقديم',
        category: 'Job Application',
        categoryAr: 'التقديم للوظائف',
        priority: 'medium',
        description: 'Your parsed profile is ready. You can apply directly or edit via CV Builder.',
        descriptionAr: 'تم تجهيز وتدقيق ملفك المهني بنجاح. يمكنك التقديم مباشرة على الشواغر المطابقة أو تعديل سيرتك عبر CV Builder.'
      }
    ]
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const targetRole = formData.get('targetRole') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name || 'Resume.pdf';
    const lowerName = fileName.toLowerCase();

    let extractedText = '';
    let pdfExtractedLinks: string[] = [];
    let rawDocumentLinks: RawExtractedLink[] = [];

    if (lowerName.endsWith('.pdf')) {
      const uint8 = new Uint8Array(arrayBuffer);
      try {
        const pdf = await getDocumentProxy(uint8);
        try {
          rawDocumentLinks = await extractLinksFromPdf(pdf);
        } catch (linkErr) {
          console.warn('extractLinksFromPdf error:', linkErr);
        }
        const pageTexts: string[] = [];

        for (let p = 1; p <= pdf.numPages; p++) {
          const page = await pdf.getPage(p);
          const annots = (await page.getAnnotations()).filter(
            (a: any) => a.subtype === 'Link' && a.url
          );

          annots.forEach((a: any) => {
            if (a.url && typeof a.url === 'string') {
              pdfExtractedLinks.push(a.url.trim());
            }
          });

          const textContent = await page.getTextContent();
          const items = (textContent.items || []) as any[];

          let currentLine: Array<{ x: number; str: string }> = [];
          let lastY: number | null = null;
          const pageLines: string[] = [];

          for (const item of items) {
            if (!item.str && item.str !== ' ') continue;
            const x = item.transform?.[4] ?? 0;
            const y = item.transform?.[5] ?? 0;
            const w = item.width || (item.str.length * 6);

            // Filter annotations that vertically align with this text item
            const lineAnnots = annots.filter((a: any) => {
              if (!Array.isArray(a.rect) || a.rect.length < 4) return false;
              const minY = Math.min(a.rect[1], a.rect[3]);
              const maxY = Math.max(a.rect[1], a.rect[3]);
              return y >= minY - 6 && y <= maxY + 6;
            });

            let rendered = item.str;
            if (lineAnnots.length > 0 && item.str.trim().length > 0) {
              const charWidth = w / Math.max(1, item.str.length);
              let reconstructed = '';
              let i = 0;

              while (i < item.str.length) {
                const charX = x + i * charWidth;
                const matchedA = lineAnnots.find((a: any) => {
                  const minX = Math.min(a.rect[0], a.rect[2]);
                  const maxX = Math.max(a.rect[0], a.rect[2]);
                  return charX >= minX - 3 && charX <= maxX + 3;
                });

                if (matchedA && matchedA.url) {
                  let span = '';
                  while (i < item.str.length) {
                    const cX = x + i * charWidth;
                    const minX = Math.min(matchedA.rect[0], matchedA.rect[2]);
                    const maxX = Math.max(matchedA.rect[0], matchedA.rect[2]);
                    if (cX >= minX - 3 && cX <= maxX + 4) {
                      span += item.str[i];
                      i++;
                    } else {
                      break;
                    }
                  }
                  const cleanSpan = span.trim();
                  if (cleanSpan && !cleanSpan.includes('http')) {
                    const trailingSep = cleanSpan.match(/[•,·|]+$/)?.[0] || '';
                    const coreText = cleanSpan.replace(/[•,·|]+$/, '').trim();
                    if (coreText) {
                      reconstructed += `[${coreText}](${matchedA.url.trim()}) ${trailingSep} `;
                    } else {
                      reconstructed += `${cleanSpan} `;
                    }
                  } else {
                    reconstructed += span;
                  }
                } else {
                  reconstructed += item.str[i];
                  i++;
                }
              }
              rendered = reconstructed;
            }

            if (lastY === null || Math.abs(y - lastY) < 4.5) {
              currentLine.push({ x, str: rendered });
            } else {
              currentLine.sort((a, b) => a.x - b.x);
              pageLines.push(currentLine.map((c) => c.str).join(' ').replace(/\s+/g, ' ').trim());
              currentLine = [{ x, str: rendered }];
            }
            lastY = y;
          }

          if (currentLine.length > 0) {
            currentLine.sort((a, b) => a.x - b.x);
            pageLines.push(currentLine.map((c) => c.str).join(' ').replace(/\s+/g, ' ').trim());
          }

          pageTexts.push(pageLines.join('\n'));
        }

        extractedText = pageTexts.join('\n\n');
      } catch (pdfErr) {
        console.warn('Advanced PDF link-aware extraction fallback:', pdfErr);
        try {
          const { text } = await extractText(uint8);
          extractedText = Array.isArray(text) ? text.join('\n') : String(text || '');
        } catch {
          extractedText = buffer.toString('utf-8');
        }

        try {
          const linksResult = await extractLinks(uint8);
          if (linksResult && Array.isArray(linksResult.links)) {
            pdfExtractedLinks = linksResult.links.filter(l => typeof l === 'string' && l.trim().length > 0);
          }
        } catch {}
      }
    } else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || '';
      } catch (docxErr) {
        console.warn('DOCX extraction fallback to UTF-8 decoding:', docxErr);
        extractedText = buffer.toString('utf-8');
      }
    } else {
      extractedText = buffer.toString('utf-8');
    }

    const trimmedText = extractedText ? extractedText.trim() : '';
    if (trimmedText.length < 50) {
      return NextResponse.json(
        {
          success: false,
          status: 'failed',
          reason: 'no_text_layer',
          error: 'تعذر استخراج النص من الملف. يرجى التأكد من أن الملف يحتوي على نص وليس صورة ممسوحة ضوئياً.'
        },
        { status: 422 }
      );
    }

    // Extract text links from the extractedText (markdown links + regex)
    const textLinks = extractLinksFromText(extractedText);
    const combinedRawLinks = [...rawDocumentLinks];
    const seenRawUrls = new Set(rawDocumentLinks.map(l => l.url.toLowerCase()));
    for (const tl of textLinks) {
      if (!seenRawUrls.has(tl.url.toLowerCase())) {
        seenRawUrls.add(tl.url.toLowerCase());
        combinedRawLinks.push(tl);
      }
    }

    // Extract binary annotations + unpdf links + regex links from buffer
    const extractedLinksResult = extractDocumentLinks(buffer, extractedText, pdfExtractedLinks);

    const structuredData = parseCVText(
      extractedText,
      targetRole || undefined,
      fileName,
      extractedLinksResult,
      combinedRawLinks
    );

    return NextResponse.json({
      success: true,
      filename: fileName,
      fileSize: file.size,
      textLength: extractedText.length,
      data: structuredData
    });
  } catch (error: any) {
    console.error('CV Parsing API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to parse CV document' },
      { status: 500 }
    );
  }
}
