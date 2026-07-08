"""Fetch and cite the 16 host-venue facts. Reproducible, no hand-typed values.

Run with ``python -m coast_to_cup.fetch_venues`` (network required). Writes
``data/raw/venues.json`` plus ``data/raw/venues.provenance.json``.

Per field: name / host city / country / roof are cited to Wikipedia's 2026 FIFA
World Cup venues table; coordinates, altitude, timezone and the June/July heat
normal come from the shared ``geofetch`` sources.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from . import geofetch

RAW = Path(__file__).resolve().parents[2] / "data" / "raw"

WIKIPEDIA = "Wikipedia, 2026 FIFA World Cup (Venues), https://en.wikipedia.org/wiki/2026_FIFA_World_Cup"

# Identity + roof cited to Wikipedia; everything else is fetched.
VENUE_SEED = [
    {"id": "atlanta", "name": "Mercedes-Benz Stadium", "query": "Mercedes-Benz Stadium", "city": "Atlanta", "country": "USA", "roof": "retractable"},
    {"id": "boston", "name": "Gillette Stadium", "query": "Gillette Stadium", "city": "Foxborough", "country": "USA", "roof": "open"},
    {"id": "dallas", "name": "AT&T Stadium", "query": "AT&T Stadium", "city": "Arlington Texas", "country": "USA", "roof": "retractable"},
    {"id": "houston", "name": "NRG Stadium", "query": "NRG Stadium", "city": "Houston", "country": "USA", "roof": "retractable"},
    {"id": "kansas_city", "name": "Arrowhead Stadium", "query": "Arrowhead Stadium", "city": "Kansas City", "country": "USA", "roof": "open"},
    {"id": "los_angeles", "name": "SoFi Stadium", "query": "SoFi Stadium", "city": "Inglewood", "country": "USA", "roof": "retractable"},
    {"id": "miami", "name": "Hard Rock Stadium", "query": "Hard Rock Stadium", "city": "Miami Gardens", "country": "USA", "roof": "open"},
    {"id": "new_york_new_jersey", "name": "MetLife Stadium", "query": "MetLife Stadium", "city": "East Rutherford", "country": "USA", "roof": "open"},
    {"id": "philadelphia", "name": "Lincoln Financial Field", "query": "Lincoln Financial Field", "city": "Philadelphia", "country": "USA", "roof": "open"},
    {"id": "san_francisco_bay_area", "name": "Levi's Stadium", "query": "Levi's Stadium", "city": "Santa Clara", "country": "USA", "roof": "open"},
    {"id": "seattle", "name": "Lumen Field", "query": "Lumen Field", "city": "Seattle", "country": "USA", "roof": "open"},
    {"id": "guadalajara", "name": "Estadio Akron", "query": "Estadio Akron", "city": "Zapopan", "country": "MEX", "roof": "open"},
    {"id": "mexico_city", "name": "Estadio Azteca", "query": "Estadio Azteca", "city": "Mexico City", "country": "MEX", "roof": "open"},
    {"id": "monterrey", "name": "Estadio BBVA", "query": "Estadio BBVA", "city": "Guadalupe Nuevo Leon", "country": "MEX", "roof": "open"},
    {"id": "toronto", "name": "BMO Field", "query": "BMO Field", "city": "Toronto", "country": "CAN", "roof": "open"},
    {"id": "vancouver", "name": "BC Place", "query": "BC Place", "city": "Vancouver", "country": "CAN", "roof": "retractable"},
]


def main() -> None:
    venues: list[dict] = []
    provenance: list[dict] = []
    for seed in VENUE_SEED:
        geo = geofetch.geocode(f"{seed['query']}, {seed['city']}")
        lat, lon = geo["lat"], geo["lon"]
        altitude = geofetch.elevation(lat, lon)
        clim = geofetch.climate(lat, lon)

        venues.append({
            "id": seed["id"], "name": seed["name"], "city": seed["city"], "country": seed["country"],
            "lat": lat, "lon": lon, "tz": clim["tz"], "altitude_m": altitude,
            "roof": seed["roof"], "heat_high_c": clim["heat_high_c"],
        })
        provenance.append({
            "id": seed["id"],
            "geocode": {k: geo[k] for k in ("display_name", "osm_type", "osm_id", "licence")},
            "heat_sample_days": clim["sample_days"],
        })
        print(f"{seed['id']:24s} ({lat:8.4f},{lon:9.4f})  {altitude:6.0f} m  {clim['tz']:20s}  heat {clim['heat_high_c']}C")

    RAW.mkdir(parents=True, exist_ok=True)
    (RAW / "venues.json").write_text(json.dumps(venues, indent=2) + "\n", encoding="utf-8")
    (RAW / "venues.provenance.json").write_text(
        json.dumps({
            "fetched_at": datetime.now(timezone.utc).isoformat(),
            "sources": {"identity_roof": WIKIPEDIA, **geofetch.SOURCES},
            "venues": provenance,
        }, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"\nWrote {len(venues)} venues to {RAW / 'venues.json'}")


if __name__ == "__main__":
    main()
