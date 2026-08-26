"""
Wuzzuf Playwright Scraper Adapter for MAJRA
Uses headless Chromium to bypass Cloudflare Turnstile and extract structured Egyptian job listings.
"""

import time
import re
import urllib.parse
import logging
from typing import List, Dict, Any, Optional
from bs4 import BeautifulSoup

from app.scraper.schemas import ScrapedJobPost

logger = logging.getLogger("MAJRA_Wuzzuf_Playwright")


class WuzzufPlaywrightAdapter:
    """
    Playwright-powered Wuzzuf Adapter to extract real Egyptian tech jobs.
    """

    BASE_URL = "https://wuzzuf.net"

    def __init__(self, headless: bool = True):
        self.headless = headless

    def _clean_text(self, text: Optional[str]) -> str:
        if not text:
            return ""
        return re.sub(r"\s+", " ", text).strip()

    def search_jobs_with_browser(
        self,
        query: str,
        max_pages: int = 1
    ) -> List[ScrapedJobPost]:
        """
        Launches browser with stealth settings, extracts job cards, and converts them to ScrapedJobPost.
        """
        from playwright.sync_api import sync_playwright

        results: List[ScrapedJobPost] = []
        logger.info(f"Starting Wuzzuf Playwright scraper: query='{query}', max_pages={max_pages}")

        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=self.headless,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-setuid-sandbox"
                ]
            )
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                viewport={"width": 1920, "height": 1080},
                locale="en-US"
            )
            page = context.new_page()
            page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => false});")

            for p_num in range(max_pages):
                encoded_q = urllib.parse.quote_plus(query)
                search_url = f"{self.BASE_URL}/search/jobs/?a=hpb&q={encoded_q}&start={p_num}"
                logger.info(f"Navigating to Wuzzuf: {search_url}")

                try:
                    page.goto(search_url, timeout=45000)
                    
                    # Wait for redirect/Cloudflare to settle
                    page.wait_for_timeout(6000)
                    try:
                        page.wait_for_load_state("networkidle", timeout=8000)
                    except Exception:
                        pass

                    # Safely retrieve page content
                    html_content = page.content()
                    soup = BeautifulSoup(html_content, "html.parser")

                    # Find all <h2> tags with job links
                    h2_elements = soup.find_all("h2")
                    logger.info(f"Page {p_num + 1}: Found {len(h2_elements)} job headings.")

                    for h2 in h2_elements:
                        link_tag = h2.find("a")
                        if not link_tag:
                            continue

                        title = self._clean_text(link_tag.get_text())
                        href = link_tag.get("href", "")
                        if not href or "/jobs/p/" not in href:
                            continue

                        job_url = href if href.startswith("http") else urllib.parse.urljoin(self.BASE_URL, href)

                        # Find parent card container
                        card_container = h2.find_parent("div")
                        if card_container and card_container.find_parent("div"):
                            parent_div = card_container.find_parent("div")
                        else:
                            parent_div = card_container

                        card_text = parent_div.get_text() if parent_div else ""

                        # Extract Company Name
                        company_tag = parent_div.find("a", href=re.compile(r"/jobs/careers/")) if parent_div else None
                        if company_tag:
                            company_name = self._clean_text(company_tag.get_text()).rstrip("-").strip()
                        else:
                            company_name = "Confidential Company"

                        # Extract Location
                        location_span = parent_div.find("span", class_=re.compile(r"location|css-5wys0k")) if parent_div else None
                        location = self._clean_text(location_span.get_text()) if location_span else "Cairo, Egypt"

                        # Extract Skills
                        skills = []
                        if parent_div:
                            for a_tag in parent_div.find_all("a", href=re.compile(r"/a/")):
                                s = self._clean_text(a_tag.get_text())
                                if s and s not in skills:
                                    skills.append(s)

                        is_remote = "remote" in location.lower() or "remote" in card_text.lower()
                        seniority = "Junior / Entry" if "entry" in card_text.lower() or "junior" in card_text.lower() else "Experienced"
                        employment_type = "Full Time" if "full time" in card_text.lower() else "Contract / Other"

                        desc = f"Job Title: {title} at {company_name}. Location: {location}. Extracted Market Tags: {', '.join(skills)}."

                        try:
                            job_post = ScrapedJobPost(
                                title=title,
                                company_name=company_name,
                                location_raw=location,
                                is_remote=is_remote,
                                employment_type=employment_type,
                                seniority_level=seniority,
                                extracted_skills_raw=skills,
                                description_raw=desc,
                                source_url=job_url,
                                source_platform="wuzzuf",
                                posted_at_raw="Recently"
                            )
                            results.append(job_post)
                        except Exception as e:
                            logger.debug(f"Error creating ScrapedJobPost: {e}")

                except Exception as e:
                    logger.error(f"Error scraping Wuzzuf page: {e}")

            browser.close()

        logger.info(f"Wuzzuf scraping complete. Total valid jobs collected: {len(results)}")
        return results
