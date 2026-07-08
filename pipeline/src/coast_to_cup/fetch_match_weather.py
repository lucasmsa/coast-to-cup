"""Fetch the venue temperature at each match's kickoff hour.

Run with ``python -m coast_to_cup.fetch_match_weather`` (network required).
Writes ``data/raw/match_weather.json`` plus provenance.

Source: Open-Meteo's forecast API with an explicit date range, which serves
recorded model data for past days and forecasts for upcoming ones; the whole
tournament window fits. One request per venue covering its match dates, then
each match reads the hour its kickoff falls in. Both dry-bulb and apparent
temperature are recorded; the model uses dry-bulb so the base-camp climate
normal stays a comparable baseline.
"""

from __future__ import annotations

import json
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from .domain import Dataset

RAW = Path(__file__).resolve().parents[2] / "data" / "raw"
API = "https://api.open-meteo.com/v1/forecast"
SOURCE = "Open-Meteo forecast API with date range (recorded past days, forecast upcoming), https://open-meteo.com/en/docs"


def _get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "coast-to-cup/0.1 (personal project)"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def _hourly_temps(lat: float, lon: float, start: str, end: str) -> dict[str, tuple[float, float]]:
    """UTC hour ("2026-06-11T19:00") -> (temperature_2m, apparent_temperature)."""
    query = urllib.parse.urlencode({
        "latitude": lat,
        "longitude": lon,
        "hourly": "temperature_2m,apparent_temperature",
        "start_date": start,
        "end_date": end,
        "timezone": "UTC",
    })
    data = _get_json(f"{API}?{query}")["hourly"]
    return {
        hour: (temp, apparent)
        for hour, temp, apparent in zip(data["time"], data["temperature_2m"], data["apparent_temperature"])
        if temp is not None and apparent is not None
    }


def main() -> None:
    ds = Dataset.load(RAW)
    matches = sorted(ds.matches.values(), key=lambda m: m.kickoff_utc)

    by_venue: dict[str, list] = {}
    for m in matches:
        by_venue.setdefault(m.venue_id, []).append(m)

    weather: dict[str, dict] = {}
    for venue_id, venue_matches in by_venue.items():
        venue = ds.venues[venue_id]
        start = venue_matches[0].kickoff.date().isoformat()
        end = venue_matches[-1].kickoff.date().isoformat()
        temps = _hourly_temps(venue.lat, venue.lon, start, end)
        for m in venue_matches:
            hour_key = m.kickoff.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:00")
            if hour_key not in temps:
                continue
            temp, apparent = temps[hour_key]
            weather[m.id] = {"temp_c": temp, "apparent_c": apparent}
        time.sleep(0.4)

    RAW.mkdir(parents=True, exist_ok=True)
    (RAW / "match_weather.json").write_text(json.dumps(weather, indent=2) + "\n", encoding="utf-8")
    (RAW / "match_weather.provenance.json").write_text(
        json.dumps({"fetched_at": datetime.now(timezone.utc).isoformat(), "source": SOURCE}, indent=2) + "\n",
        encoding="utf-8",
    )
    missing = [m.id for m in matches if m.id not in weather]
    print(f"match weather: {len(weather)}/{len(matches)} matches")
    if missing:
        print("missing (fall back to climate normal):", missing)


if __name__ == "__main__":
    main()
