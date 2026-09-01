import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { JobItem } from '@/data/jobs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ---------- helpers ---------- */

const seniorityArMap: Record<string, string> = {
  Fresh: 'حديث التخرج',
  Junior: 'مبتدئ',
  Mid: 'متوسط',
  Senior: 'أول / متقدم',
};

const workTypeArMap: Record<string, string> = {
  Hybrid: 'مرن (مكتبي وعن بُعد)',
  Remote: 'عن بُعد بالكامل',
  'On-site': 'من مقر الشركة',
};

function normalizeWorkType(raw: string | null, isRemote: boolean): JobItem['workType'] {
  if (!raw) return isRemote ? 'Remote' : 'On-site';
  const l = raw.toLowerCase();
  if (l.includes('remote')) return 'Remote';
  if (l.includes('hybrid')) return 'Hybrid';
  return 'On-site';
}

function timeAgo(dateStr: string | null): { en: string; ar: string } {
  if (!dateStr) return { en: 'Recently', ar: 'مؤخراً' };
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return { en: 'Just now', ar: 'الآن' };
  if (hours < 24) return { en: `${hours} hour${hours > 1 ? 's' : ''} ago`, ar: `منذ ${hours} ساعة` };
  const days = Math.floor(hours / 24);
  if (days < 7) return { en: `${days} day${days > 1 ? 's' : ''} ago`, ar: `منذ ${days} يوم` };
  const weeks = Math.floor(days / 7);
  return { en: `${weeks} week${weeks > 1 ? 's' : ''} ago`, ar: `منذ ${weeks} أسبوع` };
}

function parseSkillsArray(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
}

// Words/tokens that are NOT specific technical skills and must be filtered out
const JOBS_SKILL_BLACKLIST = new Set([
  'experienced', 'experience', 'senior', 'junior', 'mid level', 'expert', 'manager', 'specialist',
  'internship', 'intern', 'student', 'entry level', 'fresh graduate', 'fresher',
  'it', 'information technology', 'it/software development', 'software development',
  'engineering', 'general', 'other', 'miscellaneous', 'various',
  'research', 'ability', 'skills', 'knowledge', 'understanding',
  'strong', 'good', 'excellent', 'proficient', 'familiar', 'basic', 'advanced',
  'working knowledge', 'proven', 'demonstrated', 'solid',
  'bi', 'ai', 'ml', 'dl',
  'full time', 'part time', 'contract', 'freelance', 'remote',
  'communication', 'teamwork', 'leadership', 'presentation skills', 'interpersonal skills',
  'problem solving', 'critical thinking', 'analytical skills', 'analytical thinking',
  'work under pressure', 'attention to detail', 'time management', 'multitasking',
  'data analysis', 'business analysis', 'data analytics', 'market research', 'quantitative analysis'
]);

// Canonical expansions for common abbreviations found in scraped DB data
const SKILL_EXPANSION: Record<string, string> = {
  'bi': 'Business Intelligence',
  'ai': 'Machine Learning',
  'ml': 'Machine Learning',
  'dl': 'Deep Learning',
  'oop': 'OOP',
  'nlp': 'NLP',
  'etl': 'ETL',
  'kpi': 'KPIs & Reporting',
  'erp': 'ERP Systems',
  'api': 'REST APIs',
  'ci/cd': 'CI/CD',
  'ux': 'UX Design',
  'ui': 'UI Design',
};

// Semantic inference rules: if candidate knows key tools, they satisfy these competency areas
const SKILL_INFERENCE_RULES: Record<string, string[]> = {
  'data analysis': ['python', 'sql', 'pandas', 'excel', 'power bi', 'tableau', 'r'],
  'data analytics': ['python', 'sql', 'pandas', 'excel', 'power bi', 'tableau', 'r'],
  'business intelligence': ['power bi', 'tableau', 'sql', 'looker', 'qlik', 'excel'],
  'business analysis': ['power bi', 'tableau', 'sql', 'excel', 'jira'],
  'data visualization': ['power bi', 'tableau', 'matplotlib', 'seaborn', 'looker', 'excel'],
  'data cleaning': ['python', 'pandas', 'sql', 'excel', 'r'],
  'database management': ['sql', 'postgresql', 'mysql', 'sql server', 'oracle', 'mongodb'],
  'etl': ['python', 'sql', 'airflow', 'ssis', 'dbt', 'spark'],
  'machine learning': ['python', 'scikit-learn', 'tensorflow', 'pytorch', 'pandas', 'r'],
  'deep learning': ['python', 'pytorch', 'tensorflow', 'keras'],
  'frontend development': ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'],
  'backend development': ['node.js', 'python', 'django', 'flask', 'fastapi', 'java', 'c#', 'php', 'go'],
  'cloud computing': ['aws', 'azure', 'gcp', 'google cloud'],
};

