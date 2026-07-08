// Mirrors the Python accuracy summary so the web can recompute it live.
// Descriptive only: ignores squad strength, small uncontrolled sample.

export interface AccRow {
  edgeTeam: string
  aId: string
  bId: string
  margin: number
  sa: number | null
  sb: number | null
  winner: string | null // pens-aware for knockout games
}

export interface AccSummary {
  nPlayed: number
  nDecided: number
  correct: number
  hitRate: number | null
  corr: number | null
}

function pearson(xs: number[], ys: number[]): number | null {
  const n = xs.length
  if (n < 3) return null
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let sxy = 0
  let sxx = 0
  let syy = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx
    const dy = ys[i] - my
    sxy += dx * dy
    sxx += dx * dx
    syy += dy * dy
  }
  if (sxx === 0 || syy === 0) return null
  return sxy / Math.sqrt(sxx * syy)
}

export function summarize(rows: AccRow[]): AccSummary {
  const played = rows.filter((r) => r.sa != null && r.sb != null)
  const decided = played.filter((r) => r.winner !== null)
  const correct = decided.filter((r) => r.winner === r.edgeTeam).length

  const margins: number[] = []
  const goalDiffs: number[] = []
  for (const r of played) {
    const gd = r.edgeTeam === r.aId ? r.sa! - r.sb! : r.sb! - r.sa!
    margins.push(r.margin)
    goalDiffs.push(gd)
  }

  return {
    nPlayed: played.length,
    nDecided: decided.length,
    correct,
    hitRate: decided.length ? correct / decided.length : null,
    corr: pearson(margins, goalDiffs),
  }
}
