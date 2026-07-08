import marimo

__generated_with = "0.23.9"
app = marimo.App(width="medium")


@app.cell
def _():
    import json
    from datetime import datetime, timezone
    from zoneinfo import ZoneInfo

    import marimo as mo
    import matplotlib.pyplot as plt
    import numpy as np
    import pandas as pd

    from coast_to_cup import circadian
    from coast_to_cup.build import DERIVED, RAW
    from coast_to_cup.domain import Dataset

    return (
        DERIVED,
        Dataset,
        RAW,
        ZoneInfo,
        circadian,
        datetime,
        json,
        mo,
        np,
        pd,
        plt,
        timezone,
    )


@app.cell
def _(mo):
    mo.md("""
    # coast-to-cup model check

    Two jobs. First, confirm the circadian model behaves the way the sleep
    research says it should. Then expose the weights so the ranking can be
    pushed around by hand.

    The science it leans on: Smith, Guilleminault & Efron (SLEEP, 1997) on the
    West Coast NFL night-game edge, and Roy & Forest (J Sleep Res, 2018) on
    westward travel hurting evening games.
    """)
    return


@app.cell
def _(DERIVED, Dataset, RAW, json):
    ds = Dataset.load(RAW)
    derived = json.loads((DERIVED / "derived.json").read_text())
    teams = derived["teams"]
    return derived, ds, teams


@app.cell
def _(mo):
    mo.md("""
    ## The performance curve

    Players are sharpest from about 16:00 to 20:00 body time. The penalty is
    the inverse of that: flat-zero through the late afternoon, worst near the
    06:00 trough.
    """)
    return


@app.cell
def _(circadian, np, plt):
    _hours = np.linspace(0, 24, 240)
    _pen = [circadian.penalty(h) for h in _hours]
    _fig, _ax = plt.subplots(figsize=(7, 2.8))
    _ax.plot(_hours, _pen, color="#111111", linewidth=2)
    _ax.axvspan(16, 20, color="#C6F432", alpha=0.5, label="peak window")
    _ax.set_xlabel("body-clock hour at kickoff")
    _ax.set_ylabel("penalty")
    _ax.set_xticks(range(0, 25, 4))
    _ax.legend(loc="upper right")
    _fig.tight_layout()
    _fig
    return


@app.cell
def _(mo):
    mo.md("""
    ## Does it reproduce the West Coast night-game edge?

    The textbook case is an 8:30pm kickoff. On the East Coast a west-based side
    is still near its peak while the east-based side is past it; on the West
    Coast it flips. Lower penalty is better.
    """)
    return


@app.cell
def _(ZoneInfo, circadian, datetime, pd, timezone):
    _ny = datetime(2026, 6, 20, 20, 30, tzinfo=ZoneInfo("America/New_York")).astimezone(timezone.utc)
    _la = datetime(2026, 6, 20, 20, 30, tzinfo=ZoneInfo("America/Los_Angeles")).astimezone(timezone.utc)
    _scenarios = [
        ("East Coast 20:30 game", "West-based side", "America/Los_Angeles", "America/New_York", _ny),
        ("East Coast 20:30 game", "East-based side", "America/New_York", "America/New_York", _ny),
        ("West Coast 20:30 game", "East-based side", "America/New_York", "America/Los_Angeles", _la),
        ("West Coast 20:30 game", "West-based side", "America/Los_Angeles", "America/Los_Angeles", _la),
    ]
    _rows = []
    for _game, _who, _base, _venue, _inst in _scenarios:
        _bc = circadian.body_clock_hour(_base, _inst)
        _rows.append({
            "game": _game,
            "side": _who,
            "body clock": round(_bc, 1),
            "penalty": round(circadian.penalty(_bc), 3),
        })
    pd.DataFrame(_rows)
    return


@app.cell
def _(mo):
    mo.md("""
    ## Same test, run over all 72 fixtures

    For every team in every group match, classify the trip from base camp to
    venue as eastward or westward and flag evening kickoffs. Roy & Forest say
    westward travel should carry the bigger penalty in evening games. It does.
    """)
    return


@app.cell
def _(circadian, ds, pd, plt):
    _rows = []
    for _m in ds.matches.values():
        _venue = ds.venues[_m.venue_id]
        for _tid in (_m.team_a, _m.team_b):
            _base = ds.base_camps[_tid]
            _delta = circadian.offset_hours(_venue.tz, _m.kickoff) - circadian.offset_hours(_base.tz, _m.kickoff)
            _local = circadian.local_hour(_venue.tz, _m.kickoff)
            _bc = circadian.body_clock_hour(_base.tz, _m.kickoff)
            _rows.append({
                "direction": "eastward" if _delta > 0 else "westward" if _delta < 0 else "same zone",
                "evening": _local >= 18,
                "penalty": circadian.penalty(_bc),
            })
    _df = pd.DataFrame(_rows)
    _evening = _df[_df["evening"]].groupby("direction")["penalty"].agg(["mean", "count"]).round(3)

    _fig, _ax = plt.subplots(figsize=(6, 2.8))
    _ax.bar(_evening.index, _evening["mean"], color=["#C6F432", "#6B7280", "#111111"][: len(_evening)])
    _ax.set_ylabel("mean circadian penalty")
    _ax.set_title("Evening games, by travel direction")
    _fig.tight_layout()
    _evening
    return


@app.cell
def _(mo):
    mo.md("""
    ## Weight sensitivity

    These are the defaults the build ships. Drag them and the ranking below
    re-sorts. The per-team component scores are already normalized, so changing
    weights only re-weights, it never re-normalizes.
    """)
    return


@app.cell
def _(derived, mo):
    _dw = derived["meta"]["weights"]
    w_circ = mo.ui.slider(start=0, stop=1, step=0.05, value=_dw["circadian"], label="circadian")
    w_travel = mo.ui.slider(start=0, stop=1, step=0.05, value=_dw["travel"], label="travel")
    w_alt = mo.ui.slider(start=0, stop=1, step=0.05, value=_dw["altitude"], label="altitude")
    w_heat = mo.ui.slider(start=0, stop=1, step=0.05, value=_dw["heat"], label="heat")
    mo.vstack([w_circ, w_travel, w_alt, w_heat])
    return w_alt, w_circ, w_heat, w_travel


@app.cell
def _(mo, pd, teams, w_alt, w_circ, w_heat, w_travel):
    _w = {
        "circadian": w_circ.value,
        "travel": w_travel.value,
        "altitude": w_alt.value,
        "heat": w_heat.value,
    }
    _total = sum(_w.values()) or 1.0
    _rows = [
        {
            "team": t["name"],
            "group": t["group"],
            "base camp": t["base_camp"],
            "index": round(sum(t["norm"][c] * _w[c] for c in _w) / _total, 3),
        }
        for t in teams
    ]
    _df = pd.DataFrame(_rows).sort_values("index", ascending=False).reset_index(drop=True)
    _df.index += 1
    mo.vstack([
        mo.md("**Hardest 10**"),
        _df.head(10),
        mo.md("**Easiest 5**"),
        _df.tail(5),
    ])
    return


if __name__ == "__main__":
    app.run()
