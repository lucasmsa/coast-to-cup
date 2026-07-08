# Burden metric: base-camp frame, per-match means, disadvantage-only circadian

Status: accepted

## Context

The thesis is that the 2026 World Cup schedule is not equally hard for every team: four time zones, venues from sea level to 2,240 m, and summer heat that varies by city. The metric has to be cup-internal (a player's nationality says nothing about where they live and train) and defensible against the published sport-science.

## Decision

Every stressor is measured relative to the team's base camp, the one tournament fact that anchors a squad's clock and climate. Four components per match, aggregated per team, ranked on per-match means:

1. **Circadian.** Body clock stays on base-camp time, so the body-clock hour at kickoff is the wall-clock hour at the base camp. The burden is `max(0, penalty(bodyClock) - penalty(localKickoff))` where `penalty` is a cosine curve centred on the 16:00-20:00 performance peak. Same time zone means zero; a favorable shift is not a bonus. Grounds: the circadian advantage requires a time-zone difference and shows in evening games (Smith, Guilleminault and Efron, Sleep 1997; the 1970-2011 AASM analysis; Roy and Forest, J Sleep Res 2018; PMC3825451).
2. **Travel.** Round-trip haversine distance base camp to venue. Kept separate from circadian because the NBA literature finds the two act independently (Leota et al., Front Physiol 2022).
3. **Altitude.** `max(0, venueAltitude - baseAltitude)`: the climb the team actually makes.
4. **Heat.** Venue temperature at the actual kickoff hour (recorded for played games, forecast for upcoming, June/July climate normal as fallback), capped at a held indoor temperature (22 C) for climate-controlled venues (fixed or retractable roofs: Atlanta, Dallas, Houston, Vancouver, Los Angeles), minus the base-camp heat normal, floored at 0. The base-camp side stays a climate normal because it represents acclimatization, not a single day's exposure.

Each component's per-match mean is min-max normalized across the 48 teams and combined as a weighted sum (defaults 0.40 circadian, 0.30 travel, 0.15 altitude, 0.15 heat; user-adjustable). Means, not sums, so a team eliminated after 3 games compares fairly with a team that has played 5; raw totals stay in the output for display. A property test asserts match-count invariance.

Per-match edges (which side is less burdened) use the acute factors only: circadian plus a small travel term.

## Consequences

- Base-camp choice itself becomes part of the story (a cool mountain base raises heat burden at hot venues, and vice versa).
- Stated simplifications: body clock anchored to base-camp time with no partial re-sync, round-trip travel per match, apparent (feels-like) temperature as the default heat exposure with dry-bulb behind a toggle, squad strength ignored. The model-vs-results page is descriptive, not a forecast.
- The knockout bracket adds matches as pairings resolve; upcoming known fixtures count as scheduled trips.
