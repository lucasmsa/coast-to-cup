"""Fetch the knockout-stage matches from Wikipedia, deterministically.

Run with ``python -m coast_to_cup.fetch_knockout`` (network required). Writes
``data/raw/knockout_matches.json`` plus ``data/raw/knockout.provenance.json``.

Sources: the "2026 FIFA World Cup round of 32" page and the round sections of
"2026 FIFA World Cup knockout stage". Pages are fetched fresh on every run
because results fill in as the tournament progresses. Match blocks whose teams
are still placeholders ("Winner Match 83") are skipped and picked up on a later
run. Drawn knockout games carry the penalty-shootout score so the winner is known.
"""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

from .fetch_schedule import RE_SCORE, _kickoff_utc, _venue_id
from .wiki import wikitext

RAW = Path(__file__).resolve().parents[2] / "data" / "raw"

R32_PAGE = "2026 FIFA World Cup round of 32"
KO_PAGE = "2026 FIFA World Cup knockout stage"
SOURCE = f"Wikipedia, {R32_PAGE} and {KO_PAGE} (match templates), https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage"

# Knockout-stage page section heading -> stage code.
SECTION_STAGES = [
    (r"==\s*Round of 16\s*==", "R16"),
    (r"==\s*Quarter-?finals?\s*==", "QF"),
    (r"==\s*Semi-?finals?\s*==", "SF"),
    # Wikipedia titles it "Match for third place", so match the phrase anywhere in
    # the heading, not just at the start. Single line only (no = or newline inside).
    (r"==[^=\n]*(?:[Tt]hird[ -]place|[Bb]ronze)[^=\n]*==", "3RD"),
    (r"==\s*Final\s*==", "F"),
]

RE_DATE = re.compile(r"^\|(\d+)\|(\d+)\|(\d+)\}\}")
RE_TIME_LINE = re.compile(r"\|time=([^\n]+)")
RE_TEAM1 = re.compile(r"\|team1=\{\{[^}]*\|([A-Z]{3})\}\}")
RE_TEAM2 = re.compile(r"\|team2=\{\{[^}]*\|([A-Z]{3})\}\}")
RE_SCORE_LINK = re.compile(r"\|score=\{\{score link\|[^|]*\|([^}]+)\}\}")
RE_STADIUM = re.compile(r"\|stadium=\[\[([^\]|]+)")
RE_PENALTY = re.compile(r"\|penaltyscore=(\d+)\s*[–—-]\s*(\d+)")


def parse_stage(stage: str, section: str) -> list[dict]:
    """Match dicts for one round. Blocks without two resolved team codes are skipped."""
    parsed = []
    # One chunk per match block, so a placeholder block cannot bleed into the next.
    for chunk in section.split("|date={{Start date")[1:]:
        date = RE_DATE.match(chunk)
        time_line = RE_TIME_LINE.search(chunk)
        team1 = RE_TEAM1.search(chunk)
        team2 = RE_TEAM2.search(chunk)
        stadium = RE_STADIUM.search(chunk)
        if not (date and time_line and team1 and team2 and stadium):
            continue

        score_link = RE_SCORE_LINK.search(chunk)
        score = RE_SCORE.match(score_link.group(1)) if score_link else None
        pens = RE_PENALTY.search(chunk)
        y, mo, d = (int(g) for g in date.groups())
        parsed.append({
            "stage": stage,
            "team_a": team1.group(1).lower(),
            "team_b": team2.group(1).lower(),
            "venue_id": _venue_id(stadium.group(1)),
            "kickoff_utc": _kickoff_utc(y, mo, d, time_line.group(1)),
            "score_a": int(score[1]) if score else None,
            "score_b": int(score[2]) if score else None,
            "pen_a": int(pens[1]) if pens else None,
            "pen_b": int(pens[2]) if pens else None,
        })

    parsed.sort(key=lambda p: p["kickoff_utc"])
    return [
        {"id": f"{stage}-{i + 1}", "group": stage, "matchday": i + 1, **p}
        for i, p in enumerate(parsed)
    ]


def split_ko_sections(ko: str) -> list[tuple[str, str]]:
    """(stage, wikitext) for each knockout heading, each section running to the
    next detected heading. Pure text, so it is unit-testable without the network."""
    headings = [(m.start(), stage) for pat, stage in SECTION_STAGES for m in re.finditer(pat, ko)]
    headings.sort()
    out = []
    for i, (start, stage) in enumerate(headings):
        end = headings[i + 1][0] if i + 1 < len(headings) else len(ko)
        out.append((stage, ko[start:end]))
    return out


def knockout_sections() -> list[tuple[str, str]]:
    """(stage, wikitext section) pairs across the two knockout pages."""
    sections = [("R32", wikitext(R32_PAGE, fresh=True))]
    sections.extend(split_ko_sections(wikitext(KO_PAGE, fresh=True)))
    return sections


def main() -> None:
    matches = [m for stage, section in knockout_sections() for m in parse_stage(stage, section)]

    RAW.mkdir(parents=True, exist_ok=True)
    (RAW / "knockout_matches.json").write_text(json.dumps(matches, indent=2) + "\n", encoding="utf-8")
    (RAW / "knockout.provenance.json").write_text(
        json.dumps({"fetched_at": datetime.now(timezone.utc).isoformat(), "source": SOURCE}, indent=2) + "\n",
        encoding="utf-8",
    )

    played = sum(1 for m in matches if m["score_a"] is not None)
    print(f"knockout matches={len(matches)} (played={played})")
    for m in matches:
        score = f"{m['score_a']}-{m['score_b']}" if m["score_a"] is not None else "upcoming"
        pens = f" (pens {m['pen_a']}-{m['pen_b']})" if m["pen_a"] is not None else ""
        print(f"  {m['id']:6s} {m['team_a']} vs {m['team_b']}  {score}{pens}  @ {m['venue_id']}")


if __name__ == "__main__":
    main()
