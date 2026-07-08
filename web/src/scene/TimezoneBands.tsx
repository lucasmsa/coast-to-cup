import { Html, Line } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { meridianX } from '../lib/mapGeometry'

// Continental US time-zone boundaries (approx meridians) and zone centers.
const BOUNDARIES = [-112.5, -97.5, -82.5]
const ZONES = [
  { lon: -120, label: 'PT' },
  { lon: -105, label: 'MT' },
  { lon: -90, label: 'CT' },
  { lon: -75, label: 'ET' },
]
const SPAN = 80 // lines long enough to cross the viewport at any zoom

/** Faint vertical meridians for the time zones; labels ride the top of the view. */
export function TimezoneBands() {
  const labels = useRef<THREE.Group>(null)
  const { camera } = useThree()

  useFrame(() => {
    if (!labels.current) return
    const cam = camera as THREE.PerspectiveCamera
    const halfHeight = cam.position.z * Math.tan(((cam.fov * Math.PI) / 180) / 2)
    labels.current.position.y = cam.position.y + halfHeight - 0.5
  })

  return (
    <group>
      {BOUNDARIES.map((lon) => {
        const x = meridianX(lon)
        return (
          <Line
            key={lon}
            points={[
              [x, -SPAN, 0.01],
              [x, SPAN, 0.01],
            ]}
            color="#26384c"
            lineWidth={1}
            transparent
            opacity={0.7}
          />
        )
      })}
      <group ref={labels}>
        {ZONES.map((z) => (
          <Html
            key={z.label}
            position={[meridianX(z.lon), 0, 0.01]}
            center
            zIndexRange={[30, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <span className="font-stat text-xs font-semibold tracking-[0.2em] text-mut/70 select-none">
              {z.label}
            </span>
          </Html>
        ))}
      </group>
    </group>
  )
}
