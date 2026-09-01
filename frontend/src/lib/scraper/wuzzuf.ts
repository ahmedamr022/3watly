import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export interface ScrapedJob {
  id: string;
  title: string;
  title_ar: string;
  company: string;
  company_ar: string;
  company_logo: string | null;
  location: string;
  location_ar: string;
  work_type: string;
  is_remote: boolean;
  seniority: 'Fresh' | 'Junior' | 'Mid' | 'Senior';
  salary_range: string;
  required_skills: string[];
  description: string;
  requirements: string;
  apply_url: string;
  source: string;
  posted_at: string;
}

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
  'Referer': 'https://www.google.com/',
  'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Windows"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'cross-site'
};

const SEARCH_QUERIES = [
  'data analyst',
  'business intelligence',
  'data engineer',
  'data scientist',
  'python',
  'sql',
  'frontend',
  'react',
  'backend',
  'node',
  'full stack',
  'machine learning',
  'devops',
  'product manager',
  'business analyst',
  'power bi'
];

const KNOWN_SKILLS_KEYWORDS = [
  'Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Pandas', 'NumPy', 'R',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'Snowflake',
  'BigQuery', 'dbt', 'Airflow', 'Kafka', 'Docker', 'Kubernetes', 'AWS', 'Azure',
  'GCP', 'Google Cloud', 'Git', 'GitHub', 'CI/CD', 'Linux', 'React', 'Next.js',
  'TypeScript', 'JavaScript', 'Node.js', 'Express', 'FastAPI', 'Django', 'Flask',
  'Java', 'Spring Boot', 'C#', '.NET', 'C++', 'Go', 'PHP', 'Laravel', 'Angular',
  'Vue.js', 'Tailwind CSS', 'GraphQL', 'REST API', 'Agile', 'Scrum', 'Jira',
  'Data Modeling', 'ETL', 'Data Warehousing', 'Machine Learning', 'Deep Learning',
  'NLP', 'TensorFlow', 'PyTorch', 'Scikit-Learn', 'Statistics', 'A/B Testing'
];

function generateJobId(applyUrl: string): string {
  const hash = crypto.createHash('md5').update(applyUrl).digest('hex').slice(0, 16);
  return `wuzzuf_${hash}`;
}

function parseSeniority(rawText: string): 'Fresh' | 'Junior' | 'Mid' | 'Senior' {
  const text = rawText.toLowerCase();
  if (text.includes('entry') || text.includes('fresh') || text.includes('graduate') || text.includes('intern')) {
    return 'Fresh';
  }
  if (text.includes('junior') || text.includes('1-2') || text.includes('1-3')) {
    return 'Junior';
  }
  if (text.includes('senior') || text.includes('lead') || text.includes('principal') || text.includes('manager') || text.includes('5+')) {
    return 'Senior';
  }
  return 'Mid';
}

function parseWorkType(rawText: string): { workType: string; isRemote: boolean } {
  const text = rawText.toLowerCase();
  const isRemote = text.includes('remote') || text.includes('work from home') || text.includes('عن بعد');
  let workType = 'Full Time';
  if (text.includes('part time')) workType = 'Part Time';
  if (text.includes('freelance') || text.includes('project')) workType = 'Freelance';
  if (text.includes('hybrid')) workType = 'Hybrid';
  if (isRemote && !text.includes('hybrid')) workType = 'Remote';
  return { workType, isRemote };
}

const SCRAPER_SKILL_BLACKLIST = new Set([
  'internship', 'intern', 'student', 'entry level', 'fresh graduate', 'fresher',
  'it/software development', 'software development', 'it', 'engineering',
  'research', 'operations', 'marketing', 'sales', 'human resources', 'administration',
  'experienced', 'experienced / manager', 'manager', 'specialist', 'analyst',
  'full time', 'part time', 'freelance', 'work from home', 'remote', 'hybrid', 'on-site',
  'shift based', 'males only', 'females only', 'unspecified', 'education', 'training'
]);

const SCRAPER_SKILL_EXPANSIONS: Record<string, string> = {
  'bi': 'Business Intelligence',
  'ai': 'Artificial Intelligence',
  'ml': 'Machine Learning',
  'dl': 'Deep Learning',
  'etl': 'ETL Pipelines',
  'nlp': 'NLP',
  'rest': 'REST APIs',
  'db': 'Database Management'
};

