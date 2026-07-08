import { COMPONENTS } from '../config/components'
import { useT } from '../hooks/useT'
import { useStore } from '../store'

export function WeightSliders() {
  const t = useT()
  const weights = useStore((s) => s.weights)
  const setWeight = useStore((s) => s.setWeight)
  const resetWeights = useStore((s) => s.resetWeights)
  const heatMode = useStore((s) => s.heatMode)
  const setHeatMode = useStore((s) => s.setHeatMode)

  return (
    <div className="px-5 py-4 border-b border-line/60">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="font-stat text-base font-semibold text-mut">{t('weighting')}</h2>
        <button
          type="button"
          onClick={resetWeights}
          className="font-stat text-sm font-medium text-mut hover:text-lime transition-colors"
        >
          {t('reset')}
        </button>
      </div>
      <div className="space-y-3.5">
        {COMPONENTS.map((c) => (
          <div key={c.key}>
            <div className="flex items-baseline justify-between gap-2 mb-1.5">
              <span className="flex items-baseline gap-2 min-w-0">
                <span className="text-lg font-medium text-fg">{t(c.key)}</span>
                {c.key === 'heat' && (
                  <button
                    type="button"
                    onClick={() => setHeatMode(heatMode === 'feels' ? 'air' : 'feels')}
                    className={`font-stat text-xs font-semibold px-2 py-0.5 rounded-full border transition-colors ${
                      heatMode === 'feels'
                        ? 'bg-lime text-ink border-lime'
                        : 'text-mut border-line hover:text-fg'
                    }`}
                  >
                    {t('feelsLike')}
                  </button>
                )}
              </span>
              <span className="font-stat text-lg font-semibold text-lime tabular">
                {weights[c.key].toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={weights[c.key]}
              onChange={(e) => setWeight(c.key, Number(e.target.value))}
              aria-label={t(c.key)}
              style={{
                background: `linear-gradient(to right, var(--color-lime) ${weights[c.key] * 100}%, var(--color-line) ${weights[c.key] * 100}%)`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
