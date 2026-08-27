"""
MAJRA Database Models & Tables Definition
SQLAlchemy ORM models covering Users, Profiles, CVs, Companies, Jobs, and Skills.
"""

from datetime import datetime
import uuid
import json
from typing import List, Optional, Dict, Any
from sqlalchemy import (
    Column, String, Text, Boolean, DateTime, ForeignKey, 
    Numeric, Integer, Float
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    avatar_url = Column(Text, nullable=True)  # Stores Image URL or Base64 avatar
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    cv_documents = relationship("CVDocument", back_populates="user", cascade="all, delete-orphan")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    target_role = Column(String(100), default="Data Analyst")
    experience_years = Column(Integer, default=1)
    preferred_locations_raw = Column(Text, default='["Cairo", "Giza", "Remote"]')
    target_industry = Column(String(100), default="Technology")
    skills_raw = Column(Text, default='[]')
    career_alignment_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")

    @property
    def preferred_locations(self) -> List[str]:
        try:
            return json.loads(self.preferred_locations_raw or "[]")
        except Exception:
            return []

    @preferred_locations.setter
    def preferred_locations(self, val: List[str]):
        self.preferred_locations_raw = json.dumps(val)

    @property
    def skills(self) -> List[str]:
        try:
            return json.loads(self.skills_raw or "[]")
        except Exception:
            return []

    @skills.setter
    def skills(self, val: List[str]):
        self.skills_raw = json.dumps(val)


class CVDocument(Base):
    __tablename__ = "cv_documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), default="application/pdf")
    raw_text = Column(Text, nullable=True)
    parsed_skills_raw = Column(Text, default='[]')
    ats_score = Column(Float, default=0.0)
    ats_feedback_raw = Column(Text, default='{}')
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cv_documents")

    @property
    def parsed_skills(self) -> List[str]:
        try:
            return json.loads(self.parsed_skills_raw or "[]")
        except Exception:
            return []

    @parsed_skills.setter
    def parsed_skills(self, val: List[str]):
        self.parsed_skills_raw = json.dumps(val)

    @property
    def ats_feedback(self) -> Dict[str, Any]:
        try:
            return json.loads(self.ats_feedback_raw or "{}")
        except Exception:
            return {}

    @ats_feedback.setter
    def ats_feedback(self, val: Dict[str, Any]):
        self.ats_feedback_raw = json.dumps(val)


class Company(Base):
    __tablename__ = "companies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False, unique=True, index=True)
    logo_url = Column(String(500), nullable=True)
    website = Column(String(500), nullable=True)
    industry = Column(String(100), nullable=True)
    size = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    jobs = relationship("Job", back_populates="company")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(String(100), primary_key=True)  # e.g., 'skill_python'
    name = Column(String(100), nullable=False, unique=True, index=True)
    category = Column(String(100), nullable=False, index=True)
    aliases_raw = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    job_associations = relationship("JobSkill", back_populates="skill")

    @property
    def aliases(self) -> List[str]:
        try:
            return json.loads(self.aliases_raw or "[]")
        except Exception:
            return []

    @aliases.setter
    def aliases(self, val: List[str]):
        self.aliases_raw = json.dumps(val)


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(64), primary_key=True)  # MD5 Hash of URL
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=True)
    title = Column(String(255), nullable=False, index=True)
    description_raw = Column(Text, nullable=False)
    requirements_raw = Column(Text, nullable=True)
    location_raw = Column(String(255), default="Cairo, Egypt")
    city = Column(String(100), default="Cairo")
    country = Column(String(100), default="Egypt")
    is_remote = Column(Boolean, default=False, index=True)
    employment_type = Column(String(50), nullable=True)
    seniority_level = Column(String(50), nullable=True, index=True)
    salary_min = Column(Numeric, nullable=True)
    salary_max = Column(Numeric, nullable=True)
    salary_currency = Column(String(3), default="EGP")
    source_url = Column(String(500), nullable=False, unique=True, index=True)
    source_platform = Column(String(50), default="wuzzuf", index=True)
    posted_at_raw = Column(String(100), nullable=True)
    scraped_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="jobs")
    skills = relationship("JobSkill", back_populates="job", cascade="all, delete-orphan")


class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String(64), ForeignKey("jobs.id"), nullable=False, index=True)
    skill_id = Column(String(100), ForeignKey("skills.id"), nullable=False, index=True)
    is_required = Column(Boolean, default=True)
    importance_weight = Column(Float, default=1.0)

    job = relationship("Job", back_populates="skills")
    skill = relationship("Skill", back_populates="job_associations")
