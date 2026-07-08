from coast_to_cup.geo import haversine_km


def test_zero_distance():
    assert haversine_km(40.0, -74.0, 40.0, -74.0) == 0.0


def test_symmetry():
    a = haversine_km(40.8135, -74.0743, 33.9534, -118.3390)
    b = haversine_km(33.9534, -118.3390, 40.8135, -74.0743)
    assert abs(a - b) < 1e-9


def test_nyc_to_la():
    # MetLife to SoFi, ~3,940 km great-circle
    d = haversine_km(40.8135, -74.0743, 33.9534, -118.3390)
    assert 3800 < d < 4050


def test_mexico_city_to_guadalajara():
    # ~460 km great-circle
    d = haversine_km(19.3030, -99.1505, 20.6819, -103.4627)
    assert 400 < d < 520
