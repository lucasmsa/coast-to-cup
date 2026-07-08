import { motion } from 'motion/react'
import { teamName } from '../config/teamNames'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { burdenColor } from '../lib/color'
import { flagEmoji } from '../lib/flags'
import { useStore } from '../store'

export function Leaderboard() {
  const ranked = useLeaderboard()
  const select = useStore((s) => s.select)
  const hover = useStore((s) => s.hover)
  const selected = useStore((s) => s.selected)
  const hovered = useStore((s) => s.hovered)
  const locale = useStore((s) => s.locale)

  return (
    <div className="md:h-full md:overflow-y-auto scroll-thin">
      {ranked.map((t) => {
        const active = t.id === selected
        const hov = t.id === hovered
        return (
          <motion.button
            key={t.id}
            layout="position"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            type="button"
            onClick={() => select(active ? null : t.id)}
            onMouseEnter={() => hover(t.id)}
            onMouseLeave={() => hover(null)}
            className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors duration-150 ${
              active ? 'bg-surface-2' : hov ? 'bg-surface-2/50' : ''
            }`}
          >
            <span className="font-stat text-lg text-mut w-6 tabular text-right">{t.liveRank}</span>
            <span className="text-xl w-6 text-center leading-none">{flagEmoji(t.id)}</span>
            <span className="flex-1 min-w-0 truncate text-lg font-medium tracking-tight">
              {teamName(t.id, t.name, locale)}
            </span>
            <span className="font-stat text-sm text-mut w-4">{t.group}</span>
            <span className="w-16 h-2 rounded-full bg-line/70 overflow-hidden hidden sm:block">
              <span
                className="block h-full rounded-full"
                style={{ width: `${t.liveIndex * 100}%`, background: burdenColor(t.liveIndex) }}
              />
            </span>
            <span className="font-stat text-lg font-semibold text-fg tabular w-11 text-right">
              {Math.round(t.liveIndex * 100)}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
