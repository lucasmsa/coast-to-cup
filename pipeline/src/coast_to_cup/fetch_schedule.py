"""Fetch the real group draw and 72-match schedule from Wikipedia, deterministically.

Run with ``python -m coast_to_cup.fetch_schedule`` (network required). Writes:

- ``data/raw/teams.json``               48 teams (id, name, code, group, confederation, colour)
- ``data/raw/matches.json``             72 group matches (teams, venue, kickoff UTC)
- ``data/raw/schedule.provenance.json`` source + timestamp

Source: the per-group Wikipedia pages "2026 FIFA World Cup Group A".."Group L",
parsed from the raw match templates (team codes, date, kickoff time with its
explicit UTC offset, and stadium). Pages are cached under ``data/raw/_cache`` so
re-runs do not re-hit the API. Match results are intentionally ignored; only the
fixtures (who, where, when) are used.
"""

from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime, timedelta, timezone
from pathlib import Path

from .reference import COLORS, NATIONS
from .wiki import wikitext

RAW = Path(__file__).resolve().parents[2] / "data" / "raw"
GROUPS = "ABCDEFGHIJKL"

SOURCE = "Wikipedia, 2026 FIFA World Cup Group A..L (match templates), https://en.wikipedia.org/wiki/2026_FIFA_World_Cup"

RE_MATCH = re.compile(
    r"\|date=\{\{Start date\|(\d+)\|(\d+)\|(\d+)\}\}"  # 1-3 y m d
    r".*?\|time=([^\n]+)"                              # 4 time line
    r".*?\|team1=\{\{[^}]*\|([A-Z]{3})\}\}"            # 5 team1 code
    r".*?\|score=\{\{score link\|[^|]*\|([^}]+)\}\}"   # 6 score or "Match NN"
    r".*?\|team2=\{\{[^}]*\|([A-Z]{3})\}\}"            # 7 team2 code
    r".*?\|stadium=\[\[([^\]|]+)",                     # 8 stadium
    re.DOTALL,
)
RE_SCORE = re.compile(r"\s*(\d+)\s*[–—-]\s*(\d+)")
RE_TIME = re.compile(r"(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)?.*?UTC[−–—-](\d{1,2}):?(\d{2})?")

STADIUM_KEYWORDS = [
    ("Azteca", "mexico_city"), ("Akron", "guadalajara"), ("BBVA", "monterrey"),
    ("MetLife", "new_york_new_jersey"), ("AT&", "dallas"), ("SoFi", "los_angeles"),
    ("Arrowhead", "kansas_city"), ("Levi", "san_francisco_bay_area"), ("NRG", "houston"),
    ("Lincoln Financial", "philadelphia"), ("Mercedes-Benz", "atlanta"), ("Lumen", "seattle"),
    ("Hard Rock", "miami"), ("Gillette", "boston"), ("BC Place", "vancouver"), ("BMO", "toronto"),
]


def _venue_id(stadium: str) -> str:
    for kw, vid in STADIUM_KEYWORDS:
        if kw.lower() in stadium.lower():
            return vid
    raise RuntimeError(f"unmapped stadium: {stadium!r}")


def _kickoff_utc(y: int, mo: int, d: int, time_str: str) -> str:
    m = RE_TIME.search(time_str.replace("&nbsp;", " "))
    if not m:
        raise RuntimeError(f"unparseable time: {time_str!r}")
    hh, mm, ampm, off_h, off_m = int(m[1]), int(m[2]), m[3], int(m[4]), int(m[5] or 0)
    if ampm == "p.m." and hh != 12:
        hh += 12
    if ampm == "a.m." and hh == 12:
        hh = 0
    local = datetime(y, mo, d, hh, mm)
    # wikitext gives a western-hemisphere offset (UTC-XX:XX), so UTC = local + offset
    utc = (local + timedelta(hours=off_h, minutes=off_m)).replace(tzinfo=timezone.utc)
    return utc.isoformat()


def _color(code: str) -> str:
    if code in COLORS:
        return COLORS[code]
    hue = int(hashlib.md5(code.encode()).hexdigest(), 16) % 360
    return _hsl_to_hex(hue, 0.68, 0.55)


def _hsl_to_hex(h: float, s: float, l: float) -> str:
    c = (1 - abs(2 * l - 1)) * s
    x = c * (1 - abs((h / 60) % 2 - 1))
    m = l - c / 2
    r, g, b = {0: (c, x, 0), 1: (x, c, 0), 2: (0, c, x), 3: (0, x, c), 4: (x, 0, c), 5: (c, 0, x)}[int(h // 60) % 6]
    return "#%02x%02x%02x" % (round((r + m) * 255), round((g + m) * 255), round((b + m) * 255))


def _score(raw: str) -> dict:
    """Parse the score-link payload: a real score if played, else not yet played."""
    m = RE_SCORE.match(raw)
    if not m:
        return {"score_a": None, "score_b": None}
    return {"score_a": int(m[1]), "score_b": int(m[2])}


def parse_matches(group: str, wt: str) -> list[dict]:
    """The six fixtures of one group, ordered by kickoff and numbered 1..6."""
    rows = RE_MATCH.findall(wt)
    if len(rows) != 6:
        raise RuntimeError(f"Group {group}: expected 6 matches, parsed {len(rows)}")
    parsed = sorted(
        (
            {
                "group": group,
                "team_a": c1.lower(),
                "team_b": c2.lower(),
                "venue_id": _venue_id(stad),
                "kickoff_utc": _kickoff_utc(int(y), int(mo), int(d), tstr),
                **_score(score),
            }
            for (y, mo, d, tstr, c1, score, c2, stad) in rows
        ),
        key=lambda p: p["kickoff_utc"],
    )
    return [{"id": f"{group}-{i + 1}", "matchday": i // 2 + 1, **p} for i, p in enumerate(parsed)]


def build_team(code_lower: str, group: str) -> dict:
    code = code_lower.upper()
    name, conf = NATIONS.get(code, (code, "?"))
    return {
        "id": code_lower, "name": name, "code": code,
        "group": group, "confederation": conf, "color": _color(code),
    }


def main() -> None:
    # Fresh fetch: scores fill in as the tournament progresses.
    matches = [
        m
        for g in GROUPS
        for m in parse_matches(g, wikitext(f"2026 FIFA World Cup Group {g}", fresh=True))
    ]
    pairs = {(m["team_a"], m["group"]) for m in matches} | {(m["team_b"], m["group"]) for m in matches}
    teams = sorted(
        (build_team(code, group) for code, group in pairs),
        key=lambda t: (t["group"], t["code"]),
    )

    RAW.mkdir(parents=True, exist_ok=True)
    (RAW / "teams.json").write_text(json.dumps(teams, indent=2) + "\n", encoding="utf-8")
    (RAW / "matches.json").write_text(json.dumps(matches, indent=2) + "\n", encoding="utf-8")
    (RAW / "schedule.provenance.json").write_text(
        json.dumps({"fetched_at": datetime.now(timezone.utc).isoformat(), "source": SOURCE}, indent=2) + "\n",
        encoding="utf-8",
    )

    unknown = sorted({t["code"] for t in teams if t["confederation"] == "?"})
    print(f"teams={len(teams)} matches={len(matches)}")
    if unknown:
        print("UNKNOWN codes (add to reference.NATIONS):", unknown)
    for g in GROUPS:
        print(f"  Group {g}: {', '.join(t['name'] for t in teams if t['group'] == g)}")


if __name__ == "__main__":
    main()
