import { useMemo } from 'react'
import { useStore } from '../store'
import type { Team } from '../types'
import { useRanked } from './useRanked'

/** The team the map should feature: hovered, else selected, else the hardest. */
export function useActiveTeam(): Team | null {
  const data = useStore((s) => s.data)
  const selected = useStore((s) => s.selected)
  const ranked = useRanked()
  // Click-to-select only: the map follows the selection, never the hover.
  const id = selected ?? ranked[0]?.id ?? null
  return useMemo(() => (id && data ? (data.teams.find((t) => t.id === id) ?? null) : null), [id, data])
}
