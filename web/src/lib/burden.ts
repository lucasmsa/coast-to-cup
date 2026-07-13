import { COMPONENTS } from '../config/components'
import { reachedPhase, stagesFor, type Phase } from '../config/phases'
import type { ComponentKey, Load, Team, Weights } from '../types'

export type HeatMode = 'air' | 'feels'
export type Norm = Record<ComponentKey, number>

const KEYS: ComponentKey[] = ['circadian', 'travel', 'altitude', 'heat']

/** One match's raw value for a component, honoring the heat mode. */
function loadValue(l: Load, key: ComponentKey, heatMode: HeatMode): number {
  switch (key) {
    case 'circadian':
      return l.circadian
    case 'travel':
      return l.travel_km
    case 'altitude':
      return l.altitude_climb_m
    case 'heat':
      return heatMode === 'feels' ? l.heat_apparent_excess_c : l.heat_excess_c
  }
}

/** Per-match mean of each component over the in-scope games. */
function scopedMeans(loads: Load[], heatMode: HeatMode): Norm {
  const n = loads.length || 1
  const m: Norm = { circadian: 0, travel: 0, altitude: 0, heat: 0 }
  for (const key of KEYS) {
    m[key] = loads.reduce((s, l) => s + loadValue(l, key, heatMode), 0) / n
  }
  return m
}

export interface RankedTeam extends Team {
  liveIndex: number
  liveRank: number
  scopedNorm: Norm // per-component score within the current phase pool
  scopedLoads: Load[] // the games counted for this phase
}

/**
 * Rank teams within a phase: scope each team's games, take per-match means, then
 * min-max normalize across the phase pool so teams are compared like-with-like.
 */
export function rankTeams(
  teams: Team[],
  w: Weights,
  group: string | null,
  heatMode: HeatMode,
  phase: Phase,
): RankedTeam[] {
  // Normalize across the whole phase pool; the group letter only filters the view.
  const stages = stagesFor(phase)
  const phasePool = teams.filter((t) => reachedPhase(t.loads, phase))
  const entries = phasePool.map((t) => {
    const scopedLoads = stages ? t.loads.filter((l) => stages.has(l.stage)) : t.loads
    return { team: t, scopedLoads, means: scopedMeans(scopedLoads, heatMode) }
  })

  const normalizer = (key: ComponentKey) => {
    const vals = entries.map((e) => e.means[key])
    const lo = Math.min(...vals)
    const hi = Math.max(...vals)
    return (v: number) => (hi > lo ? (v - lo) / (hi - lo) : 0)
  }
  const fns = Object.fromEntries(KEYS.map((k) => [k, normalizer(k)])) as Record<
    ComponentKey,
    (v: number) => number
  >

  const totalWeight = KEYS.reduce((s, k) => s + w[k], 0)
  const ranked = entries.map(({ team, scopedLoads, means }) => {
    const scopedNorm: Norm = { circadian: 0, travel: 0, altitude: 0, heat: 0 }
    let sum = 0
    for (const { key } of COMPONENTS) {
      scopedNorm[key] = fns[key](means[key])
      sum += scopedNorm[key] * w[key]
    }
    return { ...team, liveIndex: totalWeight > 0 ? sum / totalWeight : 0, liveRank: 0, scopedNorm, scopedLoads }
  })

  ranked.sort((a, b) => b.liveIndex - a.liveIndex)
  const shown = group ? ranked.filter((t) => t.group === group) : ranked
  shown.forEach((t, i) => (t.liveRank = i + 1))
  return shown
}
