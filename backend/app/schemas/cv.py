"""
MAJRA CV Parsing & ATS Schemas
Pydantic models for CV upload, extracted skills, and ATS diagnostics breakdown.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ATSScoreBreakdown(BaseModel):
    overall_score: int = Field(..., ge=0, le=100, description="Overall ATS compatibility score")
    structure_score: int = Field(..., ge=0, le=25, description="Formatting and section structure score")
    skills_score: int = Field(..., ge=0, le=40, description="Skill density and tech relevance score")
    impact_score: int = Field(..., ge=0, le=20, description="Action verbs and quantified metrics score")
    readability_score: int = Field(..., ge=0, le=15, description="Word count and text flow score")
    detected_sections: List[str]
    missing_critical_sections: List[str]
    word_count: int
    suggestions: List[str]


class ExtractedSkillItem(BaseModel):
    id: str
    name: str
    category: str
    importance: str = "required"


class CVUploadResponse(BaseModel):
    document_id: str
    filename: str
    file_type: str
    total_words: int
    extracted_skills_count: int
    extracted_skills: List[str]
    detailed_skills: List[ExtractedSkillItem]
    detected_sections: List[str]
    ats_score: int
    ats_diagnostics: ATSScoreBreakdown
    preview_snippet: str
