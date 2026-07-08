# pipeline

Fetches the raw tournament facts, computes the burden model, and writes
`data/derived/derived.json` for the web app and the TUI.

```bash
python -m venv .venv && .venv/bin/pip install -e .[dev]
.venv/bin/python -m coast_to_cup.fetch_venues      # 16 stadiums (geocode, altitude, heat normals)
.venv/bin/python -m coast_to_cup.fetch_schedule    # 48 teams, 72 group matches + scores
.venv/bin/python -m coast_to_cup.fetch_base_camps  # 48 base camps
.venv/bin/python -m coast_to_cup.fetch_knockout    # R32 onward, penalty winners
.venv/bin/python -m coast_to_cup.fetch_match_weather  # kickoff-hour venue temperatures
.venv/bin/python -m coast_to_cup.build             # metrics -> ../data/derived/derived.json
.venv/bin/python -m pytest
```

Modules: `domain` (dataclasses + loaders), `geo` (haversine), `circadian`
(body clock + penalty curve), `burden` (components, normalization, composite,
per-match edges), `accuracy` (model vs results), `build` (derived JSON),
`fetch_*` (sourced raw data with provenance), `wiki`/`geofetch` (cached
HTTP helpers).

The marimo notebook validates the model against the published effects:

```bash
.venv/bin/pip install -e .[notebook]
.venv/bin/marimo edit notebooks/validation.py
```

Sources and provenance: `../docs/SOURCES.md`.
