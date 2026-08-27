"""
MAJRA FastAPI Application Entrypoint & Production API
Egyptian Career & Labor Market Intelligence Platform
Includes JWT Auth, CV Parsing & ATS Engine, Live Market Analytics, and Automated Scheduler.
"""

import sys
import asyncio
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

# Ensure backend root is in sys.path
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.config import settings
from app.core.database import init_db, SessionLocal
from app.services.db_seeder import seed_database_if_empty
from app.scraper.pipeline import recurring_scraper_task
from app.api.auth import router as auth_router
from app.api.cv import router as cv_router
from app.api.jobs import router as jobs_router
from app.api.admin import router as admin_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("MAJRA_Main")

background_scheduler_task = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI Lifespan Context:
    1. Initializes Database Tables (SQLite / PostgreSQL)
    2. Runs Automatic Data Seeder for Skills & Jobs
    3. Launches the 2-Hour Background Scraping Scheduler
    """
    global background_scheduler_task
    logger.info("🚀 Initializing MAJRA Application Lifespan...")

    # 1. Init Database Tables
    init_db()
    logger.info("✅ Database tables verified and initialized.")

    # 2. Seed Skills and Jobs from JSON
    db = SessionLocal()
    try:
        seed_res = seed_database_if_empty(db)
        logger.info(f"🌱 DB Seeder completed: {seed_res}")
    finally:
        db.close()

    # 3. Start Background Scheduler (every 2 hours)
    if settings.SCRAPER_AUTO_START:
        background_scheduler_task = asyncio.create_task(
            recurring_scraper_task(interval_hours=settings.SCRAPER_INTERVAL_HOURS)
        )
        logger.info(f"⏰ Automated Scraper Scheduler started in background (every {settings.SCRAPER_INTERVAL_HOURS}h).")

    yield

    # Shutdown
    if background_scheduler_task:
        background_scheduler_task.cancel()
        logger.info("🛑 Background scheduler stopped.")


app = FastAPI(
    title="MAJRA Career Intelligence API",
    description="""
    **MAJRA (مجرى)** — Egyptian Career & Labor Market Intelligence Platform API.
    
    Features:
    * 🔐 **JWT Authentication & Profile Management**
    * 📄 **Real CV Upload (PDF/DOCX) & ATS Diagnostic Score**
    * 💼 **Live Egyptian Job Postings with Weighted Skill Matching**
    * 📊 **Market Insights, Trending Skills & Salary Intelligence**
    * ⏰ **Automated Background Data Pipeline & Scheduler**
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router)
app.include_router(cv_router)
app.include_router(jobs_router)
app.include_router(admin_router)

# Serve uploaded files (avatars, etc.) as static content
UPLOADS_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")


# ----------------------------------------------------
# Visual Playground UI (Interactive Browser Dashboard)
# ----------------------------------------------------
@app.get("/", response_class=HTMLResponse)
def interactive_dashboard():
    """Serves the interactive live testing playground directly in the browser."""
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MAJRA — Live Testing Playground</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #F8FAFC; }
  </style>
