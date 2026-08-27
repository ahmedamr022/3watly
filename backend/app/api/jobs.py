"""
MAJRA Jobs, Market Analytics, and Matching API Router
Provides endpoints for job listings, detailed job views, weighted candidate matching, and market analytics.
"""

import json
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.core.config import settings
from app.models.database import Job, JobSkill, Skill, Company
from app.services.matching_engine import MatchingEngine
from app.services.nlp_extractor import NLPSkillExtractor
from app.schemas.jobs import (
    CandidateMatchRequest,
    JobTextAnalysisRequest,
    MatchResponse,
    MatchedJobItem,
    ActionableGap,
    MarketStatsResponse
)

router = APIRouter(prefix="/api", tags=["Jobs, Matching & Market Analytics"])

matching_engine = MatchingEngine()
nlp_extractor = NLPSkillExtractor()


def load_market_summary_fallback() -> Dict[str, Any]:
    summary_file = settings.DATA_PATH / "market_insights_summary.json"
    if summary_file.exists():
        with open(summary_file, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "total_active_jobs_analyzed": 0,
        "remote_ratio": "0%",
        "top_20_in_demand_skills": []
    }


@router.get("/market/stats", response_model=MarketStatsResponse)
def get_market_statistics(db: Session = Depends(get_db)):
    """
    Returns Egyptian tech labor market metrics, top in-demand skills, and remote job ratios.
    """
    return load_market_summary_fallback()


@router.get("/jobs")
def list_jobs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    is_remote: Optional[bool] = None,
    skill: Optional[str] = None,
    seniority: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Lists active job postings from the database with filtering and pagination.
    """
    query = db.query(Job)

    if is_remote is not None:
        query = query.filter(Job.is_remote == is_remote)

    if seniority:
        query = query.filter(Job.seniority_level.ilike(f"%{seniority}%"))

    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            or_(
                Job.title.ilike(search_fmt),
                Job.description_raw.ilike(search_fmt)
            )
        )

    if skill:
        skill_clean = skill.strip().lower()
        query = query.join(Job.skills).join(JobSkill.skill).filter(
            or_(
                Skill.name.ilike(f"%{skill_clean}%"),
                Skill.aliases_raw.ilike(f"%{skill_clean}%")
            )
        )

    total = query.count()
    offset = (page - 1) * limit
    jobs = query.order_by(Job.scraped_at.desc()).offset(offset).limit(limit).all()

    formatted_jobs = []
    for j in jobs:
        req_skills = [
            js.skill.name for js in j.skills if js.is_required and js.skill
        ]
        pref_skills = [
            js.skill.name for js in j.skills if not js.is_required and js.skill
        ]

        formatted_jobs.append({
            "id": j.id,
            "title": j.title,
            "company_name": j.company.name if j.company else "Tech Company",
            "company_logo": j.company.logo_url if j.company else None,
            "location": j.location_raw,
            "city": j.city,
            "country": j.country,
            "is_remote": j.is_remote,
            "employment_type": j.employment_type,
            "seniority_level": j.seniority_level,
            "salary_min": float(j.salary_min) if j.salary_min else None,
            "salary_max": float(j.salary_max) if j.salary_max else None,
            "salary_currency": j.salary_currency,
            "source_url": j.source_url,
            "source_platform": j.source_platform,
            "required_skills": req_skills,
            "preferred_skills": pref_skills,
            "all_detected_skills": req_skills + pref_skills,
            "scraped_at": j.scraped_at
        })

    return {
        "page": page,
        "limit": limit,
        "total_results": total,
        "total_pages": (total + limit - 1) // limit if total > 0 else 1,
        "jobs": formatted_jobs
    }


@router.get("/jobs/{job_id}")
def get_job_by_id(job_id: str, db: Session = Depends(get_db)):
    """
    Returns full details for a single job posting by ID.
    """
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    req_skills = [js.skill.name for js in job.skills if js.is_required and js.skill]
    pref_skills = [js.skill.name for js in job.skills if not js.is_required and js.skill]

    return {
        "id": job.id,
        "title": job.title,
        "company_name": job.company.name if job.company else "Tech Company",
        "company_logo": job.company.logo_url if job.company else None,
        "location": job.location_raw,
        "is_remote": job.is_remote,
        "employment_type": job.employment_type,
        "seniority_level": job.seniority_level,
        "salary_min": float(job.salary_min) if job.salary_min else None,
        "salary_max": float(job.salary_max) if job.salary_max else None,
        "salary_currency": job.salary_currency,
        "description_raw": job.description_raw,
        "requirements_raw": job.requirements_raw,
        "source_url": job.source_url,
        "source_platform": job.source_platform,
        "required_skills": req_skills,
        "preferred_skills": pref_skills,
        "scraped_at": job.scraped_at
    }


@router.post("/matching/match-user", response_model=MatchResponse)
def match_user_profile(req: CandidateMatchRequest, db: Session = Depends(get_db)):
    """
    Computes weighted market fit percentage for candidate against all database jobs.
    """
    jobs = db.query(Job).all()
    if not jobs:
        raise HTTPException(status_code=404, detail="No active jobs found in database.")

    scored_jobs = []
    for j in jobs:
        req_skills = [js.skill.name for js in j.skills if js.is_required and js.skill]
        pref_skills = [js.skill.name for js in j.skills if not js.is_required and js.skill]

        match_res = matching_engine.calculate_match(
            candidate_skills=req.candidate_skills,
            job_required_skills=req_skills,
            job_preferred_skills=pref_skills,
            candidate_experience_years=req.experience_years,
            job_seniority=j.seniority_level or "Junior",
            candidate_preferred_locations=req.preferred_locations,
            job_location=j.location_raw,
            job_is_remote=j.is_remote
        )

        gaps = [
            ActionableGap(skill=g["skill"], priority=g["priority"], reason=g["reason"])
            for g in match_res.get("actionable_gaps", [])
        ]

        scored_jobs.append(
            MatchedJobItem(
                job_id=j.id,
                title=j.title,
                company_name=j.company.name if j.company else "Tech Company",
                location=j.location_raw,
                is_remote=j.is_remote,
                source_url=j.source_url,
                source_platform=j.source_platform,
                match_score=match_res["match_score"],
                match_tier=match_res["match_tier"],
                matched_skills=match_res["matched_required_skills"] + match_res["matched_preferred_skills"],
                missing_skills=match_res["missing_required_skills"],
                actionable_gaps=gaps
            )
        )

    # Sort descending by match score
    scored_jobs.sort(key=lambda x: x.match_score, reverse=True)

    top_scores = [j.match_score for j in scored_jobs[:5]]
    overall_alignment = round(sum(top_scores) / len(top_scores), 1) if top_scores else 0.0

    return MatchResponse(
        overall_career_alignment=f"{overall_alignment}%",
        total_matched_jobs=len(scored_jobs),
        top_recommended_jobs=scored_jobs[:20]
    )


@router.post("/nlp/analyze-job")
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
    if any(k in lower for k in ["senior", "lead", "staff", "principal", "5+ years", "5 years"]):
        seniority = "Senior"
    elif any(k in lower for k in ["mid", "3-5 years", "3 years", "2-4 years"]):
        seniority = "Mid-Level"

    return {
        "provided_title": req.job_title or "Custom Job Posting",
        "inferred_seniority": seniority,
        "required_skills": res.get("required_skills", []),
        "preferred_skills": res.get("preferred_skills", []),
        "all_detected_skills_count": len(res.get("all_detected_skills", [])),
        "detailed_entities": res.get("all_detected_skills", [])
    }
