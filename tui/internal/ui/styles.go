package ui

import "github.com/charmbracelet/lipgloss"

// Dark canvas with one electric-lime accent, matching the project's visual language.
var (
	accent  = lipgloss.Color("#C6F432") // electric lime
	dim      = lipgloss.Color("#6B7280")
	fg       = lipgloss.Color("#E5E7EB")
	barFill  = lipgloss.Color("#C6F432")
	barTrack = lipgloss.Color("#2A2E37")

	titleStyle = lipgloss.NewStyle().Bold(true).Foreground(lipgloss.Color("#0B0E14")).
			Background(accent).Padding(0, 1)
	subtitleStyle = lipgloss.NewStyle().Foreground(dim)
	headerStyle   = lipgloss.NewStyle().Foreground(dim).Bold(true)
	rowStyle      = lipgloss.NewStyle().Foreground(fg)
	selectedRow   = lipgloss.NewStyle().Foreground(lipgloss.Color("#0B0E14")).Background(accent).Bold(true)
	helpStyle     = lipgloss.NewStyle().Foreground(dim)
	labelStyle    = lipgloss.NewStyle().Foreground(dim)
	valueStyle    = lipgloss.NewStyle().Foreground(fg).Bold(true)
	activeWeight  = lipgloss.NewStyle().Foreground(lipgloss.Color("#0B0E14")).Background(accent).Padding(0, 1)
	idleWeight    = lipgloss.NewStyle().Foreground(fg).Padding(0, 1)
)
