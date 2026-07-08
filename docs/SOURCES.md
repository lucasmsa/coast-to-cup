# Data sources

Every value in `pipeline/data/raw` is fetched and cited, never hand-typed.
Machine-readable provenance sits next to each dataset (`*.provenance.json`),
and raw Wikipedia pages are cached under `pipeline/data/raw/_cache`.

## Venues (`venues.json`)

| Field | Source |
| --- | --- |
| name, host city, country, roof | Wikipedia, [2026 FIFA World Cup](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup) (Venues) |
| coordinates | [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) (ODbL) |
| altitude | [Open-Meteo Elevation API](https://open-meteo.com/en/docs/elevation-api) |
| timezone, heat_high_c | [Open-Meteo Historical Archive (ERA5)](https://open-meteo.com/en/docs/historical-weather-api) |

`heat_high_c` is the mean June/July daily-max temperature over 2019-2024, i.e. a
climate normal, not a forecast for any match day.

## Teams and schedule (`teams.json`, `matches.json`)

Parsed deterministically from the raw match templates on the per-group Wikipedia
pages, [2026 FIFA World Cup Group A..L](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup)
(team codes, date, kickoff time with its explicit UTC offset, stadium). Match
results are ignored; only fixtures are used. Nation names and confederations are
stable reference data in `reference.py`. Brand colours are cosmetic.

## Base camps (`base_camps.json`)

Team-to-location from the "Team base camps" sortable table on the 2026 FIFA
World Cup page (each row's `data-sort-value` encodes Country-State-City for the
stay location). Coordinates, altitude, timezone and heat normal come from the
same geocoding/climate sources as venues.

## Knockout stage (`knockout_matches.json`)

Parsed from [2026 FIFA World Cup round of 32](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_round_of_32)
and the round sections of [2026 FIFA World Cup knockout stage](https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage).
Match blocks with unresolved pairings are skipped and picked up on a later run;
drawn games carry the `penaltyscore` so the winner is known. These pages are
refetched fresh on every run.

## Kickoff-hour weather (`match_weather.json`)

Per-match venue temperature (dry-bulb and apparent) at the kickoff hour, from
the [Open-Meteo forecast API](https://open-meteo.com/en/docs) with an explicit
date range: recorded model data for past days, forecast for upcoming ones. The
heat component uses these; the June/July climate normal is the fallback and
remains the base-camp acclimatization baseline.

## Live scores (web app)

[ESPN's public FIFA World Cup scoreboard JSON](https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard)
(CORS-open, no key), polled client-side and merged over the static dataset.

## Reproducing

```
python -m coast_to_cup.fetch_venues
python -m coast_to_cup.fetch_schedule
python -m coast_to_cup.fetch_base_camps
python -m coast_to_cup.fetch_knockout
python -m coast_to_cup.fetch_match_weather
python -m coast_to_cup.build
```
