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
  | 'resultsIgnoreWeights'
  | 'feelsLike'
  | 'searchTeam'
  | 'climatized'
  | 'stageCol'
  | 'venueCol'
  | 'stageR32'
  | 'stageR16'
  | 'stageQF'
  | 'stageSF'
  | 'stage3rd'
  | 'stageF'
  | 'phase'
  | 'phaseAll'
  | 'groupStage'
  | 'allScopeHint'
  | 'teamsWord'
  | 'gamesWord'
  | 'everyGame'
  | 'bracketLeft'
  | 'bracketRight'
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
    resultsIgnoreWeights:
      'Picks use the fresher-on-the-day model (jet lag + travel for that trip) and are fixed. The weight sliders reshape the season ranking, never these results.',
    calledRight: 'called right',
    feelsLike: 'Feels like',
    searchTeam: 'Search',
    climatized: 'Climate-controlled stadium: counts indoor temperature',
    stageCol: 'Stage',
    venueCol: 'City',
    stageR32: 'R32',
    stageR16: 'R16',
    stageQF: 'QF',
    stageSF: 'SF',
    stage3rd: '3rd place',
    stageF: 'Final',
    phase: 'Phase',
    phaseAll: 'All',
    groupStage: 'Group stage',
    allScopeHint: 'All 48 teams, scored across every game they played in the tournament.',
    teamsWord: 'teams',
    gamesWord: 'games',
    everyGame: 'every game',
    bracketLeft: 'Left side of the bracket',
    bracketRight: 'Right side of the bracket',
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
    bodyClock: 'R. biológico',
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
    resultsIgnoreWeights:
      'Os palpites usam o modelo de quem chega mais descansado no dia (fuso + viagem daquele jogo) e são fixos. Os pesos mudam o ranking da temporada, nunca estes resultados.',
    calledRight: 'de acerto',
    feelsLike: 'Sensação térmica',
    searchTeam: 'Buscar',
    climatized: 'Estádio climatizado: conta a temperatura interna',
    stageCol: 'Fase',
    venueCol: 'Cidade',
    stageR32: '16 avos',
    stageR16: 'Oitavas',
    stageQF: 'Quartas',
    stageSF: 'Semi',
    stage3rd: '3º lugar',
    stageF: 'Final',
    phase: 'Fase',
    phaseAll: 'Todas',
    groupStage: 'Fase de grupos',
    allScopeHint: 'As 48 seleções, avaliadas em todos os jogos que fizeram no torneio.',
    teamsWord: 'seleções',
    gamesWord: 'jogos',
    everyGame: 'todos os jogos',
    bracketLeft: 'Chaveamento do lado esquerdo',
    bracketRight: 'Chaveamento do lado direito',
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
    bodyClock: 'R. biológico',
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
    resultsIgnoreWeights:
      'Los pronósticos usan el modelo de quién llega más fresco ese día (huso horario + viaje de ese partido) y son fijos. Los pesos cambian el ranking de la temporada, nunca estos resultados.',
    calledRight: 'de acierto',
    feelsLike: 'Sensación térmica',
    searchTeam: 'Buscar',
    climatized: 'Estadio climatizado: cuenta la temperatura interior',
    stageCol: 'Fase',
    venueCol: 'Ciudad',
    stageR32: '16vos',
    stageR16: 'Octavos',
    stageQF: 'Cuartos',
    stageSF: 'Semi',
    stage3rd: '3er lugar',
    stageF: 'Final',
    phase: 'Fase',
    phaseAll: 'Todas',
    groupStage: 'Fase de grupos',
    allScopeHint: 'Las 48 selecciones, evaluadas en todos los partidos que jugaron en el torneo.',
    teamsWord: 'selecciones',
    gamesWord: 'partidos',
    everyGame: 'todos los partidos',
    bracketLeft: 'Lado izquierdo del cuadro',
    bracketRight: 'Lado derecho del cuadro',
    circadian: 'Reloj biológico',
    travel: 'Viaje',
    altitude: 'Altitud',
    heat: 'Calor',
  },
}
