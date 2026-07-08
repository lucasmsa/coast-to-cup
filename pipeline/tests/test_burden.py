from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from coast_to_cup.burden import compute, match_edges, match_load
from coast_to_cup.config import ModelParams
from coast_to_cup.domain import BaseCamp, Dataset, Match, Team, Venue


def _utc(day: int, hour: int, tz: str) -> str:
    return datetime(2026, 6, day, hour, 0, tzinfo=ZoneInfo(tz)).astimezone(timezone.utc).isoformat()


def _dataset() -> Dataset:
    venues = {
        "la": Venue("la", "SoFi", "LA", "USA", 34.0, -118.34, "America/Los_Angeles", 30, "open", 27),
        "ny": Venue("ny", "MetLife", "NY", "USA", 40.81, -74.07, "America/New_York", 7, "open", 29),
        "mex": Venue("mex", "Azteca", "CDMX", "MEX", 19.30, -99.15, "America/Mexico_City", 2240, "open", 24),
    }
    base_camps = {
        "local": BaseCamp("local", "LA", "USA", 34.0, -118.34, "America/Los_Angeles", 30, 27),
        "traveler": BaseCamp("traveler", "NY", "USA", 40.81, -74.07, "America/New_York", 7, 29),
    }
    teams = {
        "local": Team("local", "Local", "LOC", "A", "X", "#ffffff"),
        "traveler": Team("traveler", "Traveler", "TRV", "A", "Y", "#000000"),
    }
    matches = {}
    for i, (vid, day) in enumerate([("la", 11), ("ny", 16), ("mex", 21)]):
        matches[f"m{i}"] = Match(
            f"m{i}", "A", i + 1, vid, _utc(day, 19, venues[vid].tz), "local", "traveler"
        )
    return Dataset(venues, base_camps, teams, matches)


def test_components_normalized_0_1():
    for tb in compute(_dataset()):
        for v in tb.norm.values():
            assert 0.0 <= v <= 1.0


def test_local_team_travels_less():
    res = {tb.team_id: tb for tb in compute(_dataset())}
    assert res["local"].raw["travel"] < res["traveler"].raw["travel"]


def test_altitude_climb_to_mexico_city():
    ds = _dataset()
    load = match_load(ds, "local", ds.matches["m2"], ModelParams())
    assert load.altitude_climb_m > 2000  # sea-level base -> Mexico City


def test_index_ranks_per_match_mean_not_volume():
    # Doubling every fixture doubles the sums but not the per-match means,
    # so each team's index must not change.
    ds = _dataset()
    doubled = Dataset(
        ds.venues,
        ds.base_camps,
        ds.teams,
        {**ds.matches, **{f"{k}x": Match(f"{k}x", m.group, m.matchday, m.venue_id, m.kickoff_utc, m.team_a, m.team_b) for k, m in ds.matches.items()}},
    )
    once = {tb.team_id: tb.index for tb in compute(ds)}
    twice = {tb.team_id: tb.index for tb in compute(doubled)}
    for team_id, index in once.items():
        assert abs(index - twice[team_id]) < 1e-9


def test_same_timezone_has_zero_circadian():
    ds = _dataset()
    # m0 is the LA venue; the "local" team is based in LA (same time zone).
    load = match_load(ds, "local", ds.matches["m0"], ModelParams())
    assert abs(load.circadian) < 1e-9


def test_heat_uses_kickoff_weather_when_fetched():
    ds = _dataset()
    ds.weather = {"m0": {"temp_c": 45.0, "apparent_c": 50.0}}
    with_weather = match_load(ds, "local", ds.matches["m0"], ModelParams())
    assert with_weather.venue_temp_c == 45.0
    assert with_weather.heat_excess_c == 45.0 - 27.0  # open roof, base normal 27

    without = match_load(ds, "local", ds.matches["m1"], ModelParams())
    assert without.venue_temp_c is None  # falls back to the venue climate normal


def test_match_edges_pick_one_side():
    ds = _dataset()
    edges = match_edges(ds)
    assert len(edges) == 3
    for e in edges:
        assert e["edge_team"] in (e["a"]["team_id"], e["b"]["team_id"])
