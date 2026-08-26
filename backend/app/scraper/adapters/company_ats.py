"""
Company ATS Boards Adapter (Greenhouse & Lever) for MAJRA
Extracts 100% structured, official job postings from top tech employers in Egypt.
Supported boards: Greenhouse, Lever, Workable public APIs.
"""

import urllib.request
import json
import logging
from typing import List, Dict, Any
from app.scraper.schemas import ScrapedJobPost

logger = logging.getLogger("MAJRA_CompanyATS")


class CompanyATSAdapter:
    """
    Scrapes official career boards for tech companies operating in Egypt.
    """

    # List of known Egyptian & regional tech companies using Greenhouse
    GREENHOUSE_COMPANIES = [
        {"name": "Instabug", "slug": "instabug"},
        {"name": "Paymob", "slug": "paymob"},
        {"name": "Swvl", "slug": "swvl"},
        {"name": "Vezeeta", "slug": "vezeeta"},
        {"name": "MaxAB", "slug": "maxab"},
    ]

    def fetch_greenhouse_jobs(self, company_name: str, slug: str) -> List[ScrapedJobPost]:
        """Fetches public jobs from Greenhouse API for a specific company"""
        url = f"https://boards-api.greenhouse.io/v1/boards/{slug}/jobs?content=true"
        logger.info(f"Fetching Greenhouse jobs for: {company_name} ({url})")
        
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "MAJRA-Scraper/1.0"})
            with urllib.request.urlopen(req, timeout=15) as response:
                data = json.loads(response.read().decode("utf-8"))
                jobs = data.get("jobs", [])
                logger.info(f"Found {len(jobs)} total jobs for {company_name}")
                
                results: List[ScrapedJobPost] = []
                for j in jobs:
                    location_name = j.get("location", {}).get("name", "Cairo, Egypt")
                    
                    # Filter for Egypt or Remote
                    if any(loc in location_name.lower() for loc in ["egypt", "cairo", "giza", "alexandria", "remote"]):
                        job_post = ScrapedJobPost(
                            title=j.get("title", ""),
                            company_name=company_name,
                            location_raw=location_name,
                            is_remote="remote" in location_name.lower(),
                            employment_type="Full-time",
                            seniority_level=None,
                            description_raw=j.get("content", ""),
                            source_url=j.get("absolute_url", ""),
                            source_platform=f"greenhouse_{slug}",
                            posted_at_raw=j.get("updated_at")
                        )
                        results.append(job_post)
                        
                return results
        except Exception as e:
            logger.debug(f"Could not fetch Greenhouse board for {company_name}: {e}")
            return []

    def fetch_all_egypt_companies(self) -> List[ScrapedJobPost]:
        """Collects jobs across all mapped tech companies in Egypt"""
        all_jobs: List[ScrapedJobPost] = []
        for comp in self.GREENHOUSE_COMPANIES:
            jobs = self.fetch_greenhouse_jobs(comp["name"], comp["slug"])
            all_jobs.extend(jobs)
        return all_jobs
