"""
MAJRA FastAPI Application Entrypoint & Interactive Playground
Core REST API with an interactive web testing interface for live Job NLP Analysis,
Candidate Matching simulation, and Egyptian Market Analytics.
"""

from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import sys
from pathlib import Path
import json

# Ensure backend root is in sys.path
CURRENT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = CURRENT_DIR.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.matching_engine import MatchingEngine
from app.services.nlp_extractor import NLPSkillExtractor

app = FastAPI(
    title="MAJRA Career Intelligence API",
    description="Egyptian Career & Labor Market Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"

matching_engine = MatchingEngine()
nlp_extractor = NLPSkillExtractor()


def load_processed_jobs() -> List[Dict[str, Any]]:
    processed_file = DATA_DIR / "processed_jobs.json"
    if processed_file.exists():
        with open(processed_file, "r", encoding="utf-8") as f:
            return json.load(f)
    raw_file = DATA_DIR / "raw_jobs.json"
    if raw_file.exists():
        with open(raw_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def load_market_summary() -> Dict[str, Any]:
    summary_file = DATA_DIR / "market_insights_summary.json"
    if summary_file.exists():
        with open(summary_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "total_active_jobs_analyzed": 0,
        "remote_ratio": "0%",
        "top_20_in_demand_skills": []
    }


# ----------------------------------------------------
# Request & Response Models
# ----------------------------------------------------
class CandidateMatchRequest(BaseModel):
    candidate_skills: List[str] = Field(..., example=["SQL", "Python", "Power BI"])
    experience_years: int = Field(1, example=1)
    target_role: Optional[str] = Field(None, example="Data Analyst")
    preferred_locations: List[str] = Field(default_factory=lambda: ["Cairo", "Giza", "Remote"])


class JobTextAnalysisRequest(BaseModel):
    raw_text: str = Field(..., description="Raw text of any job description to analyze")
    job_title: Optional[str] = Field(None, description="Optional job title")


# ----------------------------------------------------
# API Routes
# ----------------------------------------------------
@app.get("/api/market/stats")
def get_market_statistics():
    """Returns top in-demand skills and labor market metrics"""
    return load_market_summary()


@app.get("/api/jobs")
def get_jobs(
    limit: int = Query(20, ge=1, le=100),
    is_remote: Optional[bool] = None,
    skill: Optional[str] = None
):
    """Lists current scraped tech jobs with optional filters"""
    jobs = load_processed_jobs()
    if is_remote is not None:
        jobs = [j for j in jobs if j.get("is_remote") == is_remote]
    if skill:
        skill_lower = skill.strip().lower()
        jobs = [
            j for j in jobs
            if any(skill_lower in s.lower() for s in j.get("all_detected_skills", []))
        ]
    return {
        "total_results": len(jobs),
        "jobs": jobs[:limit]
    }


@app.post("/api/nlp/analyze-job")
def analyze_job_posting(req: JobTextAnalysisRequest):
    """
    Analyzes any raw job posting text, extracts canonical skills,
    classifies Required vs Preferred, and infers seniority level.
    """
    if not req.raw_text.strip():
        raise HTTPException(status_code=400, detail="Job text cannot be empty.")

    res = nlp_extractor.extract_skills_from_text(req.raw_text)

    # Detect Seniority heuristic
    lower = req.raw_text.lower()
    seniority = "Junior / Fresh"
    if "senior" in lower or "lead" in lower or "5+ years" in lower or "5 years" in lower:
        seniority = "Senior"
    elif "mid" in lower or "3-5 years" in lower or "3 years" in lower or "2-4 years" in lower:
        seniority = "Mid-Level"

    return {
        "provided_title": req.job_title or "Custom Job Posting",
        "inferred_seniority": seniority,
        "required_skills": res.get("required_skills", []),
        "preferred_skills": res.get("preferred_skills", []),
        "all_detected_skills_count": len(res.get("all_detected_skills", [])),
        "detailed_entities": res.get("all_detected_skills", [])
    }


@app.post("/api/matching/match-user")
def match_user_profile(req: CandidateMatchRequest):
    """
    Computes weighted fit score for candidate across all jobs in the market.
    """
    jobs = load_processed_jobs()
    if not jobs:
        raise HTTPException(status_code=404, detail="No active job postings in database.")

    scored_jobs = []
    for j in jobs:
        match_result = matching_engine.calculate_match(
            candidate_skills=req.candidate_skills,
            job_required_skills=j.get("nlp_required_skills", []),
            job_preferred_skills=j.get("nlp_preferred_skills", []),
            candidate_experience_years=req.experience_years,
            job_seniority=j.get("seniority_level", "Junior"),
            job_location=j.get("location_raw", "Cairo"),
            job_is_remote=j.get("is_remote", False)
        )
        scored_jobs.append({
            "job_id": j.get("id"),
            "title": j.get("title"),
            "company_name": j.get("company_name"),
            "location": j.get("location_raw"),
            "is_remote": j.get("is_remote"),
            "source_url": j.get("source_url"),
            "source_platform": j.get("source_platform"),
            "match_score": match_result["match_score"],
            "match_tier": match_result["match_tier"],
            "matched_skills": match_result["matched_required_skills"] + match_result["matched_preferred_skills"],
            "missing_skills": match_result["missing_required_skills"],
            "actionable_gaps": match_result["actionable_gaps"]
        })

    scored_jobs.sort(key=lambda x: x["match_score"], reverse=True)
    top_scores = [j["match_score"] for j in scored_jobs[:5]]
    overall_alignment = round(sum(top_scores) / len(top_scores), 1) if top_scores else 0.0

    return {
        "overall_career_alignment": f"{overall_alignment}%",
        "total_matched_jobs": len(scored_jobs),
        "top_recommended_jobs": scored_jobs[:15]
    }


# ----------------------------------------------------
# Interactive Visual Testing Playground UI (HTML/JS)
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
  <header class="bg-[#1E293B] text-white border-b border-slate-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-lg tracking-wider shadow">M</div>
        <div>
          <span class="text-xl font-bold tracking-tight">MAJRA</span>
          <span class="text-xs text-blue-400 block font-medium">Egyptian Career Intelligence Playground</span>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-300 border border-emerald-800">
          ● System Online
        </span>
        <a href="/docs" target="_blank" class="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition">Swagger API Docs ↗</a>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-7xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
    
    <!-- Quick Overview Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4" id="stats-container">
      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-slate-500 uppercase">Analyzed Jobs</p>
          <h3 class="text-2xl font-bold text-slate-900 mt-1" id="stat-total-jobs">44</h3>
        </div>
        <div class="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">💼</div>
      </div>
      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-slate-500 uppercase">Remote Ratio</p>
          <h3 class="text-2xl font-bold text-emerald-600 mt-1" id="stat-remote-ratio">47.7%</h3>
        </div>
        <div class="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">🌐</div>
      </div>
      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-slate-500 uppercase">Top Market Skill</p>
          <h3 class="text-xl font-bold text-blue-600 mt-1" id="stat-top-skill">JavaScript</h3>
        </div>
        <div class="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">🔥</div>
      </div>
      <div class="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-slate-500 uppercase">Skill Taxonomy</p>
          <h3 class="text-2xl font-bold text-indigo-600 mt-1">200+ Skills</h3>
        </div>
        <div class="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">🧠</div>
      </div>
    </div>

    <!-- Playground Tabs -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="border-b border-slate-200 bg-slate-50/70 px-6 py-3 flex space-x-4">
        <button onclick="switchTab('tab-analyzer')" id="btn-tab-analyzer" class="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-sm transition">
          ⚡ 1. Live Job NLP Analyzer (جرب أي إعلان وظيفة)
        </button>
        <button onclick="switchTab('tab-matching')" id="btn-tab-matching" class="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-200 transition">
          🎯 2. Candidate Matching Simulator (محاكي التطابق)
        </button>
        <button onclick="switchTab('tab-jobs')" id="btn-tab-jobs" class="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-200 transition">
          📋 3. Live Scraped Jobs Feed (الوظائف المسحوبة)
        </button>
      </div>

      <div class="p-6 md:p-8">

        <!-- TAB 1: Live Job Analyzer -->
        <div id="tab-analyzer" class="space-y-6">
          <div class="max-w-3xl">
            <h2 class="text-lg font-bold text-slate-900">Live Job Description NLP Parser</h2>
            <p class="text-sm text-slate-500 mt-1">
              الصق أي نص إعلان وظيفة (من Wuzzuf أو LinkedIn أو أي شركة) واضغط تحليل عشان تشوف الـ NLP بيطلع المهارات الإجبارية والاختيارية إزاي:
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Job Title (اختياري)</label>
                <input type="text" id="input-job-title" placeholder="e.g. Senior Data Analyst (Vodafone Egypt)" 
                       class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Paste Raw Job Description (نص الإعلان)</label>
                <textarea id="input-job-text" rows="9" 
                          placeholder="We are looking for a Data Analyst in Cairo. Must have 2+ years experience in SQL and Python. Strong knowledge of Power BI is required. Tableau and Docker are a plus..." 
                          class="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition"></textarea>
              </div>

              <div class="flex space-x-2">
                <button onclick="analyzeCustomJob()" class="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-md transition">
                  🚀 Analyze Job with MAJRA NLP Engine
                </button>
                <button onclick="fillSampleJob()" class="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm transition">
                  Fill Sample
                </button>
              </div>
            </div>

            <!-- Analysis Output -->
            <div class="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between min-h-[320px]" id="analyzer-results-box">
              <div class="space-y-4">
                <div class="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 class="font-bold text-slate-900 text-sm">Extraction Output</h3>
                  <span id="res-seniority-badge" class="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Waiting for input...</span>
                </div>

                <div>
                  <h4 class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">🔴 Required Skills (إجبارية)</h4>
                  <div id="res-required-skills" class="flex flex-wrap gap-1.5 text-xs text-slate-400">
                    None detected yet.
                  </div>
                </div>

                <div>
                  <h4 class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">🟢 Preferred / Bonus Skills (مفضلة)</h4>
                  <div id="res-preferred-skills" class="flex flex-wrap gap-1.5 text-xs text-slate-400">
                    None detected yet.
                  </div>
                </div>

                <div>
                  <h4 class="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">📊 Market Category Breakdown</h4>
                  <div id="res-categories" class="text-xs text-slate-500 space-y-1">
                    No data.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: Candidate Matching -->
        <div id="tab-matching" class="space-y-6 hidden">
          <div class="max-w-3xl">
            <h2 class="text-lg font-bold text-slate-900">Candidate Profile Matcher</h2>
            <p class="text-sm text-slate-500 mt-1">
              اكتب مهاراتك وشوف الـ Weighted Matching Engine هيحسب لك نسبة التوافق كام ويطلع لك أفضل الوظائف المناسبة في مصر:
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Your Skills (Comma Separated)</label>
                <input type="text" id="match-skills-input" value="SQL, Python, Power BI, Excel, Pandas" 
                       class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                <p class="text-[11px] text-slate-400 mt-1">e.g. React, Node.js, TypeScript, Docker</p>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 uppercase mb-1">Years of Experience</label>
                <select id="match-exp-input" class="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm">
                  <option value="0">Fresh Graduate (0-1 Years)</option>
                  <option value="2" selected>Junior (1-2 Years)</option>
                  <option value="4">Mid-Level (3-5 Years)</option>
                  <option value="6">Senior (5+ Years)</option>
                </select>
              </div>

              <button onclick="runUserMatch()" class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm shadow-md transition">
                ⚡ Calculate Market Alignment Score
              </button>
            </div>

            <div class="lg:col-span-2 space-y-4">
              <div class="bg-blue-50/70 border border-blue-200 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span class="text-xs font-bold text-blue-900 uppercase">Overall Career Alignment</span>
                  <p class="text-xs text-blue-700">Based on your target match across active Egyptian tech jobs</p>
                </div>
                <div class="text-3xl font-extrabold text-blue-700" id="match-overall-score">--%</div>
              </div>

              <h3 class="text-sm font-bold text-slate-800">Top Recommended Matches for You:</h3>
              <div class="space-y-3" id="match-results-list">
                <div class="text-sm text-slate-400 p-4 bg-white rounded-lg border border-slate-200">
                  Click 'Calculate Market Alignment Score' to run live simulation.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: Live Jobs Feed -->
        <div id="tab-jobs" class="space-y-4 hidden">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-900">Current Ingested Egyptian Tech Jobs (44 Records)</h2>
            <span class="text-xs text-slate-500">Source: Wuzzuf & Remotive Live</span>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden text-sm">
              <thead class="bg-slate-50 text-slate-700 text-xs uppercase font-semibold">
                <tr>
                  <th class="px-4 py-3 text-left">Job Title</th>
                  <th class="px-4 py-3 text-left">Company</th>
                  <th class="px-4 py-3 text-left">Location</th>
                  <th class="px-4 py-3 text-left">Extracted Skills</th>
                  <th class="px-4 py-3 text-right">Source</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white" id="jobs-table-body">
                <tr><td colspan="5" class="p-4 text-center text-slate-400">Loading jobs...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>

  </main>

  <script>
    // Tab Switcher
    function switchTab(tabId) {
      ['tab-analyzer', 'tab-matching', 'tab-jobs'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
        document.getElementById('btn-' + id).className = 'px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-200 transition';
      });
      document.getElementById(tabId).classList.remove('hidden');
      document.getElementById('btn-' + tabId).className = 'px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white shadow-sm transition';

      if (tabId === 'tab-jobs') loadJobsTable();
    }

    // Sample Job Text
    function fillSampleJob() {
      document.getElementById('input-job-title').value = "Senior Data Analyst (BI & Analytics) - Cairo";
      document.getElementById('input-job-text').value = 
`About the Role:
We are seeking a talented Data Analyst to join our team in Cairo, Egypt.
Key Responsibilities:
- Build interactive Power BI and Tableau dashboards for senior management.
- Write complex SQL queries on PostgreSQL and Snowflake data warehouse.
- Perform exploratory data analysis using Python and Pandas.

Requirements:
- 3+ years of experience in Data Analysis or Business Intelligence.
- Strong proficiency in SQL, Python, and Power BI is required.
- Experience with ETL data pipelines is a must.
- Knowledge of Docker and Machine Learning is a strong plus.`;
    }

    // 1. Analyze Job API Call
    async function analyzeCustomJob() {
      const text = document.getElementById('input-job-text').value;
      const title = document.getElementById('input-job-title').value;
      if (!text.trim()) {
        alert("Please paste some job description text first.");
        return;
      }

      const res = await fetch('/api/nlp/analyze-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_text: text, job_title: title })
      });

      const data = await res.json();
      document.getElementById('res-seniority-badge').innerText = `Level: ${data.inferred_seniority}`;

      // Render Required Skills
      const reqContainer = document.getElementById('res-required-skills');
      if (data.required_skills.length > 0) {
        reqContainer.innerHTML = data.required_skills.map(s => 
          `<span class="px-2.5 py-1 bg-red-100 text-red-800 font-semibold rounded-md border border-red-200">✓ ${s}</span>`
        ).join('');
      } else {
        reqContainer.innerHTML = `<span class="text-slate-400">None detected as strictly required.</span>`;
      }

      // Render Preferred Skills
      const prefContainer = document.getElementById('res-preferred-skills');
      if (data.preferred_skills.length > 0) {
        prefContainer.innerHTML = data.preferred_skills.map(s => 
          `<span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-semibold rounded-md border border-emerald-200">+ ${s} (Bonus)</span>`
        ).join('');
      } else {
        prefContainer.innerHTML = `<span class="text-slate-400">None detected as preferred.</span>`;
      }

      // Render Categories
      const catContainer = document.getElementById('res-categories');
      if (data.detailed_entities.length > 0) {
        const catMap = {};
        data.detailed_entities.forEach(item => {
          catMap[item.category] = (catMap[item.category] || []).concat(item.name);
        });
        catContainer.innerHTML = Object.entries(catMap).map(([cat, list]) => 
          `<div><strong class="text-slate-700">${cat}:</strong> ${list.join(', ')}</div>`
        ).join('');
      }
    }

    // 2. Candidate Matching API Call
    async function runUserMatch() {
      const rawSkills = document.getElementById('match-skills-input').value;
      const exp = parseInt(document.getElementById('match-exp-input').value);
      const skills = rawSkills.split(',').map(s => s.trim()).filter(Boolean);

      const res = await fetch('/api/matching/match-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_skills: skills, experience_years: exp })
      });

      const data = await res.json();
      document.getElementById('match-overall-score').innerText = data.overall_career_alignment;

      const container = document.getElementById('match-results-list');
      container.innerHTML = data.top_recommended_jobs.map((job, idx) => `
        <div class="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm hover:border-blue-400 transition space-y-2">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-slate-900 text-sm">${job.title}</h4>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${job.match_score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">
              ${job.match_score}% Match
            </span>
          </div>
          <p class="text-xs text-slate-500">${job.company_name || 'Confidential Company'} • 📍 ${job.location} • <span class="uppercase font-medium">${job.source_platform}</span></p>
          <div class="flex flex-wrap gap-1 text-xs pt-1">
            ${job.matched_skills.map(s => `<span class="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">✓ ${s}</span>`).join('')}
            ${job.missing_skills.map(s => `<span class="px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">✗ Need: ${s}</span>`).join('')}
          </div>
          ${job.actionable_gaps.length > 0 ? `
            <p class="text-[11px] text-blue-600 bg-blue-50/60 p-1.5 rounded">🎯 <strong>Action:</strong> ${job.actionable_gaps[0].reason} → Learn <strong>${job.actionable_gaps[0].skill}</strong></p>
          ` : ''}
        </div>
      `).join('');
    }

    // 3. Load Jobs Table
    async function loadJobsTable() {
      const res = await fetch('/api/jobs?limit=50');
      const data = await res.json();
      const tbody = document.getElementById('jobs-table-body');
      tbody.innerHTML = data.jobs.map(j => `
        <tr class="hover:bg-slate-50/80 transition">
          <td class="px-4 py-3 font-semibold text-slate-900">${j.title}</td>
          <td class="px-4 py-3 text-slate-600">${j.company_name || 'Confidential'}</td>
          <td class="px-4 py-3 text-slate-500">${j.location_raw}</td>
          <td class="px-4 py-3">
            <div class="flex flex-wrap gap-1">
              ${(j.all_detected_skills || []).slice(0, 4).map(s => `<span class="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">${s}</span>`).join('')}
            </div>
          </td>
          <td class="px-4 py-3 text-right">
            <a href="${j.source_url}" target="_blank" class="text-xs text-blue-600 hover:underline font-medium">View ↗</a>
          </td>
        </tr>
      `).join('');
    }
  </script>
</body>
</html>
"""
    return HTMLResponse(content=html_content)
