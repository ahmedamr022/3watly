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

function extractSkillsFromText(text: string, tags: string[]): string[] {
  const found = new Set<string>();
  
  tags.forEach(tag => {
    const clean = tag.trim();
    if (clean.length > 1 && clean.length < 30) {
      found.add(clean);
    }
  });

  KNOWN_SKILLS_KEYWORDS.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(text)) {
      found.add(skill);
    }
  });

  return Array.from(found).slice(0, 10);
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

async function scrapeWuzzufQuery(query: string, maxPages: number = 2): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];

  for (let page = 0; page < maxPages; page++) {
    const url = `https://wuzzuf.net/search/jobs/?a=hpb&q=${encodeURIComponent(query)}&start=${page}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        next: { revalidate: 0 },
      });

      if (!response.ok) {
        console.warn(`[WuzzufScraper] HTTP ${response.status} fetching query: "${query}" page: ${page}`);
        continue;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const cards = $('div[class*="css-1gatmva"], div[class*="css-pkv5jc"], div.css-1gatmva, div.css-pkv5jc, div.job-card');
      
      cards.each((_, element) => {
        try {
          const card = $(element);
          
          const titleLink = card.find('h2 a, a[class*="css-o171kl"], a.css-o171kl').first();
          const title = titleLink.text().trim();
          let applyUrl = titleLink.attr('href') || '';

          if (!title || !applyUrl) return;
          if (applyUrl.startsWith('/')) {
            applyUrl = `https://wuzzuf.net${applyUrl}`;
          }

          const companyElem = card.find('a[class*="css-17s97q8"], a.css-17s97q8, div[class*="css-d7j1kk"] a, .company-name').first();
          let company = companyElem.text().trim();
          if (company.endsWith('-')) {
            company = company.slice(0, -1).trim();
          }
          if (!company) company = 'Confidential Employer';

          const locationElem = card.find('span[class*="css-5wys0k"], span.css-5wys0k, .job-location').first();
          const location = locationElem.text().trim() || 'Cairo, Egypt';

          const badgeTexts: string[] = [];
          card.find('span[class*="css-1ve4b75"], span[class*="css-y4nlo8"], .css-1ve4b75, .css-y4nlo8, a[class*="css-o171kl"]').each((_, badge) => {
            badgeTexts.push($(badge).text().trim());
          });
          const allBadgesStr = badgeTexts.join(' ');

          const { workType, isRemote } = parseWorkType(allBadgesStr + ' ' + location);
          const seniority = parseSeniority(allBadgesStr + ' ' + title);

          const skillTags: string[] = [];
          card.find('a[class*="css-5x9545"], a.css-5x9545, div[class*="css-y4nlo8"] a').each((_, tag) => {
            skillTags.push($(tag).text().trim());
          });

          const dateElem = card.find('div[class*="css-do2t5m"], div[class*="css-4c4ojb"], .css-do2t5m, .css-4c4ojb').first();
          const postedAgoStr = dateElem.text().trim();
          const postedAt = parseRelativeDate(postedAgoStr);

          const skills = extractSkillsFromText(title + ' ' + allBadgesStr + ' ' + skillTags.join(' '), skillTags);

          const logoImg = card.find('img[class*="css-128m8ex"], img.css-128m8ex, img').first();
          let companyLogo = logoImg.attr('src') || null;
          if (companyLogo && companyLogo.startsWith('data:')) companyLogo = null;

          const jobId = generateJobId(applyUrl);

          jobs.push({
            id: jobId,
            title,
            title_ar: title,
            company,
            company_ar: company,
            company_logo: companyLogo,
            location,
            location_ar: location,
            work_type: workType,
            is_remote: isRemote,
            seniority,
            salary_range: 'Competitive (EGP)',
            required_skills: skills,
            description: `Exciting opportunity for a ${title} at ${company} in ${location}. Join a growing team working with modern technologies.`,
            requirements: `Relevant experience in ${skills.slice(0, 3).join(', ')}. Strong analytical and problem-solving skills.`,
            apply_url: applyUrl,
            source: 'wuzzuf',
            posted_at: postedAt
          });
        } catch (cardErr) {}
      });

      await new Promise(r => setTimeout(r, 600));
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
