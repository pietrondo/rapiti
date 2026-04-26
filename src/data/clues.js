/* ══════════════════════════════════════════════════════════════
   INDIZI E OGGETTI D'AREA
   ══════════════════════════════════════════════════════════════ */

/** Indizi — 9 totali */
var clues = [
  { id: 'registro_1861',   name: 'Registro delle sparizioni del 1861',    area: 'archivio', desc: 'Un vecchio registro polveroso. Due persone scomparse nel 1861, mai ritrovate. Le date coincidono con forti temporali magnetici.' },
  { id: 'mappa_campi',     name: 'Mappa catastale dei campi',             area: 'campo',    desc: 'Mappa del 1890. Mostra le proprietà agricole a nord del paese. Il Campo delle Luci è segnato come "Podere Sant\'Elmo".' },
  { id: 'frammento',       name: 'Frammento metallico freddo',            area: 'cascina',  desc: 'Un frammento di metallo argentato, innaturalmente freddo al tatto. Non si scalda. La superficie è liscia come vetro.' },
  { id: 'simboli_portone', name: 'Simboli incisi sul portone',            area: 'cascina',  desc: 'Simboli comparsi la notte delle luci. Non sono cristiani né runici. Formano un pattern circolare... come una costellazione.' },
  { id: 'lanterna_rotta',  name: 'Lanterna rotta',                        area: 'piazza',   desc: 'Una lanterna a olio frantumata vicino alla fontana. Vetri sparsi. C\'è un residuo nerastro sullo stoppino.' },
  { id: 'diario_enzo',     name: 'Diario di Enzo Bellandi',               area: 'cascina',  desc: 'Il diario del nipote di Teresa. "16 marzo 1977 — Le luci sono tornate. Sono uguali a quelle del nonno. Cerchi nel grano. Loro mi osservano."' },
  { id: 'tracce_circolari',name: 'Tracce circolari nel terreno',          area: 'campo',    desc: 'Cerchi perfetti nel terreno, erba piegata in senso orario. Diametro: circa 8 metri. Il terreno è vetrificato ai bordi.' },
  { id: 'lettera_censurata',name:'Lettera militare censurata',            area: 'archivio', desc: 'Ministero della Difesa, 1961. "Operazione Sirio — recupero materiali non terrestri — massima segretezza." Timbrata: NON DIVULGARE.' },
  { id: 'radio_audio',     name: 'Registrazione radio — voce disturbata',  area: 'bar_interno',desc: 'Una voce filtrata dalle interferenze radio: "...non guardare... quando si ferma...". Origine sconosciuta.' }
];

/** Costruisce dizionario indizi per lookup */
var cluesMap = {};
clues.forEach(function(c){ cluesMap[c.id] = c; });

/** Oggetti interattivi nelle aree — posizione su canvas 400×250 */
var areaObjects = {
  piazza: [
    { id: 'lanterna_rotta', x: 120, y: 175, w: 16, h: 12, type: 'clue', drawHint: true },
    { id: 'bar_door', x: 38, y: 178, w: 14, h: 18, type: 'door', toArea: 'bar_interno', toSpawnX: 195, toSpawnY: 200, drawHint: false },
    { id: 'door_archivio', x: 187, y: 5, w: 26, h: 18, type: 'door', toArea: 'archivio', toSpawnX: 195, toSpawnY: 210, drawHint: false },
    { id: 'door_cascina', x: 357, y: 158, w: 36, h: 16, type: 'door', toArea: 'cascina', toSpawnX: 55, toSpawnY: 130, drawHint: false },
    { id: 'gatto_piazza', x: 88, y: 151, w: 8, h: 6, type: 'gatto', drawHint: false }
  ],
  archivio: [
    { id: 'registro_1861', x: 300, y: 100, w: 18, h: 14, type: 'clue', drawHint: true },
    { id: 'lettera_censurata', x: 80, y: 50, w: 16, h: 12, type: 'clue', drawHint: true, requires: 'registro_1861' },
    { id: 'door_piazza', x: 185, y: 224, w: 30, h: 16, type: 'door', toArea: 'piazza', toSpawnX: 195, toSpawnY: 40, drawHint: false },
    { id: 'gatto_archivio', x: 180, y: 204, w: 8, h: 6, type: 'gatto', drawHint: false }
  ],
  cascina: [
    { id: 'simboli_portone', x: 280, y: 150, w: 20, h: 24, type: 'clue', drawHint: true },
    { id: 'frammento', x: 140, y: 210, w: 10, h: 8, type: 'clue', drawHint: true, requires: 'simboli_portone' },
    { id: 'diario_enzo', x: 70, y: 120, w: 14, h: 12, type: 'clue', drawHint: true, requires: 'frammento' },
    { id: 'door_piazza2', x: 10, y: 145, w: 30, h: 16, type: 'door', toArea: 'piazza', toSpawnX: 360, toSpawnY: 160, drawHint: false },
    { id: 'door_campo', x: 185, y: 87, w: 30, h: 16, type: 'door', toArea: 'campo', toSpawnX: 195, toSpawnY: 210, drawHint: false },
    { id: 'gatto_cascina', x: 55, y: 210, w: 8, h: 6, type: 'gatto', drawHint: false }
  ],
  campo: [
    { id: 'mappa_campi', x: 320, y: 100, w: 18, h: 14, type: 'clue', drawHint: true },
    { id: 'tracce_circolari', x: 180, y: 160, w: 60, h: 40, type: 'clue', drawHint: true, requires: 'mappa_campi' },
    { id: 'door_cascina', x: 185, y: 224, w: 30, h: 16, type: 'door', toArea: 'cascina', toSpawnX: 195, toSpawnY: 160, drawHint: false },
    { id: 'gatto_campo', x: 320, y: 130, w: 8, h: 6, type: 'gatto', drawHint: false }
  ],
  bar_interno: [
    { id: 'radio_bar', x: 295, y: 152, w: 20, h: 12, type: 'radio', drawHint: true }
  ]
};
