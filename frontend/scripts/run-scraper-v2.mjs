/**
 * 3watly — Wuzzuf Scraper v3 (JSON API Edition)
 * Uses Wuzzuf internal REST API (/api/job) — no HTML scraping, no 403 issues on GitHub Actions.
 * Run: node scripts/run-scraper-v2.mjs
 */

class DummyWebSocket {
  constructor() {}
  addEventListener() {}
  removeEventListener() {}
  close() {}
  send() {}
}
if (typeof globalThis.WebSocket === "undefined") globalThis.WebSocket = DummyWebSocket;
if (typeof global !== "undefined" && typeof global.WebSocket === "undefined") global.WebSocket = DummyWebSocket;

import * as cheerio from "cheerio";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function getEnvVal(key) {
  if (process.env[key]) return process.env[key];
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const m = content.match(new RegExp(`^${key}=(.*)$`, "m"));
      if (m) return m[1].trim().replace(/^['""]|['""]$/g, "");
    }
  } catch {}
  return "";
}

const SUPABASE_URL = getEnvVal("NEXT_PUBLIC_SUPABASE_URL");
const SERVICE_ROLE_KEY = getEnvVal("SUPABASE_SERVICE_ROLE_KEY") || getEnvVal("NEXT_PUBLIC_SUPABASE_ANON_KEY");

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: DummyWebSocket },
});

const WUZZUF_API = "https://wuzzuf.net/api/job";
const WUZZUF_BASE = "https://wuzzuf.net";
const API_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  "Accept": "application/vnd.api+json, application/json, text/xml, */*",
  "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
  "Referer": "https://wuzzuf.net/",
};

const TECH_SLUG_PATTERNS = [
  "data-analyst", "data-engineer", "data-scientist", "business-intelligence",
  "machine-learning", "artificial-intelligence", "ai-engineer",
  "software-engineer", "software-developer", "frontend", "front-end",
  "backend", "back-end", "full-stack", "fullstack", "react", "angular",
  "vue", "node", "python", "java-developer", "dotnet", "net-developer",
  "c-sharp", "c-plus-plus", "php-developer", "laravel", "flutter",
  "mobile-developer", "android", "ios-developer", "devops", "cloud-engineer",
  "aws", "azure", "system-administrator", "network-engineer", "cyber-security",
  "information-security", "qa-engineer", "quality-assurance", "testing-engineer",
  "test-automation", "scrum-master", "product-manager", "product-owner",
  "technical-lead", "solution-architect", "database-administrator", "dba",
  "power-bi", "tableau", "etl-developer", "odoo"
];
const PAGE_SIZE = 20;
const DELAY_MS = 700;

const SKILL_ALIASES = {
  "reactjs":"React","react.js":"React","nodejs":"Node.js","node js":"Node.js",
  "postgres":"PostgreSQL","js":"JavaScript","ts":"TypeScript",
  "powerbi":"Power BI","power bi":"Power BI","msbi":"Power BI",
  "ms sql":"SQL Server","mssql":"SQL Server","vue":"Vue.js","vuejs":"Vue.js",
  "nextjs":"Next.js","next.js":"Next.js","k8s":"Kubernetes",
  "scikit":"Scikit-Learn","sklearn":"Scikit-Learn",
  "restapi":"REST APIs","rest api":"REST APIs","ci/cd":"CI/CD","cicd":"CI/CD",
  "nlp":"NLP","etl":"ETL","android":"Android","ui/ux":"UI/UX",
  "pandas":"Pandas","numpy":"NumPy","excel":"Excel","ms excel":"Excel","microsoft excel":"Excel",
};

