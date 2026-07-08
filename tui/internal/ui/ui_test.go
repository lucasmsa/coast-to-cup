package ui

import (
	"strings"
	"testing"

	"coasttocup/tui/internal/data"
)

func sample() *data.Derived {
	return &data.Derived{
		Meta: data.Meta{Weights: map[string]float64{"circadian": 0.4, "travel": 0.3, "altitude": 0.15, "heat": 0.15}},
		Teams: []data.Team{
			{ID: "aaa", Name: "Hard Team", Code: "AAA", Group: "A", Color: "#ff0000",
				BaseCamp: "Far City", Norm: map[string]float64{"circadian": 0.9, "travel": 0.6, "altitude": 0.3, "heat": 0.1}, Index: 1,
				Loads: []data.Load{{Matchday: 1, VenueID: "seattle", BodyClock: 2, Circadian: 0.9, TravelKm: 5000}}},
			{ID: "bbb", Name: "Easy Team", Code: "BBB", Group: "A", Color: "#00ff00",
				BaseCamp: "Near City", Norm: map[string]float64{"circadian": 0, "travel": 0, "altitude": 0, "heat": 0}, Index: 0,
				Loads: []data.Load{{Matchday: 1, VenueID: "miami", BodyClock: 18, Circadian: 0.0, TravelKm: 100}}},
		},
	}
}

func TestHardestRanksFirst(t *testing.T) {
	m := New(sample())
	if len(m.ranked) != 2 {
		t.Fatalf("want 2 ranked, got %d", len(m.ranked))
	}
	if m.ranked[0].ID != "aaa" {
		t.Fatalf("expected hardest team first, got %s", m.ranked[0].ID)
	}
}

func TestWeightZeroingChangesIndex(t *testing.T) {
	m := New(sample())
	hard := m.ranked[0]
	full := m.indexOf(hard)
	for _, c := range data.Components {
		m.weights[c] = 0
	}
	m.weights["heat"] = 1
	if got := m.indexOf(hard); got == full {
		t.Fatalf("index should change when weights change")
	}
}

func TestViewsRender(t *testing.T) {
	m := New(sample())
	if !strings.Contains(m.listView(), "coast-to-cup") {
		t.Fatal("list view missing title")
	}
	if !strings.Contains(m.detailView(m.ranked[0]), "BURDEN PROFILE") {
		t.Fatal("detail view missing profile")
	}
}
