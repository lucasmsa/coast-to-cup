import { motion } from 'motion/react'
import { teamName } from '../config/teamNames'
import { useResults, type Verdict } from '../hooks/useResults'
import { useT } from '../hooks/useT'
import { flagEmoji } from '../lib/flags'
import { resultLabel } from '../lib/stage'
import { useStore } from '../store'
import { OverlayPage } from './OverlayPage'

function TeamSide({ id, name, isPick, align }: { id: string; name: string; isPick: boolean; align: 'left' | 'right' }) {
  const locale = useStore((s) => s.locale)
  return (
    <span className={`flex-1 flex items-center gap-2 min-w-0 ${align === 'right' ? 'justify-end' : ''}`}>
      {align === 'left' && <span>{flagEmoji(id)}</span>}
      <span className={`truncate ${isPick ? 'text-fg font-semibold' : 'text-mut'}`}>
        {teamName(id, name, locale)}
      </span>
      {align === 'right' && <span>{flagEmoji(id)}</span>}
    </span>
  )
}

function VerdictChip({ verdict }: { verdict: Verdict }) {
  const t = useT()
  const lime = verdict === 'live' || verdict === 'called'
  return (
    <span className={`font-stat text-sm flex items-center justify-end gap-1.5 ${lime ? 'text-lime' : 'text-mut'}`}>
      {verdict === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />}
      {t(verdict)}
    </span>
  )
}

export function ResultsPage() {
  const t = useT()
  const open = useStore((s) => s.overlay === 'results')
  const setOverlay = useStore((s) => s.setOverlay)
  const results = useResults()
  if (!results) return null

  return (
    <OverlayPage open={open}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <span className="font-display text-3xl tracking-[0.05em] uppercase">
            Coast<span className="text-lime">·</span>to<span className="text-lime">·</span>Cup
          </span>
          <button
            type="button"
            onClick={() => setOverlay(null)}
            className="font-stat text-sm font-semibold text-mut hover:text-fg flex items-center gap-2"
          >
            {t('close')} <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <h2 className="font-display text-4xl uppercase">{t('modelVsResults')}</h2>
        <div className="flex items-end gap-3 mt-4">
          <span className="font-display text-7xl leading-none text-fg">
            {results.correct}
            <span className="text-mut">/{results.decided}</span>
          </span>
          <span className="text-lg text-mut mb-2">
            {results.hitPct != null && <span className="text-lime font-semibold">{results.hitPct}%</span>}{' '}
            {t('calledRight')}
          </span>
        </div>
        <p className="text-sm text-mut/70 mt-3 max-w-xl">{t('accuracyCaveat')}</p>
        <p className="text-sm text-mut/70 mt-1 max-w-xl">{t('modelPickHint')}</p>

        <div className="mt-8">
          {results.played.map((r, i) => (
            <motion.div
              key={r.matchId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.45), duration: 0.28, ease: 'easeOut' }}
              className="grid grid-cols-[2.5rem_1fr_5rem] items-center gap-3 py-3 border-b border-line/30"
            >
              <span className="font-stat text-xs text-mut">
                {resultLabel(r.stage, r.group, r.matchday)}
              </span>
              <div className="flex items-center gap-3 text-base min-w-0">
                <TeamSide id={r.aId} name={r.aName} isPick={r.pickIsA} align="right" />
                <span className="font-stat font-semibold tabular w-12 text-center">
                  {r.sa}–{r.sb}
                </span>
                <TeamSide id={r.bId} name={r.bName} isPick={!r.pickIsA} align="left" />
              </div>
              <VerdictChip verdict={r.verdict} />
            </motion.div>
          ))}
        </div>
      </div>
    </OverlayPage>
  )
}
