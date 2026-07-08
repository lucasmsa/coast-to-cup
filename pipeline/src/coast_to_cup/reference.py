"""Stable reference data: FIFA three-letter codes to nation name and confederation.

This is not tournament data (it does not change with results); it maps the codes
that appear in the Wikipedia match templates to display names and confederations.
Confederation groupings per FIFA. Unknown codes fall back to the code itself and
are reported by the fetcher so the table can be completed.
"""

from __future__ import annotations

# code -> (display name, confederation)
NATIONS: dict[str, tuple[str, str]] = {
    # CONMEBOL
    "BRA": ("Brazil", "CONMEBOL"), "ARG": ("Argentina", "CONMEBOL"),
    "URU": ("Uruguay", "CONMEBOL"), "PAR": ("Paraguay", "CONMEBOL"),
    "ECU": ("Ecuador", "CONMEBOL"), "COL": ("Colombia", "CONMEBOL"),
    "PER": ("Peru", "CONMEBOL"), "CHI": ("Chile", "CONMEBOL"),
    "BOL": ("Bolivia", "CONMEBOL"), "VEN": ("Venezuela", "CONMEBOL"),
    # CONCACAF
    "MEX": ("Mexico", "CONCACAF"), "USA": ("United States", "CONCACAF"),
    "CAN": ("Canada", "CONCACAF"), "HAI": ("Haiti", "CONCACAF"),
    "CUW": ("Curacao", "CONCACAF"), "CRC": ("Costa Rica", "CONCACAF"),
    "PAN": ("Panama", "CONCACAF"), "JAM": ("Jamaica", "CONCACAF"),
    "HON": ("Honduras", "CONCACAF"),
    # UEFA
    "FRA": ("France", "UEFA"), "GER": ("Germany", "UEFA"), "ESP": ("Spain", "UEFA"),
    "ENG": ("England", "UEFA"), "POR": ("Portugal", "UEFA"), "ITA": ("Italy", "UEFA"),
    "NED": ("Netherlands", "UEFA"), "BEL": ("Belgium", "UEFA"), "CRO": ("Croatia", "UEFA"),
    "SUI": ("Switzerland", "UEFA"), "SWE": ("Sweden", "UEFA"), "DEN": ("Denmark", "UEFA"),
    "AUT": ("Austria", "UEFA"), "NOR": ("Norway", "UEFA"), "SCO": ("Scotland", "UEFA"),
    "CZE": ("Czechia", "UEFA"), "BIH": ("Bosnia and Herzegovina", "UEFA"),
    "SRB": ("Serbia", "UEFA"), "POL": ("Poland", "UEFA"), "TUR": ("Turkiye", "UEFA"),
    "UKR": ("Ukraine", "UEFA"), "WAL": ("Wales", "UEFA"),
    # CAF
    "RSA": ("South Africa", "CAF"), "MAR": ("Morocco", "CAF"), "CIV": ("Ivory Coast", "CAF"),
    "TUN": ("Tunisia", "CAF"), "EGY": ("Egypt", "CAF"), "SEN": ("Senegal", "CAF"),
    "CPV": ("Cape Verde", "CAF"), "ALG": ("Algeria", "CAF"), "GHA": ("Ghana", "CAF"),
    "NGA": ("Nigeria", "CAF"), "CMR": ("Cameroon", "CAF"), "COD": ("DR Congo", "CAF"),
    # AFC
    "KOR": ("South Korea", "AFC"), "QAT": ("Qatar", "AFC"), "AUS": ("Australia", "AFC"),
    "JPN": ("Japan", "AFC"), "IRN": ("Iran", "AFC"), "KSA": ("Saudi Arabia", "AFC"),
    "IRQ": ("Iraq", "AFC"), "JOR": ("Jordan", "AFC"), "UZB": ("Uzbekistan", "AFC"),
    # OFC
    "NZL": ("New Zealand", "OFC"),
}

# Optional brand colours for headline sides; others get a deterministic colour.
COLORS: dict[str, str] = {
    "BRA": "#FFDF00", "ARG": "#75AADB", "FRA": "#1E40AF", "GER": "#111111",
    "ESP": "#C60B1E", "ENG": "#FFFFFF", "POR": "#C8102E", "ITA": "#0E4C92",
    "NED": "#FF6A13", "BEL": "#E30613", "MEX": "#06633A", "USA": "#0A3161",
    "URU": "#5CB8E6", "KSA": "#1B5E20",
}