function extractSkillsFromText(text: string, tags: string[]): string[] {
  const found = new Set<string>();

  // Filter raw tags: reject blacklisted words, category phrases, expand short tokens
  tags.forEach(tag => {
    const clean = tag.trim();
    const lower = clean.toLowerCase();
    
    if (SCRAPER_SKILL_EXPANSIONS[lower]) {
      found.add(SCRAPER_SKILL_EXPANSIONS[lower]);
      return;
    }

    if (
      clean.length >= 2 &&
      clean.length <= 30 &&
      !SCRAPER_SKILL_BLACKLIST.has(lower) &&
      !/^(intern|student|trainee|job|career|entry|graduate|experienced)/i.test(lower) &&
      !/^\d+$/.test(clean) &&
      clean.split(/\s+/).length <= 3
    ) {
      // Check if it matches or resembles a real technical skill
      found.add(clean);
    }
  });

  // Extract from known skills dictionary
  KNOWN_SKILLS_KEYWORDS.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      found.add(skill);
    }
  });

  return Array.from(found).slice(0, 8);
}

function translateTitleToAr(title: string): string {
  const t = title.toLowerCase();
  let prefix = '';
  if (t.includes('senior') || t.includes('lead') || t.includes('principal')) prefix = 'أول ';
  if (t.includes('junior') || t.includes('entry')) prefix = 'مبتدئ ';
  if (t.includes('fresh')) prefix = 'حديث التخرج ';

  if (t.includes('data analyst') || t.includes('data analytics')) return `محلل بيانات ${prefix}`.trim();
  if (t.includes('business intelligence') || t.includes('bi developer')) return `مطور ذكاء أعمال (BI) ${prefix}`.trim();
  if (t.includes('data engineer')) return `مهندس بيانات ${prefix}`.trim();
  if (t.includes('data scientist')) return `عالم بيانات ${prefix}`.trim();
  if (t.includes('frontend') || t.includes('front-end') || t.includes('react')) return `مطور واجهات أمامية (Frontend) ${prefix}`.trim();
  if (t.includes('backend') || t.includes('back-end') || t.includes('node') || t.includes('django')) return `مطور واجهات خلفية (Backend) ${prefix}`.trim();
  if (t.includes('full stack') || t.includes('fullstack')) return `مطور برمجيات شامل (Full Stack) ${prefix}`.trim();
  if (t.includes('devops') || t.includes('cloud')) return `مهندس DevOps وسحابيات ${prefix}`.trim();
  if (t.includes('machine learning') || t.includes('ai engineer') || t.includes('deep learning')) return `مهندس ذكاء اصطناعي وتعلم آلي ${prefix}`.trim();
  if (t.includes('product manager') || t.includes('product owner')) return `مدير منتجات رقمية ${prefix}`.trim();
  if (t.includes('business analyst')) return `محلل نظم وأعمال ${prefix}`.trim();
  if (t.includes('power bi')) return `مطور تقارير وذكاء أعمال Power BI ${prefix}`.trim();
  if (t.includes('ui/ux') || t.includes('ux/ui') || t.includes('product designer')) return `مصمم واجهات وتجربة المستخدم (UI/UX) ${prefix}`.trim();
  if (t.includes('flutter') || t.includes('mobile developer') || t.includes('ios') || t.includes('android')) return `مطور تطبيقات هواتف ${prefix}`.trim();
  if (t.includes('qa') || t.includes('quality') || t.includes('software tester')) return `مهندس جودة واختبار برمجيات (QA) ${prefix}`.trim();
  if (t.includes('scrum') || t.includes('project manager')) return `مدير مشاريع تقنية ${prefix}`.trim();
  return title;
}

