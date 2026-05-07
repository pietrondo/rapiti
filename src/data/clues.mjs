/* ══════════════════════════════════════════════════════════════
    INDIZI E OGGETTI D'AREA
    ══════════════════════════════════════════════════════════════ */

/** Indizi — 13 totali (incluse missioni) */
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
    desc: 'Una lanterna a olio frantumata vicino alla fontana.',
  },
  {
    id: 'diario_enzo',
    name: 'Diario di Enzo Bellandi',
    area: 'giardini',
    desc: 'Il diario del nipote di Teresa. Parla del ritorno delle luci.',
  },
  {
    id: 'testim_tracce',
    name: 'Testimonianza sulle Tracce',
    area: 'giardini',
    desc: 'Resoconto di un agricoltore: cerchi perfetti nel terreno, erba piegata.',
  },
  {
    id: 'tracce_circolari',
    name: 'Campione di Terreno (Tracce)',
    area: 'campo',
    desc: 'Terreno vetrificato prelevato dal centro di un cerchio nel grano.',
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
  {
    id: 'giornale_1952',
    name: 'Ritaglio di giornale del 1952',
    area: 'bar_interno',
    desc: 'Un articolo ingiallito: "Sparizione misteriosa alla cascina Bellandi. Le autorità brancolano nel buio".',
  },
  {
    id: 'cronaca_parrocchiale',
    name: 'Cronaca parrocchiale del 1861',
    area: 'chiesa',
    desc: '"I Visitatori della Mietitura sono tornati. Il cielo arde di un azzurro innaturale".',
  },
  {
    id: 'verbale_carabinieri',
    name: 'Verbale Carabinieri 1974',
    area: 'polizia',
    desc: 'Rapporto di pattuglia: "Avvistate sfere luminose sopra il bosco. Interferenze radio impediscono le comunicazioni".',
  },
  {
    id: 'appunti_enzo_2',
    name: 'Appunti stropicciati di Enzo',
    area: 'residenziale',
    desc: 'Disegni di costellazioni e una parola ripetuta: "Apertura". Segna una data: 21 Luglio.',
  },
  {
    id: 'registro_comunale',
    name: 'Registro Comunale Censito',
    area: 'municipio',
    desc: 'Mancano diverse pagine tra il 1960 e il 1962. Qualcuno ha cercato di nascondere dei dati.',
  },
  {
    id: 'nastro_monte_ferro_2',
    name: 'Nastro Monte Ferro — Sequenza 4',
    area: 'industriale',
    desc: '"Coordinate sintonizzate... il segnale risponde... pronti per l\'impulso finale".',
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
  {
    id: 'scena_lanterna',
    name: 'Lanterna rotta',
    area: 'cascina',
    desc: "Caduta a terra, vetro rotto. Qualcuno l'ha lasciata cadere di corsa.",
  },
  {
    id: 'scena_impronte',
    name: 'Impronte nel fango',
    area: 'cascina',
    desc: 'Impronte che girano in cerchio, poi tornano indietro.',
  },
  {
    id: 'scena_segni',
    name: 'Segni nel terreno',
    area: 'cascina',
    desc: 'Cerchi perfetti nel grano. Il centro è sprofondato.',
  },
  {
    id: 'nastro_monte_ferro_1',
    name: 'Nastro Audio "TEST A"',
    area: 'fienile',
    desc: 'Un vecchio nastro magnetico con etichetta "TEST A — 1961". Inizio della sequenza di registrazione.',
  },
];

/** Ipotesi — Combinazioni di indizi che sbloccano nuove deduzioni */
const hypotheses = [
  {
    id: 'esperimento_militare',
    name: 'Operazione Radar 1961',
    clues: ['lettera_censurata', 'registro_monte_ferro'],
    desc: 'Le luci del 1961 erano parte di un esperimento radar coperto dal Ministero.',
  },
  {
    id: 'rapimento_ciclico',
    name: 'Il Patto del Silenzio',
    clues: ['registro_1861', 'diario_enzo'],
    desc: 'Le sparizioni seguono ricorrenze irregolari, sempre piu ravvicinate dopo i test radio. Enzo non è il primo.',
  },
  {
    id: 'tecnologia_aliena',
    name: 'Relitto Extraterrestre',
    clues: ['frammento', 'testim_tracce'],
    desc: 'Il metallo e i cerchi nel grano indicano una presenza non umana.',
  },
  {
    id: 'falle_dimensionali',
    name: 'Il Ciclo della Mietitura',
    clues: ['cronaca_parrocchiale', 'appunti_enzo_2'],
    desc: 'Le cronache antiche e gli appunti di Enzo coincidono: le luci non "vengono", ma si "aprono" in date precise.',
  },
  {
    id: 'complotto_comunale',
    name: 'Infiltrazione Istituzionale',
    clues: ['registro_comunale', 'lettera_censurata'],
    desc: "Il Comune ha attivamente rimosso dati sulle sparizioni per coprire l'Operazione Sirius.",
  },
  {
    id: 'segnale_risposta',
    name: 'Contatto Radio Attivo',
    clues: ['nastro_monte_ferro_2', 'radio_audio'],
    desc: 'I nastri di Monte Ferro confermano che stavano inviando un segnale. La radio del bar ha captato la risposta.',
  },
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
    {
      id: 'lanterna_rotta',
      x: 212,
      y: 166,
      w: 12,
      h: 10,
      type: 'clue',
      drawHint: true,
      requires: 'mappa_campi',
    },
    { id: 'gatto_piazze', x: 276, y: 162, w: 8, h: 6, type: 'gatto', drawHint: false },
  ],
  chiesa: [
    { id: 'registro_1861', x: 170, y: 100, w: 18, h: 14, type: 'clue', drawHint: true },
    {
      id: 'lettera_censurata',
      x: 220,
      y: 60,
      w: 16,
      h: 12,
      type: 'clue',
      drawHint: true,
      requires: 'registro_1861',
    },
  ],
  cimitero: [
    { id: 'simboli_portone', x: 310, y: 120, w: 20, h: 24, type: 'clue', drawHint: true },
    {
      id: 'frammento',
      x: 150,
      y: 170,
      w: 10,
      h: 8,
      type: 'clue',
      drawHint: true,
      requires: 'simboli_portone',
    },
    { id: 'lettera_gino', x: 100, y: 220, w: 16, h: 12, type: 'clue', drawHint: true },
  ],
  giardini: [
    { id: 'diario_enzo', x: 60, y: 180, w: 14, h: 12, type: 'clue', drawHint: true },
    {
      id: 'testim_tracce',
      x: 200,
      y: 170,
      w: 40,
      h: 30,
      type: 'clue',
      drawHint: true,
      requires: 'diario_enzo',
    },
    { id: 'menta', x: 280, y: 190, w: 12, h: 10, type: 'clue', drawHint: true },
  ],
  campo: [
    {
      id: 'tracce_circolari',
      x: 194,
      y: 144,
      w: 24,
      h: 20,
      type: 'clue',
      drawHint: true,
      requires: 'mappa_campi',
    },
  ],
  bar_interno: [
    { id: 'radio_bar', x: 60, y: 100, w: 34, h: 25, type: 'radio', drawHint: true },
    { id: 'giornale_1952', x: 220, y: 110, w: 16, h: 12, type: 'clue', drawHint: true },
  ],
  bar_exterior: [],
  residenziale: [
    { id: 'appunti_enzo_2', x: 250, y: 180, w: 14, h: 10, type: 'clue', drawHint: true },
  ],
  industriale: [
    { id: 'recorder', x: 100, y: 150, w: 28, h: 16, type: 'recorder', drawHint: true },
    {
      id: 'nastro_monte_ferro_2',
      x: 220,
      y: 160,
      w: 12,
      h: 8,
      type: 'clue',
      drawHint: true,
      requires: 'registro_monte_ferro',
    },
  ],
  polizia: [
    { id: 'verbale_carabinieri', x: 80, y: 110, w: 16, h: 20, type: 'clue', drawHint: true },
  ],
  municipio: [
    { id: 'registro_comunale', x: 300, y: 130, w: 20, h: 16, type: 'clue', drawHint: true },
  ],
  archivio: [
    { id: 'verbale_carabinieri', x: 40, y: 100, w: 16, h: 12, type: 'clue', drawHint: true },
    { id: 'cronaca_parrocchiale', x: 330, y: 70, w: 16, h: 12, type: 'clue', drawHint: true },
  ],
  cascina: [
    { id: 'scena_lanterna', x: 220, y: 155, w: 14, h: 10, type: 'scene', drawHint: true },
    {
      id: 'scena_impronte',
      x: 120,
      y: 180,
      w: 20,
      h: 14,
      type: 'scene',
      drawHint: true,
      requires: 'scena_lanterna',
    },
    {
      id: 'scena_segni',
      x: 310,
      y: 170,
      w: 18,
      h: 14,
      type: 'scene',
      drawHint: true,
      requires: 'scena_impronte',
    },
  ],
  cascina_interno: [],
  monte_ferro: [
    { id: 'registro_monte_ferro', x: 280, y: 115, w: 18, h: 14, type: 'clue', drawHint: true },
  ],
  fienile: [
    { id: 'nastro_monte_ferro_1', x: 100, y: 155, w: 12, h: 8, type: 'clue', drawHint: true },
  ],
};

// Global exports
if (typeof window !== 'undefined') {
  window.clues = clues;
  window.cluesMap = cluesMap;
  window.hypotheses = hypotheses;
  window.areaObjects = _areaObjects;
}
