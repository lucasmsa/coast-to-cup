import { motion } from 'motion/react'
import { teamName } from '../config/teamNames'
import { displayNorm } from '../lib/burden'
import { useTeam } from '../hooks/useRanked'
import { useT } from '../hooks/useT'
import { flagEmoji } from '../lib/flags'
import { tripLabel } from '../lib/stage'
import { useStore } from '../store'
import { HexRadar } from './HexRadar'

const hhmm = (h: number) =>
  `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h - Math.floor(h)) * 60)).padStart(2, '0')}`

/** Selected-team detail, docked in the sidebar. Big score lives in the hero. */
export function TeamCard() {
  const t = useT()
  const selected = useStore((s) => s.selected)
  const select = useStore((s) => s.select)
  const data = useStore((s) => s.data)
  const locale = useStore((s) => s.locale)
  const heatMode = useStore((s) => s.heatMode)
  const team = useTeam(selected)

  if (!team || !data) return null
  const venueCity = (id: string) => data.venues.find((v) => v.id === id)?.city ?? id

  return (
    <motion.div
      key={team.id}
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="md:h-full md:overflow-y-auto scroll-thin px-5 pb-5"
    >
      <button
        type="button"
        onClick={() => select(null)}
        className="flex items-center gap-2 pt-4 pb-2 text-mut hover:text-fg transition-colors"
      >
        <span className="text-xl leading-none">&larr;</span>
        <span className="font-stat text-sm font-semibold">{t('ranking')}</span>
      </button>

      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none shrink-0">{flagEmoji(team.id)}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-3xl leading-none tracking-wide uppercase">
            {teamName(team.id, team.name, locale)}
          </h3>
          <p className="font-stat text-sm text-mut mt-1.5">
            {team.code} &middot; {t('group')} {team.group} &middot; {team.confederation}
          </p>
        </div>
      </div>

      <div className="flex justify-center py-1">
        <HexRadar values={displayNorm(team.norm, heatMode)} size={158} color={team.color} />
      </div>

      <div className="font-stat text-xs font-semibold text-mut/70 mb-0.5">
        {t('trips')}
      </div>
      <div className="font-stat text-[11px] text-mut/50 mb-2">
        {t('kickoff')} <span className="text-mut/40">&rarr;</span>{' '}
        <span className="text-lime/70">{t('bodyClock')}</span>
      </div>
      <div className="space-y-1.5">
        {team.loads.map((l) => {
          const temp = heatMode === 'feels' ? l.apparent_temp_c : l.venue_temp_c
          const venue = data.venues.find((v) => v.id === l.venue_id)
          const climatized = venue?.roof === 'fixed' || venue?.roof === 'retractable'
          const hot = !climatized && temp != null && temp >= 32
          return (
            <div key={l.match_id} className="flex items-center gap-2 text-sm">
              <span className="font-stat text-mut w-[68px] shrink-0">
                {tripLabel(l.stage, l.matchday, t('match'))}
              </span>
              <span className="flex-1 truncate">{venueCity(l.venue_id)}</span>
              <span
                className={`font-stat tabular w-14 text-right shrink-0 whitespace-nowrap ${hot ? 'font-semibold' : 'text-mut'}`}
                style={hot ? { color: '#ff924d' } : undefined}
                title={climatized ? t('climatized') : undefined}
              >
                {temp != null ? `${Math.round(temp)}°` : '–'}
                {climatized && <span className="text-[10px] text-mut/60 font-semibold ml-0.5 align-middle">AC</span>}
              </span>
              <span className="font-stat text-mut tabular w-16 text-right shrink-0 whitespace-nowrap">
                {Math.round(l.travel_km)} km
              </span>
              <span className="font-stat tabular w-[88px] text-right whitespace-nowrap shrink-0">
                <span className="text-mut">{hhmm(l.local_kickoff_hour)}</span>
                <span className="text-mut/40">&rarr;</span>
                <span className="text-lime">{hhmm(l.body_clock_hour)}</span>
              </span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