const KNOWN_TECH_SKILLS = new Set([
  "Python","SQL","Power BI","Tableau","Excel","Pandas","NumPy","R",
  "PostgreSQL","MySQL","MongoDB","Redis","Oracle","SQL Server","Snowflake",
  "BigQuery","dbt","Airflow","Kafka","Docker","Kubernetes","AWS","Azure",
  "GCP","Google Cloud","Git","GitHub","CI/CD","Linux","React","Next.js",
  "TypeScript","JavaScript","Node.js","Express","FastAPI","Django","Flask",
  "Java","Spring Boot","C#",".NET","C++","Go","PHP","Laravel","Angular",
  "Vue.js","Tailwind CSS","GraphQL","REST APIs","Agile","Scrum","Jira",
  "Data Modeling","ETL","Machine Learning","Deep Learning","NLP","TensorFlow",
  "PyTorch","Scikit-Learn","Statistics","Selenium","Postman","Flutter","Dart",
  "Firebase","DAX","Spark","Ansible","Terraform","Prometheus","Grafana",
  "Elasticsearch","LLMs","Generative AI","React Native","Kotlin","Swift","iOS","Android",
  "ASP.NET","Spring","Hibernate","Microservices","gRPC","Redis","Celery",
  "OpenCV","TensorFlow Lite","BERT","Transformers",".NET Core",
]);

const ROLE_SKILL_PROFILES = {
  "data analyst":        {core:["SQL","Excel","Power BI"],common:["Python","Tableau","Statistics"]},
  "data engineer":       {core:["Python","SQL","ETL"],common:["Airflow","Docker","Spark","dbt"]},
  "data scientist":      {core:["Python","Machine Learning","Statistics"],common:["TensorFlow","PyTorch","Pandas"]},
  "machine learning":    {core:["Python","Machine Learning","Statistics"],common:["TensorFlow","PyTorch","Scikit-Learn"]},
  "business intelligence":{core:["Power BI","SQL","Excel"],common:["DAX","Tableau","Data Modeling"]},
  "power bi":            {core:["Power BI","SQL","DAX"],common:["Excel","Data Modeling"]},
  "frontend":            {core:["JavaScript","HTML","CSS","React"],common:["TypeScript","Next.js","Git"]},
  "react":               {core:["React","JavaScript","HTML"],common:["TypeScript","Next.js","Git"]},
  "backend":             {core:["REST APIs","SQL","Git"],common:["Node.js","Python","Docker"]},
  "full stack":          {core:["JavaScript","SQL","Git","REST APIs"],common:["React","Node.js","Docker"]},
  "devops":              {core:["Docker","CI/CD","Linux","Git"],common:["Kubernetes","AWS","Ansible"]},
  "flutter":             {core:["Flutter","Dart","REST APIs"],common:["Firebase","Git"]},
  "product manager":     {core:["Agile","Jira","Analytics"],common:["Scrum","SQL"]},
  "business analyst":    {core:["SQL","Excel","Requirements Analysis"],common:["Power BI","Jira"]},
  "qa":                  {core:["Manual Testing","Jira","Test Cases"],common:["Selenium","Postman"]},
  "software engineer":   {core:["Git","REST APIs","SQL"],common:["Docker","Agile","CI/CD"]},
  "net developer":       {core:["C#",".NET","SQL Server"],common:["ASP.NET","Git","REST APIs"]},
  "java developer":      {core:["Java","Spring Boot","SQL"],common:["Docker","Git","REST APIs"]},
  "angular":             {core:["Angular","TypeScript","JavaScript"],common:["RxJS","Git","REST APIs"]},
  "cloud":               {core:["AWS","Azure","Docker"],common:["Kubernetes","CI/CD","Linux"]},
  "cybersecurity":       {core:["Linux","Networking","Security"],common:["Firewalls","SIEM"]},
  "ai engineer":         {core:["Python","Machine Learning","TensorFlow"],common:["Generative AI","LLMs"]},
  "node":                {core:["Node.js","JavaScript","REST APIs"],common:["Express","MongoDB","Git"]},
  "mobile":              {core:["REST APIs","Git"],common:["Flutter","React Native","Firebase"]},
};

