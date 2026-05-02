/* ══════════════════════════════════════════════════════════════
    INDIZI E OGGETTI D'AREA
    ══════════════════════════════════════════════════════════════ */

/** Indizi — 12 totali (incluse missioni) */
const clues = [
  {
    id: 'registro_1861',
    name: 'Registro delle sparizioni del 1861',
    area: 'chiesa',
    desc: 'Un vecchio registro polveroso. Due persone scomparse nel 1861, mai ritrovate.',
  },
  {
    id: 'mappa_campi',
    name: 'Mappa catastale dei campi',
    area: 'piazze',
    desc: 'Mappa del 1890. Il Campo delle Luci è segnato come "Podere Sant\'Elmo".',
  },
  {
    id: 'frammento',
    name: 'Frammento metallico freddo',
    area: 'cimitero',
    desc: 'Un frammento di metallo argentato, innaturalmente freddo al tatto.',
  },
  {
    id: 'simboli_portone',
    name: 'Simboli incisi sul portone',
    area: 'cimitero',
    desc: 'Simboli comparsi la notte delle luci. Formano un pattern circolare.',
  },
  {
    id: 'lanterna_rotta',
    name: 'Lanterna rotta',
    area: 'piazze',
    desc: "Una lanterna a olio frantumata vicino alla fontana.",
  },
  {
    id: 'diario_enzo',
    name: 'Diario di Enzo Bellandi',
    area: 'giardini',
    desc: 'Il diario del nipote di Teresa. Parla del ritorno delle luci.',
  },
  {
    id: 'tracce_circolari',
    name: 'Tracce circolari nel terreno',
    area: 'giardini',
    desc: 'Cerchi perfetti nel terreno, erba piegata in senso orario.',
  },
  {
    id: 'lettera_censurata',
    name: 'Lettera militare censurata',
    area: 'chiesa',
    desc: 'Ministero della Difesa, 1961. Parla di "recupero materiali non terrestri".',
  },
  {
    id: 'radio_audio',
    name: 'Registrazione radio — voce disturbata',
    area: 'bar_interno',
    desc: 'Una voce filtrata dalle interferenze radio: "...non guardare...".',
  },
  {
    id: 'registro_monte_ferro',
    name: 'Nastro registrato — Monte Ferro',
    area: 'industriale',
    desc: '"Test fase tre... risposta non classificabile...".',
  },
  // Mission Clues
  {
    id: 'menta',
    name: 'Menta Selvatica',
    area: 'giardini',
    desc: 'Menta fresca raccolta vicino alle tracce. Osvaldo la userà per il suo amaro.',
  },
  {
    id: 'lettera_gino',
    name: 'Busta Gialla Smarrita',
    area: 'cimitero',
    desc: 'La raccomandata che Gino ha perso tra le lapidi.',
  },
];

/** Ipotesi — Combinazioni di indizi che sbloccano nuove deduzioni */
const hypotheses = [
  {
    id: 'esperimento_militare',
    name: 'Operazione Radar 1961',
    clues: ['lettera_censurata', 'registro_monte_ferro'],
    desc: 'Le luci del 1961 erano parte di un esperimento radar coperto dal Ministero.'
  },
  {
    id: 'rapimento_ciclico',
    name: 'Il Patto del Silenzio',
    clues: ['registro_1861', 'diario_enzo'],
    desc: 'Le sparizioni avvengono ogni 60 anni circa. Enzo non è il primo.'
  },
  {
    id: 'tecnologia_aliena',
    name: 'Relitto Extraterrestre',
    clues: ['frammento', 'tracce_circolari'],
    desc: 'Il metallo e i cerchi nel grano indicano una presenza non umana.'
  }
];

/** Costruisce dizionario indizi per lookup */
const cluesMap = {};
for (const c of clues) {
  cluesMap[c.id] = c;
}

/** Oggetti interattivi nelle aree — posizione su canvas 400×250 */
const _areaObjects = {
  piazze: [
    { id: 'mappa_campi', x: 94, y: 151, w: 18, h: 14, type: 'clue', drawHint: true },
    { id: 'lanterna_rotta', x: 212, y: 166, w: 12, h: 10, type: 'clue', drawHint: true, requires: 'mappa_campi' },
    { id: 'gatto_piazze', x: 276, y: 162, w: 8, h: 6, type: 'gatto', drawHint: false },
  ],
  chiesa: [
    { id: 'registro_1861', x: 170, y: 100, w: 18, h: 14, type: 'clue', drawHint: true },
    { id: 'lettera_censurata', x: 220, y: 60, w: 16, h: 12, type: 'clue', drawHint: true, requires: 'registro_1861' },
  ],
  cimitero: [
    { id: 'simboli_portone', x: 310, y: 120, w: 20, h: 24, type: 'clue', drawHint: true },
    { id: 'frammento', x: 150, y: 170, w: 10, h: 8, type: 'clue', drawHint: true, requires: 'simboli_portone' },
    { id: 'lettera_gino', x: 100, y: 220, w: 16, h: 12, type: 'clue', drawHint: true },
  ],
  giardini: [
    { id: 'diario_enzo', x: 60, y: 180, w: 14, h: 12, type: 'clue', drawHint: true },
    { id: 'tracce_circolari', x: 200, y: 170, w: 40, h: 30, type: 'clue', drawHint: true, requires: 'diario_enzo' },
    { id: 'menta', x: 280, y: 190, w: 12, h: 10, type: 'clue', drawHint: true },
  ],
  bar_interno: [{ id: 'radio_bar', x: 60, y: 100, w: 34, h: 25, type: 'radio', drawHint: true }],
  bar_exterior: [],
  residenziale: [],
  industriale: [{ id: 'recorder', x: 100, y: 150, w: 28, h: 16, type: 'recorder', drawHint: true }],
  polizia: [],
};

// Global exports
if (typeof window !== 'undefined') {
  window.clues = clues;
  window.cluesMap = cluesMap;
  window.hypotheses = hypotheses;
  window.areaObjects = _areaObjects;
}
