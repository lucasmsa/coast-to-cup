from datetime import datetime, timezone
from zoneinfo import ZoneInfo

from coast_to_cup import circadian


def test_penalty_zero_at_peak():
    assert circadian.penalty(18.0) < 1e-9


def test_penalty_max_at_antiphase():
    assert circadian.penalty(6.0) > 0.99


def test_peak_window_is_low():
    assert circadian.penalty(16.0) < 0.1
    assert circadian.penalty(20.0) < 0.1


def _east_coast_night_kickoff() -> datetime:
    # 2026-06-20, 20:30 local on the US East Coast
    ny = datetime(2026, 6, 20, 20, 30, tzinfo=ZoneInfo("America/New_York"))
    return ny.astimezone(timezone.utc)


def test_west_coast_night_game_advantage():
    """Smith/Roy: a West-based team in an East night game is sharper than the
    East-based home team."""
    inst = _east_coast_night_kickoff()
    west_body = circadian.body_clock_hour("America/Los_Angeles", inst)
    east_body = circadian.body_clock_hour("America/New_York", inst)
    west_pen = circadian.penalty(west_body)
    east_pen = circadian.penalty(east_body)
    assert west_pen < east_pen
    assert west_pen < 0.1  # near the late-afternoon peak


def test_eastward_evening_penalty():
    """An East-based team playing a West-coast night game reads late on the body
    clock and is penalised (Roy & Forest westward-evening effect)."""
    pt = datetime(2026, 6, 20, 20, 30, tzinfo=ZoneInfo("America/Los_Angeles"))
    inst = pt.astimezone(timezone.utc)
    body = circadian.body_clock_hour("America/New_York", inst)
    assert body > 21.0  # body clock past 9pm
    assert circadian.penalty(body) > circadian.penalty(20.5)
