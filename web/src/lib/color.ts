function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function mixWhite(hex: string, amount: number): string {
  const h = hex.replace('#', '')
  const ch = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  return (
    '#' +
    ch
      .map((c) => Math.round(c + (255 - c) * amount).toString(16).padStart(2, '0'))
      .join('')
  )
}

/** Lift a team color so dark kits (e.g. black) stay readable on the dark base. */
export function vividOnDark(hex: string): string {
  return luminance(hex) < 0.22 ? mixWhite(hex, 0.45) : hex
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor(h / 60) % 6]
  return (
    '#' +
    [r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('')
  )
}

/** Burden as a heat ramp: green (easy) through amber to red (heavy logistics). */
export function burdenColor(index01: number): string {
  const t = Math.max(0, Math.min(1, index01))
  return hslToHex(150 - t * 145, 0.72, 0.56)
}
