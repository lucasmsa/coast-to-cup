import { useMemo } from 'react'
import { useAccuracy, type ResultRow } from './useAccuracy'

export type Verdict = 'live' | 'draw' | 'called' | 'missed'

export interface ResultEntry extends ResultRow {
  verdict: Verdict
  pickIsA: boolean
}

export interface ResultsView {
  played: ResultEntry[]
  correct: number
  decided: number
  hitPct: number | null
  corrText: string
}

function verdictOf(row: ResultRow): Verdict {
  if (row.live) return 'live'
  if (row.winner === null) return 'draw'
  return row.winner === row.edgeTeam ? 'called' : 'missed'
}

function formatCorr(corr: number | null): string {
  if (corr === null) return 'n/a'
  return `${corr >= 0 ? '+' : ''}${corr.toFixed(2)}`
}

/** Render-ready view of the model-vs-results comparison: played matches, most recent first. */
export function useResults(): ResultsView | null {
  const acc = useAccuracy()
  return useMemo(() => {
    if (!acc) return null
    const played = acc.rows
      .filter((row) => row.sa !== null)
      .sort((a, b) => b.kickoff.localeCompare(a.kickoff))
      .map((row) => ({ ...row, verdict: verdictOf(row), pickIsA: row.edgeTeam === row.aId }))

    const { correct, nDecided, hitRate, corr } = acc.summary
    return {
      played,
      correct,
      decided: nDecided,
      hitPct: hitRate === null ? null : Math.round(hitRate * 100),
      corrText: formatCorr(corr),
    }
  }, [acc])
}
