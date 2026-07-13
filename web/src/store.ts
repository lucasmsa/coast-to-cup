import { create } from 'zustand'
import type { HeatMode } from './lib/burden'
import type { Locale } from './config/i18n'
import type { Phase } from './config/phases'
import type { ComponentKey, Derived, Weights } from './types'

const FALLBACK_WEIGHTS: Weights = { circadian: 0.4, travel: 0.3, altitude: 0.15, heat: 0.15 }

const LOCALE_KEY = 'coast-to-cup:locale'
const HEAT_KEY = 'coast-to-cup:heat-mode'
const PHASE_KEY = 'coast-to-cup:phase'
const GROUP_KEY = 'coast-to-cup:group'
const WEIGHTS_KEY = 'coast-to-cup:weights'

const PHASES: Phase[] = ['all', 'group', 'R32', 'R16', 'QF', 'SF', 'F']

function readItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeItem(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // storage unavailable
  }
}

function loadPhase(): Phase {
  const saved = readItem(PHASE_KEY)
  return PHASES.includes(saved as Phase) ? (saved as Phase) : 'all'
}

function loadGroup(): string | null {
  const saved = readItem(GROUP_KEY)
  return saved && 'ABCDEFGHIJKL'.includes(saved) ? saved : null
}

function loadWeights(): Partial<Weights> | null {
  try {
    const raw = readItem(WEIGHTS_KEY)
    return raw ? (JSON.parse(raw) as Partial<Weights>) : null
  } catch {
    return null
  }
}

function detectLocale(): Locale {
  try {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language]
    for (const lang of languages) {
      const base = lang.toLowerCase()
      if (base.startsWith('pt')) return 'pt-BR'
      if (base.startsWith('es')) return 'es-MX'
      if (base.startsWith('en')) return 'en-US'
    }
  } catch {
    // navigator unavailable
  }
  return 'en-US'
}

function loadLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved === 'en-US' || saved === 'pt-BR' || saved === 'es-MX') return saved
  } catch {
    // storage unavailable
  }
  return detectLocale()
}

function loadHeatMode(): HeatMode {
  try {
    if (localStorage.getItem(HEAT_KEY) === 'air') return 'air'
  } catch {
    // storage unavailable
  }
  return 'feels'
}

function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    // storage unavailable
  }
}

interface Store {
  data: Derived | null
  weights: Weights
  defaults: Weights
  phase: Phase
  group: string | null
  search: string
  selected: string | null
  hovered: string | null
  matchday: number | null
  locale: Locale
  heatMode: HeatMode
  overlay: 'about' | 'results' | null
  setData: (d: Derived) => void
  setLocale: (l: Locale) => void
  setHeatMode: (m: HeatMode) => void
  setOverlay: (o: 'about' | 'results' | null) => void
  setWeight: (k: ComponentKey, v: number) => void
  resetWeights: () => void
  setPhase: (p: Phase) => void
  setGroup: (g: string | null) => void
  setSearch: (q: string) => void
  select: (id: string | null) => void
  hover: (id: string | null) => void
  setMatchday: (md: number | null) => void
}

export const useStore = create<Store>((set) => ({
  data: null,
  weights: FALLBACK_WEIGHTS,
  defaults: FALLBACK_WEIGHTS,
  phase: loadPhase(),
  group: loadPhase() === 'group' ? loadGroup() : null,
  search: '',
  selected: null,
  hovered: null,
  matchday: null,
  locale: loadLocale(),
  heatMode: loadHeatMode(),
  overlay: null,
  setLocale: (l) => {
    saveLocale(l)
    set({ locale: l })
  },
  setHeatMode: (m) => {
    try {
      localStorage.setItem(HEAT_KEY, m)
    } catch {
      // storage unavailable
    }
    set({ heatMode: m })
  },
  setOverlay: (o) => set({ overlay: o }),
  setData: (d) =>
    set((s) => {
      const base = { ...FALLBACK_WEIGHTS, ...(d.meta.weights as Weights) }
      const saved = loadWeights()
      const stages = new Set(d.matches.map((m) => m.stage))
      // A stored knockout phase is only valid once that round exists in the data.
      const phase = s.phase === 'all' || s.phase === 'group' || stages.has(s.phase) ? s.phase : 'all'
      return {
        data: d,
        weights: saved ? { ...base, ...saved } : base,
        defaults: base,
        phase,
        group: phase === 'group' ? s.group : null,
      }
    }),
  setWeight: (k, v) =>
    set((s) => {
      const weights = { ...s.weights, [k]: v }
      writeItem(WEIGHTS_KEY, JSON.stringify(weights))
      return { weights }
    }),
  resetWeights: () =>
    set((s) => {
      writeItem(WEIGHTS_KEY, null)
      return { weights: s.defaults }
    }),
  // Group letters only make sense in the group stage (everyone played the same 3 games).
  setPhase: (p) =>
    set((s) => {
      const group = p === 'group' ? s.group : null
      writeItem(PHASE_KEY, p)
      writeItem(GROUP_KEY, group)
      return { phase: p, group }
    }),
  setGroup: (g) => {
    writeItem(GROUP_KEY, g)
    set({ group: g })
  },
  setSearch: (q) => set({ search: q }),
  select: (id) => set({ selected: id }),
  hover: (id) => set({ hovered: id }),
  setMatchday: (md) => set({ matchday: md }),
}))
