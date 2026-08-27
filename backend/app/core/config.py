"""
MAJRA Configuration Settings
Supports environment variables with sensible defaults for local development.
"""

import os
from pathlib import Path
from pydantic import BaseModel

# Locate project root (D:\Mjara)
CURRENT_FILE = Path(__file__).resolve()
# Traverse up until we find the directory containing 'data' or top project root
POTENTIAL_ROOTS = [
    CURRENT_FILE.parent.parent.parent.parent,  # D:\Mjara
    CURRENT_FILE.parent.parent.parent,         # D:\Mjara\backend
    Path.cwd(),
    Path.cwd().parent
]

PROJECT_ROOT = POTENTIAL_ROOTS[0]
for p in POTENTIAL_ROOTS:
    if (p / "data" / "skill_ontology.json").exists():
        PROJECT_ROOT = p
        break

DATA_DIR = PROJECT_ROOT / "data"
UPLOADS_DIR = PROJECT_ROOT / "uploads"


class Settings(BaseModel):
    PROJECT_NAME: str = "MAJRA Career Intelligence"
    API_V1_STR: str = "/api"
    VERSION: str = "1.0.0"

    # Database
    # Defaults to local SQLite db inside data/ for zero-config; switch to PostgreSQL in production
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{DATA_DIR / 'majra.db'}"
    )

    # JWT Authentication & Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "majra-super-secret-key-2026-cairo-egypt-tech-intel")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Scheduler Settings
    SCRAPER_INTERVAL_HOURS: int = int(os.getenv("SCRAPER_INTERVAL_HOURS", "2"))
    SCRAPER_AUTO_START: bool = os.getenv("SCRAPER_AUTO_START", "true").lower() == "true"

    # Directories
    DATA_PATH: Path = DATA_DIR
    UPLOADS_PATH: Path = UPLOADS_DIR


settings = Settings()
settings.DATA_PATH.mkdir(parents=True, exist_ok=True)
settings.UPLOADS_PATH.mkdir(parents=True, exist_ok=True)
