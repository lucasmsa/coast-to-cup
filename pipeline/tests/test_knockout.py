"""Knockout section classification.

Regression: Wikipedia titles the third-place section "Match for third place",
not "Third place ...". When that heading is missed, the Semifinals section runs
all the way to the Final and swallows the third-place tie, tagging it SF. That
game is between the two semifinal losers (opposite bracket halves), which then
merges the two halves in the web's bracket split.
"""

from coast_to_cup.fetch_knockout import parse_stage, split_ko_sections

# The Final article renders teams via {{#invoke:flag|...|CODE}} and a 3-argument
# score link, unlike the {{fb|CODE}} blocks elsewhere. Parsing must still resolve it.
FINAL_PAGE_WT = """
{{Football box
|date={{Start date|2026|7|19}}
|time=3:00&nbsp;p.m. [[UTC−4]]
|team1={{#invoke:flag|fb-rt|ESP}}
|score={{score link|2026 FIFA World Cup knockout stage#Final|1–0|2026 FIFA World Cup final}}
|team2={{#invoke:flag|fb|ARG}}
|stadium=[[MetLife Stadium]]
}}
"""


def test_final_page_match_parses():
    matches = parse_stage("F", FINAL_PAGE_WT)
    assert len(matches) == 1
    m = matches[0]
    assert (m["team_a"], m["team_b"]) == ("esp", "arg")
    assert m["stage"] == "F"
    assert (m["score_a"], m["score_b"]) == (1, 0)


def test_knockout_ids_do_not_collide_with_group_ids():
    # Group F matches are "F-1".."F-6"; the Final must not also key to "F-1", or the
    # dataset (keyed by match id) drops one of them.
    final = parse_stage("F", FINAL_PAGE_WT)[0]
    assert final["id"] != "F-1"
    assert final["id"] == "KO-F-1"

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
