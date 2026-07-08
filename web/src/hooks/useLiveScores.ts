import { useEffect, useState } from 'react'

const ESPN = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard'

export interface LiveResult {
  scoreByCode: Record<string, number>
  completed: boolean
  inPlay: boolean
}

export interface LiveState {
  byPair: Map<string, LiveResult>
  anyLive: boolean
  loaded: boolean
}

/** Unordered key for a fixture, by team code. */
export function pairKey(a: string, b: string): string {
  return [a.toUpperCase(), b.toUpperCase()].sort().join('-')
}

/**
 * Polls ESPN's public (no-key, CORS-open) World Cup scoreboard. It returns a
 * window of recent/live fixtures; older results stay covered by the static
 * dataset, so the two are merged for the accuracy stat.
 */
export function useLiveScores(pollMs = 60000): LiveState {
  const [state, setState] = useState<LiveState>({ byPair: new Map(), anyLive: false, loaded: false })

  useEffect(() => {
    let live = true
    const fetchOnce = async () => {
      try {
        const res = await fetch(ESPN)
        const data = await res.json()
        const byPair = new Map<string, LiveResult>()
        let anyLive = false
        for (const ev of data.events ?? []) {
          const competitors = ev.competitions?.[0]?.competitors ?? []
          if (competitors.length !== 2) continue
          const st = ev.status?.type?.state // 'pre' | 'in' | 'post'
          const inPlay = st === 'in'
          const completed = st === 'post' || Boolean(ev.status?.type?.completed)
          if (inPlay) anyLive = true
          const scoreByCode: Record<string, number> = {}
          const codes: string[] = []
          for (const c of competitors) {
            const code = String(c.team?.abbreviation ?? '').toUpperCase()
            codes.push(code)
            const score = Number(c.score)
            if (!Number.isNaN(score)) scoreByCode[code] = score
          }
          byPair.set(pairKey(codes[0], codes[1]), { scoreByCode, completed, inPlay })
        }
        if (live) setState({ byPair, anyLive, loaded: true })
      } catch {
        if (live) setState((s) => ({ ...s, loaded: true }))
      }
    }
    fetchOnce()
    const id = setInterval(fetchOnce, pollMs)
    return () => {
      live = false
      clearInterval(id)
    }
  }, [pollMs])

  return state
}
