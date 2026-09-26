# 3watly (عواطلي) — Complete Project Architecture & AI Context Guide

> **Purpose of this document:**  
> This file is the single source of truth for the **3watly** platform. Any AI model (Claude, ChatGPT, Gemini, etc.) or developer reading this document will immediately understand the entire architecture, data schemas, business logic, tech stack, API routes, scraping engine, and strict operational constraints.

---

## 1. Project Overview & Mission

- **Name:** 3watly (عواطلي)
- **Tagline:** Egypt's Tech Career Intelligence & Employment Platform (منصة ذكاء سوق العمل التقني في مصر)
- **Target Audience:** Egyptian software engineers, data analysts/scientists, DevOps engineers, IT support specialists, tech students, fresh graduates, and career switchers.
- **Problem Statement:**  
  Egyptian tech job seekers face opaque hiring requirements, lack of real data on what tech skills are truly in demand locally, uninformative ATS rejections, and a disconnect between academic learning and Egyptian market demands.
- **Solution:**  
  A modern data-driven career platform that scrapes and indexes authentic Egyptian IT job postings (Wuzzuf), aggregates market demand into real-time analytics, audits user CVs with AI against ATS criteria, identifies skill gaps with personalized learning paths, builds ATS-optimized CVs, and provides an AI Copilot specialized in the Egyptian tech landscape.

---

## 2. Core Philosophy & Strict Non-Negotiable Rules

When modifying or generating code for 3watly, the following rules **must never be violated**:

1. **Authentic Real Data Only:**  
   - NEVER generate fake boilerplate company names (e.g., "شركة رائدة" or "شركة برمجيات مرموقة").
   - Keep real company names scraped from Wuzzuf (e.g., Vodafone, Fawry, CIB, Shiny White Dental Center, etc.).
2. **Preserve Authentic English Job Descriptions:**  
   - Egyptian tech job postings are written in English by employers.
   - NEVER replace English job descriptions, responsibilities, or requirements with generic Arabic boilerplate templates.
   - Job titles can have Arabic translations (`title_ar`), but original technical English content must be preserved.
3. **Market Truth:**  
   - In the Egyptian IT database, **SQL is consistently the #1 required skill**, followed by **Python, Git, Agile, CI/CD, JavaScript, ERP, Java, Azure, and React**.
   - Do NOT hardcode or hallucinate Python or other languages as #1 unless backed by live database aggregation.
4. **Git Remote Constraint:**  
   - Git remote MUST ONLY be `https://github.com/ahmedamr022/3watly.git` (`origin main`). Never push to any other repository.
5. **No Broken Dynamic Icons:**  
   - The platform uses dynamic tech icons via `TechIcon.tsx` and `SkillIcon.tsx`.
   - Keys are normalized (`normalizeKey(name)` strips non-alphanumeric characters to lowercase). Icons must be mapped properly in the registry.

---

## 3. Technology Stack & Versions

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16.3.3 (App Router, React 19, Server Components & Server Actions) |
| **Language** | TypeScript 5+ (Strict Mode) |
| **Styling & UI** | Tailwind CSS v4 (native `@theme`), Lucide React, React Icons (`react-icons/si`, `react-icons/vsc`, `react-icons/fa6`) |
| **Animation & Charts** | Recharts (Responsive, RTL-aware), Framer Motion |
| **Database & Auth** | Supabase (PostgreSQL 15+, Row Level Security, SSR Auth via `@supabase/ssr`, Triggers) |
| **AI Integration** | Google Gemini API (`@google/genai`, Gemini 2.0 Flash / Pro) |
| **Scraping** | Cheerio + Node Fetch + Custom regex skill extraction engine |
| **PDF Processing** | `pdf-parse` for CV text extraction |
| **Package Manager** | `pnpm` |
| **Hosting & CI/CD** | Vercel (Edge/Serverless Node.js runtime) + GitHub Actions |

---

