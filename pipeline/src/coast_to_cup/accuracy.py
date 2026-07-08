"""Model-vs-reality stats, deliberately framed as descriptive, not predictive.

The burden model captures only travel, body clock, altitude and heat. It knows
nothing about squad strength, and football has draws, so over a single group
stage (a small, uncontrolled sample) these numbers are exploratory. Published
travel-fatigue effects only separate from noise across thousands of games.
"""

from __future__ import annotations

import math


def _pearson(xs: list[float], ys: list[float]) -> float | None:
    n = len(xs)
    if n < 3:
        return None
    mx, my = sum(xs) / n, sum(ys) / n
    sxy = sum((x - mx) * (y - my) for x, y in zip(xs, ys))
    sxx = sum((x - mx) ** 2 for x in xs)
    syy = sum((y - my) ** 2 for y in ys)
    if sxx == 0 or syy == 0:
        return None
    return round(sxy / math.sqrt(sxx * syy), 3)


def summarize(edges: list[dict]) -> dict:
    """Compare the per-match burden edge against actual played results."""
    played = [e for e in edges if e["score_a"] is not None]
    decided = [e for e in played if e["winner"] is not None]
    correct = sum(1 for e in decided if e["edge_team"] == e["winner"])

    # signed: does a bigger burden edge go with a better goal difference?
    margins, goal_diffs = [], []
    for e in played:
        edge_is_a = e["edge_team"] == e["a"]["team_id"]
        gd = (e["score_a"] - e["score_b"]) if edge_is_a else (e["score_b"] - e["score_a"])
        margins.append(e["edge_margin"])
        goal_diffs.append(gd)

    return {
        "n_matches": len(edges),
        "n_played": len(played),
        "n_decided": len(decided),
        "edge_correct": correct,
        "hit_rate": round(correct / len(decided), 3) if decided else None,
        "corr_edge_goaldiff": _pearson(margins, goal_diffs),
        "note": "descriptive only; ignores squad strength; small, uncontrolled sample",
    }
