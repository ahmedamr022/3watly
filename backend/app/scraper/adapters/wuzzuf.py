"""
Wuzzuf Platform Adapter for MAJRA
Scrapes tech job listings and detailed descriptions from wuzzuf.net (Egypt).
"""

import re
import urllib.parse
from typing import List, Optional, Dict, Any
import logging

try:
    from bs4 import BeautifulSoup
    HAS_BS4 = True
except ImportError:
    HAS_BS4 = False

from app.scraper.base import BaseScraper, logger
from app.scraper.schemas import ScrapedJobPost


class WuzzufAdapter(BaseScraper):
    """
    Adapter specifically designed to scrape Egyptian Tech Jobs from Wuzzuf.net
    """

    def __init__(self, min_delay: float = 1.5, max_delay: float = 3.0):
        super().__init__(
            platform_name="wuzzuf",
            base_url="https://wuzzuf.net",
            min_delay=min_delay,
            max_delay=max_delay
        )

    def _clean_text(self, text: Optional[str]) -> str:
        """Helper to strip whitespace and linebreaks"""
        if not text:
            return ""
        # Remove extra whitespace and newlines
        return re.sub(r"\s+", " ", text).strip()

    def _parse_job_card(self, card_elem) -> Optional[Dict[str, Any]]:
        """Parses a single job card element using BeautifulSoup"""
        try:
            # 1. Job Title & Link
            title_anchor = card_elem.find("a", href=re.compile(r"/jobs/p/"))
            if not title_anchor:
                # Fallback to search any h2 a
                h2 = card_elem.find("h2")
                title_anchor = h2.find("a") if h2 else None

            if not title_anchor:
                return None

            title = self._clean_text(title_anchor.get_text())
            job_path = title_anchor.get("href", "")
            if job_path.startswith("http"):
                job_url = job_path
            else:
                job_url = urllib.parse.urljoin(self.base_url, job_path)

            # 2. Company Name
            company_elem = card_elem.find("a", href=re.compile(r"/jobs/careers/"))
            if not company_elem:
                # Fallback: look for company text in div
                company_div = card_elem.find("div", class_=re.compile(r"company|css-d7j1kk"))
                company_name = self._clean_text(company_div.get_text()) if company_div else "Confidential Company"
            else:
                company_name = self._clean_text(company_elem.get_text())

            # Clean trailing dashes or location artifacts in company name
            company_name = re.sub(r"-\s*$", "", company_name).strip()

            # 3. Location
            location_span = card_elem.find("span", class_=re.compile(r"location|css-5wys0k"))
            location = self._clean_text(location_span.get_text()) if location_span else "Cairo, Egypt"

            # 4. Badges (Employment type, Seniority)
            badges = []
            badge_elems = card_elem.find_all("span", class_=re.compile(r"css-1ve4b75|badge"))
            for b in badge_elems:
                b_text = self._clean_text(b.get_text())
                if b_text:
                    badges.append(b_text)

            employment_type = badges[0] if len(badges) > 0 else "Full Time"
            seniority = badges[1] if len(badges) > 1 else None

            # 5. Skills Tags on Card
            skills = []
            skill_links = card_elem.find_all("a", href=re.compile(r"/a/"))
            for s in skill_links:
                s_text = self._clean_text(s.get_text())
                if s_text and s_text not in skills:
                    skills.append(s_text)

            # 6. Posted At
            posted_div = card_elem.find("div", string=re.compile(r"ago|hour|day|minute", re.IGNORECASE))
            posted_at = self._clean_text(posted_div.get_text()) if posted_div else "Recently"

            # Determine remote flag
            is_remote = "remote" in location.lower() or any("remote" in b.lower() for b in badges)

            return {
                "title": title,
                "company_name": company_name,
                "location_raw": location,
                "is_remote": is_remote,
                "employment_type": employment_type,
                "seniority_level": seniority,
                "extracted_skills_raw": skills,
                "source_url": job_url,
                "posted_at_raw": posted_at,
            }

        except Exception as e:
            logger.debug(f"Failed to parse job card: {e}")
            return None

    def fetch_job_details(self, job_url: str) -> Dict[str, Any]:
        """
        Visits the individual job details page to extract the full description,
        requirements, and salary if disclosed.
        """
        self.polite_delay()
        html = self.fetch_html(job_url)
        if not html or not HAS_BS4:
            return {"description_raw": "Full description not fetched.", "requirements_raw": None}

        soup = BeautifulSoup(html, "html.parser")

        # 1. Job Description Section
        desc_section = (
            soup.find("section", class_=re.compile(r"description|css-ghicub")) or
            soup.find("div", class_=re.compile(r"description|css-1uobp1k")) or
            soup.find("div", itemprop="description")
        )
        description_text = self._clean_text(desc_section.get_text()) if desc_section else ""

        # 2. Job Requirements Section
        req_section = (
            soup.find("section", class_=re.compile(r"requirements|css-1t5f04z")) or
            soup.find("div", class_=re.compile(r"requirements"))
        )
        requirements_text = self._clean_text(req_section.get_text()) if req_section else None

        # 3. Salary extraction if present
        salary_min = None
        salary_max = None
        salary_span = soup.find("span", string=re.compile(r"EGP|USD|\$|salary", re.IGNORECASE))
        if salary_span:
            s_text = salary_span.get_text()
            # Simple number extraction e.g. "15,000 - 20,000"
            matches = re.findall(r"(\d+[\d,]*)", s_text)
            if len(matches) >= 2:
                try:
                    salary_min = float(matches[0].replace(",", ""))
                    salary_max = float(matches[1].replace(",", ""))
                except ValueError:
                    pass

        return {
            "description_raw": description_text or "Detailed technical job description.",
            "requirements_raw": requirements_text,
            "salary_min": salary_min,
            "salary_max": salary_max
        }

    def search_jobs(
        self,
        query: str,
        location: str = "Egypt",
        max_pages: int = 1,
        fetch_full_details: bool = False
    ) -> List[ScrapedJobPost]:
        """
        Main function to search Wuzzuf by keyword and return standardized JobPost objects.
        """
        logger.info(f"Searching Wuzzuf for: '{query}' in '{location}' (Max pages: {max_pages})")
        results: List[ScrapedJobPost] = []

        for page in range(max_pages):
            # Wuzzuf search URL with pagination
            encoded_query = urllib.parse.quote_plus(query)
            search_url = f"{self.base_url}/search/jobs/?a=hpb&q={encoded_query}&start={page}"
            
            logger.info(f"Fetching search results page {page + 1}: {search_url}")
            html = self.fetch_html(search_url)

            if not html:
                logger.warning(f"Could not load page {page + 1}, stopping.")
                break

            if not HAS_BS4:
                logger.error("BeautifulSoup4 is required for parsing. Please install beautifulsoup4.")
                break

            soup = BeautifulSoup(html, "html.parser")
            
            # Find job cards container (Wuzzuf usually renders cards in div containers with class css-1gatmva)
            job_cards = soup.find_all("div", class_=re.compile(r"css-1gatmva|job-card|css-pkv5jc"))
            if not job_cards:
                # Alternative fallback: search by any block containing /jobs/p/ link
                anchors = soup.find_all("a", href=re.compile(r"/jobs/p/"))
                job_cards = [a.find_parent("div") for a in anchors if a.find_parent("div")]

            logger.info(f"Found {len(job_cards)} job cards on page {page + 1}")

            if not job_cards:
                break

            for card in job_cards:
                card_data = self._parse_job_card(card)
                if not card_data:
                    continue

                # Optionally fetch full details from the job page
                if fetch_full_details:
                    logger.info(f"Visiting job details: {card_data['title']} at {card_data['company_name']}")
                    details = self.fetch_job_details(card_data["source_url"])
                    card_data.update(details)
                else:
                    if "description_raw" not in card_data or not card_data["description_raw"]:
                        card_data["description_raw"] = f"Job listing for {card_data['title']} at {card_data['company_name']}. Required skills: {', '.join(card_data['extracted_skills_raw'])}."

                # Create standardized Pydantic model
                try:
                    job_post = ScrapedJobPost(
                        title=card_data["title"],
                        company_name=card_data["company_name"],
                        location_raw=card_data["location_raw"],
                        is_remote=card_data["is_remote"],
                        employment_type=card_data.get("employment_type"),
                        seniority_level=card_data.get("seniority_level"),
                        extracted_skills_raw=card_data.get("extracted_skills_raw", []),
                        description_raw=card_data.get("description_raw", ""),
                        requirements_raw=card_data.get("requirements_raw"),
                        source_url=card_data["source_url"],
                        source_platform="wuzzuf",
                        posted_at_raw=card_data.get("posted_at_raw")
                    )
                    results.append(job_post)
                except Exception as e:
                    logger.warning(f"Failed to validate job schema: {e}")

            self.polite_delay()

        logger.info(f"Completed Wuzzuf scraping for '{query}'. Total jobs retrieved: {len(results)}")
        return results
