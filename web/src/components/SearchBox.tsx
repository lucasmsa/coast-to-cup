import { useT } from '../hooks/useT'
import { useStore } from '../store'

/** Narrows the leaderboard by team name or code. */
export function SearchBox() {
  const t = useT()
  const search = useStore((s) => s.search)
  const setSearch = useStore((s) => s.setSearch)

  return (
    <span className="relative">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t('searchTeam')}
        aria-label={t('searchTeam')}
        className="w-32 bg-transparent border-b border-line focus:border-lime outline-none font-stat text-base font-semibold text-fg placeholder:text-mut/60 py-0.5 pr-5 cursor-text"
      />
      {search && (
        <button
          type="button"
          onClick={() => setSearch('')}
          aria-label={t('close')}
          className="absolute right-0 top-1/2 -translate-y-1/2 text-mut hover:text-fg text-base leading-none"
        >
          &times;
        </button>
      )}
    </span>
  )
}
