/**
 * Placeholder for the R3F 3D extruded-map scene (task 7). Renders an
 * atmospheric panel with a dot grid and a few decorative arcs so the layout
 * reads correctly until the WebGL canvas lands here.
 */
export function MapPanel() {
  return (
    <div className="absolute inset-0 bg-atmosphere overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(#1b2230 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        fill="none"
        stroke="#c6f432"
      >
        <path d="M 180 700 Q 450 60 800 400" strokeOpacity="0.35" strokeWidth="2" />
        <path d="M 180 700 Q 320 360 560 300" strokeOpacity="0.18" strokeWidth="2" />
        <path d="M 800 400 Q 600 820 320 800" strokeOpacity="0.14" strokeWidth="2" />
      </svg>
      <div className="absolute right-5 bottom-5 font-stat text-xs font-semibold tracking-wide text-mut uppercase">
        3D map · in progress
      </div>
    </div>
  )
}
