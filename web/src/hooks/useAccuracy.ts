import { useMemo } from 'react'
import { summarize, type AccSummary } from '../lib/accuracy'
import { useStore } from '../store'
import type { Match } from '../types'
import { type LiveState, pairKey, useLiveScores } from './useLiveScores'

export interface ResultRow {
  matchId: string
  group: string
  matchday: number
  stage: string
  aId: string
  aName: string
  bId: string
  bName: string
  margin: number
  sa: number | null
  sb: number | null
  winner: string | null
  edgeTeam: string
  live: boolean
  kickoff: string
}

export interface Accuracy {
  summary: AccSummary
  rows: ResultRow[]
  anyLive: boolean
}

/** Winning team id, or null for a draw or a not-yet-played match. */
function winnerOf(sa: number | null, sb: number | null, aId: string, bId: string): string | null {
  if (sa === null || sb === null) return null
  if (sa === sb) return null
  return sa > sb ? aId : bId
}

/** Live ESPN score for a fixture if it has one, otherwise the static dataset score. */
function mergedScore(
  m: Match,
  live: LiveState,
): { sa: number | null; sb: number | null; isLive: boolean; fromEspn: boolean } {
  const espn = live.byPair.get(pairKey(m.a.team_id, m.b.team_id))
  const espnHasScore =
    espn &&
    (espn.completed || espn.inPlay) &&
    espn.scoreByCode[m.a.team_id.toUpperCase()] != null &&
    espn.scoreByCode[m.b.team_id.toUpperCase()] != null

  if (!espnHasScore) {
    return { sa: m.score_a, sb: m.score_b, isLive: false, fromEspn: false }
  }
  return {
    sa: espn.scoreByCode[m.a.team_id.toUpperCase()],
    sb: espn.scoreByCode[m.b.team_id.toUpperCase()],
    isLive: espn.inPlay,
    fromEspn: true,
  }
}

/** Model edge vs real results, merging the static dataset with live ESPN scores. */
export function useAccuracy(): Accuracy | null {
  const data = useStore((s) => s.data)
  const live = useLiveScores()

  return useMemo(() => {
    if (!data) return null
    const nameById = new Map(data.teams.map((t) => [t.id, t.name]))

    const rows: ResultRow[] = data.matches.map((m) => {
      const { sa, sb, isLive, fromEspn } = mergedScore(m, live)
      // The dataset winner is penalty-aware for knockout games; only recompute
      // from goals when ESPN's live score replaced the dataset score.
      const winner = fromEspn ? winnerOf(sa, sb, m.a.team_id, m.b.team_id) : m.winner
      return {
        matchId: m.match_id,
        group: m.group,
        matchday: m.matchday,
        stage: m.stage,
        aId: m.a.team_id,
        aName: nameById.get(m.a.team_id) ?? m.a.team_id,
        bId: m.b.team_id,
        bName: nameById.get(m.b.team_id) ?? m.b.team_id,
        margin: m.edge_margin,
        sa,
        sb,
        winner,
        edgeTeam: m.edge_team,
        live: isLive,
        kickoff: m.kickoff_utc,
      }
    })

    const summary = summarize(
      rows.map((r) => ({
        edgeTeam: r.edgeTeam,
        aId: r.aId,
        bId: r.bId,
        margin: r.margin,
        sa: r.sa,
        sb: r.sb,
        winner: r.winner,
      })),
    )
    return { summary, rows, anyLive: live.anyLive }
  }, [data, live])
}
