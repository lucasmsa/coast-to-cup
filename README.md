# coast-to-cup

Who's got the toughest World Cup 2026 logistics. An interactive map that scores
how physically demanding each of the 48 teams' schedule is (travel, body clock,
altitude, heat), ranks them, and checks the model against real results as the
tournament plays out.

The 2026 World Cup spans the US, Mexico and Canada: four time zones, venues from
sea level to 2,240 m, and summer heat that swings by city. Two teams in the same
group can draw very different physical loads. This project puts an adjustable
number on that.

## Surfaces

| Directory | What it is |
| --- | --- |
| `web/` | The product: flat GPU map with animated trip arcs, leaderboard, hexagon burden profile, adjustable weights, live model-vs-results, EN/PT/ES. Vite + React + TypeScript + react-three-fiber. |
| `pipeline/` | The model: fetches and cites the raw facts, computes the burden metrics, emits `data/derived/derived.json`. Python, plus a marimo validation notebook. |
| `tui/` | Terminal explorer over the same dataset. Go, Bubble Tea + Lipgloss. |

## Quickstart

```bash
# dataset (already committed; rerun to refresh results)
cd pipeline && python -m venv .venv && .venv/bin/pip install -e .[dev]
.venv/bin/python -m coast_to_cup.fetch_schedule
.venv/bin/python -m coast_to_cup.fetch_knockout
.venv/bin/python -m coast_to_cup.build
cp ../data/derived/derived.json ../web/public/data/derived.json

# web
cd web && pnpm install && pnpm dev

# tui
cd tui && go run ./cmd/tui
```

## The model, briefly

Every stressor is measured relative to the team's base camp. Per match: the
body-clock hour at kickoff versus the 16:00-20:00 performance peak (only when a
time-zone gap makes it worse than local), round-trip distance, altitude climb,
and heat above the base-camp climate (roofed, air-conditioned stadiums
discounted). Per-match means are normalized across teams and combined with
weights you control. Grounded in the published circadian sport-science; papers
and data sources are cited on the About page and in `docs/SOURCES.md`.

Decisions live in `docs/adr/`.
