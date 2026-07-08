import type { ComponentKey } from '../types'

export interface ComponentMeta {
  key: ComponentKey
  label: string
  short: string
  blurb: string
}

// Order here drives the hexagon axes, the sliders, and the breakdown bars.
export const COMPONENTS: ComponentMeta[] = [
  { key: 'circadian', label: 'Body clock', short: 'CIRC', blurb: 'Jet-lag vs the 4-8pm peak' },
  { key: 'travel', label: 'Travel', short: 'TRVL', blurb: 'Round-trip km, base to venue' },
  { key: 'altitude', label: 'Altitude', short: 'ALT', blurb: 'Climb above the base camp' },
  { key: 'heat', label: 'Heat', short: 'HEAT', blurb: 'Venue heat over the base climate' },
]
