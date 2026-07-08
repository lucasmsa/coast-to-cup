// Command tui is a Charm terminal explorer for the coast-to-cup burden dataset.
package main

import (
	"fmt"
	"os"

	"coasttocup/tui/internal/data"
	"coasttocup/tui/internal/ui"

	tea "github.com/charmbracelet/bubbletea"
)

func main() {
	print := false
	var rest []string
	for _, a := range os.Args[1:] {
		if a == "-print" || a == "--print" {
			print = true
		} else {
			rest = append(rest, a)
		}
	}

	d, err := data.LoadDerived(data.FindDerived(rest))
	if err != nil {
		fmt.Fprintln(os.Stderr, "coast-to-cup: cannot load derived data:", err)
		fmt.Fprintln(os.Stderr, "run the Python build first, or pass a path to derived.json")
		os.Exit(1)
	}

	if print {
		fmt.Println(ui.New(d).Snapshot())
		return
	}
	if _, err := tea.NewProgram(ui.New(d), tea.WithAltScreen()).Run(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
