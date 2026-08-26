"""
MAJRA Base Scraper
Handles resilient HTTP requests, polite rate-limiting, randomized headers, and logging.
"""

import time
import random
import logging
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, List
import urllib.request
import urllib.error
import json
import ssl

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("MAJRA_Scraper")

# Pool of realistic desktop browser User-Agents
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
]


class BaseScraper(ABC):
    """
    Abstract Base Scraper that all platform adapters inherit from.
    """

    def __init__(
        self,
        platform_name: str,
        base_url: str,
        min_delay: float = 1.5,
        max_delay: float = 3.5,
        max_retries: int = 3
    ):
        self.platform_name = platform_name
        self.base_url = base_url
        self.min_delay = min_delay
        self.max_delay = max_delay
        self.max_retries = max_retries
        self.session_headers = self._get_default_headers()

    def _get_default_headers(self) -> Dict[str, str]:
        """Returns browser-like headers to prevent 403 Forbidden errors"""
        return {
            "User-Agent": random.choice(USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Referer": "https://www.google.com/",
            "Sec-Ch-Ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": '"Windows"',
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "cross-site",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
        }

    def polite_delay(self) -> None:
        """Sleeps for a randomized duration to avoid overwhelming target servers"""
        delay = random.uniform(self.min_delay, self.max_delay)
        logger.debug(f"Polite delay: sleeping for {delay:.2f}s...")
        time.sleep(delay)

    def fetch_html(self, url: str) -> Optional[str]:
        """
        Fetches raw HTML from a URL with retry logic and polite headers.
        Uses standard urllib to guarantee zero external dependency issues out-of-the-box.
        """
        for attempt in range(1, self.max_retries + 1):
            try:
                headers = self._get_default_headers()
                req = urllib.request.Request(url, headers=headers)
                
                # Context to ignore SSL verification issues if any
                ctx = ssl.create_default_context()
                ctx.check_hostname = False
                ctx.verify_mode = ssl.CERT_NONE

                with urllib.request.urlopen(req, context=ctx, timeout=15) as response:
                    # Handle encoding
                    charset = response.headers.get_content_charset() or "utf-8"
                    
                    # Decompress if gzipped
                    if response.headers.get("Content-Encoding") == "gzip":
                        import gzip
                        data = gzip.decompress(response.read())
                    else:
                        data = response.read()
                    
                    return data.decode(charset, errors="ignore")

            except urllib.error.HTTPError as e:
                logger.warning(f"HTTPError {e.code} for URL {url} (Attempt {attempt}/{self.max_retries})")
                if e.code == 429:
                    # Rate limited: wait longer
                    time.sleep(5 * attempt)
                elif e.code == 404:
                    logger.error(f"Job posting not found (404): {url}")
                    return None
            except Exception as e:
                logger.warning(f"Error fetching {url}: {e} (Attempt {attempt}/{self.max_retries})")
                time.sleep(2 * attempt)

        logger.error(f"Failed to fetch HTML after {self.max_retries} attempts: {url}")
        return None

    @abstractmethod
    def search_jobs(self, query: str, location: str = "Egypt", max_pages: int = 1) -> List[Any]:
        """Must be implemented by each platform adapter"""
        pass
