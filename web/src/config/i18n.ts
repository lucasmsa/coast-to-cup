export type Locale = 'en-US' | 'pt-BR' | 'es-MX'

export const LOCALES: { id: Locale; short: string; label: string }[] = [
  { id: 'en-US', short: 'EN', label: 'English' },
  { id: 'pt-BR', short: 'PT', label: 'Português' },
  { id: 'es-MX', short: 'ES', label: 'Español' },
]

export type StringKey =
  | 'tagline'
  | 'toughest'
  | 'scoreUnit'
  | 'basedIn'
  | 'weighting'
  | 'reset'
  | 'ranking'
  | 'difficulty'
  | 'trips'
  | 'match'
  | 'kickoff'
  | 'bodyClock'
  | 'group'
  | 'groups'
  | 'all'
  | 'modelVsResults'
  | 'decided'
  | 'live'
  | 'accuracyCaveat'
  | 'about'
  | 'science'
  | 'dataSources'
  | 'close'
  | 'results'
  | 'called'
  | 'missed'
  | 'draw'
  | 'modelPickHint'
  | 'feelsLike'
  | 'searchTeam'
  | 'climatized'
  | 'calledRight'
  | 'circadian'
  | 'travel'
  | 'altitude'
  | 'heat'

export const STRINGS: Record<Locale, Record<StringKey, string>> = {
  'en-US': {
    tagline: "who's got the toughest World Cup 2026 logistics",
    toughest: 'Toughest logistics',
    scoreUnit: '/ 100',
    basedIn: 'based in',
    weighting: 'Weighting',
    reset: 'reset',
    ranking: 'Hardest to easiest',
    difficulty: 'Difficulty',
    trips: 'Trips',
    match: 'Match',
    kickoff: 'Kickoff',
    bodyClock: 'Body clock',
    group: 'Group',
    groups: 'Groups',
    all: 'All',
    modelVsResults: 'Model vs results',
    decided: 'decided games',
    live: 'live',
    accuracyCaveat: 'descriptive, ignores squad strength',
    about: 'About',
    science: 'The science',
    dataSources: 'Data sources',
    close: 'Close',
    results: 'Results',
    called: 'called',
    missed: 'missed',
    draw: 'draw',
    modelPickHint: 'The lower-burden side (bold) is the model’s pick.',
    calledRight: 'called right',
    feelsLike: 'Feels like',
    searchTeam: 'Search',
    climatized: 'Climate-controlled stadium: counts indoor temperature',
    circadian: 'Body clock',
    travel: 'Travel',
    altitude: 'Altitude',
    heat: 'Heat',
  },
  'pt-BR': {
    tagline: 'Quem tá com a logística mais difícil da Copa',
    toughest: 'Logística mais difícil',
    scoreUnit: '/ 100',
    basedIn: 'com base em',
    weighting: 'Pesos',
    reset: 'resetar',
    ranking: 'Da mais difícil à mais fácil',
    difficulty: 'Dificuldade',
    trips: 'Viagens',
    match: 'Jogo',
    kickoff: 'Início',
    bodyClock: 'Relógio',
    group: 'Grupo',
    groups: 'Grupos',
    all: 'Todos',
    modelVsResults: 'Modelo vs resultados',
    decided: 'jogos decididos',
    live: 'ao vivo',
    accuracyCaveat: 'descritivo, ignora a força do time',
    about: 'Sobre',
    science: 'A ciência',
    dataSources: 'Fontes de dados',
    close: 'Fechar',
    results: 'Resultados',
    called: 'acertou',
    missed: 'errou',
    draw: 'empate',
    modelPickHint: 'O lado com menos carga (em negrito) é o palpite do modelo.',
    calledRight: 'de acerto',
    feelsLike: 'Sensação térmica',
    searchTeam: 'Buscar',
    climatized: 'Estádio climatizado: conta a temperatura interna',
    circadian: 'Relógio biológico',
    travel: 'Viagem',
    altitude: 'Altitude',
    heat: 'Calor',
  },
  'es-MX': {
    tagline: 'quién tiene la logística más difícil del Mundial 2026',
    toughest: 'Logística más difícil',
    scoreUnit: '/ 100',
    basedIn: 'con sede en',
    weighting: 'Pesos',
    reset: 'reiniciar',
    ranking: 'De más difícil a más fácil',
    difficulty: 'Dificultad',
    trips: 'Viajes',
    match: 'Partido',
    kickoff: 'Inicio',
    bodyClock: 'Reloj',
    group: 'Grupo',
    groups: 'Grupos',
    all: 'Todos',
    modelVsResults: 'Modelo vs resultados',
    decided: 'partidos decididos',
    live: 'en vivo',
    accuracyCaveat: 'descriptivo, ignora el nivel del equipo',
    about: 'Acerca',
    science: 'La ciencia',
    dataSources: 'Fuentes de datos',
    close: 'Cerrar',
    results: 'Resultados',
    called: 'acertó',
    missed: 'falló',
    draw: 'empate',
    modelPickHint: 'El lado con menos carga (en negrita) es el pronóstico del modelo.',
    calledRight: 'de acierto',
    feelsLike: 'Sensación térmica',
    searchTeam: 'Buscar',
    climatized: 'Estadio climatizado: cuenta la temperatura interior',
    circadian: 'Reloj biológico',
    travel: 'Viaje',
    altitude: 'Altitud',
    heat: 'Calor',
  },
}