const UNRELATED_TITLE_PATTERNS = [
  /\b(accountant|accounting|finance|financial|treasury|auditor)\b/i,
  /\b(sales|retail|customer service|call center|telemarketing)\b/i,
  /\b(hr|human resources|talent acquisition|recruiter|payroll|personnel)\b/i,
  /\b(marketing|brand|seo|social media manager|content creator|graphic design)\b/i,
  /\b(supply chain|logistics|procurement|warehouse|inventory|purchasing|import|export)\b/i,
  /\b(legal|lawyer|attorney|compliance officer)\b/i,
  /\b(teacher|instructor|trainer|professor|lecturer)\b/i,
  /\b(doctor|nurse|pharmacist|medical|clinical|dental)\b/i,
  /\b(chef|cook|food|hospitality|hotel|tourism|restaurant)\b/i,
  /\b(driver|delivery|courier|transport|fleet)\b/i,
  /\b(secretary|receptionist|office manager|administrative assistant)\b/i,
  /\b(factory|manufacturing|quality control inspector|production)\b/i,
  /\b(civil engineer|structural|architectural|mechanical engineer|electrical engineer)\b/i,
  /\b(real estate|property|construction manager)\b/i,
];

function genId(url) {
  return "wuzzuf_" + crypto.createHash("md5").update(url).digest("hex").slice(0, 16);
}

function normalizeSkill(raw) {
  if (!raw) return null;
  const s = raw.replace(/^[\s\u2022\u25CF\-\*\t]+/, "").replace(/[:\s]+$/, "").trim();
  if (s.length < 2) return null;
  return SKILL_ALIASES[s.toLowerCase().replace(/\s+/g," ")] || s;
}

function dedupeSkills(skills) {
  const seen = new Set();
  return skills.map(s => normalizeSkill(s)).filter(s => {
    if (!s) return false;
    const lo = s.toLowerCase().replace(/\s+/g," ");
    if (s.length < 2 || s.length > 40) return false;
    if (/^\d+$/.test(s)) return false;
    if (s.split(/\s+/).length > 4) return false;
    const inKnown = KNOWN_TECH_SKILLS.has(s) || [...KNOWN_TECH_SKILLS].some(k => k.toLowerCase()===lo);
    const inAlias = Object.values(SKILL_ALIASES).some(v => v.toLowerCase()===lo);
    if (!inKnown && !inAlias) return false;
    if (seen.has(lo)) return false;
    seen.add(lo); return true;
  });
}

function extractSkillsFromText(text) {
  if (!text) return [];
  const found = new Set();
  for (const skill of KNOWN_TECH_SKILLS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    if (new RegExp(`(?<![a-zA-Z])${escaped}(?![a-zA-Z])`,"i").test(text)) found.add(skill);
  }
  return [...found];
}

function inferSkillsFromTitle(title) {
  const t = title.toLowerCase();
  for (const [key, profile] of Object.entries(ROLE_SKILL_PROFILES)) {
    if (t.includes(key)) return dedupeSkills([...profile.core,...profile.common]);
  }
  return [];
}

function parseSeniority(careerLevel, title) {
  const levelStr = typeof careerLevel === 'object'
    ? (careerLevel?.name || careerLevel?.hint || '')
    : (careerLevel || '');
  const s = ((levelStr || '') + ' ' + (title || '')).toLowerCase();
  if (/entry|fresh|graduate|intern|student|trainee/i.test(s)) return 'Fresh';
  if (/senior|lead|principal|sr\.|manager|5\+|7\+/i.test(s)) return 'Senior';
  if (/junior/i.test(s)) return 'Junior';
  return 'Mid';
}

function parseWorkType(arrangement) {
  const str = typeof arrangement === 'object'
    ? (arrangement?.displayedName || arrangement?.translations?.displayed_name?.en || '')
    : (arrangement || '');
  const a = str.toLowerCase();
  if (/hybrid/i.test(a)) return { workType: 'Hybrid', isRemote: false };
  if (/remote|work from home|عن بعد/i.test(a)) return { workType: 'Remote', isRemote: true };
  return { workType: 'On-site', isRemote: false };
}

