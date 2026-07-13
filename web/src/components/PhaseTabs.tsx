import { gamesAtPhase, PHASE_LABEL } from '../config/phases'
import { usePhases } from '../hooks/usePhases'
import { useRanked } from '../hooks/useRanked'
import { useT } from '../hooks/useT'
import { useStore } from '../store'

/** Phase scope selector: which round's road each team is judged on. */
export function PhaseTabs() {
  const t = useT()
  const phases = usePhases()
  const phase = useStore((s) => s.phase)
  const setPhase = useStore((s) => s.setPhase)
  const poolSize = useRanked().length

  const games = gamesAtPhase(phase)
  const gamesText = games === null ? t('everyGame') : `${games} ${t('gamesWord')}`

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
              className={`font-stat text-sm font-semibold px-2.5 py-1 rounded-full transition-colors ${
                active ? 'bg-lime text-ink' : 'text-mut hover:text-fg'
              }`}
            >
              {t(PHASE_LABEL[p])}
            </button>
          )
        })}
      </div>
      <p className="font-stat text-xs text-mut/60 mt-2">
        {poolSize} {t('teamsWord')} · {gamesText}
      </p>
    </div>
  )
}
