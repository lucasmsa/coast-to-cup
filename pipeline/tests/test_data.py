from pathlib import Path

from coast_to_cup.domain import Dataset

RAW = Path(__file__).resolve().parents[1] / "data" / "raw"


def test_sixteen_venues():
    ds = Dataset.load(RAW)
    assert len(ds.venues) == 16


def test_venue_fields_sane():
    ds = Dataset.load(RAW)
    for v in ds.venues.values():
        assert -90 <= v.lat <= 90, v.id
        assert -180 <= v.lon <= 180, v.id
        assert v.altitude_m >= 0, v.id
        assert v.roof in {"open", "fixed", "retractable"}, v.id
        assert "/" in v.tz, v.id  # looks like an IANA zone
        assert 0 < v.heat_high_c < 50, v.id


def test_mexico_city_is_highest():
    ds = Dataset.load(RAW)
    highest = max(ds.venues.values(), key=lambda v: v.altitude_m)
    assert highest.id == "mexico_city"