function translateTitle(title) {
  const t = title.toLowerCase();
  const pfx = /senior|lead|principal/.test(t) ? "أول " : /junior|entry/.test(t) ? "مبتدئ " : "";
  if (/data analyst/.test(t)) return `محلل بيانات ${pfx}`.trim();
  if (/data engineer/.test(t)) return `مهندس بيانات ${pfx}`.trim();
  if (/data scientist/.test(t)) return `عالم بيانات ${pfx}`.trim();
  if (/machine learning|ai engineer/.test(t)) return `مهندس ذكاء اصطناعي ${pfx}`.trim();
  if (/frontend|front-end|react developer/.test(t)) return `مطور واجهات أمامية ${pfx}`.trim();
  if (/backend|back-end/.test(t)) return `مطور خلفية (Backend) ${pfx}`.trim();
  if (/full.?stack/.test(t)) return `مطور برمجيات شامل ${pfx}`.trim();
  if (/devops|cloud engineer/.test(t)) return `مهندس DevOps ${pfx}`.trim();
  if (/product manager/.test(t)) return `مدير منتجات رقمية ${pfx}`.trim();
  if (/business analyst/.test(t)) return `محلل نظم وأعمال ${pfx}`.trim();
  if (/power bi/.test(t)) return `مطور تقارير Power BI ${pfx}`.trim();
  if (/flutter|mobile developer/.test(t)) return `مطور تطبيقات هواتف ${pfx}`.trim();
  if (/qa|quality assurance/.test(t)) return `مهندس جودة (QA) ${pfx}`.trim();
  if (/software engineer|software developer/.test(t)) return `مهندس برمجيات ${pfx}`.trim();
  if (/cybersecurity/.test(t)) return `مهندس أمن معلومات ${pfx}`.trim();
  if (/net developer|c# developer/.test(t)) return `مطور .NET ${pfx}`.trim();
  if (/java developer/.test(t)) return `مطور Java ${pfx}`.trim();
  if (/node/.test(t)) return `مطور Node.js ${pfx}`.trim();
  return title;
}

function translateLocation(loc) {
  const l = (loc||"").toLowerCase();
  if (/sheikh zayed|zayed/.test(l)) return "الشيخ زايد، الجيزة";
  if (/6th of october|october/.test(l)) return "السادس من أكتوبر، الجيزة";
  if (/smart village/.test(l)) return "القرية الذكية، الجيزة";
  if (/new cairo|tagamoa/.test(l)) return "القاهرة الجديدة، القاهرة";
  if (/maadi/.test(l)) return "المعادي، القاهرة";
  if (/nasr city/.test(l)) return "مدينة نصر، القاهرة";
  if (/heliopolis/.test(l)) return "مصر الجديدة، القاهرة";
  if (/dokki/.test(l)) return "الدقي، الجيزة";
  if (/mohandessin/.test(l)) return "المهندسين، الجيزة";
  if (/giza/.test(l)) return "الجيزة، مصر";
  if (/alexandria|alex/.test(l)) return "الإسكندرية، مصر";
  if (/cairo/.test(l)) return "القاهرة، مصر";
  if (/remote/.test(l)) return "عن بُعد (مصر)";
  return loc || "القاهرة، مصر";
}

function parseSalary(salaryAttr, hideSalary) {
  if (hideSalary || !salaryAttr) return "تحدد أثناء المقابلة";
  const {min, max, currency} = salaryAttr;
  if (!min && !max) return "تحدد أثناء المقابلة";
  const curr = currency || "EGP";
  if (min && max) return `${Number(min).toLocaleString()} - ${Number(max).toLocaleString()} ${curr}`;
  if (max) return `Up to ${Number(max).toLocaleString()} ${curr}`;
  if (min) return `From ${Number(min).toLocaleString()} ${curr}`;
  return "تحدد أثناء المقابلة";
}

function parsePostedAt(dateStr) {
  if (!dateStr) return null;
  try { const d = new Date(dateStr); if (!isNaN(d.getTime())) return d.toISOString(); } catch {}
  return null;
}

function classifyQuality(job) {
  const hasVerified = (job.required_skills?.length ?? 0) >= 2;
  const hasInferred = (job.inferred_skills?.length ?? 0) >= 1;
  const hasDate = !!job.posted_at;
  const hasCompany = !!job.company;
  if (hasVerified && hasDate && hasCompany) return "verified";
  if (hasVerified || (hasInferred && hasDate)) return "partial";
  if (hasInferred) return "inferred";
  return "unresolved";
}

async function apiFetch(params) {
  const url = `${WUZZUF_API}?${new URLSearchParams(params).toString()}`;
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {headers: API_HEADERS, signal: AbortSignal.timeout(20000)});
      if (res.status === 429) {
        const wait = 3000 * Math.pow(2, attempt);
        console.warn(`  ⚠️  Rate limited — waiting ${wait}ms`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (!res.ok) { console.warn(`  ⚠️  HTTP ${res.status} — ${url.slice(0,80)}`); return null; }
      return await res.json();
    } catch (e) {
      if (attempt === 2) { console.warn(`  ❌ Fetch failed: ${e.message}`); return null; }
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  return null;
}

function buildJob(item, companiesById) {
  const a = item.attributes;
  const companyId = item.relationships?.company?.data?.id;
  const companyData = companiesById.get(companyId);
  const company = companyData?.attributes?.name || null;
  const logoFile = companyData?.attributes?.logo || a.logo || null;
  const companyLogo = logoFile
    ? (logoFile.startsWith("http") ? logoFile : `https://media.wuzzuf.net/files/company_logo/${logoFile}`)
    : null;

  const title = (a.title || "").trim();
  if (!title) return null;
  if (UNRELATED_TITLE_PATTERNS.some(p => p.test(title))) return null;

  const cityName = a.location?.city?.name || "";
  const countryName = a.location?.country?.name || "";
  if (countryName && !/(egypt|eg)/i.test(countryName) && !/(remote|work from home)/i.test(a.workplaceArrangement || "")) {
    return null;
  }

  const location = cityName || countryName || "Cairo, Egypt";
  const {workType, isRemote} = parseWorkType(a.workplaceArrangement);
  const seniority = parseSeniority(a.careerLevel?.name, title);
  const postedAt = parsePostedAt(a.postedAt);

  const keywordSkills = (a.keywords || []).map(k => k.name).filter(Boolean);
  const descText = (a.description || "") + " " + (a.requirements || "");
  const descSkills = extractSkillsFromText(descText);
  const titleSkills = extractSkillsFromText(title);

  const verifiedSkills = dedupeSkills([...keywordSkills, ...descSkills, ...titleSkills]);
  const allSkills = verifiedSkills.length >= 2 ? verifiedSkills : inferSkillsFromTitle(title);

  const applyUrl = a.slug ? `${WUZZUF_BASE}/jobs/p/${a.slug}` : `${WUZZUF_BASE}${a.uri || ""}`;

  return {
    id: genId(applyUrl),
    title,
    title_ar: translateTitle(title),
    company: company || 'شركة رائدة',
    company_ar: company || 'شركة رائدة',
    company_logo: companyLogo,
    location,
    location_ar: translateLocation(location),
    work_type: workType,
    is_remote: isRemote,
    seniority,
    salary_range: parseSalary(a.salary, a.hideSalary),
    salary_min: a.salary?.min || null,
    salary_max: a.salary?.max || null,
    salary_currency: a.salary?.currency || 'EGP',
    required_skills: allSkills,
    description: (a.description || `Exciting opportunity for ${title} at ${company || "a leading company"} in ${location}.`).slice(0, 3000),
    requirements: (a.requirements || allSkills.slice(0, 5).map(s => `• Experience with ${s}`).join("\n")).slice(0, 3000),
    apply_url: applyUrl,
    source: "wuzzuf",
    posted_at: postedAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Discover Tech Slugs from Sitemaps (Cloudflare Safe: XML endpoints return 200)
// ─────────────────────────────────────────────────────────────────────────────
async function discoverSlugsFromSitemaps() {
  console.log("🗺️  Phase 1: Discovering Tech Slugs via Sitemaps...");
  const sitemaps = [
    "https://wuzzuf.net/sitemap-job-1.xml",
    "https://wuzzuf.net/sitemap-job-2.xml",
  ];
  const techSlugs = new Set();

  for (const sitemapUrl of sitemaps) {
    try {
      console.log(`  📄 Fetching sitemap: ${sitemapUrl}`);
      const res = await fetch(sitemapUrl, {
        headers: API_HEADERS,
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) {
        console.warn(`  ⚠️  HTTP ${res.status} — ${sitemapUrl}`);
        continue;
      }
      const xml = await res.text();
      const $ = cheerio.load(xml, { xmlMode: true });
      const urls = [];
      $("loc").each((_, el) => {
        const text = $(el).text().trim();
        if (text) urls.push(text);
      });

      console.log(`  Found ${urls.length} URLs in ${sitemapUrl}`);

      for (const fullUrl of urls) {
        const match = fullUrl.match(/\/jobs\/p\/([a-zA-Z0-9_-]+)/);
        if (!match) continue;
        const slug = match[1];
        const lowerSlug = slug.toLowerCase();

        const matchesTech = TECH_SLUG_PATTERNS.some(p => lowerSlug.includes(p));
        if (!matchesTech) continue;

        if (UNRELATED_TITLE_PATTERNS.some(p => p.test(lowerSlug.replace(/-/g, " ")))) continue;

        techSlugs.add(slug);
      }
    } catch (e) {
      console.warn(`  ⚠️ Sitemap fetch error: ${e.message}`);
    }
  }

  console.log(`  🎯 Filtered to ${techSlugs.size} unique tech job slugs.\n`);
  return [...techSlugs];
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Batch Fetch Job Details via Wuzzuf JSON API (15 slugs per call)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchBatchBySlugs(slugs) {
  console.log(`🚀 Phase 2: Enriching ${slugs.length} Tech Jobs via Wuzzuf JSON API...`);
  const jobs = [];
  const CHUNK_SIZE = 15;

  for (let i = 0; i < slugs.length; i += CHUNK_SIZE) {
    const chunk = slugs.slice(i, i + CHUNK_SIZE);
    const url = `${WUZZUF_API}?filter[slug]=${chunk.join(",")}&include=company`;

    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        const res = await fetch(url, {
          headers: API_HEADERS,
          signal: AbortSignal.timeout(15000),
        });

        if (res.status === 429) {
          const wait = 3000 * Math.pow(2, attempt);
          console.warn(`  ⚠️  Rate limited — waiting ${wait}ms`);
          await new Promise(r => setTimeout(r, wait));
          continue;
        }

        if (!res.ok) {
          console.warn(`  ⚠️  HTTP ${res.status} for batch ${Math.floor(i / CHUNK_SIZE) + 1}`);
          break;
        }

        const json = await res.json();
        const companiesById = new Map(
          (json.included || []).filter(item => item.type === "company").map(c => [c.id, c])
        );

        for (const item of (json.data || [])) {
          const job = buildJob(item, companiesById);
          if (job) jobs.push(job);
        }
        break;
      } catch (e) {
        if (attempt === 2) console.warn(`  ❌ Batch error: ${e.message}`);
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    process.stdout.write(`  🚀 Processed ${Math.min(i + CHUNK_SIZE, slugs.length)}/${slugs.length} slugs (${jobs.length} tech jobs enriched)\r`);
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n  ✅ Batch Enrichment Complete: ${jobs.length} jobs ready.\n`);
  return jobs;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Supplemental: Latest Active Jobs via API Feed
// ─────────────────────────────────────────────────────────────────────────────
async function fetchLatestActiveJobs(maxPages = 4) {
  console.log("⚡ Phase 3: Fetching Latest Active Jobs from API Feed...");
  const supplementalJobs = [];

  for (let page = 1; page <= maxPages; page++) {
    const url = `${WUZZUF_API}?filter[status]=active&sort=-postedAt&include=company&page[number]=${page}&page[size]=50`;
    try {
      const res = await fetch(url, { headers: API_HEADERS, signal: AbortSignal.timeout(15000) });
      if (!res.ok) break;
      const json = await res.json();
      const companiesById = new Map(
        (json.included || []).filter(item => item.type === "company").map(c => [c.id, c])
      );

      for (const item of (json.data || [])) {
        const a = item.attributes;
        if (!a || !a.title) continue;

        const isTechRole = a.workRoles?.some(r => r.id === 16 || /it\/software/i.test(r.name));
        const matchesTech = isTechRole || TECH_SLUG_PATTERNS.some(p => (a.slug || a.title).toLowerCase().includes(p));
        if (!matchesTech) continue;
        if (UNRELATED_TITLE_PATTERNS.some(p => p.test(a.title))) continue;

        const country = a.location?.country?.name || "";
        if (country && !/(egypt|eg)/i.test(country) && !/(remote|work from home)/i.test(a.workplaceArrangement || "")) {
          continue;
        }

        const job = buildJob(item, companiesById);
        if (job) supplementalJobs.push(job);
      }
      await new Promise(r => setTimeout(r, 400));
    } catch {}
  }

  console.log(`  ✅ Supplemental Phase: ${supplementalJobs.length} fresh active tech jobs.\n`);
  return supplementalJobs;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Main Controller
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log("═════════════════════════════════════════════════════════");
  console.log("  3watly Wuzzuf Scraper v3 — Cloudflare-Safe Engine");
  console.log(`  Started: ${new Date().toLocaleString("ar-EG")}`);
  console.log("═════════════════════════════════════════════════════════\n");

  // Step 1: Slugs from Sitemap
  const slugs = await discoverSlugsFromSitemaps();

  // Step 2: Batch Enrich from JSON API (up to 350 slugs)
  const enrichedJobs = await fetchBatchBySlugs(slugs.slice(0, 350));

  // Step 3: Latest Active Feed
  const latestJobs = await fetchLatestActiveJobs(4);

  // Step 4: Merge & Deduplicate
  const allMap = new Map();
  for (const job of [...enrichedJobs, ...latestJobs]) {
    allMap.set(job.id, job);
  }
  const jobsList = [...allMap.values()];

  console.log(`📊  Total Unique Tech Jobs Collected: ${jobsList.length}`);
  console.log(`  With skills:  ${jobsList.filter(j => j.required_skills.length > 0).length}`);
  console.log(`  With date:    ${jobsList.filter(j => j.posted_at).length}`);
  console.log(`  With company: ${jobsList.filter(j => j.company).length}`);

  // Step 5: Upsert to Supabase
  console.log("\n💾  Saving to Supabase...");
  let upserted = 0, errors = 0;
  const CHUNK = 50;

  for (let i = 0; i < jobsList.length; i += CHUNK) {
    const batch = jobsList.slice(i, i + CHUNK);
    const { error } = await supabase
      .from("jobs")
      .upsert(batch, { onConflict: "id", ignoreDuplicates: false });

    if (error) {
      console.error(`  ❌ Batch ${Math.floor(i / CHUNK) + 1} error: ${error.message}`);
      errors++;
    } else {
      upserted += batch.length;
      process.stdout.write(`  ✅ Saved ${upserted}/${jobsList.length} jobs to Supabase\r`);
    }
  }

  // Step 6: Cleanup expired jobs (> 30 days)
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const { data: deleted } = await supabase
    .from("jobs").delete()
    .lt("posted_at", cutoff.toISOString())
    .not("posted_at", "is", null)
    .select("id");

  const d = fn => jobsList.length > 0 ? (jobsList.filter(j => fn(j)).length / jobsList.length * 100).toFixed(1) : 0;
  const dateRate = d(j => j.posted_at);
  const compRate = d(j => j.company);
  const skillRate = d(j => j.required_skills.length > 0);

  console.log("\n\n═════════════════════════════════════════════════════════");
  console.log("  ✅ SCRAPER RUN COMPLETE");
  console.log("═════════════════════════════════════════════════════════");
  console.log(`  Total collected:     ${jobsList.length}`);
  console.log(`  Saved to DB:         ${upserted}`);
  console.log(`  Expired deleted:     ${deleted?.length ?? 0}`);
  console.log(`  Batch errors:        ${errors}`);
  console.log(`  Date extraction:     ${dateRate}% ✅`);
  console.log(`  Company extraction:  ${compRate}% ✅`);
  console.log(`  Skill extraction:    ${skillRate}% ✅`);
  console.log(`  Finished: ${new Date().toLocaleString("ar-EG")}`);
  console.log("═════════════════════════════════════════════════════════\n");
}

main().catch(console.error);
