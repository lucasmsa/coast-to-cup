import { useMemo } from 'react'
import { rankTeams, type RankedTeam } from '../lib/burden'
import { useStore } from '../store'
import type { Team } from '../types'

/** Teams ranked hardest-first under the current weights and group filter. */
export function useRanked(): RankedTeam[] {
  const data = useStore((s) => s.data)
  const weights = useStore((s) => s.weights)
  const group = useStore((s) => s.group)
  const heatMode = useStore((s) => s.heatMode)
  return useMemo(
    () => (data ? rankTeams(data.teams, weights, group, heatMode) : []),
    [data, weights, group, heatMode],
  )
}

export function useTeam(id: string | null): Team | null {
  const data = useStore((s) => s.data)
  return useMemo(() => (id && data ? (data.teams.find((t) => t.id === id) ?? null) : null), [id, data])
}
