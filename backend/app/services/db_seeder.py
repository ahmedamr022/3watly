"""
MAJRA Database Seeder
Automatically seeds Skill Ontology and Processed Jobs into SQLite/PostgreSQL on initial startup.
"""

import json
import logging
from pathlib import Path
from typing import Dict, Any, List
from sqlalchemy.orm import Session

from app.models.database import Skill, Job, JobSkill, Company
from app.core.config import settings

logger = logging.getLogger("MAJRA_Seeder")


def seed_database_if_empty(db: Session) -> Dict[str, int]:
    """
    Seeds initial skills and jobs data if tables are currently empty.
    """
    seeded_counts = {"skills": 0, "jobs": 0, "companies": 0}
    data_dir = settings.DATA_PATH

    # 1. Seed Skills from skill_ontology.json
    try:
        existing_skills_count = db.query(Skill).count()
        if existing_skills_count == 0:
            ontology_path = data_dir / "skill_ontology.json"
            if ontology_path.exists():
                logger.info("🌱 Seeding Skill Ontology into Database...")
                with open(ontology_path, "r", encoding="utf-8") as f:
                    ontology_data = json.load(f)

                for cat in ontology_data.get("categories", []):
                    cat_name = cat.get("name", "General")
                    for s in cat.get("skills", []):
                        s_id = s.get("id")
                        s_name = s.get("name")
                        aliases = s.get("aliases", [])

                        if not db.query(Skill).filter(Skill.id == s_id).first():
                            skill_record = Skill(
                                id=s_id,
                                name=s_name,
                                category=cat_name
                            )
                            skill_record.aliases = aliases
                            db.add(skill_record)
                            seeded_counts["skills"] += 1

                db.commit()
                logger.info(f"✅ Seeded {seeded_counts['skills']} skills.")
    except Exception as e:
        logger.error(f"Error seeding skills: {e}")
        db.rollback()

    # 2. Seed Jobs & Companies from processed_jobs.json
    try:
        existing_jobs_count = db.query(Job).count()
        if existing_jobs_count == 0:
            jobs_path = data_dir / "processed_jobs.json"
            if jobs_path.exists():
                logger.info("🌱 Seeding Jobs & Companies into Database...")
                with open(jobs_path, "r", encoding="utf-8") as f:
                    jobs_data = json.load(f)

                for j in jobs_data:
                    j_id = j.get("id")
                    if not j_id:
                        continue

                    # Handle Company
                    company_name = (j.get("company_name") or "Confidential / Tech Company").strip()
                    company = db.query(Company).filter(Company.name == company_name).first()
                    if not company:
                        company = Company(name=company_name)
                        db.add(company)
                        db.flush()
                        seeded_counts["companies"] += 1

                    # Check if job exists
                    if not db.query(Job).filter(Job.id == j_id).first():
                        job_record = Job(
                            id=j_id,
                            company_id=company.id,
                            title=j.get("title", "Software Role"),
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
                            source_url=j.get("source_url", f"https://majra.ai/jobs/{j_id}"),
                            source_platform=j.get("source_platform", "wuzzuf"),
                            posted_at_raw=j.get("posted_at_raw")
                        )
                        db.add(job_record)
                        seeded_counts["jobs"] += 1

                        # Connect JobSkills
                        all_skills = j.get("all_detected_skills", [])
                        req_skills = set(j.get("nlp_required_skills", []))

                        for skill_name in all_skills:
                            # Match with canonical skill
                            skill_db = db.query(Skill).filter(Skill.name.ilike(skill_name)).first()
                            if skill_db:
                                js = JobSkill(
                                    job_id=j_id,
                                    skill_id=skill_db.id,
                                    is_required=(skill_name in req_skills),
                                    importance_weight=1.2 if skill_name in req_skills else 0.8
                                )
                                db.add(js)

                db.commit()
                logger.info(f"✅ Seeded {seeded_counts['jobs']} jobs and {seeded_counts['companies']} companies.")
    except Exception as e:
        logger.error(f"Error seeding jobs: {e}")
        db.rollback()

    return seeded_counts