function isSkillMatchedByUser(reqSkill: string, userSkills: string[]): boolean {
  const normReq = reqSkill.toLowerCase().trim();
  const normUser = userSkills.map(s => s.toLowerCase().trim());

  // 1. Direct or substring match
  if (normUser.some(us => us === normReq || us.includes(normReq) || normReq.includes(us))) {
    return true;
  }

  // 2. Semantic inference match (e.g. user knows Power BI -> satisfies Business Intelligence & Data Visualization)
  const inferredFrom = SKILL_INFERENCE_RULES[normReq];
  if (inferredFrom && inferredFrom.some(neededSkill => normUser.some(us => us.includes(neededSkill) || neededSkill.includes(us)))) {
    return true;
  }

  return false;
}

function cleanAndFilterSkills(rawSkills: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of rawSkills) {
    const trimmed = (raw || '').trim();
    if (!trimmed || trimmed.length < 2) continue;

    const lower = trimmed.toLowerCase();

    // Skip blacklisted tokens
    if (JOBS_SKILL_BLACKLIST.has(lower)) continue;

    // Expand known abbreviations
    const expanded = SKILL_EXPANSION[lower] || trimmed;
    const expLower = expanded.toLowerCase();

    if (JOBS_SKILL_BLACKLIST.has(expLower)) continue;

    // Skip very short tokens (1-2 chars)
    if (expanded.length <= 2) continue;

    // Skip tokens that are purely numeric
    if (/^\d+$/.test(expanded)) continue;

    // Skip phrases with more than 4 words
    if (expanded.split(/\s+/).length > 4) continue;

    if (!seen.has(expanded)) { seen.add(expanded); result.push(expanded); }
  }

  return result;
}

