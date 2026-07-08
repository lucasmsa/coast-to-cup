import { AboutPage } from './components/AboutPage'
import { ResultsPage } from './components/ResultsPage'
import { CountUp } from './components/CountUp'
import { GroupFilter } from './components/GroupFilter'
import { LanguageSelector } from './components/LanguageSelector'
import { Leaderboard } from './components/Leaderboard'
import { SearchBox } from './components/SearchBox'
import { TeamCard } from './components/TeamCard'
import { WeightSliders } from './components/WeightSliders'
import { useDerived } from './hooks/useDerived'
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
    <header className="flex items-center justify-between gap-3 px-4 md:px-6 h-14 md:h-16 border-b border-line/70 shrink-0">
      <div className="flex items-baseline gap-4 min-w-0">
        <span className="font-display text-xl md:text-3xl tracking-[0.05em] uppercase whitespace-nowrap">
          Coast<span className="text-lime">·</span>to<span className="text-lime">·</span>Cup
        </span>
        <span className="hidden lg:block text-base text-mut">{t('tagline')}</span>
      </div>
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <a
          href="https://github.com/lucasmsa/coast-to-cup"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:block font-stat text-sm md:text-base font-semibold text-mut hover:text-fg transition-colors"
        >
          GitHub
        </a>
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
        {active.liveRank === 1 ? t('toughest') : `#${active.liveRank} / 48`}
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
          <aside className="bg-surface flex flex-col flex-1 min-h-0 overflow-y-auto md:overflow-visible scroll-thin">
            <div className="px-5 py-3.5 border-b border-line/60">
              <GroupFilter />
            </div>
            <WeightSliders />
            {selected ? (
              <div className="relative md:flex-1 md:min-h-0">
                <TeamCard />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface to-transparent hidden md:block" />
              </div>
            ) : (
              <>
                <div className="px-5 pt-3 pb-2 shrink-0 flex items-baseline justify-between gap-3">
                  <h2 className="font-stat text-base font-semibold text-mut truncate">{t('ranking')}</h2>
                  <SearchBox />
                </div>
                <div className="relative md:flex-1 md:min-h-0">
                  <Leaderboard />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-surface to-transparent hidden md:block" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface to-transparent hidden md:block" />
                </div>
              </>
            )}
          </aside>
        </main>
      )}
      <AboutPage />
      <ResultsPage />
    </div>
  )
}
