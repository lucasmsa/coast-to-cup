// Verified sources, shared by the About page and anywhere a factual claim is shown.

export const PODCAST_EPISODE_URL =
  'https://podcasts.apple.com/us/podcast/95-circadian-rhythms-travel-and-athlete-optimization/id1578319619?i=1000702475485'

export interface Source {
  label: string
  detail: string
  url: string
}

export const SCIENCE: Source[] = [
  {
    label: 'Mah, Mah, Kezirian & Dement (2011)',
    detail: 'Sleep extension improved athletic performance in collegiate basketball players. Sleep 34(7):943-950.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/21731144/',
  },
  {
    label: 'Smith, Guilleminault & Efron (1997)',
    detail: 'Circadian rhythms and enhanced athletic performance in the NFL. Sleep 20(5):362-365. West-coast teams beat the Vegas spread in late MNF games (1970-1994).',
    url: 'https://academic.oup.com/sleep/article-abstract/20/5/362/2732132',
  },
  {
    label: 'Circadian misalignment in professional football',
    detail: 'The circadian advantage requires a time-zone difference; same-zone and daytime games show no effect. This is why a team that never changes zone carries no circadian burden here.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3825451/',
  },
  {
    label: 'AASM (2013 analysis)',
    detail: 'Extended 1970-2011 analysis: circadian timing edge for West-coast NFL teams in night games.',
    url: 'https://aasm.org/circadian-timing-may-give-edge-to-west-coast-nfl-teams-in-night-games/',
  },
  {
    label: 'Roy & Forest (2018)',
    detail: 'Westward-travelling teams are at a circadian disadvantage in evening games (NBA, NHL, NFL). J Sleep Res.',
    url: 'https://onlinelibrary.wiley.com/doi/abs/10.1111/jsr.12565',
  },
  {
    label: 'Leota et al. (2022)',
    detail: 'Eastward jet lag was associated with a 6.03% lower home win rate in the NBA. Front Physiol 13:892681.',
    url: 'https://doi.org/10.3389/fphys.2022.892681',
  },
  {
    label: 'The Matt Walker Podcast #95 - Dr. Cheri Mah (2025)',
    detail: 'Circadian Rhythms, Travel, and Athlete Optimization. The episode that inspired this project.',
    url: 'https://podcasts.apple.com/us/podcast/95-circadian-rhythms-travel-and-athlete-optimization/id1578319619?i=1000702475485',
  },
]

export const DATA_SOURCES: Source[] = [
  {
    label: 'Schedule, draw & results',
    detail: 'Parsed from the 2026 FIFA World Cup group pages on Wikipedia.',
    url: 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup',
  },
  {
    label: 'Team base camps',
    detail: 'FIFA Team Base Camp sites, via the Wikipedia base-camp table.',
    url: 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup',
  },
  {
    label: 'Coordinates',
    detail: 'OpenStreetMap Nominatim (Data (c) OpenStreetMap contributors, ODbL).',
    url: 'https://nominatim.openstreetmap.org/',
  },
  {
    label: 'Elevation & heat normals',
    detail: 'Open-Meteo: elevation, ERA5 climate normals, and per-match kickoff-hour venue temperature (recorded for played games, forecast for upcoming).',
    url: 'https://open-meteo.com/',
  },
  {
    label: 'Live scores',
    detail: "ESPN's public FIFA World Cup scoreboard JSON.",
    url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard',
  },
]
