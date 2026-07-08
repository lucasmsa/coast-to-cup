# tui

Terminal explorer for the coast-to-cup dataset: burden leaderboard, team
drill-down, group filter and live weight adjustment. Go, Bubble Tea + Lipgloss.

```bash
go run ./cmd/tui            # finds ../data/derived/derived.json
go run ./cmd/tui -print     # non-interactive leaderboard snapshot
go test ./...
```

Keys: arrows or j/k move, enter opens a team, g cycles groups, tab picks a
weight, +/- adjusts it, r resets, q quits.
