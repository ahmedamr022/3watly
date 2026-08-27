"""
MAJRA Automated Scraping & NLP Data Pipeline
Orchestrates multi-source scraping (Wuzzuf, Remotive, ATS), deduplication by URL,
NLP skill extraction, database synchronization, and market intelligence aggregation.
"""

import json
import logging
import time
import asyncio
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional

from app.scraper.schemas import ScrapedJobPost
from app.scraper.adapters.wuzzuf import WuzzufAdapter
from app.scraper.adapters.remotive import RemotiveAdapter
from app.scraper.adapters.company_ats import CompanyATSAdapter
from app.services.nlp_extractor import NLPSkillExtractor
from app.core.config import settings

logger = logging.getLogger("MAJRA_Pipeline")


class DataPipeline:
    def __init__(self):
        self.wuzzuf = WuzzufAdapter()
        self.remotive = RemotiveAdapter()
        self.ats = CompanyATSAdapter()
        self.nlp = NLPSkillExtractor()
        settings.DATA_PATH.mkdir(parents=True, exist_ok=True)

    def load_existing_jobs(self) -> List[Dict[str, Any]]:
        processed_file = settings.DATA_PATH / "processed_jobs.json"
        if processed_file.exists():
            try:
                with open(processed_file, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error reading {processed_file}: {e}")
        return []

    def run_pipeline(self, search_queries: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Executes complete ingestion -> deduplication -> NLP extraction -> market stats.
        """
        if search_queries is None:
            search_queries = ["data analyst", "python", "software engineer", "frontend", "backend", "react"]

        logger.info("🚀 Starting MAJRA ETL Scraping & NLP Pipeline...")
        existing_jobs = self.load_existing_jobs()
        existing_urls = {j.get("source_url", "").strip().lower() for j in existing_jobs if j.get("source_url")}
        logger.info(f"Loaded {len(existing_jobs)} existing jobs from cache.")

        newly_scraped: List[ScrapedJobPost] = []

        # 1. Scrape Remotive Tech Jobs (API)
        try:
            logger.info("📡 Fetching tech jobs from Remotive API...")
            remotive_jobs = self.remotive.fetch_tech_jobs(limit=25)
            for j in remotive_jobs:
                if j.source_url.strip().lower() not in existing_urls:
                    newly_scraped.append(j)
                    existing_urls.add(j.source_url.strip().lower())
            logger.info(f"Added {len(remotive_jobs)} jobs from Remotive.")
        except Exception as e:
            logger.error(f"Remotive scraping error: {e}")

        # 2. Scrape Wuzzuf Egypt Jobs
        for query in search_queries[:3]:  # Limit for speed and polite crawling
            try:
                logger.info(f"🔍 Scraping Wuzzuf for query: '{query}'...")
                wuzzuf_jobs = self.wuzzuf.search_jobs(query=query, max_pages=1)
                for j in wuzzuf_jobs:
                    if j.source_url.strip().lower() not in existing_urls:
                        newly_scraped.append(j)
                        existing_urls.add(j.source_url.strip().lower())
            except Exception as e:
                logger.error(f"Wuzzuf scraping error for '{query}': {e}")
            time.sleep(1)

        logger.info(f"✨ Total new unique jobs scraped in this cycle: {len(newly_scraped)}")

        # 3. Process new jobs with NLP Skill Extractor
        new_processed_jobs: List[Dict[str, Any]] = []
        for post in newly_scraped:
            job_dict = post.model_dump()
            
            # Combine title + description + raw tags for comprehensive NLP scanning
            combined_text = f"{post.title}\n{post.description_raw}\n{' '.join(post.extracted_skills_raw)}"
            nlp_res = self.nlp.extract_skills_from_text(combined_text)

            # Heuristic seniority detection
            lower = combined_text.lower()
            seniority = post.seniority_level or "Junior"
            if any(k in lower for k in ["senior", "lead", "staff", "principal", "5+ years"]):
                seniority = "Senior"
            elif any(k in lower for k in ["mid-level", "mid level", "3-5 years", "2-4 years"]):
                seniority = "Mid-Level"

            job_dict["seniority_level"] = seniority
            job_dict["nlp_required_skills"] = nlp_res.get("required_skills", [])
            job_dict["nlp_preferred_skills"] = nlp_res.get("preferred_skills", [])
            
            all_detected = nlp_res.get("required_skills", []) + nlp_res.get("preferred_skills", [])
            job_dict["all_detected_skills"] = sorted(list(set(all_detected)))
            new_processed_jobs.append(job_dict)

        # Merge with existing
        all_jobs = existing_jobs + new_processed_jobs
        
        # Save updated processed_jobs.json
        processed_path = settings.DATA_PATH / "processed_jobs.json"
        with open(processed_path, "w", encoding="utf-8") as f:
            json.dump(all_jobs, f, indent=2, ensure_ascii=False, default=str)

        # 4. Generate Market Insights Summary
        stats = self._generate_market_summary(all_jobs)
        summary_path = settings.DATA_PATH / "market_insights_summary.json"
        with open(summary_path, "w", encoding="utf-8") as f:
            json.dump(stats, f, indent=2, ensure_ascii=False)

        # 5. Sync newly processed jobs to DB if available
        self._sync_to_db(new_processed_jobs)

        logger.info(f"✅ Pipeline completed successfully. Total active jobs in catalog: {len(all_jobs)}")
        return {
            "status": "success",
            "new_jobs_added": len(newly_scraped),
            "total_active_jobs": len(all_jobs),
            "stats": stats
        }

    def _sync_to_db(self, new_jobs: List[Dict[str, Any]]) -> None:
        """Syncs new jobs directly into database tables."""
        if not new_jobs:
            return
        try:
            from app.core.database import SessionLocal
            from app.models.database import Job, Company, Skill, JobSkill

            db = SessionLocal()
            for j in new_jobs:
                j_id = j.get("id")
                if not j_id or db.query(Job).filter(Job.id == j_id).first():
                    continue

                company_name = (j.get("company_name") or "Tech Company").strip()
                company = db.query(Company).filter(Company.name == company_name).first()
                if not company:
                    company = Company(name=company_name)
                    db.add(company)
                    db.flush()

                job_rec = Job(
                    id=j_id,
                    company_id=company.id,
                    title=j.get("title", "Tech Role"),
                    description_raw=j.get("description_raw", ""),
                    requirements_raw=j.get("requirements_raw", ""),
                    location_raw=j.get("location_raw", "Cairo, Egypt"),
                    city=j.get("city", "Cairo"),
                    country=j.get("country", "Egypt"),
                    is_remote=j.get("is_remote", False),
                    employment_type=j.get("employment_type", "Full-time"),
                    seniority_level=j.get("seniority_level", "Junior"),
                    salary_min=j.get("salary_min"),
                    salary_max=j.get("salary_max"),
                    source_url=j.get("source_url"),
                    source_platform=j.get("source_platform", "wuzzuf"),
                    posted_at_raw=j.get("posted_at_raw")
                )
                db.add(job_rec)

                req_skills = set(j.get("nlp_required_skills", []))
                for s_name in j.get("all_detected_skills", []):
                    skill_db = db.query(Skill).filter(Skill.name.ilike(s_name)).first()
                    if skill_db:
                        js = JobSkill(
                            job_id=j_id,
                            skill_id=skill_db.id,
                            is_required=(s_name in req_skills),
                            importance_weight=1.2 if s_name in req_skills else 0.8
                        )
                        db.add(js)

            db.commit()
            db.close()
            logger.info(f"Synced {len(new_jobs)} newly scraped jobs into DB.")
        except Exception as e:
            logger.error(f"Error syncing jobs to DB: {e}")

    def _generate_market_summary(self, jobs: List[Dict[str, Any]]) -> Dict[str, Any]:
        total = len(jobs)
        if total == 0:
            return {"total_active_jobs_analyzed": 0, "remote_ratio": "0%", "top_20_in_demand_skills": []}

        skill_freq: Dict[str, int] = {}
        platform_freq: Dict[str, int] = {}
        remote_count = 0

        for j in jobs:
            if j.get("is_remote"):
                remote_count += 1
            p = j.get("source_platform", "other")
            platform_freq[p] = platform_freq.get(p, 0) + 1

            for s in j.get("all_detected_skills", []):
                skill_freq[s] = skill_freq.get(s, 0) + 1

        sorted_skills = sorted(skill_freq.items(), key=lambda x: x[1], reverse=True)[:20]
        top_skills = [
            {
                "skill": s,
                "job_count": count,
                "demand_percentage": f"{(count / total) * 100:.1f}%"
            }
            for s, count in sorted_skills
        ]

        return {
            "total_active_jobs_analyzed": total,
            "platforms_breakdown": platform_freq,
            "remote_ratio": f"{(remote_count / total) * 100:.1f}%",
            "top_20_in_demand_skills": top_skills,
            "last_updated": datetime.utcnow().isoformat()
        }


# Background Recurring Scheduler Function
async def recurring_scraper_task(interval_hours: int = 2):
    """
    Runs the scraping pipeline every interval_hours automatically in the background.
    """
    logger.info(f"⏰ [Scheduler Initialized] Interval set to every {interval_hours} hour(s).")
    pipeline = DataPipeline()
    
    # Initial sleep delay of 10 seconds after server startup before first background tick
    await asyncio.sleep(10)
    
    while True:
        try:
            logger.info(f"⏰ [Scheduler Tick] Triggering automatic periodic scraping cycle...")
            pipeline.run_pipeline()
        except asyncio.CancelledError:
            logger.info("Scheduler task cancelled.")
            break
        except Exception as e:
            logger.error(f"Scheduler execution error: {e}")
        
        # Sleep for interval_hours (e.g. 2 hours = 7200 seconds)
        await asyncio.sleep(interval_hours * 3600)
