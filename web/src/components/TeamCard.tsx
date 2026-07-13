import { motion } from 'motion/react'
import { teamName } from '../config/teamNames'
import { useTeam } from '../hooks/useRanked'
import { useT } from '../hooks/useT'
import { flagEmoji } from '../lib/flags'
import { INDOOR_TEMP_C } from '../config/model'
import { VENUE_SHORT } from '../config/venueNames'
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
  const venueCity = (id: string) => VENUE_SHORT[id] ?? data.venues.find((v) => v.id === id)?.city ?? id
  const venueFull = (id: string) => data.venues.find((v) => v.id === id)?.name ?? id

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
            {team.code} &middot; {t('group')} {team.group}
          </p>
        </div>
      </div>

      <div className="flex justify-center py-1">
        <HexRadar
          values={team.scopedNorm}
          labels={{
            circadian: t('circadian'),
            travel: t('travel'),
            altitude: t('altitude'),
            heat: t('heat'),
          }}
          size={158}
          color={team.color}
        />
      </div>

      <div className="font-stat text-xs font-semibold text-mut/70 mb-2">{t('trips')}</div>
      <div className="flex items-center gap-2 font-stat text-[10px] text-mut/60 border-b border-line/60 pb-1.5 mb-1.5">
        <span className="w-[56px] shrink-0">{t('stageCol')}</span>
        <span className="flex-1">{t('venueCol')}</span>
        <span className="w-12 text-left shrink-0">&deg;C</span>
        <span className="w-10 text-left shrink-0">km</span>
        <span className="w-[92px] text-right shrink-0 whitespace-nowrap">
          {t('kickoff')}<span className="text-mut/40">&rarr;</span>
          <span className="text-lime/70">{t('bodyClock')}</span>
        </span>
      </div>
      <div className="space-y-1.5">
        {team.scopedLoads.map((l) => {
          const outside = heatMode === 'feels' ? l.apparent_temp_c : l.venue_temp_c
          const venue = data.venues.find((v) => v.id === l.venue_id)
          const climatized = venue?.roof === 'fixed' || venue?.roof === 'retractable'
          // Climatized venues play at the held indoor temperature, exactly as the
          // model scores them, so the display never swings with the outside air.
          const temp = climatized && outside != null ? Math.min(outside, INDOOR_TEMP_C) : outside
          const hot = !climatized && temp != null && temp >= 32
          return (
            <div key={l.match_id} className="flex items-center gap-2 text-sm">
              <span className="font-stat text-mut w-[56px] shrink-0">
                {tripLabel(l.stage, l.matchday, t)}
              </span>
              <span className="flex-1 truncate" title={venueFull(l.venue_id)}>
                {venueCity(l.venue_id)}
              </span>
              <span
                className={`font-stat tabular w-12 text-left shrink-0 whitespace-nowrap ${hot ? 'font-semibold' : 'text-mut'}`}
                style={hot ? { color: '#ff924d' } : undefined}
                title={climatized ? t('climatized') : undefined}
              >
                {temp != null ? `${Math.round(temp)}°` : '–'}
                {climatized && <span className="text-[10px] text-mut/60 font-semibold ml-0.5 align-middle">AC</span>}
              </span>
              <span className="font-stat text-mut tabular w-10 text-left shrink-0 whitespace-nowrap">
                {Math.round(l.travel_km)}
              </span>
              <span className="font-stat tabular w-[92px] text-right whitespace-nowrap shrink-0">
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