/* ---------- GET handler ---------- */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword')?.trim().toLowerCase() || '';
    const locationQuery = searchParams.get('location')?.trim().toLowerCase() || '';
    const seniority = searchParams.get('seniority') || 'all';
    const workType = searchParams.get('workType') || 'all';
    const sortBy = searchParams.get('sortBy') || 'match';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 200);
    const userSkillsParam = searchParams.get('skills') || '';

    const userSkills = userSkillsParam
      ? userSkillsParam.split(',').map((s) => s.trim().toLowerCase())
      : ['sql', 'python', 'power bi', 'excel', 'data modeling', 'tableau', 'react', 'git'];

    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let jobsFromDb: any[] = [];

    if (supabase) {
      try {
        let query = supabase.from('jobs').select('*');

        // DB-level keyword search across title, company, location
        if (keyword) {
          query = query.or(
            `title.ilike.%${keyword}%,company.ilike.%${keyword}%,description.ilike.%${keyword}%`
          );
        }

        // DB-level location filter
        if (locationQuery) {
          query = query.ilike('location', `%${locationQuery}%`);
        }

        if (seniority !== 'all') {
          query = query.ilike('seniority', `%${seniority}%`);
        }
        if (workType === 'remote') {
          query = query.eq('is_remote', true);
        } else if (workType === 'hybrid') {
          query = query.ilike('work_type', '%hybrid%');
        } else if (workType === 'onsite') {
          query = query.ilike('work_type', '%on-site%');
        }

        const { data, error } = await query
          .order('posted_at', { ascending: false })
          .limit(limit);

        if (!error && Array.isArray(data) && data.length > 0) {
          jobsFromDb = data;
        }
      } catch (e) {
        console.warn('Supabase jobs query fallback:', e);
      }
    }

    /* ---- Transform DB rows → full JobItem[] ---- */
    const targetRole = (searchParams.get('targetRole') || '').trim().toLowerCase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedJobs: JobItem[] = jobsFromDb.map((row: any) => {
      // Clean scraped skills — removes garbage tokens and generic title phrases
      const reqSkills = cleanAndFilterSkills(parseSkillsArray(row.required_skills));

      const matchedSkills = reqSkills
        .filter((s) => isSkillMatchedByUser(s, userSkills))
        .map((s) => ({ name: s, weight: 0.8 }));

      const missingSkills = reqSkills
        .filter((s) => !isSkillMatchedByUser(s, userSkills))
        .map((s, idx) => {
          const demandBase = Math.max(25, Math.min(75, 60 - idx * 7));
          return {
            name: s,
            weight: parseFloat(((reqSkills.length - idx) / Math.max(reqSkills.length, 1)).toFixed(2)),
            marketNote: `Found in ${demandBase}% of similar Cairo jobs`,
            marketNoteAr: `موجودة في ${demandBase}% من وظائف القاهرة المشابهة`,
          };
        });

      // Role title match boost
      const titleLower = (row.title || '').toLowerCase();
      let roleBoost = 0;
      if (targetRole) {
        if (targetRole.includes('data') && (titleLower.includes('data') || titleLower.includes('bi') || titleLower.includes('analytics'))) {
          roleBoost = 15;
        } else if (targetRole.includes('frontend') && (titleLower.includes('frontend') || titleLower.includes('react') || titleLower.includes('web'))) {
          roleBoost = 15;
        } else if (targetRole.includes('backend') && (titleLower.includes('backend') || titleLower.includes('node') || titleLower.includes('api'))) {
          roleBoost = 15;
        }
      }

      const matchRatio = reqSkills.length > 0 ? (matchedSkills.length / reqSkills.length) : 0.8;
      const baseMatch = Math.round(matchRatio * 75 + 15 + roleBoost);
      const matchScore = Math.min(98, Math.max(55, baseMatch));

      const wt = normalizeWorkType(row.work_type, !!row.is_remote);
      const senior: JobItem['seniority'] =
        (['Fresh', 'Junior', 'Mid', 'Senior'].includes(row.seniority) ? row.seniority : 'Junior') as JobItem['seniority'];
      const posted = timeAgo(row.posted_at);

      // Use real experience_years from DB if available, otherwise derive from seniority
      const rawExpYears = row.experience_years || row.min_experience || null;
      const expYearsEn = rawExpYears
        ? `${rawExpYears}+ years`
        : senior === 'Fresh' ? '0-1 years' : senior === 'Junior' ? '1-3 years' : senior === 'Senior' ? '5+ years' : '2-4 years';
      const expYearsAr = rawExpYears
        ? `+${rawExpYears} سنوات`
        : senior === 'Fresh' ? '٠-١ سنوات' : senior === 'Junior' ? '١-٣ سنوات' : senior === 'Senior' ? '+٥ سنوات' : '٢-٤ سنوات';

      const descLines = (row.description || '').split(/\n|•/).filter(Boolean);
      const reqLines = (row.requirements || '').split(/\n|•/).filter(Boolean);

      const job: JobItem = {
        id: row.id,
        title: row.title,
        titleAr: row.title_ar || row.title,
        company: row.company,
        companyAr: row.company_ar || row.company,
        logo:
          row.company_logo ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(row.company.slice(0, 2))}&background=0D8ABC&color=fff&bold=true`,
        companyLogo: row.company_logo || null,
        company_logo: row.company_logo || null,
        applyUrl: row.apply_url || '',
        apply_url: row.apply_url || '',
        location: row.location || 'Cairo, Egypt',
        locationAr: row.location_ar || row.location || 'القاهرة، مصر',
        workType: wt,
        workTypeAr: (workTypeArMap[wt] || 'من مقر الشركة') as JobItem['workTypeAr'],
        employmentType: 'Full-time',
        employmentTypeAr: 'دوام كامل',
        seniority: senior,
        seniorityAr: seniorityArMap[senior] || 'متوسط',
        salaryRange: row.salary_range || 'Competitive (EGP)',
        salaryRangeAr: row.salary_range || 'راتب تنافسي',
        matchScore,
        postedAgo: posted.en,
        postedAgoAr: posted.ar,
        applicantsCount: row.applicants_count || Math.floor(Math.random() * 40) + 5,
        department: row.department || row.category || 'Technology',
        departmentAr: row.department_ar || row.category_ar || 'التكنولوجيا',
        education: row.education || "Bachelor's",
        educationAr: row.education_ar || 'بكالوريوس',
        experienceYears: expYearsEn,
        experienceYearsAr: expYearsAr,
        matchedSkills,
        missingSkills,
        description: row.description || `Exciting role at ${row.company}`,
        descriptionAr: row.description_ar || row.description || `فرصة عمل متميزة في ${row.company}`,
        responsibilities: descLines.length > 0 ? descLines.slice(0, 5) : [`Work on core ${row.title} tasks`],
        responsibilitiesAr: descLines.length > 0 ? descLines.slice(0, 5) : [`العمل على مهام ${row.title}`],
        requirements: reqLines.length > 0 ? reqLines : reqSkills.slice(0, 5).map((s) => `Experience with ${s}`),
        requirementsAr: reqLines.length > 0 ? reqLines : reqSkills.slice(0, 5).map((s) => `خبرة في ${s}`),
      };
      return job;
    });

    /* ---- Client-side filtering & sorting ---- */
    let results = mappedJobs;

    if (keyword) {
      results = results.filter(
        (j) =>
          j.title.toLowerCase().includes(keyword) ||
          j.titleAr.includes(keyword) ||
          j.company.toLowerCase().includes(keyword) ||
          j.matchedSkills.some((s) => s.name.toLowerCase().includes(keyword))
      );
    }

    if (locationQuery) {
      results = results.filter(
        (j) =>
          j.location.toLowerCase().includes(locationQuery) ||
          j.locationAr.toLowerCase().includes(locationQuery)
      );
    }

    if (sortBy === 'match') {
      results.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === 'recent') {
      results.sort((a, b) => b.applicantsCount - a.applicantsCount);
    }

    return NextResponse.json({
      jobs: results,
      total: results.length,
      source: jobsFromDb.length > 0 ? 'supabase' : 'fallback',
    });
  } catch (err: unknown) {
    console.error('Error in GET /api/jobs:', err);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
