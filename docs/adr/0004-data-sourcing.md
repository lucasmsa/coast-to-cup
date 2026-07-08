# Fetched, cited raw data; deterministic wikitext parsing; client-side live scores

Status: accepted

## Context

Every value shown has to trace to a source. LLM or prose summaries of structured tournament data proved unreliable (a summary once hallucinated the group draw), and keyed sports APIs cannot be called safely from a static site.

## Decision

- Raw facts are fetched programmatically into `pipeline/data/raw` with machine-readable provenance (`*.provenance.json`) beside each file. Nothing is hand-typed.
- Schedule, draw, results and base camps parse from raw Wikipedia wikitext via the MediaWiki API: per-group pages, the round-of-32 page, and the knockout-stage round sections. Match blocks are chunk-split so placeholder pairings ("Winner Match 83") cannot bleed into neighbours; drawn knockout games read `penaltyscore` so the winner is known. Tournament pages are refetched fresh on every run.
- Coordinates come from OpenStreetMap Nominatim (ODbL); elevation and June/July heat normals (2019-2024 daily-max means) from Open-Meteo. Per-match kickoff-hour venue temperatures come from Open-Meteo's forecast API with an explicit date range, which serves recorded model data for past days and forecasts for upcoming ones; climate normals remain the fallback and the acclimatization baseline.
- Live scores come from ESPN's public scoreboard JSON (CORS-open, no key), polled in the browser and merged over the static dataset; the pens-aware dataset winner is preferred unless ESPN supplies a fresher score.
- sofascore was considered for live data and rejected: unofficial, aggressively rate-limited, and redundant given the above.

## Consequences

- Reproducing the dataset is four commands (see `docs/SOURCES.md`); re-running the fetchers picks up newly resolved knockout pairings.
- Wikipedia edit latency bounds freshness of the static results; the ESPN merge covers the gap for live and just-finished games.
- The human-readable source list lives in `docs/SOURCES.md` and, for everything user-facing, in the About page's citations.
