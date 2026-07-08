import { LOCALES } from '../config/i18n'
import { useStore } from '../store'

export function LanguageSelector() {
  const locale = useStore((s) => s.locale)
  const setLocale = useStore((s) => s.setLocale)

  return (
    <div className="flex items-center gap-1 rounded-full border border-line/70 p-0.5">
      {LOCALES.map((l) => {
        const active = locale === l.id
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => setLocale(l.id)}
            title={l.label}
            className={`px-2.5 md:px-3 py-1 rounded-full font-stat text-sm md:text-base font-semibold tracking-wide transition-colors ${
              active ? 'bg-lime text-ink' : 'text-mut hover:text-fg'
            }`}
          >
            {l.short}
          </button>
        )
      })}
    </div>
  )
}
