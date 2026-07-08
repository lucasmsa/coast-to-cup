import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { projectPoint } from '../lib/mapGeometry'
import { useStore } from '../store'

const Z = 0.03
const POP_SECONDS = 0.45

/** Overshooting ease for the marker pop (easeOutBack). */
function easeOutBack(p: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2
}

/** Venue markers as flat rings; the active team's venues glow. */
export function VenueMarkers({ activeIds, color }: { activeIds: string[]; color: string }) {
  const data = useStore((s) => s.data)
  if (!data) return null
  return (
    <>
      {data.venues.map((v) => {
        const [x, y] = projectPoint(v.lon, v.lat)
        const active = activeIds.includes(v.id)
        const c = active ? color : '#475a72'
        return (
          <group key={v.id} position={[x, y, Z]}>
            <mesh>
              <ringGeometry args={[active ? 0.085 : 0.05, active ? 0.115 : 0.072, 40]} />
              <meshBasicMaterial color={c} toneMapped={false} transparent opacity={active ? 1 : 0.8} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.028, 24]} />
              <meshBasicMaterial color={c} toneMapped={false} />
            </mesh>
          </group>
        )
      })}
    </>
  )
}

export function BaseMarker({ lon, lat, color }: { lon: number; lat: number; color: string }) {
  const [x, y] = projectPoint(lon, lat)
  const group = useRef<Group>(null)
  const startedAt = useRef<number | null>(null)

  useFrame((state) => {
    if (!group.current) return
    if (startedAt.current === null) startedAt.current = state.clock.elapsedTime
    const progress = Math.min(1, (state.clock.elapsedTime - startedAt.current) / POP_SECONDS)
    const scale = easeOutBack(progress)
    group.current.scale.setScalar(Math.max(0.001, scale))
  })

  return (
    <group ref={group} position={[x, y, Z + 0.01]}>
      <mesh>
        <ringGeometry args={[0.13, 0.17, 48]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.06, 28]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  )
}
