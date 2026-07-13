import { teamName } from '../config/teamNames'
import { useBracketHalves } from '../hooks/useBracketHalves'
import { useRanked } from '../hooks/useRanked'
import { useT } from '../hooks/useT'
import type { RankedTeam } from '../lib/burden'
import { flagEmoji } from '../lib/flags'
import { useStore } from '../store'

/** Two bracket halves, each ranked by burden. Knockout phases only. */
export function BracketBox() {
  const t = useT()
  const phase = useStore((s) => s.phase)
  const locale = useStore((s) => s.locale)
  const selected = useStore((s) => s.selected)
  const select = useStore((s) => s.select)
  const ranked = useRanked()
  const { resolved, half } = useBracketHalves()

  if (phase === 'all' || phase === 'group' || !resolved) return null

  const left = ranked.filter((r) => half[r.id] === 'left')
  const right = ranked.filter((r) => half[r.id] === 'right')

  const Column = ({ rows }: { rows: RankedTeam[] }) => (
    <div className="flex-1 min-w-0 max-h-56 overflow-y-auto scroll-thin">
      {rows.map((r, i) => {
        const active = r.id === selected
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => select(active ? null : r.id)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-lime/70 ${
              active ? 'bg-surface-2' : 'hover:bg-surface-2/50'
            }`}
          >
            <span className="font-stat text-xs text-mut w-3 text-right tabular">{i + 1}</span>
            <span className="text-sm leading-none">{flagEmoji(r.id)}</span>
            <span className="flex-1 min-w-0 truncate text-sm">{teamName(r.id, r.name, locale)}</span>
            <span className="font-stat text-sm font-semibold text-fg tabular">{Math.round(r.liveIndex * 100)}</span>
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="px-5 py-3.5 border-b border-line/60">
      <span className="block font-stat text-base font-semibold text-mut mb-2">{t('bracket')}</span>
      <div className="flex gap-2">
        <Column rows={left} />
        <div className="w-px bg-line/60 shrink-0" />
        <Column rows={right} />
      </div>
    </div>
  )
}
