import { useEffect } from 'react'
import { AboutPage } from './components/AboutPage'
import { ResultsPage } from './components/ResultsPage'
import { CountUp } from './components/CountUp'
import { GroupFilter } from './components/GroupFilter'
import { LanguageSelector } from './components/LanguageSelector'
import { Leaderboard } from './components/Leaderboard'
import { PhaseTabs } from './components/PhaseTabs'
import { SearchBox } from './components/SearchBox'
import { TeamCard } from './components/TeamCard'
import { WeightSliders } from './components/WeightSliders'
import { useDerived } from './hooks/useDerived'
import { useEdgeFades } from './hooks/useEdgeFades'
import { useRanked } from './hooks/useRanked'
import { useT } from './hooks/useT'
import { teamName } from './config/teamNames'
import { flagEmoji } from './lib/flags'
import { Map3D } from './scene/Map3D'
import { useStore } from './store'

function TopBar() {
  const t = useT()
  const setOverlay = useStore((s) => s.setOverlay)
  return (
    <header className="flex items-center justify-between gap-2 px-3 md:px-6 h-14 md:h-16 border-b border-line/70 shrink-0">
      <div className="flex items-baseline gap-4 min-w-0">
        <span className="font-display text-base md:text-3xl tracking-[0.05em] uppercase whitespace-nowrap">
          Coast<span className="text-lime">·</span>to<span className="text-lime">·</span>Cup
        </span>
        <span className="hidden lg:block text-base text-mut">{t('tagline')}</span>
      </div>
      <div className="flex items-center gap-1.5 md:gap-4 shrink-0">
        <button
          type="button"
          onClick={() => setOverlay('results')}
          className="font-stat text-sm md:text-base font-semibold text-mut hover:text-fg transition-colors"
        >
          {t('results')}
        </button>
        <button
          type="button"
          onClick={() => setOverlay('about')}
          className="font-stat text-sm md:text-base font-semibold text-mut hover:text-fg transition-colors"
        >
          {t('about')}
        </button>
        <LanguageSelector />
        <a
          href="https://github.com/lucasmsa/coast-to-cup"
          target="_blank"
          rel="noreferrer"
          aria-label="Source on GitHub"
          className="text-mut hover:text-fg transition-colors"
        >
          <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
          </svg>
        </a>
      </div>
    </header>
  )
}

function HeroOverlay() {
  const t = useT()
  const ranked = useRanked()
  const selected = useStore((s) => s.selected)
  const locale = useStore((s) => s.locale)
  const active = selected ? ranked.find((r) => r.id === selected) : ranked[0]
  if (!active) return null
  return (
    <div className="absolute left-4 top-4 md:left-6 md:top-6 max-w-md pointer-events-none">
      <p className="font-stat text-sm font-semibold text-mut flex items-center gap-2">
        <span className="text-base">{flagEmoji(active.id)}</span>
        {active.liveRank === 1 ? t('toughest') : `#${active.liveRank} / ${ranked.length}`}
      </p>
      <h2 className="font-display text-3xl md:text-5xl leading-[0.95] uppercase mt-2">
        {teamName(active.id, active.name, locale)}
      </h2>
      <div className="flex items-end gap-2 mt-2 md:mt-3">
        <span className="font-display text-6xl md:text-8xl leading-[0.78] text-lime">
          <CountUp value={active.liveIndex * 100} />
        </span>
        <span className="font-stat text-base text-mut mb-1.5 md:mb-2">{t('scoreUnit')}</span>
      </div>
      <p className="text-base md:text-lg text-mut mt-2 md:mt-3">
        {t('basedIn')}{' '}
        <span className="block md:inline text-fg font-semibold underline decoration-lime/70 decoration-2 underline-offset-4">
          {active.base_camp}
        </span>
      </p>
    </div>
  )
}

function Loading({ failed }: { failed: boolean }) {
  return (
    <div className="flex-1 grid place-items-center">
      <p className="text-base text-mut">
        {failed ? 'could not load derived.json. run the Python build' : 'loading…'}
      </p>
    </div>
  )
}

export default function App() {
  const t = useT()
  const { status } = useDerived()
  const selected = useStore((s) => s.selected)
  const select = useStore((s) => s.select)
  const phase = useStore((s) => s.phase)
  const ranked = useRanked()
  const fades = useEdgeFades<HTMLElement>()

  // Drop the selection if the phase change removed that team from the pool.
  useEffect(() => {
    if (selected && ranked.length && !ranked.some((r) => r.id === selected)) select(null)
  }, [ranked, selected, select])

  return (
    <div className="h-full bg-atmosphere flex flex-col text-fg">
      <TopBar />
      {status !== 'ready' ? (
        <Loading failed={status === 'error'} />
      ) : (
        <main className="flex-1 flex flex-col md:grid md:grid-cols-[1fr_minmax(380px,420px)] min-h-0">
          <section className="relative h-[42vh] shrink-0 border-b border-line/70 md:h-auto md:border-b-0 md:border-r">
            <Map3D />
            <HeroOverlay />
          </section>
          <div className="relative flex flex-col flex-1 min-h-0 bg-surface">
            <aside
              ref={fades.rootRef}
              className="flex flex-col flex-1 min-h-0 overflow-y-auto scroll-thin"
            >
            <div ref={fades.topRef} className="h-px shrink-0" aria-hidden />
            <PhaseTabs />
            {phase === 'group' && (
              <div className="px-5 py-3.5 border-b border-line/60">
                <GroupFilter />
              </div>
            )}
            <WeightSliders />
            {selected ? (
              <TeamCard />
            ) : (
              <>
                <div className="px-5 pt-3 pb-2 flex items-baseline justify-between gap-3">
                  <h2 className="font-stat text-base font-semibold text-mut truncate">{t('ranking')}</h2>
                  <SearchBox />
                </div>
                <Leaderboard />
              </>
            )}
            <div ref={fades.bottomRef} className="h-px shrink-0" aria-hidden />
            </aside>
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-surface to-transparent transition-opacity duration-200 ${
                fades.top ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div
              className={`pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent transition-opacity duration-200 ${
                fades.bottom ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </main>
      )}
      <AboutPage />
      <ResultsPage />
    </div>
  )
}
