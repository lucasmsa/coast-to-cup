"""Knockout section classification.

Regression: Wikipedia titles the third-place section "Match for third place",
not "Third place ...". When that heading is missed, the Semifinals section runs
all the way to the Final and swallows the third-place tie, tagging it SF. That
game is between the two semifinal losers (opposite bracket halves), which then
merges the two halves in the web's bracket split.
"""

from coast_to_cup.fetch_knockout import split_ko_sections

SAMPLE = """
==Semifinals==
===France vs Spain===
{{Football box
|date={{Start date|2026|7|14}}
|time=19:00
|team1={{fb|FRA}}
|team2={{fb|ESP}}
|stadium=[[MetLife Stadium]]
}}
===England vs Argentina===
{{Football box
|date={{Start date|2026|7|15}}
|time=19:00
|team1={{fb|ENG}}
|team2={{fb|ARG}}
|stadium=[[AT&T Stadium]]
}}
==Match for third place==
===France vs England===
{{Football box
|date={{Start date|2026|7|18}}
|time=21:00
|team1={{fb|FRA}}
|team2={{fb|ENG}}
|stadium=[[Hard Rock Stadium]]
}}
==Final==
===Final===
{{Football box
|date={{Start date|2026|7|19}}
|time=15:00
|stadium=[[MetLife Stadium]]
}}
"""


def test_third_place_is_its_own_section_not_semifinal():
    sections = dict(split_ko_sections(SAMPLE))
    assert "3RD" in sections, "third-place heading must be detected"
    assert "France vs England" in sections["3RD"]
    assert "France vs England" not in sections.get("SF", ""), (
        "third-place tie must not fall inside the Semifinals section"
    )
