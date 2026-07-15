import { geoMercator } from 'd3-geo'
import * as THREE from 'three'
import { feature } from 'topojson-client'
import worldTopo from 'world-atlas/countries-110m.json'

// USA, Mexico, Canada by numeric ISO id in world-atlas.
const HOST_IDS = new Set(['840', '484', '124'])
// Clip to the host region so Alaska and the Canadian arctic do not zoom the
// continent out; this keeps the relevant footprint filling the frame.
const WIN = { lonMin: -128, lonMax: -66, latMin: 13, latMax: 58 }

export const MAP_EXTENT = 12
export const MAP_DEPTH = 0.35

type Ring = [number, number][]
type Poly = Ring[]

function featurePolys(f: { geometry: { type: string; coordinates: unknown } }): Poly[] {
  const g = f.geometry
  if (g.type === 'Polygon') return [g.coordinates as Poly]
  if (g.type === 'MultiPolygon') return g.coordinates as Poly[]
  return []
}

function polyInWindow(poly: Poly): boolean {
  return poly[0].some(
    ([lon, lat]) =>
      lon >= WIN.lonMin && lon <= WIN.lonMax && lat >= WIN.latMin && lat <= WIN.latMax,
  )
}

const fc = feature(
  worldTopo as Parameters<typeof feature>[0],
  (worldTopo as { objects: { countries: unknown } }).objects.countries as Parameters<typeof feature>[1],
) as unknown as { features: { id?: string | number; geometry: { type: string; coordinates: unknown } }[] }

const keptPolys: Poly[] = []
for (const f of fc.features) {
  if (!HOST_IDS.has(String(f.id))) continue
  for (const poly of featurePolys(f)) if (polyInWindow(poly)) keptPolys.push(poly)
}

const keptFC = {
  type: 'FeatureCollection' as const,
  features: keptPolys.map((p) => ({
    type: 'Feature' as const,
    properties: {},
    geometry: { type: 'Polygon' as const, coordinates: p },
  })),
}

const projection = geoMercator().fitSize([MAP_EXTENT, MAP_EXTENT], keptFC as never)

/** Project lon/lat into centered map space (x east, y north), pre-rotation. */
export function projectPoint(lon: number, lat: number): [number, number] {
  const p = projection([lon, lat]) as [number, number]
  return [p[0] - MAP_EXTENT / 2, -(p[1] - MAP_EXTENT / 2)]
}

export function buildShapes(): THREE.Shape[] {
  return keptPolys.map((poly) => {
    const [outer, ...holes] = poly
    const shape = new THREE.Shape()
    outer.forEach(([lon, lat], i) => {
      const [x, y] = projectPoint(lon, lat)
      i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)
    })
    for (const hole of holes) {
      const path = new THREE.Path()
      hole.forEach(([lon, lat], i) => {
        const [x, y] = projectPoint(lon, lat)
        i === 0 ? path.moveTo(x, y) : path.lineTo(x, y)
      })
      shape.holes.push(path)
    }
    return shape
  })
}

/** x of a meridian (constant longitude). In Mercator, x depends only on lon. */
export function meridianX(lon: number): number {
  return projectPoint(lon, 0)[0]
}

// Altitude stems mark the climb a team actually makes from its base camp to a
// venue (venue altitude minus base altitude, exactly as the model scores it), so
// only the selected team's venues get one, scaled by that climb. Small climbs
// read as ground level (no stem).
export const ALTITUDE_STEM_FLOOR_M = 300
export const ALTITUDE_STEM_REF_M = 2100 // ~the largest base-to-venue climb -> full length
export const ALTITUDE_STEM_MAX_LEN = 0.8

export function altitudeStemLength(climb_m: number): number {
  if (climb_m < ALTITUDE_STEM_FLOOR_M) return 0
  return Math.min(climb_m / ALTITUDE_STEM_REF_M, 1) * ALTITUDE_STEM_MAX_LEN
}

export const MAP_BOUNDS = (() => {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const poly of keptPolys) {
    for (const [lon, lat] of poly[0]) {
      const [x, y] = projectPoint(lon, lat)
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    }
  }
  return { minX, maxX, minY, maxY }
})()

/** Outer-ring coastlines as point arrays, for stroked outlines on the flat map. */
export function buildOutlines(): [number, number, number][][] {
  return keptPolys.map((poly) =>
    poly[0].map(([lon, lat]) => {
      const [x, y] = projectPoint(lon, lat)
      return [x, y, 0.02] as [number, number, number]
    }),
  )
}