function translateLocationToAr(location: string): string {
  const l = location.toLowerCase();
  if (l.includes('sheikh zayed') || l.includes('zayed')) return 'الشيخ زايد، الجيزة';
  if (l.includes('6th of october') || l.includes('october')) return 'السادس من أكتوبر، الجيزة';
  if (l.includes('smart village')) return 'القرية الذكية، الجيزة';
  if (l.includes('new cairo') || l.includes('tagamoa') || l.includes('5th settlement')) return 'القاهرة الجديدة، القاهرة';
  if (l.includes('maadi')) return 'المعادي، القاهرة';
  if (l.includes('nasr city')) return 'مدينة نصر، القاهرة';
  if (l.includes('heliopolis') || l.includes('masr el gedida')) return 'مصر الجديدة، القاهرة';
  if (l.includes('dokki')) return 'الدقي، الجيزة';
  if (l.includes('mohandessin')) return 'المهندسين، الجيزة';
  if (l.includes('giza')) return 'الجيزة، مصر';
  if (l.includes('alexandria') || l.includes('alex')) return 'الإسكندرية، مصر';
  if (l.includes('cairo')) return 'القاهرة، مصر';
  if (l.includes('remote')) return 'عن بُعد (مصر)';
  return location;
}

function estimateSalaryRange(seniority: string, isRemote: boolean): string {
  if (isRemote) {
    if (seniority === 'Fresh') return '$600 - $1,000 / mo';
    if (seniority === 'Junior') return '$1,000 - $1,800 / mo';
    if (seniority === 'Senior') return '$2,800 - $5,000 / mo';
    return '$1,800 - $2,800 / mo';
  }
  if (seniority === 'Fresh') return '14,000 - 20,000 ج.م / شهرياً';
  if (seniority === 'Junior') return '20,000 - 32,000 ج.م / شهرياً';
  if (seniority === 'Senior') return '50,000 - 90,000 ج.م / شهرياً';
  return '32,000 - 50,000 ج.م / شهرياً';
}

function parseRelativeDate(dateStr: string): string {
  const now = new Date();
  const text = dateStr.toLowerCase().trim();

  const hoursMatch = text.match(/(\d+)\s*(?:hour|hours|hr|hrs)/);
  if (hoursMatch) {
    now.setHours(now.getHours() - parseInt(hoursMatch[1], 10));
    return now.toISOString();
  }

  const daysMatch = text.match(/(\d+)\s*(?:day|days)/);
  if (daysMatch) {
    now.setDate(now.getDate() - parseInt(daysMatch[1], 10));
    return now.toISOString();
  }

  const weeksMatch = text.match(/(\d+)\s*(?:week|weeks)/);
  if (weeksMatch) {
    now.setDate(now.getDate() - parseInt(weeksMatch[1], 10) * 7);
    return now.toISOString();
  }

  const monthsMatch = text.match(/(\d+)\s*(?:month|months)/);
  if (monthsMatch) {
    now.setMonth(now.getMonth() - parseInt(monthsMatch[1], 10));
    return now.toISOString();
  }

  return now.toISOString();
}

