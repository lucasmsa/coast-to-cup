// Package data loads the derived burden dataset produced by the Python pipeline.
package data

import (
	"encoding/json"
	"os"
	"path/filepath"
)

// Components is the canonical order of the burden factors.
var Components = []string{"circadian", "travel", "altitude", "heat"}

type Derived struct {
	Meta    Meta    `json:"meta"`
	Teams   []Team  `json:"teams"`
	Matches []Match `json:"matches"`
}

type Meta struct {
	Weights    map[string]float64 `json:"weights"`
	Components []string           `json:"components"`
	Counts     map[string]int     `json:"counts"`
}

type Team struct {
	ID            string             `json:"id"`
	Name          string             `json:"name"`
	Code          string             `json:"code"`
	Group         string             `json:"group"`
	Confederation string             `json:"confederation"`
	Color         string             `json:"color"`
	BaseCamp      string             `json:"base_camp"`
	Raw           map[string]float64 `json:"raw"`
	Norm          map[string]float64 `json:"norm"`
	Index         float64            `json:"index"`
	Rank          int                `json:"rank"`
	Loads         []Load             `json:"loads"`
}

type Load struct {
	MatchID        string  `json:"match_id"`
	Matchday       int     `json:"matchday"`
	VenueID        string  `json:"venue_id"`
	BodyClock      float64 `json:"body_clock_hour"`
	Circadian      float64 `json:"circadian"`
	TravelKm       float64 `json:"travel_km"`
	AltitudeClimbM float64 `json:"altitude_climb_m"`
	HeatExcessC    float64 `json:"heat_excess_c"`
}

type Match struct {
	ID         string  `json:"id"`
	Group      string  `json:"group"`
	Matchday   int     `json:"matchday"`
	VenueID    string  `json:"venue_id"`
	EdgeTeam   string  `json:"edge_team"`
	EdgeMargin float64 `json:"edge_margin"`
	A          Side    `json:"a"`
	B          Side    `json:"b"`
}

type Side struct {
	TeamID string `json:"team_id"`
}

// LoadDerived reads and parses a derived.json file.
func LoadDerived(path string) (*Derived, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var d Derived
	if err := json.Unmarshal(raw, &d); err != nil {
		return nil, err
	}
	return &d, nil
}

// FindDerived returns an explicit path argument if given, otherwise walks up
// from the working directory looking for data/derived/derived.json.
func FindDerived(args []string) string {
	if len(args) > 0 {
		return args[0]
	}
	dir, _ := os.Getwd()
	for i := 0; i < 7; i++ {
		candidate := filepath.Join(dir, "data", "derived", "derived.json")
		if _, err := os.Stat(candidate); err == nil {
			return candidate
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return filepath.Join("data", "derived", "derived.json")
}
