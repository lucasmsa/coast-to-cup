import { useT } from '../hooks/useT'
import { useStore } from '../store'

const GROUPS = 'ABCDEFGHIJKL'.split('')

export function GroupFilter() {
  const t = useT()
  const group = useStore((s) => s.group)
  const setGroup = useStore((s) => s.setGroup)

  const Pill = ({ value, label }: { value: string | null; label: string }) => {
    const active = group === value
    return (
      <button
        type="button"
        onClick={() => setGroup(value)}
        className={`min-w-8 px-2.5 py-1 rounded-md font-stat text-base font-semibold transition-colors ${
          active ? 'bg-lime text-ink' : 'text-mut hover:text-fg hover:bg-surface-2'
        }`}
      >
        {label}
      </button>
    )
  }

  return (
    <div>
      <span className="block font-stat text-base font-semibold text-mut mb-2">{t('groups')}</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        <Pill value={null} label={t('all')} />
        {GROUPS.map((g) => (
          <Pill key={g} value={g} label={g} />
        ))}
      </div>
    </div>
  )
}