async function fetchWithRetry(url: string, maxRetries: number = 2): Promise<string | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: BROWSER_HEADERS,
        next: { revalidate: 0 },
      });

      if (response.status === 429) {
        const waitMs = (attempt + 1) * 2500 + Math.floor(Math.random() * 1000);
        console.warn(`[WuzzufScraper] Rate limited (429) on ${url.slice(0, 60)}... Backing off for ${waitMs}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }

      if (!response.ok) {
        console.warn(`[WuzzufScraper] HTTP ${response.status} fetching ${url.slice(0, 60)}`);
        return null;
      }

      return await response.text();
    } catch (e: any) {
      if (attempt === maxRetries) {
        console.warn(`[WuzzufScraper] Network error on ${url.slice(0, 60)}:`, e.message);
        return null;
      }
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  return null;
}

/**
 * Scrape a single search query on Wuzzuf (with pagination & jitter support)
 */
async function scrapeWuzzufQuery(query: string, maxPages: number = 2): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];

  for (let page = 0; page < maxPages; page++) {
    const url = `https://wuzzuf.net/search/jobs/?q=${encodeURIComponent(query)}&a=hpb&start=${page}`;
    
    const html = await fetchWithRetry(url, 2);
    if (!html) continue;

    try {
      const $ = cheerio.load(html);
      const cards = $('div[class*="css-1gatmva"], div[class*="css-pkv5jc"], div.css-1gatmva, div.css-pkv5jc, div.job-card');
      
      cards.each((_, element) => {
        try {
          const card = $(element);
          
          // 1. Job Title & URL
          const titleLink = card.find('h2 a, a[class*="css-o171kl"], a.css-o171kl').first();
          const title = titleLink.text().trim();
          let applyUrl = titleLink.attr('href') || '';

          if (!title || !applyUrl) return;
          if (applyUrl.startsWith('/')) {
            applyUrl = `https://wuzzuf.net${applyUrl}`;
          }

          // 2. Company Name Extraction (3-layer fallback: Link text -> Alt text -> Career URL regex)
          let company = card.find('a[href*="/jobs/careers/"], a.css-ipsyv7, a[class*="css-ipsyv7"], a[class*="css-17s97q8"]').first().text().trim();
          if (!company || company.length < 2) {
            const alt = card.find('img[alt*="Jobs and Careers"]').attr('alt') || '';
            if (alt) {
              company = alt.replace(/^Jobs and Careers at /i, '').replace(/ Egypt$/i, '').trim();
            }
          }
          if (!company || company.length < 2) {
            const careerHref = card.find('a[href*="/jobs/careers/"]').attr('href') || '';
            const match = careerHref.match(/careers\/(.*?)(?:-Egypt)?-\d+/);
            if (match && match[1]) {
              company = decodeURIComponent(match[1].replace(/-/g, ' '));
            }
          }
          if (!company || company.length < 2) {
            company = card.text().includes('Confidential') ? 'Confidential' : 'Confidential Employer';
          }
          company = company
            .replace(/\s*[-–—]\s*(?:New Cairo|Cairo|Giza|Alexandria|Smart Village|Maadi|Nasr City|6th of October|Dokki|Heliopolis|Egypt|مصر).*$/i, '')
            .replace(/\s*\((?:New Cairo|Cairo|Giza|Alexandria|Smart Village|Maadi|Nasr City|6th of October|Dokki|Heliopolis|Egypt|مصر)[^)]*\)/i, '')
            .replace(/[-–—]$/, '')
            .trim();

          // 3. Company Logo Extraction (Direct CDN URL)
          const logoImg = card.find('img[src*="company_logo"], img[class*="css-1in28d3"], a[href*="/jobs/careers/"] img, img[class*="css-128m8ex"]').first();
          let companyLogo = logoImg.attr('src') || logoImg.attr('data-src') || null;
          if (companyLogo && (companyLogo.startsWith('data:') || companyLogo.includes('placeholder') || companyLogo.includes('default'))) {
            companyLogo = null;
          }

          // 4. Location
          const locElem = card.find('span[class*="css-16x61xq"], span[class*="css-5wys0k"], .job-location').first();
          let location = locElem.text().trim().replace(/<!-- -->/g, '').replace(/\s+/g, ' ');
          if (!location) location = 'Cairo, Egypt';

          // 5. Work Type & Seniority Pills
          const badgeTexts: string[] = [];
          card.find('span[class*="css-1ve4b75"], span[class*="css-y4nlo8"], span[class*="eoyjyou0"], a[href*="Full-Time"], a[href*="Part-Time"], a[href*="Remote"], a[href*="On-Site"], a[href*="Hybrid"]').each((_, badge) => {
            badgeTexts.push($(badge).text().trim());
          });
          const allBadgesStr = badgeTexts.join(' ');

          const { workType, isRemote } = parseWorkType(allBadgesStr + ' ' + location);
          const seniority = parseSeniority(allBadgesStr + ' ' + title);

          // 6. Skill tags
          const skillTags: string[] = [];
          card.find('a[class*="css-5x9pm1"], a[class*="css-5x9545"], div[class*="css-y4nlo8"] a, a[href*="-Jobs-in-Egypt"]').each((_, tag) => {
            const txt = $(tag).text().replace(/^[·\s]+/, '').trim();
            if (txt && !txt.includes('Full Time') && !txt.includes('On-site') && !txt.includes('Hybrid') && !txt.includes('Remote') && !txt.includes('Yrs of Exp')) {
              skillTags.push(txt);
            }
          });

          // 7. Posted date
          const dateElem = card.find('div[class*="css-1jldrig"], div[class*="css-do2t5m"], div[class*="css-4c4ojb"]').first();
          const postedAgoStr = dateElem.text().trim();
          const postedAt = parseRelativeDate(postedAgoStr);

          // Extract skills
          const skills = extractSkillsFromText(title + ' ' + allBadgesStr + ' ' + skillTags.join(' '), skillTags);

          const jobId = generateJobId(applyUrl);

          const titleAr = translateTitleToAr(title);
          const locationAr = translateLocationToAr(location);
          const salary = estimateSalaryRange(seniority, isRemote);

          jobs.push({
            id: jobId,
            title,
            title_ar: titleAr,
            company,
            company_ar: company,
            company_logo: companyLogo,
            location,
            location_ar: locationAr,
            work_type: workType,
            is_remote: isRemote,
            seniority,
            salary_range: salary,
            required_skills: skills,
            description: `فرصة عمل ممتازة لمنصب ${title} في شركة ${company} (${location}). بيئة عمل متطورة تركز على أحدث التقنيات والنمو المهني.`,
            requirements: `• إتقان أدوات وتقنيات: ${skills.slice(0, 4).join(', ')}.\n• خبرة عملية مثبتة في نفس التخصص.\n• مهارات تحليلية وتفكير نقدي وحل المشكلات.\n• قدرة على العمل الجماعي والتواصل الفعال.`,
            apply_url: applyUrl,
            source: 'wuzzuf',
            posted_at: postedAt
          });
        } catch (cardErr) {
          // Ignore individual card parse errors and continue
        }
      });

      // Polite randomized delay between pages
      const pageDelay = 1200 + Math.floor(Math.random() * 600);
      await new Promise(r => setTimeout(r, pageDelay));
    } catch (queryErr) {
      console.warn(`[WuzzufScraper] Error during scraping query: "${query}"`, queryErr);
    }
  }

  return jobs;
}

