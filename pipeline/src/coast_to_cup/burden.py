"""Per-match loads, per-team aggregation, normalization and the composite index.

Every component is measured relative to the team's base camp (the tournament
reference frame): the body-clock penalty, the round-trip flying distance, the
altitude climb, and the heat excess over the base-camp climate.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass

from . import circadian
from .config import ModelParams, Weights
from .domain import Dataset, Match
from .geo import haversine_km

COMPONENTS = ("circadian", "travel", "altitude", "heat")


@dataclass
class MatchLoad:
    """One team's load for one match, in raw (un-normalized) units."""

    match_id: str
    matchday: int
    stage: str                 # "group" or a knockout round code
    venue_id: str
    local_kickoff_hour: float  # kickoff hour in venue local time
    body_clock_hour: float     # hour the players' bodies feel at kickoff
    circadian: float       # 0..1 penalty
    travel_km: float       # round trip base <-> venue
    altitude_climb_m: float
    heat_excess_c: float
    heat_apparent_excess_c: float  # same, using feels-like temperature
    venue_temp_c: float | None      # kickoff-hour venue temperature, when fetched
    apparent_temp_c: float | None   # kickoff-hour feels-like temperature, when fetched


@dataclass
class TeamBurden:
    team_id: str
    loads: list[MatchLoad]
    raw: dict[str, float]      # summed raw components
    norm: dict[str, float]     # 0..1 normalized across all teams
    index: float               # weighted composite, 0..1
    rank: int = 0


def match_load(ds: Dataset, team_id: str, match: Match, params: ModelParams) -> MatchLoad:
    base = ds.base_camps[team_id]
    venue = ds.venues[match.venue_id]
    local = circadian.local_hour(venue.tz, match.kickoff)
    bc = circadian.body_clock_hour(base.tz, match.kickoff)
    # Circadian burden is travel-induced and counts disadvantage only: how much worse
    # the body-clock timing is than a local team's, floored at 0. Same time zone means
    # body == local, so zero. A body clock nearer the peak than local is not a bonus.
    # Grounds: the circadian effect needs a time-zone difference (Smith et al., NFL).
    body_penalty = circadian.penalty(bc, params.peak_center_hour)
    local_penalty = circadian.penalty(local, params.peak_center_hour)
    circ = max(0.0, body_penalty - local_penalty)
    # Heat exposure is the venue temperature at the kickoff hour (recorded or
    # forecast) when fetched; the June/July climate normal is the fallback. The
    # base-camp side stays a climate normal: it represents acclimatization.
    kickoff_weather = ds.weather.get(match.id)
    venue_temp = kickoff_weather["temp_c"] if kickoff_weather else venue.heat_high_c
    apparent_temp = kickoff_weather["apparent_c"] if kickoff_weather else venue.heat_high_c
    # Climate-controlled venues (fixed/retractable roof) play at a held indoor
    # temperature, so the outside heat is capped at it and mostly zeroes out.
    if venue.is_covered:
        venue_heat = min(venue_temp, params.indoor_temp_c)
        apparent_heat = min(apparent_temp, params.indoor_temp_c)
    else:
        venue_heat = venue_temp
        apparent_heat = apparent_temp
    return MatchLoad(
        match_id=match.id,
        matchday=match.matchday,
        stage=match.stage,
        venue_id=venue.id,
        local_kickoff_hour=round(local, 2),
        body_clock_hour=round(bc, 2),
        circadian=round(circ, 4),
        travel_km=2.0 * haversine_km(base.lat, base.lon, venue.lat, venue.lon),
        altitude_climb_m=max(0.0, venue.altitude_m - base.altitude_m),
        heat_excess_c=max(0.0, venue_heat - base.heat_high_c),
        heat_apparent_excess_c=max(0.0, apparent_heat - base.heat_high_c),
        venue_temp_c=venue_temp if kickoff_weather else None,
        apparent_temp_c=apparent_temp if kickoff_weather else None,
    )


