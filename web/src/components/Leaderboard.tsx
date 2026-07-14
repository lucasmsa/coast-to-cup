import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { teamName } from '../config/teamNames'
import { useBracketHalves } from '../hooks/useBracketHalves'
import { useLeaderboard } from '../hooks/useLeaderboard'
import { useT } from '../hooks/useT'
import type { RankedTeam } from '../lib/burden'
import { burdenColor } from '../lib/color'
import { flagEmoji } from '../lib/flags'
import { useStore } from '../store'

export function Leaderboard() {
  const t = useT()
  const ranked = useLeaderboard()
  const phase = useStore((s) => s.phase)
  const select = useStore((s) => s.select)
  const hover = useStore((s) => s.hover)
  const selected = useStore((s) => s.selected)
  const hovered = useStore((s) => s.hovered)
  const locale = useStore((s) => s.locale)
  const { resolved, half } = useBracketHalves()

  // Plain render fn (not a component) so rows keep identity across renders.
  const row = (team: RankedTeam, rank: number): ReactNode => {
    const active = team.id === selected
    const hov = team.id === hovered
    return (
      <motion.button
        key={team.id}
        layout="position"
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        type="button"
        onClick={() => select(active ? null : team.id)}
        onMouseEnter={() => hover(team.id)}
        onMouseLeave={() => hover(null)}
        className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors duration-150 ${
          active ? 'bg-surface-2' : hov ? 'bg-surface-2/50' : ''
        }`}
      >
        <span className="font-stat text-lg text-mut w-6 tabular text-right">{rank}</span>
        <span className="text-xl w-6 text-center leading-none">{flagEmoji(team.id)}</span>
        <span className="flex-1 min-w-0 truncate text-lg font-medium tracking-tight">
          {teamName(team.id, team.name, locale)}
        </span>
        <span className="font-stat text-sm text-mut w-4">{team.group}</span>
        <span className="w-16 h-2 rounded-full bg-line/70 overflow-hidden hidden sm:block">
          <span
            className="block h-full rounded-full"
            style={{ width: `${team.liveIndex * 100}%`, background: burdenColor(team.liveIndex) }}
          />
        </span>
        <span className="font-stat text-lg font-semibold text-fg tabular w-11 text-right">
          {Math.round(team.liveIndex * 100)}
        </span>
      </motion.button>
    )
  }

  const sectioned = phase !== 'all' && phase !== 'group' && resolved
  if (!sectioned) {
    return <div>{ranked.map((tm) => row(tm, tm.liveRank))}</div>
  }

  // Knockout phases: split the one list into the two bracket halves, each ranked.
  // Each half carries its own "Chaveamento do lado X" heading with a rule under it.
  const section = (title: string, rows: RankedTeam[]): ReactNode =>
    rows.length > 0 && (
      <div key={title}>
        <div className="mx-5 pt-4 pb-2 font-stat text-sm font-semibold text-mut border-b border-line/60">
          {title}
        </div>
        <div className="pt-1">{rows.map((tm, i) => row(tm, i + 1))}</div>
      </div>
    )

  return (
    <div className="pb-2">
      {section(
        t('bracketLeft'),
        ranked.filter((tm) => half[tm.id] === 'left'),
      )}
      {section(
        t('bracketRight'),
        ranked.filter((tm) => half[tm.id] === 'right'),
      )}
    </div>
  )
}
