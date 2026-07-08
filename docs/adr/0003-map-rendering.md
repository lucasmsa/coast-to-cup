# Flat GPU map with stroked outlines and animated arcs

Status: accepted (supersedes the extruded-3D direction explored first)

## Context

The map is the hero surface. An extruded, camera-pitched 3D landmass was built first; in review it read as murky "intel software" rather than a sports product, and a globe is less legible at continental scale.

## Decision

A flat Mercator map rendered in react-three-fiber: filled country shapes (USA, Mexico, Canada from world-atlas topojson, clipped to the host window) with stroked coastlines, flat colors, no gradients. On top:

- Vertical time-zone meridians (PT, MT, CT, ET) with labels riding the top edge of the view; the thesis is time zones, so they are part of the map.
- Venue markers as flat rings; the selected team's venues light up in its color.
- Trips as bowed arcs from base camp to venue that draw on from the base (dash-offset animation), with flow dots fading in behind the draw and a pop on the base marker.
- Pan-only controls (no rotate), clamped to the map bounds; bloom post-processing for the glow.

The canvas stays fixed-height above a single scrolling panel on narrow screens.

## Consequences

- Legibility and the SGK-style reference aesthetic win over 3D drama; three.js stays for GPU arcs and bloom, so the bundle keeps its WebGL weight.
- Selection animations are keyed remounts (arcs and base marker), so they replay on every click.