</head>
<body class="text-slate-800 antialiased min-h-screen flex flex-col">

  <!-- Top Navbar -->
  <header class="bg-[#0F172A] text-white border-b border-slate-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg tracking-wider shadow">M</div>
        <div>
          <span class="text-xl font-bold tracking-tight">MAJRA</span>
          <span class="text-xs text-blue-400 block font-medium">Egyptian Career Intelligence API</span>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
          ● Phase 0 Online (100%)
        </span>
        <a href="/docs" target="_blank" class="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-1.5 rounded-md transition shadow">Interactive Swagger API Docs ↗</a>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
    
    <!-- Hero Banner -->
    <div class="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-6 md:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <span class="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full border border-blue-500/30">Phase 0 Core Backend Ready</span>
        <h1 class="text-2xl md:text-3xl font-extrabold mt-3 tracking-tight">MAJRA Career & Market Intelligence</h1>
        <p class="text-slate-300 text-sm mt-1 max-w-2xl">
          Complete backend layer featuring Database ORM, JWT Auth, Multi-Format CV Parser (PDF/DOCX), ATS Diagnostic Scoring, and Automated 2-Hour Scraping Scheduler.
        </p>
      </div>
      <div class="flex gap-3">
        <a href="/docs" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow transition">Open Swagger UI</a>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="stats-grid">
      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-slate-500 uppercase">Catalog Tech Jobs</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-1" id="stat-total-jobs">--</h3>
        </div>
        <div class="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">💼</div>
      </div>
      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-slate-500 uppercase">Remote Ratio</p>
          <h3 class="text-2xl font-bold text-emerald-600 mt-1" id="stat-remote-ratio">--</h3>
        </div>
        <div class="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">🌐</div>
      </div>
      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-slate-500 uppercase">Skill Ontology</p>
          <h3 class="text-2xl font-bold text-purple-600 mt-1" id="stat-skills">200+ Skills</h3>
        </div>
        <div class="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">🧠</div>
      </div>
      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-slate-500 uppercase">Scheduler</p>
          <h3 class="text-2xl font-bold text-blue-600 mt-1">Every 2 Hours</h3>
        </div>
        <div class="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">⏰</div>
      </div>
    </div>

    <!-- Interactive Sections Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Live Candidate Matching Simulator -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 class="text-lg font-bold text-slate-900">🎯 Candidate Matching Engine</h2>
            <p class="text-xs text-slate-500">Test how the weighted algorithm calculates market-fit and skill gaps</p>
          </div>
          <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">Live API</span>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Candidate Skills (Comma Separated)</label>
            <input type="text" id="match-skills" value="SQL, Python, Power BI, Excel" class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Experience (Years)</label>
              <input type="number" id="match-exp" value="1" min="0" max="20" class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Target Role</label>
              <input type="text" id="match-role" value="Data Analyst" class="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
          </div>

          <button onclick="runCandidateMatch()" id="btn-match" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-sm">
            Calculate Matching Jobs ⚡
          </button>
        </div>

        <div id="match-results" class="hidden space-y-3 pt-3 border-t border-slate-100">
          <div class="bg-blue-50/70 p-3 rounded-lg flex items-center justify-between border border-blue-100">
            <span class="text-xs font-semibold text-blue-900">Career Alignment Score:</span>
            <span class="text-lg font-extrabold text-blue-700" id="match-overall-score">--</span>
          </div>
          <div class="max-h-60 overflow-y-auto space-y-2 pr-1" id="matched-jobs-list"></div>
        </div>
      </div>

      <!-- Live CV Parser & ATS Checker -->
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 class="text-lg font-bold text-slate-900">📄 Real CV Upload & ATS Parser</h2>
            <p class="text-xs text-slate-500">Upload any PDF/DOCX CV or paste text to inspect ATS score</p>
          </div>
          <span class="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-md">Real NLP</span>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Upload CV Document (.pdf, .docx, .txt)</label>
            <input type="file" id="cv-file-input" accept=".pdf,.docx,.txt" class="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-slate-300 rounded-lg p-1" />
          </div>

          <button onclick="uploadCVFile()" id="btn-upload-cv" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-sm">
            Upload & Analyze CV with ATS Engine 🚀
          </button>
        </div>

        <div id="cv-results" class="hidden space-y-3 pt-3 border-t border-slate-100">
          <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-800">ATS Score:</span>
              <span class="text-xl font-extrabold text-emerald-600" id="cv-ats-score">--/100</span>
            </div>
            <div class="text-xs text-slate-600" id="cv-sections-detected"></div>
            <div class="text-xs text-slate-600" id="cv-skills-extracted"></div>
          </div>
        </div>
      </div>

    </div>

  </main>

  <script>
    // Fetch stats on load
    async function loadStats() {
      try {
        const res = await fetch('/api/market/stats');
        if (res.ok) {
          const data = await res.json();
          document.getElementById('stat-total-jobs').innerText = data.total_active_jobs_analyzed || '44';
          document.getElementById('stat-remote-ratio').innerText = data.remote_ratio || '47.7%';
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadStats();

    // Match candidate
    async function runCandidateMatch() {
      const skillsStr = document.getElementById('match-skills').value;
      const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      const exp = parseInt(document.getElementById('match-exp').value) || 1;
      const role = document.getElementById('match-role').value;

      const btn = document.getElementById('btn-match');
      btn.innerText = 'Calculating...';

      try {
        const res = await fetch('/api/matching/match-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ candidate_skills: skills, experience_years: exp, target_role: role })
        });
        const data = await res.json();
        
        document.getElementById('match-overall-score').innerText = data.overall_career_alignment;
        const list = document.getElementById('matched-jobs-list');
        list.innerHTML = '';

        data.top_recommended_jobs.forEach(j => {
          const item = document.createElement('div');
          item.className = 'p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1';
          item.innerHTML = `
            <div class="flex justify-between items-start">
              <span class="font-bold text-slate-900">${j.title}</span>
              <span class="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded">${j.match_score}% Match</span>
            </div>
            <p class="text-slate-500">${j.company_name} • ${j.location} ${j.is_remote ? '• 🌐 Remote' : ''}</p>
            <div class="text-emerald-700 font-medium">Matched: ${j.matched_skills.join(', ') || 'None'}</div>
            ${j.missing_skills.length ? `<div class="text-rose-600">Missing: ${j.missing_skills.join(', ')}</div>` : ''}
          `;
          list.appendChild(item);
        });

        document.getElementById('match-results').classList.remove('hidden');
      } catch (e) {
        alert('Error: ' + e);
      } finally {
        btn.innerText = 'Calculate Matching Jobs ⚡';
      }
    }

    // Upload CV
    async function uploadCVFile() {
      const fileInput = document.getElementById('cv-file-input');
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('Please select a CV file first.');
        return;
      }

      const formData = new FormData();
      formData.append('file', fileInput.files[0]);

      const btn = document.getElementById('btn-upload-cv');
      btn.innerText = 'Parsing & Evaluating ATS...';

      try {
        const res = await fetch('/api/cv/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();

        if (res.ok) {
          document.getElementById('cv-ats-score').innerText = data.ats_score + '/100';
          document.getElementById('cv-sections-detected').innerHTML = '<b>Sections:</b> ' + data.detected_sections.join(', ');
          document.getElementById('cv-skills-extracted').innerHTML = '<b>Extracted Skills (' + data.extracted_skills_count + '):</b> ' + data.extracted_skills.join(', ');
          document.getElementById('cv-results').classList.remove('hidden');
        } else {
          alert('Upload failed: ' + (data.detail || 'Error'));
        }
      } catch (e) {
        alert('Upload error: ' + e);
      } finally {
        btn.innerText = 'Upload & Analyze CV with ATS Engine 🚀';
      }
    }
  </script>
</body>
</html>
"""
    return HTMLResponse(content=html_content)
