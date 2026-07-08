"""Build the derived dataset the web app and the Go TUI consume.

Run with ``python -m coast_to_cup.build``. Reads ``data/raw`` and writes
``data/derived/derived.json`` at the repo root.
"""

from __future__ import annotations

import json
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path

from . import accuracy
from .burden import COMPONENTS, compute, match_edges
from .config import ModelParams, Weights
from .domain import Dataset

RAW = Path(__file__).resolve().parents[2] / "data" / "raw"
DERIVED = Path(__file__).resolve().parents[3] / "data" / "derived"


def build(
    raw_dir: Path = RAW,
    out_dir: Path = DERIVED,
    params: ModelParams | None = None,
    weights: Weights | None = None,
) -> dict:
    params = params or ModelParams()
    weights = weights or Weights()

    ds = Dataset.load(raw_dir)
    burdens = compute(ds, params, weights)
    edges = match_edges(ds, params)

    teams_out = []
    for tb in burdens:
        team = ds.teams[tb.team_id]
        base = ds.base_camps.get(team.id)
        teams_out.append({
            "id": team.id,
            "name": team.name,
            "code": team.code,
            "group": team.group,
            "confederation": team.confederation,
            "color": team.color,
            "base_camp": base.city if base else None,
            "base_lat": base.lat if base else None,
            "base_lon": base.lon if base else None,
            "raw": {k: round(v, 2) for k, v in tb.raw.items()},
            "norm": {k: round(v, 4) for k, v in tb.norm.items()},
            "index": round(tb.index, 4),
            "rank": tb.rank,
            "loads": [asdict(l) for l in tb.loads],
        })

    out = {
        "meta": {
            "built_at": datetime.now(timezone.utc).isoformat(),
            "counts": {
                "venues": len(ds.venues),
                "teams": len(ds.teams),
                "base_camps": len(ds.base_camps),
                "matches": len(ds.matches),
                "ranked_teams": len(burdens),
            },
            "weights": weights.as_dict(),
            "params": asdict(params),
            "components": list(COMPONENTS),
            "accuracy": accuracy.summarize(edges),
        },
        "venues": [asdict(v) for v in ds.venues.values()],
        "teams": teams_out,
        "matches": edges,
    }

    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "derived.json").write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
    return out


def main() -> None:
    out = build()
    c = out["meta"]["counts"]
    print(
        f"venues={c['venues']} teams={c['teams']} base_camps={c['base_camps']} "
        f"matches={c['matches']} ranked={c['ranked_teams']}"
    )
    print(f"wrote {DERIVED / 'derived.json'}")


if __name__ == "__main__":
    main()
