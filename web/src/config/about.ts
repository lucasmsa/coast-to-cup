import type { Locale } from './i18n'

export interface AboutSection {
  title: string
  body: string[]
}

export interface AboutContent {
  intro: string
  sections: AboutSection[]
  inspired: string
}

export const ABOUT: Record<Locale, AboutContent> = {
  'en-US': {
    intro:
      'Coast-to-Cup measures how physically demanding each team’s 2026 World Cup group-stage schedule is to get through: the travel, the body-clock shifts, the altitude and the heat. It ranks all 48 teams.',
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
          'Body clock: players stay on base-camp time, so the kickoff is compared to their 4–8 PM performance peak. Travel: round-trip distance from base to each venue. Altitude: the climb from the base elevation to the venue. Heat: the real feels-like temperature (heat plus humidity) at the kickoff hour above the base-camp climate; climate-controlled stadiums count their held indoor temperature instead of the weather outside.',
        ],
      },
      {
        title: 'Does it predict results?',
        body: [
          'On its own, not really. It ignores squad strength, and a group stage is a tiny, uncontrolled sample. The live "model vs results" figure is descriptive, not a forecast.',
          'Travel and circadian effects are real, but they only separate cleanly from noise across thousands of games, not 72.',
        ],
      },
    ],
    inspired: 'Inspired by The Matt Walker Podcast #95 with Dr. Cheri Mah.',
  },
  'pt-BR': {
    intro:
      'O Coast-to-Cup mede o quanto a tabela de cada seleção na fase de grupos da Copa 2026 é dura de aguentar fisicamente: a viagem, o relógio biológico, a altitude e o calor. E ranqueia as 48 seleções.',
    sections: [
      {
        title: 'A ideia',
        body: [
          'A Copa 2026 se espalha por EUA, México e Canadá: quatro fusos horários, estádios do nível do mar até cerca de 2.240 m, e um calor de verão que varia muito de cidade para cidade.',
          'Duas seleções do mesmo grupo podem pegar cargas físicas bem diferentes. O Coast-to-Cup coloca um número ajustável nisso, para a sorte (ou o azar) da tabela ficar visível.',
        ],
      },
      {
        title: 'Como o índice funciona',
        body: [
          'Cada seleção tem uma base. Cada jogo é uma viagem da base até um estádio. Quatro fatores são medidos em relação à base, pontuados de 0 a 100 e combinados com pesos que você controla.',
          'Relógio biológico: os jogadores seguem o horário da base, então o início do jogo é comparado ao pico de desempenho entre 16h e 20h. Viagem: distância de ida e volta da base a cada estádio. Altitude: a subida da altitude da base até o estádio. Calor: a sensação térmica real (calor e umidade) no horário do jogo acima do clima da base; estádios climatizados contam a temperatura interna controlada, não o tempo lá fora.',
        ],
      },
      {
        title: 'Ele prevê os resultados?',
        body: [
          'Sozinho, não. Ele ignora a força do elenco, e uma fase de grupos é uma amostra pequena e não controlada. O número "modelo vs resultados" ao vivo é descritivo, não uma previsão.',
          'Os efeitos de viagem e do relógio biológico são reais, mas só se separam do ruído ao longo de milhares de jogos, não 72.',
        ],
      },
    ],
    inspired: 'Inspirado no The Matt Walker Podcast #95 com a Dra. Cheri Mah.',
  },
  'es-MX': {
    intro:
      'Coast-to-Cup mide qué tan exigente es físicamente el calendario de cada selección en la fase de grupos del Mundial 2026: los viajes, el reloj biológico, la altitud y el calor. Clasifica a las 48 selecciones.',
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
          'Reloj biológico: los jugadores siguen la hora de la base, así que el inicio del partido se compara con su pico de rendimiento entre las 16 y las 20 h. Viaje: distancia de ida y vuelta de la base a cada sede. Altitud: el ascenso desde la altitud de la base hasta la sede. Calor: la sensación térmica real (calor y humedad) a la hora del partido por encima del clima de la base; los estadios climatizados cuentan su temperatura interior controlada, no el clima exterior.',
        ],
      },
      {
        title: '¿Predice los resultados?',
        body: [
          'Por sí solo, no. Ignora el nivel del plantel, y una fase de grupos es una muestra pequeña y no controlada. La cifra en vivo de "modelo vs resultados" es descriptiva, no un pronóstico.',
          'Los efectos de viaje y del reloj biológico son reales, pero solo se distinguen del ruido a lo largo de miles de partidos, no 72.',
        ],
      },
    ],
    inspired: 'Inspirado en The Matt Walker Podcast #95 con la Dra. Cheri Mah.',
  },
}
