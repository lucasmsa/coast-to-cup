import type { Locale } from './i18n'

// Localized country names by FIFA code. English uses the dataset name as-is.
const PT: Record<string, string> = {
  cze: 'Tchéquia', kor: 'Coreia do Sul', mex: 'México', rsa: 'África do Sul', can: 'Canadá',
  qat: 'Catar', sui: 'Suíça', bih: 'Bósnia e Herzegovina', bra: 'Brasil', hai: 'Haiti',
  mar: 'Marrocos', sco: 'Escócia', usa: 'Estados Unidos', aus: 'Austrália', tur: 'Turquia',
  par: 'Paraguai', ger: 'Alemanha', civ: 'Costa do Marfim', ecu: 'Equador', cuw: 'Curaçao',
  ned: 'Países Baixos', swe: 'Suécia', tun: 'Tunísia', jpn: 'Japão', bel: 'Bélgica',
  irn: 'Irã', nzl: 'Nova Zelândia', egy: 'Egito', esp: 'Espanha', ksa: 'Arábia Saudita',
  uru: 'Uruguai', cpv: 'Cabo Verde', fra: 'França', irq: 'Iraque', nor: 'Noruega',
  sen: 'Senegal', arg: 'Argentina', aut: 'Áustria', jor: 'Jordânia', alg: 'Argélia',
  cod: 'RD Congo', col: 'Colômbia', por: 'Portugal', uzb: 'Uzbequistão', cro: 'Croácia',
  eng: 'Inglaterra', gha: 'Gana', pan: 'Panamá',
}

const ES: Record<string, string> = {
  cze: 'Chequia', kor: 'Corea del Sur', mex: 'México', rsa: 'Sudáfrica', can: 'Canadá',
  qat: 'Catar', sui: 'Suiza', bih: 'Bosnia y Herzegovina', bra: 'Brasil', hai: 'Haití',
  mar: 'Marruecos', sco: 'Escocia', usa: 'Estados Unidos', aus: 'Australia', tur: 'Turquía',
  par: 'Paraguay', ger: 'Alemania', civ: 'Costa de Marfil', ecu: 'Ecuador', cuw: 'Curazao',
  ned: 'Países Bajos', swe: 'Suecia', tun: 'Túnez', jpn: 'Japón', bel: 'Bélgica',
  irn: 'Irán', nzl: 'Nueva Zelanda', egy: 'Egipto', esp: 'España', ksa: 'Arabia Saudita',
  uru: 'Uruguay', cpv: 'Cabo Verde', fra: 'Francia', irq: 'Irak', nor: 'Noruega',
  sen: 'Senegal', arg: 'Argentina', aut: 'Austria', jor: 'Jordania', alg: 'Argelia',
  cod: 'RD Congo', col: 'Colombia', por: 'Portugal', uzb: 'Uzbekistán', cro: 'Croacia',
  eng: 'Inglaterra', gha: 'Ghana', pan: 'Panamá',
}

export function teamName(id: string, fallback: string, locale: Locale): string {
  if (locale === 'pt-BR') return PT[id] ?? fallback
  if (locale === 'es-MX') return ES[id] ?? fallback
  return fallback
}
