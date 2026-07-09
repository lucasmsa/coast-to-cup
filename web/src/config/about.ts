import type { Locale } from './i18n'

export interface AboutSection {
  title: string
  body: string[]
  /** Optional source link rendered after the body. */
  cite?: { label: string; url: string }
}

export interface AboutContent {
  intro: string
  sections: AboutSection[]
  inspired: string
}

// Open access: Smith et al., The Impact of Circadian Misalignment on Athletic
// Performance in Professional Football Players (late-afternoon performance peak).
const PEAK_STUDY_URL = 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3825451/'

export const ABOUT: Record<Locale, AboutContent> = {
  'en-US': {
    intro:
      'Coast-to-Cup measures how physically demanding each team’s 2026 World Cup schedule is to get through: the travel, the body-clock shifts, the altitude and the heat. It ranks all 48 teams, from the group stage through the knockouts.',
    sections: [
      {
        title: 'The idea',
        body: [
          'The 2026 World Cup is spread across the US, Mexico and Canada: four time zones, venues from sea level to about 2,240 m, and summer heat that swings wildly by city.',
          'Two teams in the same group can draw very different physical loads. Coast-to-Cup puts a single, adjustable number on that, so the schedule luck is visible instead of anecdotal.',
        ],
      },
      {
        title: 'How the score works',
        body: [
          'Every team has a base camp. Each match is a trip from that base to a stadium. Four factors are each measured relative to the base camp, scored 0 to 100, and combined with weights you control.',
          'Body clock: circadian research finds physical performance peaks in the late afternoon, roughly 4–8 PM body time. Players stay on base-camp time, so each kickoff is compared to that window. Travel: round-trip distance from base to each venue. Altitude: the climb from the base elevation to the venue. Heat: the real feels-like temperature (heat plus humidity) at the kickoff hour above the base-camp climate; climate-controlled stadiums count their held indoor temperature instead of the weather outside.',
        ],
        cite: { label: 'The study behind the performance peak', url: PEAK_STUDY_URL },
      },
      {
        title: 'Does it predict results?',
        body: [
          'On its own, not really. It ignores squad strength, and one tournament is a tiny, uncontrolled sample. The live "model vs results" figure is descriptive, not a forecast.',
          'Travel and circadian effects are real, but they only separate cleanly from noise across thousands of games, not the hundred or so a World Cup provides.',
        ],
      },
    ],
    inspired: 'Inspired by The Matt Walker Podcast #95 with Dr. Cheri Mah.',
  },
  'pt-BR': {
    intro:
      'O Coast-to-Cup mede o quanto o calendário de cada seleção na Copa 2026 é duro de aguentar fisicamente: a viagem, o relógio biológico, a altitude e o calor. E ranqueia as 48 seleções, da fase de grupos ao mata-mata.',
    sections: [
      {
        title: 'A ideia',
        body: [
          'A Copa 2026 se espalha por EUA, México e Canadá: quatro fusos horários, estádios do nível do mar até cerca de 2.240 m, e um calor de verão que varia muito de cidade para cidade.',
          'Duas seleções do mesmo grupo podem pegar cargas físicas bem diferentes. O Coast-to-Cup coloca um número ajustável nisso, para a sorte (ou o azar) do calendário ficar visível.',
        ],
      },
      {
        title: 'Como o índice funciona',
        body: [
          'Cada seleção tem uma base. Cada jogo é uma viagem da base até um estádio. Quatro fatores são medidos em relação à base, pontuados de 0 a 100 e combinados com pesos que você controla.',
          'Relógio biológico: a pesquisa sobre ritmos circadianos mostra que o desempenho físico atinge o pico no fim da tarde, entre cerca de 16h e 20h no horário do corpo. Os jogadores seguem o horário da base, então cada início de jogo é comparado a essa janela. Viagem: distância de ida e volta da base a cada estádio. Altitude: a subida da altitude da base até o estádio. Calor: a sensação térmica real (calor e umidade) no horário do jogo acima do clima da base; estádios climatizados contam a temperatura interna controlada, não o tempo lá fora.',
        ],
        cite: { label: 'O estudo por trás do pico de desempenho', url: PEAK_STUDY_URL },
      },
      {
        title: 'Ele prevê os resultados?',
        body: [
          'Sozinho, não. Ele ignora a força do elenco, e um torneio é uma amostra pequena e não controlada. O número "modelo vs resultados" ao vivo é descritivo, não uma previsão.',
          'Os efeitos de viagem e do relógio biológico são reais, mas só se separam do ruído ao longo de milhares de jogos, não da centena que uma Copa oferece.',
        ],
      },
    ],
    inspired: 'Inspirado no The Matt Walker Podcast #95 com a Dra. Cheri Mah.',
  },
  'es-MX': {
    intro:
      'Coast-to-Cup mide qué tan exigente es físicamente el calendario de cada selección en el Mundial 2026: los viajes, el reloj biológico, la altitud y el calor. Clasifica a las 48 selecciones, de la fase de grupos a las eliminatorias.',
    sections: [
      {
        title: 'La idea',
        body: [
          'El Mundial 2026 se reparte entre EE. UU., México y Canadá: cuatro zonas horarias, sedes desde el nivel del mar hasta unos 2,240 m, y un calor de verano que cambia mucho según la ciudad.',
          'Dos selecciones del mismo grupo pueden recibir cargas físicas muy distintas. Coast-to-Cup le pone un número ajustable, para que la suerte del calendario sea visible.',
        ],
      },
      {
        title: 'Cómo funciona el índice',
        body: [
          'Cada selección tiene una sede base. Cada partido es un viaje de esa base a un estadio. Cuatro factores se miden respecto a la base, se puntúan de 0 a 100 y se combinan con pesos que tú controlas.',
          'Reloj biológico: la investigación sobre ritmos circadianos muestra que el rendimiento físico alcanza su pico al final de la tarde, entre las 16 y las 20 h en la hora del cuerpo. Los jugadores siguen la hora de la base, así que cada inicio de partido se compara con esa ventana. Viaje: distancia de ida y vuelta de la base a cada sede. Altitud: el ascenso desde la altitud de la base hasta la sede. Calor: la sensación térmica real (calor y humedad) a la hora del partido por encima del clima de la base; los estadios climatizados cuentan su temperatura interior controlada, no el clima exterior.',
        ],
        cite: { label: 'El estudio detrás del pico de rendimiento', url: PEAK_STUDY_URL },
      },
      {
        title: '¿Predice los resultados?',
        body: [
          'Por sí solo, no. Ignora el nivel del plantel, y un torneo es una muestra pequeña y no controlada. La cifra en vivo de "modelo vs resultados" es descriptiva, no un pronóstico.',
          'Los efectos de viaje y del reloj biológico son reales, pero solo se distinguen del ruido a lo largo de miles de partidos, no del centenar que ofrece un Mundial.',
        ],
      },
    ],
    inspired: 'Inspirado en The Matt Walker Podcast #95 con la Dra. Cheri Mah.',
  },
}
