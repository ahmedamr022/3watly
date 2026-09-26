import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { careerTracks } from '@/data/market';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

let memoryCache: { key: string; data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 30 * 1000; // 30s cache

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const track = searchParams.get('track') || searchParams.get('industry') || 'all';
    const workModel = searchParams.get('workModel') || searchParams.get('region') || 'all';
    const experience = searchParams.get('experience') || searchParams.get('timeframe') || 'all';
    const role = searchParams.get('role') || '';
    const cacheKey = `${track}-${workModel}-${experience}-${role}`;

    if (memoryCache && memoryCache.key === cacheKey && (Date.now() - memoryCache.timestamp) < CACHE_TTL_MS) {
      return NextResponse.json(memoryCache.data, {
        headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
      });
    }

    const TRACK_KEYWORDS: Record<string, { titles: string[]; skills: string[] }> = {
      'frontend': {
        titles: ['frontend', 'front end', 'react', 'web developer', 'ui developer', 'next.js', 'angular', 'vue'],
        skills: ['react', 'typescript', 'javascript', 'next.js', 'tailwind css', 'redux', 'html', 'css', 'figma']
      },
      'backend': {
        titles: ['backend', 'back end', 'node', 'java', 'api', 'fastapi', 'django', 'python', 'go', 'spring boot'],
        skills: ['node.js', 'postgresql', 'python', 'docker', 'redis', 'java', 'mongodb', 'rest apis', 'go', 'kafka']
      },
      'data-ai': {
        titles: ['data', 'analytics', 'machine learning', 'ai', 'bi', 'etl', 'scientist', 'big data'],
        skills: ['python', 'sql', 'power bi', 'pandas', 'tableau', 'spark', 'dbt', 'machine learning', 'generative ai', 'snowflake']
      },
      'devops': {
        titles: ['devops', 'cloud', 'sre', 'reliability', 'infrastructure', 'platform', 'kubernetes', 'system engineer'],
        skills: ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux', 'terraform', 'azure', 'git', 'grafana', 'ansible']
      },
      'mobile': {
        titles: ['mobile', 'flutter', 'android', 'ios', 'react native', 'dart', 'swift', 'kotlin'],
        skills: ['flutter', 'dart', 'react native', 'firebase', 'kotlin', 'swift', 'rest apis', 'sqlite']
      },
      'qa': {
        titles: ['qa', 'tester', 'testing', 'quality', 'automation', 'sdet'],
        skills: ['selenium', 'cypress', 'postman', 'playwright', 'jira', 'automation testing', 'jmeter']
      },
      'cybersecurity': {
        titles: ['security', 'cyber', 'soc', 'penetration', 'infosec', 'firewall', 'threat'],
        skills: ['network security', 'siem', 'penetration testing', 'linux', 'splunk', 'cloud security', 'wireshark']
      },
      'all': {
        titles: ['developer', 'engineer', 'analyst', 'data', 'cloud', 'software', 'tech'],
        skills: ['sql', 'python', 'javascript', 'react', 'typescript', 'docker', 'git', 'aws', 'node.js']
      }
    };

    const activeTrackConfig = TRACK_KEYWORDS[track] || TRACK_KEYWORDS['all'];
    const activeCareerTrack = careerTracks.find((t) => t.id === track) || careerTracks[0];

    const supabase = await createClient();
    let jobs: any[] = [];
    if (supabase) {
      try {
        let query = supabase
          .from('jobs')
          // Select all columns to remain compatible while the additive migration
          // is being rolled out. The response still exposes only derived values.
          .select('*');

        // Filter by location or workModel
        if (workModel === 'remote') {
          query = query.or('is_remote.eq.true,work_type.ilike.%remote%');
        } else if (workModel === 'hybrid') {
          query = query.ilike('work_type', '%hybrid%');
        } else if (workModel === 'cairo-giza') {
          query = query.or('location.ilike.%cairo%,location.ilike.%giza%');
        } else if (workModel === 'alex-regions') {
          query = query.ilike('location', '%alex%');
        } else if (workModel === 'cairo') {
          query = query.ilike('location', '%cairo%');
        } else if (workModel === 'giza') {
          query = query.ilike('location', '%giza%');
        } else if (workModel === 'alex') {
          query = query.ilike('location', '%alex%');
        }

        const { data, error } = await query.limit(1000);
        if (!error && Array.isArray(data)) {
          // The migration flags known bad rows with false. Older imported rows
          // have no flag yet and must remain visible rather than becoming an
          // arbitrary partial total such as 80 out of the real catalogue.
          jobs = data.filter((job) => job.is_tech_role !== false);
        }
      } catch (e) {
        console.warn('Market stats Supabase query fallback:', e);
      }
    }

    // Role specific keywords mapping for higher precision
    const ROLE_KEYWORDS: Record<string, { titles: string[]; skills: string[] }> = {
      'data-engineer': {
        titles: ['data engineer', 'etl', 'big data', 'data pipeline', 'pipeline engineer', 'dbt'],
        skills: ['python', 'sql', 'spark', 'airflow', 'etl', 'docker', 'kafka']
      },
      'senior-data-analyst': {
        titles: ['data analyst', 'analyst', 'power bi', 'business intelligence', 'bi analyst', 'analytics'],
        skills: ['sql', 'power bi', 'excel', 'tableau', 'python', 'statistics']
      },
      'bi-developer': {
        titles: ['bi developer', 'business intelligence', 'power bi', 'tableau', 'dax developer', 'bi'],
        skills: ['power bi', 'dax', 'sql', 'tableau', 'data modeling']
      },
      'analytics-engineer': {
        titles: ['analytics engineer', 'dbt developer', 'data modeler', 'snowflake', 'warehouse'],
        skills: ['sql', 'dbt', 'python', 'snowflake', 'data modeling']
      },
      'frontend-developer': {
        titles: ['frontend', 'react', 'front end', 'ui developer', 'web developer', 'next.js'],
        skills: ['react', 'typescript', 'javascript', 'tailwind css', 'next.js']
      },
      'backend-developer': {
        titles: ['backend', 'back end', 'node', 'django', 'api engineer', 'microservices', 'fastapi'],
        skills: ['node.js', 'postgresql', 'python', 'docker', 'redis', 'apis']
      },
      'flutter-developer': {
        titles: ['flutter', 'mobile developer', 'dart', 'android', 'ios'],
        skills: ['flutter', 'dart', 'firebase', 'mobile app']
      },
      'ai-ml-engineer': {
        titles: ['machine learning', 'ai engineer', 'deep learning', 'ml engineer', 'data scientist', 'genai'],
        skills: ['python', 'pytorch', 'machine learning', 'fastapi', 'llm']
      },
      'fullstack-developer': {
        titles: ['full stack', 'fullstack', 'software engineer', 'web developer'],
        skills: ['react', 'node.js', 'typescript', 'sql', 'docker']
      }
    };

    // Filter jobs by Track or Role
    let trackJobs = jobs;
    if (role && ROLE_KEYWORDS[role]) {
      const roleConfig = ROLE_KEYWORDS[role];
      const roleFiltered = jobs.filter((j) => {
        const titleLo = (j.title || '').toLowerCase();
        const skillsLo: string[] = (Array.isArray(j.required_skills) ? j.required_skills : []).map((s: unknown) => String(s).toLowerCase());
        const titleMatch = roleConfig.titles.some((kw) => titleLo.includes(kw));
        const skillMatch = roleConfig.skills.some((kw) => skillsLo.some((s) => s.includes(kw)));
        return titleMatch || skillMatch;
      });
      trackJobs = roleFiltered;
    } else if (track !== 'all') {
      const filtered = jobs.filter((j) => {
        const titleLo = (j.title || '').toLowerCase();
        const skillsLo: string[] = (Array.isArray(j.required_skills) ? j.required_skills : []).map((s: unknown) => String(s).toLowerCase());
        const titleMatch = activeTrackConfig.titles.some((kw) => titleLo.includes(kw));
        const skillMatch = activeTrackConfig.skills.some((kw) => skillsLo.some((s) => s.includes(kw)));
        return titleMatch || skillMatch;
      });
      trackJobs = filtered;
    }

    if (experience !== 'all') {
      const desired = experience === 'fresh' ? ['Fresh']
        : experience === 'junior' ? ['Fresh', 'Junior']
        : experience === 'mid' ? ['Mid']
        : experience === 'senior' ? ['Senior']
        : [];
      if (desired.length) trackJobs = trackJobs.filter((job) => desired.includes(job.seniority));
    }

    const totalJobs = trackJobs.length;
    const companiesSet = new Set(trackJobs.map((j) => j.company).filter(Boolean));
    const totalCompanies = companiesSet.size;

    const remoteCount = trackJobs.filter((j) => j.is_remote || (j.work_type && j.work_type.toLowerCase().includes('remote')) || (j.work_type && j.work_type.toLowerCase().includes('hybrid'))).length;
    const remotePercentage = trackJobs.length > 0 ? Math.round((remoteCount / trackJobs.length) * 100) : 0;

    // Filter out non-technical job classifications, HR, and generic soft skills
    const NON_TECH_SKILLS = new Set([
      'management',
      'troubleshooting',
      'it/software development',
      'project management',
      'microsoft office',
      'project/program management',
      'engineering - telecom/technology',
      'quality',
      'sales',
      'marketing',
      'accounting',
      'human resources (hr)',
      'communication skills',
      'problem solving',
      'customer service/support',
      'operations',
      'administration',
      'information technology (it)',
      'installation',
      'maintenance',
      'english',
      'time management',
      'teamwork',
      'analytical skills',
      'presentation skills',
      'negotiation',
      'leadership',
      'finance',
      'civil engineering'
    ]);

    // Aggregate skills from real jobs matching track
    const skillFrequency: Record<string, number> = {};
    trackJobs.forEach((j) => {
      const skills: string[] = Array.isArray(j.required_skills)
        ? j.required_skills
        : typeof j.required_skills === 'string'
        ? (() => { try { return JSON.parse(j.required_skills || '[]'); } catch { return []; } })()
        : [];

      skills.forEach((s) => {
        if (!s || typeof s !== 'string') return;
        const trimmed = s.trim();
        if (trimmed.length < 2 || trimmed.length > 35) return;
        if (NON_TECH_SKILLS.has(trimmed.toLowerCase())) return;
        skillFrequency[trimmed] = (skillFrequency[trimmed] || 0) + 1;
      });
    });

    const categoryForSkill = (name: string) => {
      const key = name.toLowerCase();
      if (/sql|mongo|redis|oracle|database|dbt|snowflake|bigquery/.test(key)) return { en: 'Database', ar: 'قواعد بيانات' };
      if (/python|java|script|typescript|javascript|php|c#|\.net|go\b|swift|kotlin|dart/.test(key)) return { en: 'Language', ar: 'لغة برمجة' };
      if (/aws|azure|docker|kubernetes|cloud|terraform|linux|ansible|kafka/.test(key)) return { en: 'Cloud & DevOps', ar: 'سحابة وعمليات' };
      if (/react|vue|angular|next|tailwind|figma|ui|ux/.test(key)) return { en: 'Frontend & UI', ar: 'واجهات أمامية' };
      if (/help|desk|support|network|sysadmin|security|firewall/.test(key)) return { en: 'Infrastructure', ar: 'بنية تحتية ودعم' };
      if (/ai|llm|genai|gpt|machine learning/.test(key)) return { en: 'AI & Data', ar: 'ذكاء اصطناعي' };
      return { en: 'Technology', ar: 'تقنية' };
    };

    const allKnownSkills = careerTracks.flatMap((t) => t.skills);

    const dynamicTopSkills = Object.entries(skillFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, count], index) => {
        const category = categoryForSkill(name);
        const known = activeCareerTrack.skills.find((s) => s.name.toLowerCase() === name.toLowerCase())
          || allKnownSkills.find((s) => s.name.toLowerCase() === name.toLowerCase());

        const percentage = totalJobs > 0 ? Math.round((count / totalJobs) * 100) : 0;
        const trend = known?.trend || `+${Math.max(10, 32 - index * 3)}%`;
        const isHot = known?.isHot ?? (index < 3 && percentage >= 35);
        const icon = known?.icon || `https://cdn.simpleicons.org/${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

        return {
          name,
          value: percentage,
          jobCount: count,
          icon,
          category: known?.category || category.en,
          categoryLabel: known?.categoryLabel || category.en,
          categoryLabelAr: known?.categoryLabelAr || category.ar,
          trend,
          isHot,
        };
      });

    const salarySamples = trackJobs
      .filter((job) => {
        const disclosed = typeof job.salary_disclosed === 'boolean'
          ? job.salary_disclosed
          : Boolean(job.salary_min || job.salary_max || job.salary_range);
        return disclosed && (job.salary_currency || 'EGP') === 'EGP' && (job.salary_period || 'monthly') === 'monthly';
      })
      .map((job) => {
        const min = Number(job.salary_min || 0);
        const max = Number(job.salary_max || 0);
        return min && max ? (min + max) / 2 : min || max;
      })
      .filter((salary) => salary >= 3000 && salary <= 300000)
      .sort((a, b) => a - b);
    const percentile = (values: number[], fraction: number) => {
      if (values.length === 0) return null;
      const index = (values.length - 1) * fraction;
      const lower = Math.floor(index);
      const upper = Math.ceil(index);
      return values[lower] + (values[upper] - values[lower]) * (index - lower);
    };
    const salarySampleCount = salarySamples.length;
    const salaryEstimate = salarySampleCount >= 5
      ? {
          min: Math.round(percentile(salarySamples, 0.25) || 0),
          median: Math.round(percentile(salarySamples, 0.5) || 0),
          max: Math.round(percentile(salarySamples, 0.75) || 0),
          sampleCount: salarySampleCount,
          confidence: salarySampleCount >= 20 ? 'high' : salarySampleCount >= 10 ? 'medium' : 'low',
        }
      : null;

    const updatedAt = trackJobs.reduce<string | null>((latest, job) => {
      const candidate = job.scraped_at || job.posted_at;
      return candidate && (!latest || new Date(candidate) > new Date(latest)) ? candidate : latest;
    }, null);
    const companyFrequency = trackJobs.reduce<Record<string, number>>((counts, job) => {
      const company = String(job.company || '').trim();
      if (company && !/confidential/i.test(company)) counts[company] = (counts[company] || 0) + 1;
      return counts;
    }, {});
    const topCompanies = Object.entries(companyFrequency)
      .sort(([, left], [, right]) => right - left)
      .slice(0, 5)
      .map(([name, jobCount]) => ({ name, jobCount }));

    const result = {
      stats: {
        totalJobs,
        totalCompanies,
        remoteJobsPercentage: workModel === 'remote' ? 100 : remotePercentage,
        topSkillName: dynamicTopSkills[0]?.name || null,
        topSkillPercentage: dynamicTopSkills[0]?.value || 0,
        trackLabel: activeCareerTrack.label,
        trackLabelAr: activeCareerTrack.labelAr,
      },
      topSkills: dynamicTopSkills,
      trendingHighlights: activeCareerTrack.trendingHighlights,
      insights: activeCareerTrack.insights,
      salaryEstimate,
      topCompanies,
      updatedAt,
      source: 'wuzzuf_job_posts',
      filters: { track, workModel, experience, role },
    };

    memoryCache = { key: cacheKey, data: result, timestamp: Date.now() };

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' }
    });
  } catch (err: unknown) {
    console.error('Error in /api/market/stats:', err);
    return NextResponse.json({ error: 'Failed to generate market stats' }, { status: 500 });
  }
}
