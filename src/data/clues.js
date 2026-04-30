/* ══════════════════════════════════════════════════════════════
    INDIZI E OGGETTI D'AREA
    ══════════════════════════════════════════════════════════════ */

/** Indizi — 9 totali */
var clues = [
  {
    id: 'registro_1861',
    name: 'Registro delle sparizioni del 1861',
    area: 'chiesa',
    desc: 'Un vecchio registro polveroso. Due persone scomparse nel 1861, mai ritrovate. Le date coincidono con forti temporali magnetici.',
  },
  {
    id: 'mappa_campi',
    name: 'Mappa catastale dei campi',
    area: 'piazze',
    desc: 'Mappa del 1890. Mostra le proprietà agricole a nord del paese. Il Campo delle Luci è segnato come "Podere Sant\'Elmo".',
  },
  {
    id: 'frammento',
    name: 'Frammento metallico freddo',
    area: 'cimitero',
    desc: 'Un frammento di metallo argentato, innaturalmente freddo al tatto. Non si scalda. La superficie è liscia come vetro.',
  },
  {
    id: 'simboli_portone',
    name: 'Simboli incisi sul portone',
    area: 'cimitero',
    desc: 'Simboli comparsi la notte delle luci. Non sono cristiani né runici. Formano un pattern circolare... come una costellazione.',
  },
  {
    id: 'lanterna_rotta',
    name: 'Lanterna rotta',
    area: 'piazze',
    desc: "Una lanterna a olio frantumata vicino alla fontana. Vetri sparsi. C'è un residuo nerastro sullo stoppino.",
  },
  {
    id: 'diario_enzo',
    name: 'Diario di Enzo Bellandi',
    area: 'giardini',
    desc: 'Il diario del nipote di Teresa. "16 marzo 1977 — Le luci sono tornate. Sono uguali a quelle del nonno. Cerchi nel grano. Loro mi osservano."',
  },
  {
    id: 'tracce_circolari',
    name: 'Tracce circolari nel terreno',
    area: 'giardini',
    desc: 'Cerchi perfetti nel terreno, erba piegata in senso orario. Diametro: circa 8 metri. Il terreno è vetrificato ai bordi.',
  },
  {
    id: 'lettera_censurata',
    name: 'Lettera militare censurata',
    area: 'chiesa',
    desc: 'Ministero della Difesa, 1961. "Operazione Sirio — recupero materiali non terrestri — massima segretezza." Timbrata: NON DIVULGARE.',
  },
  {
    id: 'radio_audio',
    name: 'Registrazione radio — voce disturbata',
    area: 'bar_exterior',
    desc: 'Una voce filtrata dalle interferenze radio: "...non guardare... quando si ferma...". Origine sconosciuta.',
  },
  {
    id: 'registro_monte_ferro',
    name: 'Nastro registrato — Monte Ferro',
    area: 'industriale',
    desc: '"Test fase tre... interferenza non prevista... risposta non classificabile... interrompere—". Il nastro si interrompe bruscamente.',
  },
];

/** Costruisce dizionario indizi per lookup */
var cluesMap = {};
clues.forEach((c) => {
  cluesMap[c.id] = c;
});

/** Oggetti interattivi nelle aree — posizione su canvas 400×250 */
var areaObjects = {
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
  ],
  giardini: [
    { id: 'diario_enzo', x: 60, y: 180, w: 14, h: 12, type: 'clue', drawHint: true },
    {
      id: 'tracce_circolari',
      x: 200,
      y: 170,
      w: 40,
      h: 30,
      type: 'clue',
      drawHint: true,
      requires: 'diario_enzo',
    },
  ],
  bar_exterior: [{ id: 'radio_bar', x: 306, y: 146, w: 20, h: 12, type: 'radio', drawHint: true }],
  residenziale: [],
  industriale: [{ id: 'recorder', x: 100, y: 150, w: 28, h: 16, type: 'recorder', drawHint: true }],
  polizia: [],
};
