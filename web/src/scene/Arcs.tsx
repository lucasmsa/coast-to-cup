import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { projectPoint } from '../lib/mapGeometry'

const PARTICLES = 4
const DRAW_SECONDS = 0.7

// Small triangle pointing +X; each flow marker rotates to the curve's tangent,
// so the arrows visibly travel from the base camp toward the venue.
const ARROW = new THREE.BufferGeometry()
ARROW.setAttribute(
  'position',
  new THREE.BufferAttribute(
    new Float32Array([0.06, 0, 0, -0.038, 0.034, 0, -0.038, -0.034, 0]),
    3,
  ),
)

/** One flat arc base->venue: the curve draws on from the base, then dots flow along it. */
function FlatArc({ a, b, color }: { a: [number, number]; b: [number, number]; color: string }) {
  const [ax, ay] = a
  const [bx, by] = b

  const curve = useMemo(() => {
    const mx = (ax + bx) / 2
    const my = (ay + by) / 2
    const dx = bx - ax
    const dy = by - ay
    const len = Math.hypot(dx, dy) || 1
    const bow = len * 0.22 // perpendicular offset for a gentle bow
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(ax, ay, 0.04),
      new THREE.Vector3(mx + (-dy / len) * bow, my + (dx / len) * bow, 0.04),
      new THREE.Vector3(bx, by, 0.04),
    )
  }, [ax, ay, bx, by])

  const points = useMemo(
    () => curve.getPoints(60).map((p) => [p.x, p.y, p.z] as [number, number, number]),
    [curve],
  )
  const arcLength = useMemo(() => curve.getLength(), [curve])

  const line = useRef<Line2>(null)
  const dots = useRef<THREE.Group>(null)
  const startedAt = useRef<number | null>(null)

  useFrame((state) => {
    if (startedAt.current === null) startedAt.current = state.clock.elapsedTime
    const progress = Math.min(1, (state.clock.elapsedTime - startedAt.current) / DRAW_SECONDS)

    if (line.current) {
      line.current.material.dashOffset = arcLength * (1 - progress)
    }
    if (dots.current) {
      const t = state.clock.elapsedTime * 0.22
      dots.current.children.forEach((dot, i) => {
        const u = (t + i / PARTICLES) % 1
        const p = curve.getPoint(u)
        const tangent = curve.getTangent(u)
        dot.position.set(p.x, p.y, p.z + 0.01)
        dot.rotation.z = Math.atan2(tangent.y, tangent.x)
        const material = (dot as THREE.Mesh).material as THREE.MeshBasicMaterial
        material.opacity = progress
      })
    }
  })

  return (
    <group>
      <Line
        ref={line}
        points={points}
        color={color}
        lineWidth={1.6}
        transparent
        opacity={0.5}
        dashed
        dashSize={arcLength}
        gapSize={arcLength}
      />
      <group ref={dots}>
        {Array.from({ length: PARTICLES }).map((_, i) => (
          <mesh key={i} geometry={ARROW}>
            <meshBasicMaterial color={color} toneMapped={false} transparent opacity={0} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export function Arcs({ base, targets, color }: { base: [number, number]; targets: [number, number][]; color: string }) {
  const bp = projectPoint(base[0], base[1])
  return (
    <>
      {targets.map((t, i) => {
        const tp = projectPoint(t[0], t[1])
        return <FlatArc key={i} a={bp} b={tp} color={color} />
      })}
    </>
  )
}
