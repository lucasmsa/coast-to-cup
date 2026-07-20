import { useMemo } from 'react'
import { gamesAtPhase, PHASE_LABEL, reachedPhase } from '../config/phases'
import { usePhases } from '../hooks/usePhases'
import { useT } from '../hooks/useT'
import { useStore } from '../store'

/** Phase scope selector: which round's road each team is judged on. */
export function PhaseTabs() {
  const t = useT()
  const phases = usePhases()
  const phase = useStore((s) => s.phase)
  const setPhase = useStore((s) => s.setPhase)
  const data = useStore((s) => s.data)
  // The comparison basis (whole phase pool), independent of the group view filter.
  const poolSize = useMemo(
    () => (data?.teams ?? []).filter((tm) => reachedPhase(tm.loads, phase)).length,
    [data, phase],
  )

  // "6 games played" reads as cumulative-per-team, so it isn't misread as
  // "matches in this round" (a quarterfinal has 4 matches, but 6 games played).
  const games = gamesAtPhase(phase)
  const gamesText = games === null ? t('everyGame') : `${games} ${t('gamesWord')} ${t('gamesPlayed')}`

  return (
    <div className="px-5 py-3.5 border-b border-line/60">
      <span className="block font-stat text-base font-semibold text-mut mb-2">{t('phase')}</span>
      <div className="flex flex-wrap gap-1.5">
        {phases.map((p) => {
          const active = p === phase
          return (
            <button
              key={p}
              type="button"
              onClick={() => setPhase(p)}
              title={p === 'all' ? t('allScopeHint') : undefined}
              className={`min-w-8 px-2.5 py-1 rounded-md font-stat text-base font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-lime/70 ${
                active ? 'bg-lime text-ink' : 'text-mut hover:text-fg hover:bg-surface-2'
              }`}
            >
              {t(PHASE_LABEL[p])}
            </button>
          )
        })}
      </div>
      <p className="font-stat text-sm text-mut mt-2.5">
        {poolSize} {t('teamsWord')}: {gamesText}
      </p>
    </div>
  )
}
