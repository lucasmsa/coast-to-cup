"""Domain model and dataset loader.

Five curated fact files in ``data/raw`` feed everything downstream:

- ``venues.json``     the 16 host stadiums
- ``base_camps.json`` one per team (the tournament reference frame)
- ``teams.json``      the 48 teams, their group and brand colour
- ``matches.json``    the 72 group-stage matches

Everything the burden model needs is base-camp-relative, so the base camp is
the anchor: distances, altitude climbs, heat deltas and body-clock offsets are
all measured from where a team chose to stay.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

ROOF_OPEN = "open"
ROOF_FIXED = "fixed"
ROOF_RETRACTABLE = "retractable"


@dataclass(frozen=True)
class Venue:
    id: str
    name: str
    city: str
    country: str
    lat: float
    lon: float
    tz: str
    altitude_m: float
    roof: str
    heat_high_c: float  # typical June/July afternoon high

    @property
    def is_covered(self) -> bool:
        """Fixed or retractable roofs blunt heat (assumed climate-controlled)."""
        return self.roof in (ROOF_FIXED, ROOF_RETRACTABLE)


@dataclass(frozen=True)
class BaseCamp:
    team_id: str
    city: str
    country: str
    lat: float
    lon: float
    tz: str
    altitude_m: float
    heat_high_c: float


@dataclass(frozen=True)
class Team:
    id: str
    name: str
    code: str  # FIFA three-letter code
    group: str  # "A".."L"
    confederation: str
    color: str  # hex, for UI


@dataclass(frozen=True)
class Match:
    id: str
    group: str
    matchday: int
    venue_id: str
    kickoff_utc: str  # ISO-8601, e.g. "2026-06-15T19:00:00+00:00"
    team_a: str
    team_b: str
    score_a: int | None = None  # team_a goals, once played
    score_b: int | None = None  # team_b goals, once played
    stage: str = "group"        # "group", "R32", "R16", "QF", "SF", "3RD", "F"
    pen_a: int | None = None    # penalty-shootout goals, drawn knockout games only
    pen_b: int | None = None

    @property
    def kickoff(self) -> datetime:
        return datetime.fromisoformat(self.kickoff_utc)

    @property
    def played(self) -> bool:
        return self.score_a is not None and self.score_b is not None

    @property
    def winner(self) -> str | None:
        """Winning team id; drawn knockout games are decided on penalties."""
        if not self.played:
            return None
        if self.score_a != self.score_b:
            return self.team_a if self.score_a > self.score_b else self.team_b
        if self.pen_a is not None and self.pen_b is not None and self.pen_a != self.pen_b:
            return self.team_a if self.pen_a > self.pen_b else self.team_b
        return None


@dataclass
class Dataset:
    venues: dict[str, Venue]
    base_camps: dict[str, BaseCamp]
    teams: dict[str, Team]
    matches: dict[str, Match]
    # match id -> kickoff-hour venue weather ({"temp_c", "apparent_c"}), when fetched
    weather: dict[str, dict] = field(default_factory=dict)

    @classmethod
    def load(cls, raw_dir: str | Path) -> "Dataset":
        raw = Path(raw_dir)
        venues = {
            v["id"]: Venue(**v) for v in _read_list(raw / "venues.json")
        }
        base_camps = {
            b["team_id"]: BaseCamp(**b) for b in _read_list(raw / "base_camps.json")
        }
        teams = {t["id"]: Team(**t) for t in _read_list(raw / "teams.json")}
        matches = {
            m["id"]: Match(**m)
            for m in _read_list(raw / "matches.json") + _read_list(raw / "knockout_matches.json")
        }
        weather_path = raw / "match_weather.json"
        weather = json.loads(weather_path.read_text(encoding="utf-8")) if weather_path.exists() else {}
        return cls(venues=venues, base_camps=base_camps, teams=teams, matches=matches, weather=weather)

    def matches_for(self, team_id: str) -> list[Match]:
        out = [m for m in self.matches.values() if team_id in (m.team_a, m.team_b)]
        return sorted(out, key=lambda m: m.kickoff)

    def opponent(self, match: Match, team_id: str) -> str:
        return match.team_b if match.team_a == team_id else match.team_a


def _read_list(path: Path) -> list[dict]:
    """Read a JSON array, tolerating a not-yet-curated (missing) file as empty."""
    if not path.exists():
        return []
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)
