import type { RankedTeam } from '../lib/burden'
import { useStore } from '../store'
import { useRanked } from './useRanked'

/** The team the map should feature: the selection, else the hardest in the current phase. */
export function useActiveTeam(): RankedTeam | null {
  const selected = useStore((s) => s.selected)
  const ranked = useRanked()
  // Click-to-select only: the map follows the selection, never the hover.
  return ranked.find((t) => t.id === selected) ?? ranked[0] ?? null
}
