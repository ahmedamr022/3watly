-- Live job-data foundation: source skills, disclosed salary metadata, and fast search.
-- Run through the Supabase migration workflow before deploying the updated scraper.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE public.jobs
  ALTER COLUMN company DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS salary_period TEXT,
  ADD COLUMN IF NOT EXISTS salary_disclosed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS salary_source TEXT,
  ADD COLUMN IF NOT EXISTS salary_confidence TEXT NOT NULL DEFAULT 'unknown',
  ADD COLUMN IF NOT EXISTS salary_estimate_min NUMERIC,
  ADD COLUMN IF NOT EXISTS salary_estimate_max NUMERIC,
  ADD COLUMN IF NOT EXISTS salary_estimate_sample_count INTEGER,
  ADD COLUMN IF NOT EXISTS salary_estimate_as_of TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_tech_role BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS scraped_at TIMESTAMPTZ;

ALTER TABLE public.jobs
  DROP CONSTRAINT IF EXISTS jobs_salary_confidence_check;
ALTER TABLE public.jobs
  ADD CONSTRAINT jobs_salary_confidence_check
  CHECK (salary_confidence IN ('high', 'medium', 'low', 'unknown'));

ALTER TABLE public.jobs
  DROP CONSTRAINT IF EXISTS jobs_salary_period_check;
ALTER TABLE public.jobs
  ADD CONSTRAINT jobs_salary_period_check
  CHECK (salary_period IS NULL OR salary_period IN ('monthly', 'annual', 'weekly', 'daily', 'hourly'));

CREATE TABLE IF NOT EXISTS public.job_skills (
  job_id TEXT NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  skill_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'job_tags',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (job_id, skill_key)
);

ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Job skills are publicly viewable" ON public.job_skills;
CREATE POLICY "Job skills are publicly viewable"
  ON public.job_skills FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_job_skills_skill_key ON public.job_skills (skill_key);
CREATE INDEX IF NOT EXISTS idx_job_skills_job_id ON public.job_skills (job_id);
CREATE INDEX IF NOT EXISTS idx_jobs_title_trgm ON public.jobs USING GIN (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_company_trgm ON public.jobs USING GIN (company gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_jobs_active_tech_posted ON public.jobs (is_tech_role, posted_at DESC);

-- Legacy rows are immediately searchable after this migration; the scraper will
-- subsequently replace these with canonical keys and exact source provenance.
INSERT INTO public.job_skills (job_id, skill_key, display_name, source)
SELECT
  j.id,
  lower(trim(skill.value #>> '{}')),
  trim(skill.value #>> '{}'),
  'legacy_backfill'
FROM public.jobs AS j
CROSS JOIN LATERAL jsonb_array_elements(COALESCE(j.required_skills, '[]'::jsonb)) AS skill(value)
WHERE trim(skill.value #>> '{}') <> ''
ON CONFLICT (job_id, skill_key) DO UPDATE
SET display_name = EXCLUDED.display_name,
    source = EXCLUDED.source;

-- Do not present a guessed company as factual data.
UPDATE public.jobs
SET company = NULL, company_ar = NULL
WHERE company IN ('شركة رائدة', 'Employer', 'Unknown Company');

-- Keep historical non-tech records out of the technical-market feed while
-- retaining them for auditability rather than destructively deleting them.
UPDATE public.jobs
SET is_tech_role = FALSE
WHERE lower(title) ~ '(hr( |&|/)|human resources|technical office|architecture technical|civil engineer|mechanical engineer|pharmacist|nurse|receptionist|warehouse|storekeeper)';

UPDATE public.jobs
SET salary_disclosed = salary_min IS NOT NULL OR salary_max IS NOT NULL,
    salary_source = CASE
      WHEN salary_min IS NOT NULL OR salary_max IS NOT NULL THEN COALESCE(salary_source, 'job_post')
      ELSE salary_source
    END,
    salary_confidence = CASE
      WHEN salary_min IS NOT NULL AND salary_max IS NOT NULL THEN 'high'
      WHEN salary_min IS NOT NULL OR salary_max IS NOT NULL THEN 'medium'
      ELSE salary_confidence
    END,
    salary_period = CASE
      WHEN salary_min IS NOT NULL OR salary_max IS NOT NULL THEN COALESCE(salary_period, 'monthly')
      ELSE salary_period
    END;
