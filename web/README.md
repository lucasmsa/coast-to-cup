# web

The coast-to-cup product: flat GPU map with animated trip arcs, burden
leaderboard, hexagon team profiles, adjustable weights, live model-vs-results,
in EN/PT/ES. Vite + React + TypeScript + Tailwind + react-three-fiber + zustand.

```bash
pnpm install
pnpm dev     # http://localhost:5173
pnpm build
```

Reads `public/data/derived.json` (copied from `../data/derived/` after a
pipeline build) and polls ESPN's public scoreboard for live scores.

Layout convention: components render only; state and effects live in
`src/hooks`, pure calculations in `src/lib`, copy and constants in `src/config`.
