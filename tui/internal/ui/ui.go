// Package ui is the Bubble Tea terminal explorer over the burden dataset.
package ui

import (
	"fmt"
	"sort"
	"strings"

	"coasttocup/tui/internal/data"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
)

const groups = "ABCDEFGHIJKL"

type mode int

const (
	modeList mode = iota
	modeDetail
)

// Model holds the TUI state. Weights re-weight the precomputed per-team norms,
// so re-ranking is instant and needs no re-normalization.
type Model struct {
	d        *data.Derived
	weights  map[string]float64
	defaults map[string]float64
	ranked   []*data.Team
	cursor   int
	mode     mode
	group    int // -1 = all, else index into groups
	wsel     int // selected weight (index into data.Components)
	h        int
}

func New(d *data.Derived) Model {
	weights := map[string]float64{}
	defaults := map[string]float64{}
	for k, v := range d.Meta.Weights {
		weights[k], defaults[k] = v, v
	}
	m := Model{d: d, weights: weights, defaults: defaults, group: -1}
	m.rerank()
	return m
}

func (m Model) Init() tea.Cmd { return nil }

func (m *Model) indexOf(t *data.Team) float64 {
	var s, w float64
	for _, c := range data.Components {
		s += t.Norm[c] * m.weights[c]
		w += m.weights[c]
	}
	if w == 0 {
		return 0
	}
	return s / w
}

func (m *Model) rerank() {
	m.ranked = m.ranked[:0]
	for i := range m.d.Teams {
		t := &m.d.Teams[i]
		if m.group == -1 || t.Group == string(groups[m.group]) {
			m.ranked = append(m.ranked, t)
		}
	}
	sort.SliceStable(m.ranked, func(i, j int) bool {
		return m.indexOf(m.ranked[i]) > m.indexOf(m.ranked[j])
	})
	if m.cursor >= len(m.ranked) {
		m.cursor = len(m.ranked) - 1
	}
	if m.cursor < 0 {
		m.cursor = 0
	}
}

func (m Model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.h = msg.Height
	case tea.KeyMsg:
		switch msg.String() {
		case "q", "ctrl+c":
			return m, tea.Quit
		case "up", "k":
			if m.mode == modeList && m.cursor > 0 {
				m.cursor--
			}
		case "down", "j":
			if m.mode == modeList && m.cursor < len(m.ranked)-1 {
				m.cursor++
			}
		case "enter", "l":
			if m.mode == modeList && len(m.ranked) > 0 {
				m.mode = modeDetail
			}
		case "esc", "backspace", "h":
			m.mode = modeList
		case "g":
			m.group++
			if m.group >= len(groups) {
				m.group = -1
			}
			m.rerank()
		case "tab":
			m.wsel = (m.wsel + 1) % len(data.Components)
		case "+", "=":
			m.weights[data.Components[m.wsel]] += 0.05
			m.rerank()
		case "-", "_":
			if w := m.weights[data.Components[m.wsel]] - 0.05; w >= 0 {
				m.weights[data.Components[m.wsel]] = w
			} else {
				m.weights[data.Components[m.wsel]] = 0
			}
			m.rerank()
		case "r":
			for k, v := range m.defaults {
				m.weights[k] = v
			}
			m.rerank()
		}
	}
	return m, nil
}

func bar(v float64, width int) string {
	if v < 0 {
		v = 0
	}
	if v > 1 {
		v = 1
	}
	n := int(v*float64(width) + 0.5)
	return lipgloss.NewStyle().Foreground(barFill).Render(strings.Repeat("█", n)) +
		lipgloss.NewStyle().Foreground(barTrack).Render(strings.Repeat("░", width-n))
}

func swatch(hex string) string {
	return lipgloss.NewStyle().Background(lipgloss.Color(hex)).Render("  ")
}

func trunc(s string, n int) string {
	if len(s) <= n {
		return s + strings.Repeat(" ", n-len(s))
	}
	return s[:n-1] + "…"
}

