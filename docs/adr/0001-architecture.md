# Static web app, Python data pipeline, Go TUI

Status: accepted

## Context

The dataset is small and fixed (16 venues, 48 base camps, 92 matches) and the product is an interactive visualization. A server would only earn its place for live scores or shared state.

## Decision

Three surfaces over one generated dataset (`data/derived/derived.json`):

- `pipeline/` (Python) owns the model: fetches and curates raw facts, computes the burden metrics, emits the derived JSON. A marimo notebook (`notebooks/validation.py`) checks the model against the published effects and exposes weight sensitivity.
- `web/` (Vite + React + TypeScript + react-three-fiber) is the product: flat GPU map, leaderboard, team detail, results and about pages. Ships as a static site.
- `tui/` (Go, Bubble Tea + Lipgloss) is a terminal explorer over the same JSON.

Live scores come from ESPN's public World Cup scoreboard JSON, which is CORS-open and needs no key, polled client-side and merged over the static dataset. No backend.

## Consequences

- Deploys are static hosting; rebuilds are `python -m coast_to_cup.build` plus a copy into `web/public/data`.
- Each language does what it is strong at: pandas-free Python for the model and provenance, TypeScript for the interactive surface, Go for the terminal binary.
- Anything requiring shared server state (saved weightings, accounts) is out of scope.
