import { create } from 'zustand'
import type { HeatMode } from './lib/burden'
import type { Locale } from './config/i18n'
import type { ComponentKey, Derived, Weights } from './types'

const FALLBACK_WEIGHTS: Weights = { circadian: 0.4, travel: 0.3, altitude: 0.15, heat: 0.15 }

const LOCALE_KEY = 'coast-to-cup:locale'
const HEAT_KEY = 'coast-to-cup:heat-mode'

function loadLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved === 'en-US' || saved === 'pt-BR' || saved === 'es-MX') return saved
  } catch {
    // storage unavailable
  }
  return 'en-US'
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
  group: null,
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
  setData: (d) => {
    const w = { ...FALLBACK_WEIGHTS, ...(d.meta.weights as Weights) }
    set({ data: d, weights: w, defaults: w })
  },
  setWeight: (k, v) => set((s) => ({ weights: { ...s.weights, [k]: v } })),
  resetWeights: () => set((s) => ({ weights: s.defaults })),
  setGroup: (g) => set({ group: g }),
  setSearch: (q) => set({ search: q }),
  select: (id) => set({ selected: id }),
  hover: (id) => set({ hovered: id }),
  setMatchday: (md) => set({ matchday: md }),
}))