// Snapshot renders the leaderboard once, for non-interactive use (tests, docs).
func (m Model) Snapshot() string {
	m.h = 30
	return m.listView()
}

func (m Model) View() string {
	if m.mode == modeDetail && len(m.ranked) > 0 {
		return m.detailView(m.ranked[m.cursor])
	}
	return m.listView()
}

func (m Model) weightsLine() string {
	parts := make([]string, len(data.Components))
	for i, c := range data.Components {
		txt := fmt.Sprintf("%s %.2f", c[:3], m.weights[c])
		if i == m.wsel {
			parts[i] = activeWeight.Render(txt)
		} else {
			parts[i] = idleWeight.Render(txt)
		}
	}
	return labelStyle.Render("weights ") + strings.Join(parts, " ")
}

func (m Model) listView() string {
	var b strings.Builder
	groupLabel := "ALL"
	if m.group >= 0 {
		groupLabel = "Group " + string(groups[m.group])
	}
	b.WriteString(titleStyle.Render(" coast-to-cup ") + "  " +
		subtitleStyle.Render(fmt.Sprintf("2026 World Cup · schedule burden · %s", groupLabel)) + "\n\n")
	b.WriteString(m.weightsLine() + "\n\n")
	b.WriteString(headerStyle.Render(fmt.Sprintf("  %-3s   %-18s %-4s %-18s %s", "#", "TEAM", "GRP", "BURDEN", "INDEX")) + "\n")

	limit := m.h - 9
	if limit < 1 || limit > len(m.ranked) {
		limit = len(m.ranked)
	}
	for i := 0; i < limit; i++ {
		t := m.ranked[i]
		idx := m.indexOf(t)
		line := fmt.Sprintf(" %2d  %s %s %-4s %s %.3f",
			i+1, swatch(t.Color), trunc(t.Name, 18), t.Group, bar(idx, 16), idx)
		if i == m.cursor {
			b.WriteString(selectedRow.Render(line) + "\n")
		} else {
			b.WriteString(rowStyle.Render(line) + "\n")
		}
	}
	b.WriteString("\n" + helpStyle.Render("↑/↓ move · enter detail · g group · tab pick weight · +/- adjust · r reset · q quit"))
	return b.String()
}

func (m Model) detailView(t *data.Team) string {
	var b strings.Builder
	b.WriteString(titleStyle.Render(" "+strings.ToUpper(t.Name)+" ") + "  " +
		subtitleStyle.Render(fmt.Sprintf("%s · Group %s · %s", t.Code, t.Group, t.Confederation)) + "\n\n")
	b.WriteString(labelStyle.Render("base camp  ") + valueStyle.Render(t.BaseCamp) + "\n")
	b.WriteString(labelStyle.Render("burden     ") + valueStyle.Render(fmt.Sprintf("%.3f", m.indexOf(t))) + "\n\n")

	b.WriteString(headerStyle.Render("  GROUP-STAGE TRIPS") + "\n")
	b.WriteString(headerStyle.Render(fmt.Sprintf("  %-3s %-22s %6s %6s %9s %6s %6s", "MD", "VENUE", "BODY", "CIRC", "TRAVEL", "ALT", "HEAT")) + "\n")
	for _, l := range t.Loads {
		b.WriteString(rowStyle.Render(fmt.Sprintf("  %-3d %-22s %5.1fh %6.2f %7.0fkm %5.0fm %5.1f°",
			l.Matchday, trunc(l.VenueID, 22), l.BodyClock, l.Circadian, l.TravelKm, l.AltitudeClimbM, l.HeatExcessC)) + "\n")
	}

	b.WriteString("\n" + headerStyle.Render("  BURDEN PROFILE (normalized)") + "\n")
	for _, c := range data.Components {
		b.WriteString(fmt.Sprintf("  %-10s %s %.2f\n", c, bar(t.Norm[c], 20), t.Norm[c]))
	}
	b.WriteString("\n" + helpStyle.Render("esc back · q quit"))
	return b.String()
}