def _raw_totals(loads: list[MatchLoad]) -> dict[str, float]:
    return {
        "circadian": sum(l.circadian for l in loads),
        "travel": sum(l.travel_km for l in loads),
        "altitude": sum(l.altitude_climb_m for l in loads),
        "heat": sum(l.heat_excess_c for l in loads),
        # extra column, swapped in for "heat" when the feels-like mode is on
        "heat_apparent": sum(l.heat_apparent_excess_c for l in loads),
    }


def _normalize(values: list[float]) -> list[float]:
    lo, hi = min(values), max(values)
    if hi - lo < 1e-12:
        return [0.0 for _ in values]
    return [(v - lo) / (hi - lo) for v in values]


def compute(
    ds: Dataset,
    params: ModelParams | None = None,
    weights: Weights | None = None,
) -> list[TeamBurden]:
    """Compute the burden index for every team with a base camp and matches."""
    params = params or ModelParams()
    weights = weights or Weights()

    team_ids = [t for t in ds.teams if t in ds.base_camps and ds.matches_for(t)]
    if not team_ids:
        return []

    per_team: dict[str, list[MatchLoad]] = {
        t: [match_load(ds, t, m, params) for m in ds.matches_for(t)] for t in team_ids
    }
    raws = {t: _raw_totals(per_team[t]) for t in team_ids}
    # Rank on per-match means so teams knocked out after 3 games compare fairly
    # with teams that have played (or have scheduled) more. Raw sums stay in the
    # output for display.
    means = {t: {k: v / len(per_team[t]) for k, v in raws[t].items()} for t in team_ids}

    norms: dict[str, dict[str, float]] = {t: {} for t in team_ids}
    for comp in (*COMPONENTS, "heat_apparent"):
        col = _normalize([means[t][comp] for t in team_ids])
        for t, n in zip(team_ids, col):
            norms[t][comp] = n

    w = weights.as_dict()
    result: list[TeamBurden] = []
    for t in team_ids:
        index = sum(norms[t][c] * w[c] for c in COMPONENTS) / sum(w.values())
        result.append(
            TeamBurden(team_id=t, loads=per_team[t], raw=raws[t], norm=norms[t], index=index)
        )

    result.sort(key=lambda tb: tb.index, reverse=True)  # hardest first
    for i, tb in enumerate(result, start=1):
        tb.rank = i
    return result


def match_edges(ds: Dataset, params: ModelParams | None = None) -> list[dict]:
    """Per-match asymmetry: each side's acute load and who holds the edge.

    Uses the match-local circadian + travel (the acute, day-of factors), since
    altitude/heat acclimation is a slower, cumulative effect.
    """
    params = params or ModelParams()
    out: list[dict] = []
    for m in sorted(ds.matches.values(), key=lambda x: x.kickoff):
        if m.team_a not in ds.base_camps or m.team_b not in ds.base_camps:
            continue
        la = match_load(ds, m.team_a, m, params)
        lb = match_load(ds, m.team_b, m, params)
        # acute load: circadian penalty plus a small per-1000km travel term
        sa = la.circadian + la.travel_km / 10000.0
        sb = lb.circadian + lb.travel_km / 10000.0
        edge_team = m.team_b if sa > sb else m.team_a  # the less-burdened side
        winner = m.winner
        out.append({
            "match_id": m.id,
            "group": m.group,
            "matchday": m.matchday,
            "stage": m.stage,
            "venue_id": m.venue_id,
            "kickoff_utc": m.kickoff_utc,
            "a": {"team_id": m.team_a, **asdict(la)},
            "b": {"team_id": m.team_b, **asdict(lb)},
            "edge_team": edge_team,
            "edge_margin": round(abs(sa - sb), 4),
            "score_a": m.score_a,
            "score_b": m.score_b,
            "winner": winner,
            "edge_correct": None if winner is None else (edge_team == winner),
        })
    return out
