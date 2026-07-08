from coast_to_cup.accuracy import _pearson, summarize


def _edge(a, b, edge, sa, sb):
    winner = None if sa is None or sa == sb else (a if sa > sb else b)
    return {
        "a": {"team_id": a},
        "b": {"team_id": b},
        "edge_team": edge,
        "edge_margin": 0.2,
        "score_a": sa,
        "score_b": sb,
        "winner": winner,
    }


def test_summary_counts():
    edges = [
        _edge("x", "y", "x", 2, 0),  # decided, edge correct
        _edge("x", "y", "y", 2, 0),  # decided, edge wrong
        _edge("x", "y", "x", 1, 1),  # draw
        _edge("x", "y", "x", None, None),  # not played
    ]
    s = summarize(edges)
    assert s["n_played"] == 3
    assert s["n_decided"] == 2
    assert s["edge_correct"] == 1
    assert s["hit_rate"] == 0.5


def test_pearson_needs_three_points():
    assert _pearson([1, 2], [1, 2]) is None
    assert _pearson([1, 2, 3], [1, 2, 3]) == 1.0
