"""Tunable model parameters and default composite weights.

Defaults are deliberately conservative and are calibrated/justified in the
marimo validation notebook against the cited literature. Circadian and travel
carry the most weight because the NBA work finds both act independently and
dominate; altitude and heat are real but narrower (few venues, roof discounts).
"""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ModelParams:
    peak_center_hour: float = 18.0  # centre of the 16:00-20:00 performance peak
    indoor_temp_c: float = 22.0     # climate-controlled venues hold about this, roof closed


@dataclass(frozen=True)
class Weights:
    circadian: float = 0.40
    travel: float = 0.30
    altitude: float = 0.15
    heat: float = 0.15

    def as_dict(self) -> dict[str, float]:
        return {
            "circadian": self.circadian,
            "travel": self.travel,
            "altitude": self.altitude,
            "heat": self.heat,
        }
