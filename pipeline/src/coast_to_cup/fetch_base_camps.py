"""Fetch the 48 team base camps from Wikipedia, then geocode each, deterministically.

Run with ``python -m coast_to_cup.fetch_base_camps`` (network required). Writes
``data/raw/base_camps.json`` plus ``data/raw/base_camps.provenance.json``.

Source: the "Team base camps" sortable table on the 2026 FIFA World Cup page.
Each row's ``data-sort-value`` encodes ``Country-State-City`` for the stay
location; coordinates, altitude, timezone and the June/July heat normal then
come from the shared ``geofetch`` sources.
"""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

from . import geofetch
from .wiki import wikitext

RAW = Path(__file__).resolve().parents[2] / "data" / "raw"
PAGE = "2026 FIFA World Cup"
SOURCE = f"Wikipedia, {PAGE} (Team base camps table), https://en.wikipedia.org/wiki/2026_FIFA_World_Cup"

RE_CODE = re.compile(r"flagg\|main\|unpe\|([A-Z]{3})")
RE_SORT = re.compile(r'data-sort-value="([^"]+)"')
COUNTRY = {"USA": ("USA", "United States"), "Mexico": ("MEX", "Mexico"), "Canada": ("CAN", "Canada")}


def parse_camps(wt: str) -> list[dict]:
    """Team code plus stay city/region/country for each base-camp row."""
    start = wt.find("===Team base camps===")
    table = wt[start : wt.find("\n|}", start)]
    camps = []
    for row in re.split(r"\n\|-", table):
        code = RE_CODE.search(row)
        sort = RE_SORT.search(row)
        if not (code and sort):
            continue
        parts = sort.group(1).split("-")
        region = parts[1] if len(parts) >= 3 else ""
        city = parts[2] if len(parts) >= 3 else parts[1]
        country_code, country_full = COUNTRY[parts[0]]
        query = f"{city}, {region}, {country_full}" if region else f"{city}, {country_full}"
        camps.append({
            "team_id": code.group(1).lower(),
            "city": city,
            "country": country_code,
            "query": query,
        })
    return camps


def main() -> None:
    camps = parse_camps(wikitext(PAGE))
    if len(camps) != 48:
        raise RuntimeError(f"expected 48 base camps, parsed {len(camps)}")

    base_camps: list[dict] = []
    provenance: list[dict] = []
    for c in camps:
        geo = geofetch.geocode(c["query"])
        lat, lon = geo["lat"], geo["lon"]
        clim = geofetch.climate(lat, lon)
        base_camps.append({
            "team_id": c["team_id"], "city": c["city"], "country": c["country"],
            "lat": lat, "lon": lon, "tz": clim["tz"],
            "altitude_m": geofetch.elevation(lat, lon), "heat_high_c": clim["heat_high_c"],
        })
        provenance.append({"team_id": c["team_id"], "query": c["query"], "geocode": geo["display_name"]})
        print(f"{c['team_id']:5s} {c['city']:22s} {base_camps[-1]['altitude_m']:6.0f} m  {clim['tz']:20s}  heat {clim['heat_high_c']}C")

    RAW.mkdir(parents=True, exist_ok=True)
    (RAW / "base_camps.json").write_text(json.dumps(base_camps, indent=2) + "\n", encoding="utf-8")
    (RAW / "base_camps.provenance.json").write_text(
        json.dumps({
            "fetched_at": datetime.now(timezone.utc).isoformat(),
            "sources": {"base_camp_table": SOURCE, **geofetch.SOURCES},
            "base_camps": provenance,
        }, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"\nWrote {len(base_camps)} base camps to {RAW / 'base_camps.json'}")


if __name__ == "__main__":
    main()
