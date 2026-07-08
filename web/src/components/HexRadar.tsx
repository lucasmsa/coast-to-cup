import { COMPONENTS } from '../config/components'
import type { ComponentKey } from '../types'

interface Props {
  values: Record<ComponentKey, number>
  color?: string
  size?: number
}

/** Radar / hexagon-style burden profile over the component axes. Presentational. */
export function HexRadar({ values, color = '#c6f432', size = 200 }: Props) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 30
  const n = COMPONENTS.length
  const angleAt = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n
  const at = (i: number, radius: number): [number, number] => [
    cx + radius * Math.cos(angleAt(i)),
    cy + radius * Math.sin(angleAt(i)),
  ]
  const ringPoints = (frac: number) =>
    COMPONENTS.map((_, i) => at(i, r * frac).join(',')).join(' ')
  const valuePoints = COMPONENTS.map((c, i) => {
    const v = Math.max(0, Math.min(1, values[c.key] ?? 0))
    return at(i, r * v).join(',')
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="overflow-visible">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={ringPoints(f)} fill="none" stroke="#222a36" strokeWidth={1} />
      ))}
      {COMPONENTS.map((c, i) => {
        const [x, y] = at(i, r)
        const [lx, ly] = at(i, r + 16)
        return (
          <g key={c.key}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="#222a36" strokeWidth={1} />
            <text
              x={lx}
              y={ly}
              fill="#88909e"
              fontSize={9}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="Saira"
              fontWeight={600}
            >
              {c.short}
            </text>
          </g>
        )
      })}
      <polygon
        points={valuePoints}
        fill={color}
        fillOpacity={0.16}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {COMPONENTS.map((c, i) => {
        const v = Math.max(0, Math.min(1, values[c.key] ?? 0))
        const [x, y] = at(i, r * v)
        return <circle key={c.key} cx={x} cy={y} r={3} fill={color} />
      })}
    </svg>
  )
}
