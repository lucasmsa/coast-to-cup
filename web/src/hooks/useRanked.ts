import { useMemo } from 'react'
import { rankTeams, type RankedTeam } from '../lib/burden'
import { useStore } from '../store'

/** Teams ranked hardest-first under the current weights, group filter and phase. */
export function useRanked(): RankedTeam[] {
  const data = useStore((s) => s.data)
  const weights = useStore((s) => s.weights)
  const group = useStore((s) => s.group)
  const heatMode = useStore((s) => s.heatMode)
  const phase = useStore((s) => s.phase)
  return useMemo(
    () => (data ? rankTeams(data.teams, weights, group, heatMode, phase) : []),
    [data, weights, group, heatMode, phase],
  )
}

/** The selected team as its phase-scoped ranked entry (scoped norm + games). */
export function useTeam(id: string | null): RankedTeam | null {
  const ranked = useRanked()
  return useMemo(() => (id ? (ranked.find((t) => t.id === id) ?? null) : null), [id, ranked])
}
