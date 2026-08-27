"""
MAJRA CV Upload & ATS Analysis Router
Accepts PDF / DOCX / TXT files, extracts plain text, parses skills with NLP,
and generates comprehensive ATS diagnostic reports.
"""

import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.core.security import get_optional_user
from app.models.database import User, CVDocument
from app.services.cv_parser import CVParser
from app.schemas.cv import CVUploadResponse, ATSScoreBreakdown, ExtractedSkillItem

router = APIRouter(prefix="/api/cv", tags=["CV Parser & ATS Diagnostics"])
cv_parser = CVParser()


@router.post("/upload", response_model=CVUploadResponse)
async def upload_and_parse_cv(
    file: UploadFile = File(..., description="CV file in PDF, DOCX, or TXT format"),
    current_user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db)
):
    """
    Uploads a real CV file (PDF/DOCX/TXT), extracts raw text, detects structural sections,
    extracts canonical tech skills, and computes an ATS Compatibility Score.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file has no filename.")

    # Read binary content
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # 1. Extract text
    raw_text = cv_parser.extract_text_from_bytes(
        file_bytes=contents,
        filename=file.filename,
        content_type=file.content_type or ""
    )

    if not raw_text or len(raw_text.strip()) < 10:
        raise HTTPException(
            status_code=422,
            detail="Unable to extract readable text from this file. Please make sure it is not a scanned image or password-protected."
        )

    # 2. Analyze CV and compute ATS metrics
    analysis = cv_parser.analyze_cv(raw_text)

    # 3. Persist CV document in DB
    doc_id = str(uuid.uuid4())
    cv_record = CVDocument(
        id=doc_id,
        user_id=current_user.id if current_user else None,
        filename=file.filename,
        file_type=file.content_type or "application/octet-stream",
        raw_text=raw_text,
        ats_score=float(analysis["overall_score"])
    )
    cv_record.parsed_skills = analysis["extracted_skills"]
    cv_record.ats_feedback = analysis

    db.add(cv_record)

    # If authenticated, update user profile skills automatically
    if current_user and current_user.profile:
        existing_skills = set(current_user.profile.skills)
        updated_skills = list(existing_skills.union(set(analysis["extracted_skills"])))
        current_user.profile.skills = updated_skills

    db.commit()

    # 4. Construct Response
    ats_breakdown = ATSScoreBreakdown(
        overall_score=analysis["overall_score"],
        structure_score=analysis["structure_score"],
        skills_score=analysis["skills_score"],
        impact_score=analysis["impact_score"],
        readability_score=analysis["readability_score"],
        detected_sections=analysis["detected_sections"],
        missing_critical_sections=analysis["missing_critical_sections"],
        word_count=analysis["word_count"],
        suggestions=analysis["suggestions"]
    )

    detailed_skills_models = [
        ExtractedSkillItem(
            id=s["id"],
            name=s["name"],
            category=s.get("category", "Technical"),
            importance=s.get("importance", "required")
        )
        for s in analysis.get("detailed_skills", [])
    ]

    preview = (raw_text[:300] + "...") if len(raw_text) > 300 else raw_text

    return CVUploadResponse(
        document_id=doc_id,
        filename=file.filename,
        file_type=file.content_type or "application/pdf",
        total_words=analysis["word_count"],
        extracted_skills_count=len(analysis["extracted_skills"]),
        extracted_skills=analysis["extracted_skills"],
        detailed_skills=detailed_skills_models,
        detected_sections=analysis["detected_sections"],
        ats_score=analysis["overall_score"],
        ats_diagnostics=ats_breakdown,
        preview_snippet=preview
    )