## 4. Directory & Codebase Structure

```
D:\Projects\3watly\
├── frontend\                        # Primary Next.js Application
│   ├── src\
│   │   ├── app\                     # Next.js App Router (Pages & APIs)
│   │   │   ├── (auth)\              # Login, Sign-up, Forgot Password
│   │   │   ├── admin\               # Admin Studio (Users, CVs, Resources, Logs)
│   │   │   ├── api\                 # Serverless API routes (19 routes)
│   │   │   │   ├── admin\           # Admin operations (stats, users, resources, audit)
│   │   │   │   ├── copilot\         # AI Copilot chat & message streaming
│   │   │   │   ├── cron\scrape\     # Automated scraping trigger
│   │   │   │   ├── cv\              # CV parsing, enhance, document store
│   │   │   │   ├── jobs\            # Jobs query & dynamic [id] route
│   │   │   │   ├── market\stats\    # Real-time skill frequencies & market analytics
│   │   │   │   ├── resources\       # Learning resources
│   │   │   │   └── user\            # User profile, avatar, account deletion
│   │   │   ├── ats-diagnostics\     # ATS CV scoring & feedback UI
│   │   │   ├── copilot\             # Gemini AI Career Copilot chat interface
│   │   │   ├── cv-builder\          # Live interactive CV Builder & PDF export
│   │   │   ├── dashboard\           # User overview dashboard
│   │   │   ├── jobs\                # Jobs explorer with filters & [id] detail page
│   │   │   ├── market\              # Market intelligence & live charts
│   │   │   ├── onboarding\          # Multi-step user onboarding flow
│   │   │   ├── profile\             # User profile page
│   │   │   ├── settings\            # Account settings & privacy controls
│   │   │   ├── skill-gap\           # Skill gap matrix & career track alignment
│   │   │   ├── terms\ & privacy\    # Legal pages (embedded in footer and modals)
│   │   │   ├── layout.tsx           # Global Root Layout
│   │   │   └── page.tsx             # Landing Page
│   │   ├── components\              # Reusable React components
│   │   │   ├── admin\               # Admin Studio tables, metrics, forms
│   │   │   ├── ats\                 # ScoreOverview, ParserCard, KeywordCard, etc.
│   │   │   ├── brand\               # CompanyLogo (with CDN fallback logic), Logo
│   │   │   ├── cv\                  # CVPreview, EditorPanel, SectionRow, etc.
│   │   │   ├── icons\               # TechIcon (registry of 100+ normalized tech icons)
│   │   │   ├── jobs\                # JobCard, JobFilters, ApplyModal
│   │   │   ├── landing\             # Hero, MarketInsights, DemandGauge, MarketSalaryChart
│   │   │   ├── layout\              # Navbar, Sidebar, Footer, AppShell
│   │   │   ├── market\              # TopSkillsCard, GrowthChart, CareerTracks
│   │   │   ├── providers\           # AppProviders (Auth, Theme, Toasts)
│   │   │   ├── skills\              # SkillIcon, SkillRow, PriorityList
│   │   │   └── ui\                  # Reusable UI primitives (Modal, Field, AutoTextarea)
│   │   ├── contexts\                # React Contexts
│   │   │   ├── AuthContext.tsx      # Supabase user session & profile state
│   │   │   ├── ChatContext.tsx      # Copilot chat state & streaming
│   │   │   ├── CVContext.tsx        # CV Builder document state
│   │   │   └── SkillPlanContext.tsx # User skill plan & target role tracking
│   │   ├── data\                    # Catalogs & fallback seed data
│   │   │   ├── cvData.ts            # CV Builder template defaults
│   │   │   ├── jobs.ts              # JobItem types & fallback jobs
│   │   │   ├── marketData.ts        # Career track presets & growth curves
│   │   │   └── skillCatalog.ts      # Skill hierarchy & learning resources
│   │   ├── lib\                     # Core utilities
│   │   │   ├── ai\                  # Gemini API client & prompt engineering
│   │   │   ├── scraper\             # Wuzzuf scraping engine & Cheerio parser
│   │   │   └── supabase\            # Client, Server, and Admin Supabase clients
│   │   └── middleware.ts            # Supabase SSR session refresh & route protection
│   ├── scripts\
│   │   └── run-scraper-v2.mjs       # Standalone scraping & enrichment CLI script
│   ├── supabase\migrations\         # Database migrations SQL
│   ├── next.config.ts               # Next.js build & security headers config
│   └── package.json                 # Dependencies & scripts
├── supabase_schema.sql              # Master database schema
├── supabase_schema_patch.sql        # RLS and security hardening patch
└── push_to_github.ps1               # Automated deployment/push script
```

