import { useMemo } from 'react'
import { teamName } from '../config/teamNames'
import type { RankedTeam } from '../lib/burden'
import { matchesTeam } from '../lib/text'
import { useStore } from '../store'
import { useRanked } from './useRanked'

/** The leaderboard rows: ranked teams narrowed by the search box. */
export function useLeaderboard(): RankedTeam[] {
  const ranked = useRanked()
  const search = useStore((s) => s.search)
  const locale = useStore((s) => s.locale)
  return useMemo(
    () => ranked.filter((t) => matchesTeam(search, teamName(t.id, t.name, locale), t.name, t.code)),
    [ranked, search, locale],
  )
}
