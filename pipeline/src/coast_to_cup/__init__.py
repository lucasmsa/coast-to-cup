"""coast-to-cup: model the travel burden of 2026 World Cup group-stage schedules.

The package reads curated facts (venues, base camps, teams, matches) from
``data/raw`` and computes a per-team burden index from four base-camp-relative
components: circadian mismatch, travel distance, altitude and heat. See
``burden`` for the composite and ``circadian`` for the headline factor.
"""

__version__ = "0.1.0"