---

## 5. Database Schema (Supabase / PostgreSQL)

### 1. `profiles`
User accounts extending Supabase `auth.users`.
- `id` (UUID, PK, FK to `auth.users.id` ON DELETE CASCADE)
- `email` (TEXT)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `target_role` (TEXT, e.g. `'Frontend Developer'`, `'Data Analyst'`)
- `experience_years` (INTEGER)
- `target_industry` (TEXT)
- `preferred_locations` (JSONB, e.g. `["Cairo", "Giza", "Remote"]`)
- `skills` (JSONB, array of strings)
- `career_alignment_score` (INTEGER)
- `onboarding_completed` (BOOLEAN)
- `role` (TEXT, `'owner' | 'admin' | 'user'`, default `'user'`)
- `account_status` (TEXT, `'active' | 'suspended'`, default `'active'`)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 2. `jobs`
Public Egyptian market jobs scraped from Wuzzuf.
- `id` (TEXT, PK, derived from Wuzzuf job ID or hash)
- `title` (TEXT, original job title in English)
- `title_ar` (TEXT, Arabic localized title)
- `company` (TEXT, authentic employer name)
- `company_ar` (TEXT, optional Arabic company name)
- `company_logo` (TEXT, URL pointing to `images.wuzzuf-data.net`)
- `location` (TEXT, e.g. `'Cairo, Egypt'`, `'Giza, Egypt'`, `'Nasr City, Cairo'`)
- `location_ar` (TEXT, Arabic location)
- `work_type` (TEXT, `'Full Time' | 'Part Time' | 'Work From Home' | 'Internship'`)
- `is_remote` (BOOLEAN)
- `seniority` (TEXT, `'Entry Level' | 'Mid' | 'Senior' | 'Lead' | 'Manager'`)
- `salary_range` (TEXT, e.g. `'15,000 - 25,000 EGP'`)
- `salary_min` / `salary_max` (NUMERIC)
- `salary_currency` (TEXT, default `'EGP'`)
- `required_skills` (JSONB, array of normalized tech strings: `["SQL", "Python", "Git", "Azure"]`)
- `description` (TEXT, full original job description)
- `requirements` (TEXT, job requirements and candidate criteria)
- `apply_url` (TEXT, UNIQUE, direct application URL on Wuzzuf/employer site)
- `source` (TEXT, default `'wuzzuf'`)
- `posted_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)

### 3. `cv_documents`
Parsed and saved user CVs.
- `id` (UUID, PK)
- `user_id` (UUID, FK to `auth.users.id` ON DELETE CASCADE, NOT NULL)
- `filename` (TEXT)
- `file_type` (TEXT, default `'application/pdf'`)
- `raw_text` (TEXT)
- `summary` (TEXT)
- `parsed_skills` (JSONB)
- `experiences` (JSONB)
- `education` (JSONB)
- `projects` (JSONB)
- `target_role` (TEXT)
- `ats_score` (NUMERIC, 0.0 to 100.0)
- `ats_feedback` (JSONB, categorized feedback: keywords, formatting, structure, impact)
- `created_at` / `updated_at` (TIMESTAMPTZ)

### 4. `copilot_messages`
Chat conversation history with Gemini Copilot.
- `id` (UUID, PK)
- `user_id` (UUID, FK to `auth.users.id` ON DELETE CASCADE, NOT NULL)
- `role` (TEXT, `'user' | 'assistant' | 'system'`)
- `content` (TEXT)
- `feedback` (TEXT, `'up' | 'down' | null`)
- `created_at` (TIMESTAMPTZ)

### 5. `resources`
Curated learning materials linked to skills.
- `id` (UUID, PK)
- `skill_key` (TEXT, e.g. `'sql'`, `'python'`, `'react'`)
- `title` / `title_ar` (TEXT)
- `provider` (TEXT, e.g. `'YouTube'`, `'Coursera'`, `'freeCodeCamp'`)
- `provider_icon` (TEXT)
- `kind` (TEXT, `'video' | 'article' | 'course' | 'repo' | 'practice' | 'book' | 'other'`)
- `url` (TEXT)
- `duration_hours` (NUMERIC)
- `is_free` (BOOLEAN)
- `language` (TEXT, `'en' | 'ar' | 'both'`)
- `is_active` (BOOLEAN)
- `display_order` (INTEGER)

### 6. `audit_logs`
Administrative action audit trail.
- `id` (UUID, PK)
- `actor_id` (UUID, FK to `auth.users.id`)
- `actor_email` (TEXT)
- `action` (TEXT, e.g. `'user.suspend'`, `'resource.create'`)
- `target_type` / `target_id` (TEXT)
- `metadata` (JSONB)
- `created_at` (TIMESTAMPTZ)

---

## 6. Key Features & Business Logic

### A. Market Intelligence (`/market` & `/api/market/stats`)
- Aggregates `required_skills` across active jobs in Supabase.
- **Filters out non-technical noise** using `NON_TECH_SKILLS` set (excludes terms like "Management", "Troubleshooting", "IT/Software Development", "Microsoft Office").
- Computes percentage appearance: `(skillCount / totalJobs) * 100`.
- Categorizes skills into Frontend/UI, Backend, Infrastructure, Data & AI, and Practices.
- Recharts visualizations adapt to Arabic RTL layout (`YAxis orientation="right"`).

### B. Scraping & Skill Extraction Engine (`wuzzuf.ts` & `run-scraper-v2.mjs`)
- Scrapes IT/Software queries on Wuzzuf Egypt: `https://wuzzuf.net/a/IT-Software-Development-Jobs-in-Egypt`.
- **Company Logo CDN Rule:** Wuzzuf migrated from `media.wuzzuf.net` to `images.wuzzuf-data.net`. URLs are sanitized at ingest and runtime.
- **Skill Extraction:** Uses `KNOWN_TECH_SKILLS` and `SKILL_ALIASES` dictionaries. Matches IT Support, Networking, Cloud, ERP, DevOps, Data, and Web development keywords.

