import * as cheerio from 'cheerio';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xwkkwmplohwsnwxjxusx.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

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
  'data analyst', 'business intelligence', 'data engineer', 'data scientist',
  'python', 'sql', 'frontend', 'react', 'backend', 'node', 'full stack',
  'machine learning', 'devops', 'product manager', 'business analyst', 'power bi'
];

const KNOWN_SKILLS = [
  'Python', 'SQL', 'Power BI', 'Tableau', 'Excel', 'Pandas', 'NumPy', 'R',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'Docker',
  'Kubernetes', 'AWS', 'Azure', 'GCP', 'Git', 'GitHub', 'CI/CD', 'Linux',
  'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
  'FastAPI', 'Django', 'Flask', 'Java', 'Spring Boot', 'C#', '.NET', 'PHP',
  'Laravel', 'Airflow', 'Kafka', 'dbt', 'Snowflake', 'BigQuery', 'ETL',
  'Data Modeling', 'Data Warehousing', 'Machine Learning', 'TensorFlow', 'PyTorch'
];

function generateJobId(url) {
  return 'wuzzuf_' + crypto.createHash('md5').update(url).digest('hex').slice(0, 16);
}

function parseSeniority(str) {
  const s = str.toLowerCase();
  if (s.includes('entry') || s.includes('fresh') || s.includes('مبتدئ') || s.includes('حديث')) return 'Fresh';
  if (s.includes('junior')) return 'Junior';
  if (s.includes('senior') || s.includes('lead') || s.includes('manager') || s.includes('أول') || s.includes('متقدم')) return 'Senior';
  return 'Mid';
}

function parseWorkType(str) {
  const s = str.toLowerCase();
  const isRemote = s.includes('remote') || s.includes('work from home') || s.includes('عن بُعد') || s.includes('عن بعد');
  let workType = 'On-site';
  if (s.includes('hybrid') || s.includes('مرن') || s.includes('هجين')) workType = 'Hybrid';
  if (isRemote && !s.includes('hybrid')) workType = 'Remote';
  return { workType, isRemote };
}

function extractSkills(text, tags = []) {
  const set = new Set(tags.map(t => t.trim()).filter(t => t.length > 1));
  KNOWN_SKILLS.forEach(k => {
    if (new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)) {
      set.add(k);
    }
  });
  return Array.from(set).slice(0, 10);
}

async function scrapeWuzzuf() {
  console.log('🚀 [3WATLY Cloud Scraper] Starting crawl of Wuzzuf Egypt & Global Tech postings...');
  const allJobs = new Map();

  for (const q of SEARCH_QUERIES) {
    for (let page = 0; page <= 2; page++) {
      const url = `https://wuzzuf.net/search/jobs/?q=${encodeURIComponent(q)}&a=hpb&start=${page}`;
      try {
        const res = await fetch(url, { headers: BROWSER_HEADERS });
        if (!res.ok) {
          console.warn(`⚠️ [Wuzzuf] HTTP ${res.status} on "${q}" page ${page}`);
          continue;
        }

        const html = await res.text();
        const $ = cheerio.load(html);

        const cards = $('div[class*="css-1gatmva"], div[class*="css-pkv5jc"], div.css-1gatmva, div.css-pkv5jc');
        cards.each((_, el) => {
          try {
            const card = $(el);

            const link = card.find('h2 a, a[class*="css-o171kl"]').first();
            const title = link.text().trim();
            let applyUrl = link.attr('href') || '';
            if (!title || !applyUrl) return;
            if (applyUrl.startsWith('/')) applyUrl = 'https://wuzzuf.net' + applyUrl;

            const compElem = card.find('a[class*="css-17s97q8"], div[class*="css-d7j1kk"] a').first();
            let company = compElem.text().trim().replace(/-$/, '').trim() || 'Confidential Employer';

            const locElem = card.find('span[class*="css-5wys0k"]').first();
            const location = locElem.text().trim() || 'Cairo, Egypt';

            const badges = [];
            card.find('span[class*="css-1ve4b75"], span[class*="css-y4nlo8"], a[class*="css-o171kl"]').each((_, b) => badges.push($(b).text().trim()));
            const badgeStr = badges.join(' ');

            const { workType, isRemote } = parseWorkType(badgeStr + ' ' + location);
            const seniority = parseSeniority(badgeStr + ' ' + title);

            const tags = [];
            card.find('a[class*="css-5x9545"], div[class*="css-y4nlo8"] a').each((_, t) => tags.push($(t).text().trim()));

            const skills = extractSkills(title + ' ' + badgeStr + ' ' + tags.join(' '), tags);

            const logoImg = card.find('img[class*="css-128m8ex"]').first();
            let companyLogo = logoImg.attr('src') || null;
            if (companyLogo && companyLogo.startsWith('data:')) companyLogo = null;

            const id = generateJobId(applyUrl);
            allJobs.set(id, {
              id,
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
              description: `فرصة عمل متميزة لمنصب ${title} في شركة ${company} (${location}). بيئة عمل احترافية مع فرص للتطور والنمو.`,
              requirements: `خبرة عملية في ${skills.slice(0, 4).join(', ')}. مهارات تحليلية وتواصل قوية.`,
              apply_url: applyUrl,
              source: 'wuzzuf',
              posted_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            });
          } catch (err) {}
        });

        await new Promise(r => setTimeout(r, 450));
      } catch (err) {
        console.warn(`Error on query "${q}":`, err.message);
      }
    }
  }

  // Remotive Remote Data & Software jobs
  try {
    const remotiveCategories = ['data', 'software-dev'];
    for (const cat of remotiveCategories) {
      const res = await fetch(`https://remotive.com/api/remote-jobs?category=${cat}&limit=30`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.jobs)) {
          json.jobs.slice(0, 25).forEach(j => {
            const id = generateJobId(j.url);
            const skills = extractSkills(j.title + ' ' + (j.tags || []).join(' ') + ' ' + (j.description || ''), j.tags || []);
            allJobs.set(id, {
              id,
              title: j.title,
              title_ar: j.title,
              company: j.company_name,
              company_ar: j.company_name,
              company_logo: j.company_logo || null,
              location: j.candidate_required_location || 'Remote (Worldwide)',
              location_ar: 'عن بُعد (عالمي / مصر)',
              work_type: 'Remote',
              is_remote: true,
              seniority: parseSeniority(j.title),
              salary_range: j.salary || 'Competitive USD / EGP',
              required_skills: skills,
              description: j.description ? j.description.slice(0, 1000).replace(/<[^>]+>/g, '') : `Remote position for ${j.title} at ${j.company_name}.`,
              requirements: `Skills required: ${skills.slice(0, 5).join(', ')}.`,
              apply_url: j.url,
              source: 'remotive',
              posted_at: j.publication_date || new Date().toISOString(),
              created_at: new Date().toISOString()
            });
          });
        }
      }
    }
  } catch (remotiveErr) {}

  const jobsList = Array.from(allJobs.values());
  console.log(`\n📦 Total unique live jobs collected: ${jobsList.length}`);

  let upsertedCount = 0;
  const CHUNK_SIZE = 50;
  for (let i = 0; i < jobsList.length; i += CHUNK_SIZE) {
    const chunk = jobsList.slice(i, i + CHUNK_SIZE);
    const { error } = await supabase.from('jobs').upsert(chunk, { onConflict: 'id' });
    if (!error) {
      upsertedCount += chunk.length;
    }
  }

  console.log(`\n🎉 DONE! ${upsertedCount} live jobs successfully synced to Supabase database!`);
}

scrapeWuzzuf();
