"""
MAJRA Auth Schemas
Pydantic models for user registration, authentication, tokens, and profile management.
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password at least 6 characters")
    full_name: Optional[str] = Field(None, example="Ahmed Ali")
    avatar_url: Optional[str] = None
    target_role: Optional[str] = Field("Data Analyst", example="Frontend Developer")
    experience_years: Optional[int] = Field(1, ge=0, le=40)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int
    user_id: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


class UserProfileSchema(BaseModel):
    target_role: Optional[str] = "Data Analyst"
    experience_years: int = 1
    preferred_locations: List[str] = ["Cairo", "Giza", "Remote"]
    target_industry: Optional[str] = "Technology"
    skills: List[str] = []
    career_alignment_score: float = 0.0


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    profile: Optional[UserProfileSchema] = None

    class Config:
        from_attributes = True


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    target_role: Optional[str] = None
    experience_years: Optional[int] = None
    preferred_locations: Optional[List[str]] = None
    target_industry: Optional[str] = None
    skills: Optional[List[str]] = None