### C. ATS Diagnostics (`/ats-diagnostics` & `/api/cv/parse`)
- Uploads PDF CV -> extracts text via `pdf-parse`.
- Gemini AI prompts analyze the CV against ATS parsing rules:
  - Header & contact information extraction
  - Section categorization (Experience, Education, Skills, Projects)
  - Keyword density & presence of industry-standard terms
  - Action-verb and quantifiable result analysis
  - Yields numerical ATS score (0-100) and actionable remediation steps.

### D. AI CV Builder (`/cv-builder`)
- Interactive WYSIWYG builder supporting multiple sections.
- **AIEnhanceButton (`/api/cv/enhance`):** Takes a single bullet point or summary and asks Gemini to rewrite it using the Google X-Y-Z formula ("Accomplished [X] as measured by [Y], by doing [Z]").
- Real-time print-ready CSS layout for clean A4 PDF export.

### E. Skill Gap Analyzer (`/skill-gap`)
- Users select their target career track (e.g. Full Stack Developer, DevOps Engineer, Data Engineer).
- Compares user's known skills against market requirements for that role.
- Breaks gaps down into:
  - **Critical (Must Learn):** High market demand in Egypt.
  - **Recommended:** Competitive advantage.
  - **Future:** Emerging tech (GenAI, LLMs, Kubernetes).
