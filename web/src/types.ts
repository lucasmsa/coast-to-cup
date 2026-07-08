export type ComponentKey = 'circadian' | 'travel' | 'altitude' | 'heat'
export type Weights = Record<ComponentKey, number>

export interface Load {
  match_id: string
  matchday: number
  stage: string
  venue_id: string
  local_kickoff_hour: number
  body_clock_hour: number
  circadian: number
  travel_km: number
  altitude_climb_m: number
  heat_excess_c: number
  heat_apparent_excess_c: number
  venue_temp_c: number | null
  apparent_temp_c: number | null
}

export interface Team {
  id: string
  name: string
  code: string
  group: string
  confederation: string
  color: string
  base_camp: string | null
  base_lat: number | null
  base_lon: number | null
  raw: Record<string, number>
  norm: Record<ComponentKey, number> & { heat_apparent: number }
  index: number
  rank: number
  loads: Load[]
}

export interface Venue {
  id: string
  name: string
  city: string
  country: string
  lat: number
  lon: number
  tz: string
  altitude_m: number
  roof: string
  heat_high_c: number
}

export interface MatchSide extends Load {
  team_id: string
}

export interface Match {
  match_id: string
  group: string
  matchday: number
  stage: string
  venue_id: string
  kickoff_utc: string
  a: MatchSide
  b: MatchSide
  edge_team: string
  edge_margin: number
  score_a: number | null
  score_b: number | null
  winner: string | null
  edge_correct: boolean | null
}

export interface Meta {
  weights: Weights
  components: string[]
  counts: Record<string, number>
}

export interface Derived {
  meta: Meta
  venues: Venue[]
  teams: Team[]
  matches: Match[]
}
