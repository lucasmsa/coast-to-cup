"""The circadian-mismatch model: the headline burden factor.

A player's body stays on base-camp time across the short group stage, so the
body-clock time at kickoff is the wall-clock time back at the base camp. The
penalty rises with how far that sits from the late-afternoon performance peak.

This reproduces the published NFL result: a West-Coast-based team in an East
night game is still near its peak (advantage), while an East-based team out West
at night reads close to midnight body-time (penalty). See Smith, Guilleminault &
Efron, SLEEP (1997) and Roy & Forest, J Sleep Res (2018).
"""

from __future__ import annotations

import math
from datetime import datetime
from zoneinfo import ZoneInfo


def offset_hours(tz: str, instant_utc: datetime) -> float:
    """UTC offset of ``tz`` at a UTC instant, in hours (DST-aware)."""
    local = instant_utc.astimezone(ZoneInfo(tz))
    return local.utcoffset().total_seconds() / 3600.0


def local_hour(tz: str, instant_utc: datetime) -> float:
    local = instant_utc.astimezone(ZoneInfo(tz))
    return local.hour + local.minute / 60.0


def body_clock_hour(base_tz: str, instant_utc: datetime) -> float:
    """Hour (0-24) the players' bodies feel at kickoff: the time at their base camp."""
    return local_hour(base_tz, instant_utc)


def penalty(body_hour: float, peak_center: float = 18.0) -> float:
    """Circadian performance penalty in [0, 1].

    A cosine performance curve centred on ``peak_center`` (default 18:00): 0 at
    the peak, ~0.07 at the edges of the 16:00-20:00 window, 0.5 around midday and
    midnight, and 1.0 at the ~06:00 antiphase trough.
    """
    return (1.0 - math.cos(2.0 * math.pi * (body_hour - peak_center) / 24.0)) / 2.0
