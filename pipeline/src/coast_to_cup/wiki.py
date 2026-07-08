"""Cached, rate-limited fetch of raw Wikipedia wikitext via the MediaWiki API.

Fetchers parse raw wikitext deterministically rather than trusting a prose or
LLM summary, which is unreliable for structured tournament data. Pages are
cached under ``data/raw/_cache`` so re-runs are offline and polite to the API.
"""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://en.wikipedia.org/w/api.php"
UA = "coast-to-cup/0.1 (personal World Cup data-viz; contact: local dev)"
CACHE = Path(__file__).resolve().parents[2] / "data" / "raw" / "_cache"


def wikitext(page: str, fresh: bool = False) -> str:
    """Wikitext for a page. ``fresh=True`` refetches pages that change during the tournament."""
    CACHE.mkdir(parents=True, exist_ok=True)
    cache_file = CACHE / (page.replace(" ", "_") + ".wikitext")
    if not fresh and cache_file.exists():
        return cache_file.read_text(encoding="utf-8")
    q = urllib.parse.urlencode(
        {"action": "parse", "page": page, "format": "json", "prop": "wikitext", "formatversion": "2"}
    )
    url = f"{API}?{q}"
    for attempt in range(5):
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = json.load(r)
            if "error" in data:
                raise RuntimeError(data["error"].get("info"))
            wt = data["parse"]["wikitext"]
            cache_file.write_text(wt, encoding="utf-8")
            time.sleep(1.5)  # be polite
            return wt
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 4:
                time.sleep(5 * (attempt + 1))
                continue
            raise
        except (urllib.error.URLError, TimeoutError):
            # transient network errors happen on unattended cron runs
            if attempt < 4:
                time.sleep(5 * (attempt + 1))
                continue
            raise
    raise RuntimeError(f"failed to fetch {page}")
