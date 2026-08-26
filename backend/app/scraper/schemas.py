"""
MAJRA Scraping Schemas
Standardized data contracts for all scraped job data across platforms.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
import hashlib


class ScrapedJobPost(BaseModel):
    """
    Standardized Job Post Schema across all scrapers (Wuzzuf, LinkedIn, APIs, etc.)
    """
    id: Optional[str] = Field(None, description="MD5 hash of URL for deduplication")
    title: str = Field(..., description="Job Title, e.g. 'Senior Data Analyst'")
    company_name: str = Field(..., description="Company name, e.g. 'Vodafone Egypt'")
    company_url: Optional[str] = Field(None, description="Company profile URL")
    location_raw: str = Field("Cairo, Egypt", description="Raw location text")
    city: Optional[str] = Field("Cairo", description="Normalized City")
    country: Optional[str] = Field("Egypt", description="Normalized Country")
    is_remote: bool = Field(False, description="True if position is remote")
    employment_type: Optional[str] = Field(None, description="e.g. 'Full Time', 'Internship'")
    seniority_level: Optional[str] = Field(None, description="e.g. 'Entry Level', 'Junior', 'Mid-Level', 'Senior'")
    years_of_experience: Optional[str] = Field(None, description="e.g. '1-3 years'")
    
    # Description & Content
    description_raw: str = Field(..., description="Full raw job description text")
    requirements_raw: Optional[str] = Field(None, description="Specific requirements/qualifications text if separated")
    extracted_skills_raw: List[str] = Field(default_factory=list, description="List of raw skill tags found on the job card/page")
    
    # Salary information if disclosed
    salary_min: Optional[float] = Field(None, description="Minimum salary if disclosed")
    salary_max: Optional[float] = Field(None, description="Maximum salary if disclosed")
    salary_currency: Optional[str] = Field("EGP", description="Salary currency")
    
    # Metadata
    source_url: str = Field(..., description="Original job posting URL (Unique Key)")
    source_platform: str = Field("wuzzuf", description="e.g. 'wuzzuf', 'linkedin', 'remotive'")
    posted_at_raw: Optional[str] = Field(None, description="Raw posted date text, e.g. '2 hours ago'")
    scraped_at: datetime = Field(default_factory=datetime.utcnow, description="Scraping timestamp")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional custom platform metadata")

    def model_post_init(self, __context: Any) -> None:
        """Generate deterministic ID from source_url if not provided"""
        if not self.id and self.source_url:
            self.id = hashlib.md5(self.source_url.strip().lower().encode("utf-8")).hexdigest()
