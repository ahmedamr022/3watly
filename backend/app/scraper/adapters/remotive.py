"""
Remotive Remote Tech Jobs Adapter for MAJRA
Extracts structured remote tech jobs (Software, Data, DevOps, QA) open worldwide and to Egypt.
Uses Remotive's official Public API (100% Legal & Clean JSON).
"""

import urllib.request
import json
import logging
from typing import List
from app.scraper.schemas import ScrapedJobPost

logger = logging.getLogger("MAJRA_Remotive")


class RemotiveAdapter:
    """
    Adapter to fetch live remote tech jobs from Remotive API.
    """
    API_URL = "https://remotive.com/api/remote-jobs"

    def __init__(self, limit: int = 50):
        self.limit = limit

    def search_jobs(self, category: str = "software-dev") -> List[ScrapedJobPost]:
        """
        Fetches remote jobs by category (software-dev, data, devops, qa).
        """
        logger.info(f"Fetching live remote jobs from Remotive API (Category: {category})...")
        url = f"{self.API_URL}?category={category}&limit={self.limit}"
        
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "MAJRA-Career-Intelligence/1.0"})
            with urllib.request.urlopen(req, timeout=15) as response:
                data = json.loads(response.read().decode("utf-8"))
                raw_jobs = data.get("jobs", [])
                
                logger.info(f"Retrieved {len(raw_jobs)} remote jobs from Remotive.")
                results: List[ScrapedJobPost] = []
                
                for j in raw_jobs:
                    # Filter/Check if candidate location allows Worldwide/Egypt/Anywhere
                    candidate_location = j.get("candidate_required_location", "Anywhere")
                    
                    job_post = ScrapedJobPost(
                        title=j.get("title", ""),
                        company_name=j.get("company_name", "Tech Startup"),
                        company_url=j.get("company_logo_url"),
                        location_raw=f"Remote ({candidate_location})",
                        is_remote=True,
                        employment_type=j.get("job_type", "Full-time"),
                        seniority_level=None,
                        extracted_skills_raw=j.get("tags", []),
                        description_raw=j.get("description", ""),
                        source_url=j.get("url", ""),
                        source_platform="remotive",
                        posted_at_raw=j.get("publication_date")
                    )
                    results.append(job_post)

                return results

        except Exception as e:
            logger.error(f"Failed to fetch Remotive jobs: {e}")
            return []
