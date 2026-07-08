import { Line } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { buildOutlines, buildShapes } from '../lib/mapGeometry'

/** Flat host-nation landmass: filled shapes plus stroked coastlines. */
export function Landmass() {
  const fill = useMemo(() => new THREE.ShapeGeometry(buildShapes()), [])
  const outlines = useMemo(() => buildOutlines(), [])

  return (
    <group>
      <mesh geometry={fill} position={[0, 0, 0]}>
        <meshBasicMaterial color="#1d212b" />
      </mesh>
      {outlines.map((points, i) => (
        <Line key={i} points={points} color="#3c4655" lineWidth={1.4} />
      ))}
    </group>
  )
}
