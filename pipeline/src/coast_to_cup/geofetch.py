"""Cited, cached geocoding and climate lookups used by the data fetchers.

- coordinates : OpenStreetMap Nominatim (ODbL)
- elevation   : Open-Meteo Elevation API
- tz + heat   : Open-Meteo Historical Archive (ERA5); heat_high_c is the mean
                June/July daily max over 2019-2024 (a climate normal)

All responses are cached to ``data/raw/_cache/geocache.json`` so re-runs do not
re-hit the services, and Nominatim is rate-limited to one request per second.
"""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

_CACHE_PATH = Path(__file__).resolve().parents[2] / "data" / "raw" / "_cache" / "geocache.json"
USER_AGENT = "coast-to-cup/0.1 (personal World Cup data-viz project)"
HEAT_START, HEAT_END = "2019-06-01", "2024-07-31"

SOURCES = {
    "coordinates": "OpenStreetMap Nominatim, https://nominatim.openstreetmap.org/ (Data (c) OpenStreetMap contributors, ODbL)",
    "altitude_m": "Open-Meteo Elevation API, https://open-meteo.com/en/docs/elevation-api",
    "tz_heat": "Open-Meteo Historical Archive (ERA5), https://open-meteo.com/en/docs/historical-weather-api; heat_high_c = mean June/July daily max 2019-2024",
}

_cache: dict | None = None


def _store() -> dict:
    global _cache
    if _cache is None:
        _cache = json.loads(_CACHE_PATH.read_text()) if _CACHE_PATH.exists() else {}
    return _cache


def _remember(key: str, value):
    store = _store()
    store[key] = value
    _CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    _CACHE_PATH.write_text(json.dumps(store, indent=2), encoding="utf-8")
    return value


def _get_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def geocode(query: str) -> dict:
    """Resolve a place name to coordinates and provenance (cached)."""
    key = f"geo:{query}"
    if key in _store():
        return _store()[key]
    q = urllib.parse.quote(query)
    res = _get_json(f"https://nominatim.openstreetmap.org/search?q={q}&format=json&limit=1")
    if not res:
        raise RuntimeError(f"Nominatim found nothing for {query!r}")
    hit = res[0]
    time.sleep(1.1)  # Nominatim usage policy
    return _remember(key, {
        "lat": round(float(hit["lat"]), 5),
        "lon": round(float(hit["lon"]), 5),
        "display_name": hit.get("display_name"),
        "osm_type": hit.get("osm_type"),
        "osm_id": hit.get("osm_id"),
        "licence": hit.get("licence"),
    })


def elevation(lat: float, lon: float) -> float:
    key = f"elev:{lat},{lon}"
    if key in _store():
        return _store()[key]
    val = float(_get_json(f"https://api.open-meteo.com/v1/elevation?latitude={lat}&longitude={lon}")["elevation"][0])
    return _remember(key, val)


def climate(lat: float, lon: float) -> dict:
    """IANA timezone and the June/July climate-normal daily-max temperature."""
    key = f"clim:{lat},{lon}"
    if key in _store():
        return _store()[key]
    url = (
        "https://archive-api.open-meteo.com/v1/archive"
        f"?latitude={lat}&longitude={lon}&start_date={HEAT_START}&end_date={HEAT_END}"
        "&daily=temperature_2m_max&timezone=auto"
    )
    data = _get_json(url)
    summer = [
        t for d, t in zip(data["daily"]["time"], data["daily"]["temperature_2m_max"])
        if d[5:7] in ("06", "07") and t is not None
    ]
    return _remember(key, {
        "tz": data["timezone"],
        "heat_high_c": round(sum(summer) / len(summer), 1),
        "sample_days": len(summer),
    })
