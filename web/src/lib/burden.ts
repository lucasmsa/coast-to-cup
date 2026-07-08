import { COMPONENTS } from '../config/components'
import type { ComponentKey, Team, Weights } from '../types'

export type HeatMode = 'air' | 'feels'

type Norm = Team['norm']

/** The normalized value backing one axis, honoring the heat mode. */
function normValue(norm: Norm, key: ComponentKey, heatMode: HeatMode): number {
  if (key === 'heat' && heatMode === 'feels') return norm.heat_apparent ?? norm.heat
  return norm[key] ?? 0
}

/** The four axis values for display (hexagon), with the heat mode applied. */
export function displayNorm(norm: Norm, heatMode: HeatMode): Record<ComponentKey, number> {
  return Object.fromEntries(
    COMPONENTS.map(({ key }) => [key, normValue(norm, key, heatMode)]),
  ) as Record<ComponentKey, number>
}

/** Weighted composite from the precomputed per-team norms. No re-normalization. */
export function computeIndex(norm: Norm, w: Weights, heatMode: HeatMode = 'air'): number {
  let sum = 0
  let total = 0
  for (const { key } of COMPONENTS) {
    sum += normValue(norm, key, heatMode) * w[key]
    total += w[key]
  }
  return total > 0 ? sum / total : 0
}

export interface RankedTeam extends Team {
  liveIndex: number
  liveRank: number
}

export function rankTeams(
  teams: Team[],
  w: Weights,
  group: string | null,
  heatMode: HeatMode = 'air',
): RankedTeam[] {
  const pool = group ? teams.filter((t) => t.group === group) : teams
  const ranked = pool.map((t) => ({ ...t, liveIndex: computeIndex(t.norm, w, heatMode), liveRank: 0 }))
  ranked.sort((a, b) => b.liveIndex - a.liveIndex)
  ranked.forEach((t, i) => (t.liveRank = i + 1))
  return ranked
}
