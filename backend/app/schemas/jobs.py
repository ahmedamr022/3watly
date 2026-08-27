"""
MAJRA Job & Market Schemas
Pydantic models for job listing, searching, matching, and market analytics.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class CandidateMatchRequest(BaseModel):
    candidate_skills: List[str] = Field(..., example=["SQL", "Python", "Power BI"])
    experience_years: int = Field(1, example=1)
    target_role: Optional[str] = Field(None, example="Data Analyst")
    preferred_locations: List[str] = Field(default_factory=lambda: ["Cairo", "Giza", "Remote"])


class JobTextAnalysisRequest(BaseModel):
    raw_text: str = Field(..., description="Raw text of any job description to analyze")
    job_title: Optional[str] = Field(None, description="Optional job title")


class ActionableGap(BaseModel):
    skill: str
    priority: str
    reason: str


class MatchedJobItem(BaseModel):
    job_id: str
    title: str
    company_name: Optional[str] = None
    location: Optional[str] = None
    is_remote: bool
    source_url: str
    source_platform: str
    match_score: float
    match_tier: str
    matched_skills: List[str]
    missing_skills: List[str]
    actionable_gaps: List[ActionableGap]


class MatchResponse(BaseModel):
    overall_career_alignment: str
    total_matched_jobs: int
    top_recommended_jobs: List[MatchedJobItem]


class SkillDemandItem(BaseModel):
    skill: str
    job_count: int
    demand_percentage: str


class MarketStatsResponse(BaseModel):
    total_active_jobs_analyzed: int
    remote_ratio: str
    top_20_in_demand_skills: List[SkillDemandItem]
    platforms_breakdown: Optional[Dict[str, int]] = None
    last_updated: Optional[str] = None
