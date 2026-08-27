"""
MAJRA Admin & Scraper Control Router
Provides endpoints to trigger ETL scraping, inspect scheduler status, and check system health.
"""

from datetime import datetime
from typing import Dict, Any
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.models.database import User, CVDocument, Job, Skill, Company
from app.scraper.pipeline import DataPipeline

router = APIRouter(prefix="/api/admin", tags=["Admin & Scraper Controls"])

# Shared state for scheduler monitoring
scheduler_state = {
    "is_running": False,
    "last_run_time": None,
    "last_status": "Idle",
    "last_result": None,
    "total_runs_count": 0,
    "error_log": []
}


def run_pipeline_task():
    """Background task function to execute data pipeline."""
    global scheduler_state
    scheduler_state["is_running"] = True
    scheduler_state["last_run_time"] = datetime.utcnow().isoformat()
    scheduler_state["last_status"] = "Executing Scraper & NLP Pipeline..."

    pipeline = DataPipeline()
    try:
        res = pipeline.run_pipeline()
        scheduler_state["last_result"] = res
        scheduler_state["last_status"] = "Success"
        scheduler_state["total_runs_count"] += 1
    except Exception as e:
        scheduler_state["last_status"] = f"Failed: {str(e)}"
        scheduler_state["error_log"].append({
            "timestamp": datetime.utcnow().isoformat(),
            "error": str(e)
        })
    finally:
        scheduler_state["is_running"] = False


@router.post("/scraper/trigger")
def trigger_manual_scraper(background_tasks: BackgroundTasks):
    """
    Manually triggers a full scraping & NLP cycle in the background.
    """
    if scheduler_state["is_running"]:
        return {
            "status": "in_progress",
            "message": "Scraper is already running a cycle right now.",
            "last_run": scheduler_state["last_run_time"]
        }

    background_tasks.add_task(run_pipeline_task)
    return {
        "status": "triggered",
        "message": "Scraper pipeline task dispatched to background successfully.",
        "dispatched_at": datetime.utcnow().isoformat()
    }


@router.get("/scraper/status")
def get_scraper_scheduler_status():
    """
    Returns live execution status, last cycle timestamp, and error logs for the automated scheduler.
    """
    return {
        "scheduler_enabled": settings.SCRAPER_AUTO_START,
        "interval_hours": settings.SCRAPER_INTERVAL_HOURS,
        "is_currently_running": scheduler_state["is_running"],
        "last_run_time": scheduler_state["last_run_time"],
        "last_status": scheduler_state["last_status"],
        "total_completed_runs": scheduler_state["total_runs_count"],
        "last_run_result": scheduler_state["last_result"],
        "recent_errors": scheduler_state["error_log"][-5:]
    }


@router.get("/system/stats")
def get_system_database_statistics(db: Session = Depends(get_db)):
    """
    Returns platform health and counts of database entities (Users, CVs, Jobs, Skills, Companies).
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": {
            "total_users": db.query(User).count(),
            "total_cv_documents": db.query(CVDocument).count(),
            "total_jobs": db.query(Job).count(),
            "total_skills": db.query(Skill).count(),
            "total_companies": db.query(Company).count()
        }
    }