export async function runWuzzufScraper(): Promise<{
  success: boolean;
  totalScraped: number;
  totalInsertedOrUpdated: number;
  expiredDeleted: number;
  errors: string[];
}> {
  const errors: string[] = [];
  const allScrapedMap = new Map<string, ScrapedJob>();

  console.log('[WuzzufScraper] Starting multi-category scraping run...');

  for (const query of SEARCH_QUERIES) {
    try {
      const queryJobs = await scrapeWuzzufQuery(query, 2);
      queryJobs.forEach(job => {
        allScrapedMap.set(job.id, job);
      });
      console.log(`[WuzzufScraper] Scraped "${query}" -> found ${queryJobs.length} jobs (Total unique: ${allScrapedMap.size})`);
    } catch (e: any) {
      errors.push(`Error scraping query "${query}": ${e.message}`);
    }
  }

  const scrapedJobsList = Array.from(allScrapedMap.values());
  let upsertCount = 0;
  let deletedCount = 0;

  const supabase = createAdminClient();
  if (supabase && scrapedJobsList.length > 0) {
    try {
      const CHUNK_SIZE = 50;
      for (let i = 0; i < scrapedJobsList.length; i += CHUNK_SIZE) {
        const batch = scrapedJobsList.slice(i, i + CHUNK_SIZE);
        const { error } = await supabase
          .from('jobs')
          .upsert(batch, { onConflict: 'id', ignoreDuplicates: false });

        if (error) {
          console.error('[WuzzufScraper] Supabase batch upsert error:', error);
          errors.push(`Supabase batch error: ${error.message}`);
        } else {
          upsertCount += batch.length;
        }
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: deleted, error: delError } = await supabase
        .from('jobs')
        .delete()
        .lt('posted_at', thirtyDaysAgo.toISOString())
        .select('id');

      if (!delError && deleted) {
        deletedCount = deleted.length;
        console.log(`[WuzzufScraper] Cleaned up ${deletedCount} expired jobs (>30 days old)`);
      }
    } catch (dbErr: any) {
      console.error('[WuzzufScraper] Database operation error:', dbErr);
      errors.push(`Database error: ${dbErr.message}`);
    }
  } else if (!supabase) {
    errors.push('Supabase Admin Client could not be initialized. Check SUPABASE_SERVICE_ROLE_KEY.');
  }

  return {
    success: errors.length === 0,
    totalScraped: scrapedJobsList.length,
    totalInsertedOrUpdated: upsertCount,
    expiredDeleted: deletedCount,
    errors
  };
}
