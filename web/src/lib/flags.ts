// FIFA three-letter code -> ISO 3166-1 alpha-2, for flag emoji.
const ISO2: Record<string, string> = {
  mex: 'MX', kor: 'KR', cze: 'CZ', rsa: 'ZA', can: 'CA', qat: 'QA', sui: 'CH', bih: 'BA',
  bra: 'BR', hai: 'HT', mar: 'MA', usa: 'US', aus: 'AU', tur: 'TR', par: 'PY', ger: 'DE',
  civ: 'CI', ecu: 'EC', cuw: 'CW', ned: 'NL', swe: 'SE', tun: 'TN', jpn: 'JP', bel: 'BE',
  irn: 'IR', nzl: 'NZ', egy: 'EG', esp: 'ES', ksa: 'SA', uru: 'UY', cpv: 'CV', fra: 'FR',
  irq: 'IQ', nor: 'NO', sen: 'SN', arg: 'AR', aut: 'AT', jor: 'JO', alg: 'DZ', cod: 'CD',
  col: 'CO', por: 'PT', uzb: 'UZ', cro: 'HR', gha: 'GH', pan: 'PA',
}

// Home-nation flags need subdivision tag sequences.
const SPECIAL: Record<string, string> = {
  eng: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}',
  sco: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}',
}

/** Flag emoji for a team's lowercase FIFA code. */
export function flagEmoji(code: string): string {
  const c = code.toLowerCase()
  if (SPECIAL[c]) return SPECIAL[c]
  const iso = ISO2[c]
  if (!iso) return '\u{1F3F3}\u{FE0F}'
  return String.fromCodePoint(...[...iso].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65))
}
