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

/* ---------- GET handler ---------- */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword')?.trim().toLowerCase() || '';
    const locationQuery = searchParams.get('location')?.trim().toLowerCase() || '';
    const seniority = searchParams.get('seniority') || 'all';
    const workType = searchParams.get('workType') || 'all';
    const sortBy = searchParams.get('sortBy') || 'match';
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

        if (seniority !== 'all') {
          query = query.ilike('seniority', `%${seniority}%`);
        }
        if (workType === 'remote') {
          query = query.eq('is_remote', true);
        } else if (workType === 'hybrid') {
          query = query.ilike('work_type', '%hybrid%');
        } else if (workType === 'onsite') {
          query = query.ilike('work_type', '%full%');
        }

        const { data, error } = await query.order('posted_at', { ascending: false }).limit(60);
        if (!error && Array.isArray(data) && data.length > 0) {
          jobsFromDb = data;
        }
      } catch (e) {
        console.warn('Supabase jobs query fallback:', e);
      }
    }

    /* ---- Transform DB rows → full JobItem[] ---- */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mappedJobs: JobItem[] = jobsFromDb.map((row: any) => {
      const reqSkills = parseSkillsArray(row.required_skills);

      const matchedSkills = reqSkills
        .filter((s) => userSkills.some((us) => us === s.toLowerCase()))
        .map((s) => ({ name: s, weight: 0.8 }));

      const missingSkills = reqSkills
        .filter((s) => !userSkills.some((us) => us === s.toLowerCase()))
        .map((s) => ({
          name: s,
          weight: 0.6,
          marketNote: `Adding ${s} boosts your match`,
          marketNoteAr: `إضافة ${s} ترفع نسبة التوافق`,
        }));

      const matchedCount = matchedSkills.length;
      const matchScore =
        reqSkills.length > 0
          ? Math.min(98, Math.max(62, Math.round((matchedCount / reqSkills.length) * 100)))
          : 85;

      const wt = normalizeWorkType(row.work_type, !!row.is_remote);
      const senior: JobItem['seniority'] =
        (['Fresh', 'Junior', 'Mid', 'Senior'].includes(row.seniority) ? row.seniority : 'Mid') as JobItem['seniority'];
      const posted = timeAgo(row.posted_at);

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
        applicantsCount: Math.floor(Math.random() * 25) + 8,
        department: 'Engineering',
        departmentAr: 'الهندسة',
        education: "Bachelor's",
        educationAr: 'بكالوريوس',
        experienceYears: senior === 'Fresh' ? '0-1' : senior === 'Junior' ? '1-3' : senior === 'Senior' ? '5+' : '2-4',
        experienceYearsAr: senior === 'Fresh' ? '٠-١' : senior === 'Junior' ? '١-٣' : senior === 'Senior' ? '+٥' : '٢-٤',
        matchedSkills,
        missingSkills,
        description: row.description || `Exciting role at ${row.company}`,
        descriptionAr: row.description || `فرصة عمل متميزة في ${row.company}`,
        responsibilities: descLines.length > 0 ? descLines.slice(0, 5) : [`Work on core ${row.title} tasks`],
        responsibilitiesAr: descLines.length > 0 ? descLines.slice(0, 5) : [`العمل على مهام ${row.title}`],
        requirements: reqLines.length > 0 ? reqLines : reqSkills.map((s) => `Experience with ${s}`),
        requirementsAr: reqLines.length > 0 ? reqLines : reqSkills.map((s) => `خبرة في ${s}`),
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