- Directly attaches curated resources from the `resources` table.

### F. Gemini AI Copilot (`/copilot` & `/api/copilot/chat`)
- Chat interface equipped with system context regarding the Egyptian tech market.
- Knows user's target role, current skills, and active market stats.
- Supports thumbs up/down feedback saved to `copilot_messages`.

---

## 7. Complete API Route Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/jobs` | Search & filter jobs (pagination, seniority, remote, skills) | Public |
| `GET` | `/api/jobs/[id]` | Get specific job details | Public |
| `GET` | `/api/market/stats` | Aggregated skill frequency, salary estimates, top companies | Public |
| `POST` | `/api/cv/parse` | Parse uploaded PDF CV and compute initial ATS diagnostics | Optional |
| `POST` | `/api/cv/enhance` | AI rewrite of bullet points using Gemini | User |
| `GET/POST` | `/api/cv/document` | Load or save active CV Builder document | User |
| `POST` | `/api/copilot/chat` | Send message to AI Copilot (Gemini) | User |
| `GET/POST` | `/api/copilot/messages`| Retrieve history or post message feedback | User |
| `GET` | `/api/resources` | Fetch active learning resources by skill key | Public |
| `POST` | `/api/user/avatar` | Upload and update profile avatar | User |
| `POST` | `/api/user/delete` | Hard delete user profile, CVs, and messages | User |
| `GET` | `/api/cron/scrape` | Trigger Wuzzuf scraping job (Cron secret protected) | Cron Secret / Admin |
| `GET` | `/api/admin/stats` | Platform summary counts (users, CVs, jobs, resources) | Admin / Owner |
| `GET/PATCH` | `/api/admin/users` | List users, update roles or suspend accounts | Admin / Owner |
| `GET` | `/api/admin/cvs` | Inspect uploaded user CVs and ATS scores | Admin / Owner |
| `GET/POST/PUT/DELETE` | `/api/admin/resources` | Manage learning resources catalog | Admin / Owner |
| `POST` | `/api/admin/resources/seed` | Seed default curated learning resources | Owner |
| `GET` | `/api/admin/audit-logs` | Retrieve admin action logs | Admin / Owner |
| `GET/PATCH` | `/api/admin/settings` | Platform-wide feature toggles | Owner |

---

## 8. Environment Variables Specification

Ensure these variables are set in `.env.local` for development and in the **Vercel Project Settings** for production:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Base URL for API calls
NEXT_PUBLIC_API_BASE=https://3watly.vercel.app

# Google Gemini API Key
GEMINI_API_KEY=AIzaSy...

# Optional: Scraper Cron Secret (to secure /api/cron/scrape)
CRON_SECRET=your_random_secret_here
```

---

## 9. Common Troubleshooting & AI Guidance

- **If dynamic icons show fallback `Code2` blue icon:**  
  Check `src/components/icons/TechIcon.tsx`. The name passed into `<TechIcon name="..." />` is passed through `normalizeKey(name)`. Add the normalized key to the `iconRegistry` map.
- **If job logos fail to load:**  
  Ensure `src/components/brand/CompanyLogo.tsx` is used. It automatically substitutes legacy `media.wuzzuf.net` URLs with `images.wuzzuf-data.net`.
- **If build fails on TypeScript:**  
  Run `pnpm exec tsc --noEmit` locally. Verify `JobItem` optional properties in `src/data/jobs.ts` (`required_skills?: string[]`).
- **If deploying to Vercel:**  
  Ensure all 5 required environment variables are set in the Vercel dashboard before triggering the deployment.
