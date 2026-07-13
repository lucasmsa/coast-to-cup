import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useActiveTeam } from '../hooks/useActiveTeam'
import { MAP_BOUNDS } from '../lib/mapGeometry'
import { useStore } from '../store'
import { Arcs } from './Arcs'
import { Landmass } from './Landmass'
import { BaseMarker, VenueMarkers } from './Markers'
import { TimezoneBands } from './TimezoneBands'

/** Keeps the pan target within the map bounds so the map can never leave view. */
function PanClamp() {
  const controls = useThree((s) => s.controls) as { target: THREE.Vector3 } | null
  const camera = useThree((s) => s.camera)
  const padX = 1
  const padY = 1
  useFrame(() => {
    if (!controls) return
    const t = controls.target
    const cx = THREE.MathUtils.clamp(t.x, MAP_BOUNDS.minX - padX, MAP_BOUNDS.maxX + padX)
    const cy = THREE.MathUtils.clamp(t.y, MAP_BOUNDS.minY - padY, MAP_BOUNDS.maxY + padY)
    if (cx !== t.x || cy !== t.y) {
      camera.position.x += cx - t.x
      camera.position.y += cy - t.y
      t.x = cx
      t.y = cy
    }
  })
  return null
}

export function Map3D() {
  const data = useStore((s) => s.data)
  const team = useActiveTeam()

  const venueIds = team ? team.scopedLoads.map((l) => l.venue_id) : []
  const targets: [number, number][] =
    team && data
      ? team.scopedLoads.map((l) => {
          const v = data.venues.find((x) => x.id === l.venue_id)
          return v ? [v.lon, v.lat] : [0, 0]
        })
      : []
  const hasBase = !!team && team.base_lat != null && team.base_lon != null

  return (
    <Canvas
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 14], fov: 50 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#14161d']} />
      <Landmass />
      <TimezoneBands />
      <VenueMarkers activeIds={venueIds} color={team?.color ?? '#c6f432'} />
      {hasBase && (
        <Arcs
          key={`arcs-${team!.id}-${targets.length}`}
          base={[team!.base_lon!, team!.base_lat!]}
          targets={targets}
          color={team!.color}
        />
      )}
      {hasBase && (
        <BaseMarker key={`base-${team!.id}`} lon={team!.base_lon!} lat={team!.base_lat!} color={team!.color} />
      )}

      <OrbitControls
        makeDefault
        enableRotate={false}
        enablePan
        screenSpacePanning
        minDistance={9}
        maxDistance={20}
        mouseButtons={{ LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
        touches={{ ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN }}
      />
      <PanClamp />
      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.5} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  )
}
