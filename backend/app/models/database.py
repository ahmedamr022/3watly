"""
MAJRA Database Models & Tables Definition
SQLAlchemy Models matching the PostgreSQL schema in docs/technical/database-schema.md
"""

from datetime import datetime
import uuid
from typing import List, Optional
from sqlalchemy import (
    Column, String, Text, Boolean, DateTime, ForeignKey, 
    Numeric, Integer, Table, create_engine
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.dialects.postgresql import UUID, JSONB

Base = declarative_base()


class Company(Base):
    __tablename__ = "companies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
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
    name = Column(String(100), nullable=False, unique=True)
    category = Column(String(100), nullable=False)
    aliases = Column(Text, nullable=True)  # Comma-separated or JSON list
    created_at = Column(DateTime, default=datetime.utcnow)

    job_associations = relationship("JobSkill", back_populates="skill")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(64), primary_key=True)  # MD5 of URL
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description_raw = Column(Text, nullable=False)
    requirements_raw = Column(Text, nullable=True)
    location_raw = Column(String(255), default="Cairo, Egypt")
    city = Column(String(100), default="Cairo")
    country = Column(String(100), default="Egypt")
    is_remote = Column(Boolean, default=False)
    employment_type = Column(String(50), nullable=True)
    seniority_level = Column(String(50), nullable=True)
    salary_min = Column(Numeric, nullable=True)
    salary_max = Column(Numeric, nullable=True)
    salary_currency = Column(String(3), default="EGP")
    source_url = Column(String(500), nullable=False, unique=True)
    source_platform = Column(String(50), default="wuzzuf")
    posted_at_raw = Column(String(100), nullable=True)
    scraped_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("Company", back_populates="jobs")
    skills = relationship("JobSkill", back_populates="job")


class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    job_id = Column(String(64), ForeignKey("jobs.id"), nullable=False)
    skill_id = Column(String(100), ForeignKey("skills.id"), nullable=False)
    is_required = Column(Boolean, default=True)
    importance_weight = Column(Numeric, default=1.0)

    job = relationship("Job", back_populates="skills")
    skill = relationship("Skill", back_populates="job_associations")
