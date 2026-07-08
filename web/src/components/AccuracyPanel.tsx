import { useAccuracy } from '../hooks/useAccuracy'
import { useT } from '../hooks/useT'

/** Honest model-vs-reality readout, pinned at the foot of the map. */
export function AccuracyPanel() {
  const t = useT()
  const acc = useAccuracy()
  if (!acc || acc.summary.nDecided === 0) return null

  const { summary, anyLive } = acc
  const pct = summary.hitRate != null ? Math.round(summary.hitRate * 100) : null
  const corr = summary.corr != null ? `${summary.corr >= 0 ? '+' : ''}${summary.corr.toFixed(2)}` : 'n/a'

  return (
    <div className="absolute left-6 bottom-6 max-w-[16rem] pointer-events-none">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-stat text-sm font-semibold text-mut">{t('modelVsResults')}</span>
        {anyLive && (
          <span className="flex items-center gap-1 font-stat text-[10px] uppercase tracking-wide text-lime">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
            {t('live')}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl text-fg leading-none">
          {summary.correct}
          <span className="text-mut">/{summary.nDecided}</span>
        </span>
        <span className="text-sm text-mut">{t('decided')}</span>
      </div>
      <p className="font-stat text-xs text-mut/70 mt-1.5 tabular">
        {pct}% · r {corr} · <span className="text-mut/50">{t('accuracyCaveat')}</span>
      </p>
    </div>
  )
}
