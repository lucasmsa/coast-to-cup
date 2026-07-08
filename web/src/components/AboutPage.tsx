import { ABOUT } from '../config/about'
import { DATA_SOURCES, SCIENCE, type Source } from '../config/citations'
import { useT } from '../hooks/useT'
import { useStore } from '../store'
import { OverlayPage } from './OverlayPage'

function SourceList({ items }: { items: Source[] }) {
  return (
    <ul className="space-y-3">
      {items.map((s) => (
        <li key={s.label}>
          <a href={s.url} target="_blank" rel="noreferrer" className="group block">
            <span className="text-fg font-medium group-hover:text-lime transition-colors">{s.label}</span>
            <span className="block text-sm text-mut mt-0.5 leading-snug">{s.detail}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export function AboutPage() {
  const t = useT()
  const locale = useStore((s) => s.locale)
  const open = useStore((s) => s.overlay === 'about')
  const setOverlay = useStore((s) => s.setOverlay)
  const c = ABOUT[locale]

  return (
    <OverlayPage open={open}>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <span className="font-display text-3xl tracking-[0.05em] uppercase">
            Coast<span className="text-lime">·</span>to<span className="text-lime">·</span>Cup
          </span>
          <button
            type="button"
            onClick={() => setOverlay(null)}
            className="font-stat text-sm font-semibold text-mut hover:text-fg flex items-center gap-2"
          >
            {t('close')} <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <p className="text-2xl md:text-3xl leading-snug text-fg mb-12 max-w-2xl">{c.intro}</p>

        <div className="space-y-12">
          {c.sections.map((sec) => (
            <section key={sec.title}>
              <h2 className="font-stat text-sm font-semibold uppercase tracking-[0.18em] text-lime mb-3">
                {sec.title}
              </h2>
              {sec.body.map((p, i) => (
                <p key={i} className="text-lg text-mut leading-relaxed mb-3 max-w-2xl">
                  {p}
                </p>
              ))}
            </section>
          ))}

          <section>
            <h2 className="font-stat text-sm font-semibold uppercase tracking-[0.18em] text-lime mb-4">
              {t('science')}
            </h2>
            <SourceList items={SCIENCE} />
          </section>

          <section>
            <h2 className="font-stat text-sm font-semibold uppercase tracking-[0.18em] text-lime mb-4">
              {t('dataSources')}
            </h2>
            <SourceList items={DATA_SOURCES} />
          </section>

          <div className="pt-8 border-t border-line/60">
            <p className="text-base text-mut/70">{c.inspired}</p>
            <p className="text-base text-mut/70 mt-3 flex items-center gap-4">
              <a
                href="https://github.com/lucasmsa"
                target="_blank"
                rel="noreferrer"
                className="hover:text-lime transition-colors font-medium"
              >
                made by lucasmsa
              </a>
              <a
                href="https://github.com/lucasmsa/coast-to-cup"
                target="_blank"
                rel="noreferrer"
                className="hover:text-lime transition-colors font-medium"
              >
                source
              </a>
              <a
                href="https://buymeacoffee.com/lmsamoreirt"
                target="_blank"
                rel="noreferrer"
                className="hover:text-lime transition-colors font-medium"
              >
                buy me a coffee ☕
              </a>
            </p>
          </div>
        </div>
      </div>
    </OverlayPage>
  )
}
