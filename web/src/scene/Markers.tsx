import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { altitudeStemLength, projectPoint } from '../lib/mapGeometry'
import { useStore } from '../store'

// Strong, non-glowing slate so altitude reads as a drawn stroke, not a bloom.
const STEM_COLOR = '#6f84a0'

const Z = 0.03
const POP_SECONDS = 0.45

/** Overshooting ease for the marker pop (easeOutBack). */
function easeOutBack(p: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2
}

/** Venue markers as flat rings; the active team's venues glow. */
export function VenueMarkers({
  activeIds,
  color,
  climbs,
}: {
  activeIds: string[]
  color: string
  climbs: Record<string, number>
}) {
  const data = useStore((s) => s.data)
  if (!data) return null
  // Stems that will render, and their mean x, so labels on neighbouring stems
  // flow to opposite sides (west label left, east label right) instead of colliding.
  const stemVenues = data.venues.filter((v) => altitudeStemLength(climbs[v.id] ?? 0) > 0)
  const meanStemX =
    stemVenues.length > 0
      ? stemVenues.reduce((s, v) => s + projectPoint(v.lon, v.lat)[0], 0) / stemVenues.length
      : 0
  return (
    <>
      {data.venues.map((v) => {
        const [x, y] = projectPoint(v.lon, v.lat)
        const active = activeIds.includes(v.id)
        const c = active ? color : '#475a72'
        const climb = climbs[v.id] ?? 0
        const stem = altitudeStemLength(climb)
        const labelLeft = stemVenues.length > 1 && x < meanStemX
        return (
          <group key={v.id} position={[x, y, Z]}>
            {stem > 0 && (
              // z in front of the marker so the stroke reads over the glowing ring, not behind it.
              <group position={[0, 0, 0.02]}>
                <mesh position={[0, stem / 2, 0]}>
                  <planeGeometry args={[0.03, stem]} />
                  <meshBasicMaterial color={STEM_COLOR} toneMapped={false} />
                </mesh>
                <mesh position={[0, stem, 0]}>
                  <circleGeometry args={[0.035, 24]} />
                  <meshBasicMaterial color={STEM_COLOR} toneMapped={false} />
                </mesh>
                <Html position={[labelLeft ? -0.06 : 0.06, stem, 0]} style={{ pointerEvents: 'none' }}>
                  <div
                    className="font-stat font-semibold whitespace-nowrap tabular"
                    style={{
                      fontSize: 11,
                      color: '#e2e8f2',
                      backgroundColor: 'rgba(13,15,20,0.85)',
                      padding: '1px 5px',
                      borderRadius: 4,
                      transform: labelLeft ? 'translate(-100%, -50%)' : 'translateY(-50%)',
                    }}
                  >
                    +{Math.round(climb)} m
                  </div>
                </Html>
              </group>
            )}
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
