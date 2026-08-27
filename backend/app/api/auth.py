"""
MAJRA Authentication & User Profile API Endpoints
Handles user registration, JWT login, token authentication, avatar uploads, and profile management.
"""

import uuid
import shutil
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)
from app.models.database import User, UserProfile
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
    UserResponse,
    ProfileUpdateRequest,
    UserProfileSchema
)

AVATARS_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "avatars"
AVATARS_DIR.mkdir(parents=True, exist_ok=True)

router = APIRouter(prefix="/api/auth", tags=["Authentication & Profile"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(req: UserRegister, db: Session = Depends(get_db)):
    """
    Registers a new user, hashes password with Bcrypt, creates initial profile, and returns JWT token.
    """
    # Check if email is already registered
    existing = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Create User
    new_user = User(
        email=req.email.lower().strip(),
        hashed_password=get_password_hash(req.password),
        full_name=req.full_name,
        avatar_url=req.avatar_url
    )
    db.add(new_user)
    db.flush()

    # Create associated Profile
    new_profile = UserProfile(
        user_id=new_user.id,
        target_role=req.target_role or "Data Analyst",
        experience_years=req.experience_years or 1
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_user)

    # Generate JWT
    token = create_access_token(data={"sub": new_user.id, "email": new_user.email})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        user_id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        avatar_url=new_user.avatar_url
    )


@router.post("/login", response_model=TokenResponse)
def login_user(req: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticates user credentials and returns a signed JWT access token.
    """
    user = db.query(User).filter(User.email == req.email.lower().strip()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated."
        )

    token = create_access_token(data={"sub": user.id, "email": user.email})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        avatar_url=user.avatar_url
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns the authenticated user details, avatar, and active profile settings.
    """
    profile_data = None
    if current_user.profile:
        profile_data = UserProfileSchema(
            target_role=current_user.profile.target_role,
            experience_years=current_user.profile.experience_years,
            preferred_locations=current_user.profile.preferred_locations,
            target_industry=current_user.profile.target_industry,
            skills=current_user.profile.skills,
            career_alignment_score=current_user.profile.career_alignment_score
        )

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        avatar_url=current_user.avatar_url,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        profile=profile_data
    )


@router.put("/profile", response_model=UserResponse)
def update_user_profile(
    req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates user personal info (full name, avatar) and career target role, skills, experience.
    """
    if req.full_name is not None:
        current_user.full_name = req.full_name
    if req.avatar_url is not None:
        current_user.avatar_url = req.avatar_url

    profile = current_user.profile
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    if req.target_role is not None:
        profile.target_role = req.target_role
    if req.experience_years is not None:
        profile.experience_years = req.experience_years
    if req.preferred_locations is not None:
        profile.preferred_locations = req.preferred_locations
    if req.target_industry is not None:
        profile.target_industry = req.target_industry
    if req.skills is not None:
        profile.skills = req.skills

    db.commit()
    db.refresh(current_user)

    profile_data = UserProfileSchema(
        target_role=profile.target_role,
        experience_years=profile.experience_years,
        preferred_locations=profile.preferred_locations,
        target_industry=profile.target_industry,
        skills=profile.skills,
        career_alignment_score=profile.career_alignment_score
    )

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        avatar_url=current_user.avatar_url,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        profile=profile_data
    )


@router.post("/avatar")
def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Uploads a user avatar image file. Saves it to disk and stores the URL in the database.
    Supports JPEG, PNG, and WebP formats. Max size: 5MB.
    """
    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{file.content_type}'. Allowed: JPEG, PNG, WebP."
        )

    # Read and validate size (max 5MB)
    contents = file.file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5MB."
        )
    file.file.seek(0)

    # Generate unique filename
    ext = Path(file.filename).suffix if file.filename else ".jpg"
    if ext.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        ext = ".jpg"
    unique_name = f"{current_user.id}_{uuid.uuid4().hex[:8]}{ext}"
    save_path = AVATARS_DIR / unique_name

    # Delete old avatar file if it exists
    if current_user.avatar_url:
        old_filename = current_user.avatar_url.split("/")[-1]
        old_path = AVATARS_DIR / old_filename
        if old_path.exists():
            old_path.unlink()

    # Save file to disk
    with open(save_path, "wb") as f:
        f.write(contents)

    # Store relative URL path in database
    avatar_url = f"/uploads/avatars/{unique_name}"
    current_user.avatar_url = avatar_url
    db.commit()

    return {"avatar_url": avatar_url, "message": "Avatar uploaded successfully."}

