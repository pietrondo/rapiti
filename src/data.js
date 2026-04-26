/* ══════════════════════════════════════════════════════════════
   SEZIONE 1: CONFIGURAZIONE
   ══════════════════════════════════════════════════════════════ */

var PALETTE = {
  nightBlue:   '#1A1C20',
  violetBlue:  '#2D3047',
  darkForest:  '#3D5A3C',
  oliveGreen:  '#5C7A4B',
  greyBrown:   '#8B7D6B',
  fadedBeige:  '#B8A88A',
  earthBrown:  '#6B5B4F',
  burntOrange: '#C4956A',
  lanternYel:  '#D4A843',
  creamPaper:  '#E8DCC8',
  alumGrey:    '#A0A8B0',
  slateGrey:   '#4A5568'
};

var CANVAS_W = 400;
var CANVAS_H = 250;
var PLAYER_SPEED = 1.6;
var PLAYER_W = 10;
var PLAYER_H = 14;

/* ══════════════════════════════════════════════════════════════
   SEZIONE 2: GAME STATE
   ══════════════════════════════════════════════════════════════ */

var gameState = {
  currentArea: 'piazza',
  gamePhase: 'title',
  previousPhase: null,
  player: { x: 195, y: 125, w: PLAYER_W, h: PLAYER_H, dir: 'down', frame: 0 },
  cluesFound: [],
  npcStates: { ruggeri: 0, teresa: 0, neri: 0, valli: 0 },
  playerName: 'Detective Maurizio',
  playerColors: { body: '#8B7355', head: '#D4A84B', legs: '#3D3025', detail: '#2D3047' },
  musicEnabled: true,
  puzzleSolved: false,
  puzzleAttempts: 0,
  introSlide: 0,
  introText: '',
  introCharIndex: 0,
  endingType: null,
  keys: {},
  dialogueNpcId: null,
  message: '',
  messageTimer: 0,
  fadeAlpha: 0,
  fadeDir: 0,
  fadeCallback: null,
  titleAnim: 0
};

/* ══════════════════════════════════════════════════════════════
   SEZIONE 3: DATI DI GIOCO
   ══════════════════════════════════════════════════════════════ */

/** Indizi — 8 totali */
var clues = [
  { id: 'registro_1861',   name: 'Registro delle sparizioni del 1861',    area: 'archivio', desc: 'Un vecchio registro polveroso. Due persone scomparse nel 1861, mai ritrovate. Le date coincidono con forti temporali magnetici.' },
  { id: 'mappa_campi',     name: 'Mappa catastale dei campi',             area: 'campo',    desc: 'Mappa del 1890. Mostra le proprietà agricole a nord del paese. Il Campo delle Luci è segnato come "Podere Sant\'Elmo".' },
  { id: 'frammento',       name: 'Frammento metallico freddo',            area: 'cascina',  desc: 'Un frammento di metallo argentato, innaturalmente freddo al tatto. Non si scalda. La superficie è liscia come vetro.' },
  { id: 'simboli_portone', name: 'Simboli incisi sul portone',            area: 'cascina',  desc: 'Simboli comparsi la notte delle luci. Non sono cristiani né runici. Formano un pattern circolare... come una costellazione.' },
  { id: 'lanterna_rotta',  name: 'Lanterna rotta',                        area: 'piazza',   desc: 'Una lanterna a olio frantumata vicino alla fontana. Vetri sparsi. C\'è un residuo nerastro sullo stoppino.' },
  { id: 'diario_enzo',     name: 'Diario di Enzo Bellandi',               area: 'cascina',  desc: 'Il diario del nipote di Teresa. "16 marzo 1977 — Le luci sono tornate. Sono uguali a quelle del nonno. Cerchi nel grano. Loro mi osservano."' },
  { id: 'tracce_circolari',name: 'Tracce circolari nel terreno',          area: 'campo',    desc: 'Cerchi perfetti nel terreno, erba piegata in senso orario. Diametro: circa 8 metri. Il terreno è vetrificato ai bordi.' },
  { id: 'lettera_censurata',name:'Lettera militare censurata',            area: 'archivio', desc: 'Ministero della Difesa, 1961. "Operazione Sirio — recupero materiali non terrestri — massima segretezza." Timbrata: NON DIVULGARE.' }
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
  ]
};

/** Dati visivi NPC */
var npcsData = [
  { id:'ruggeri', name:'Sindaco Ruggeri', colors:{body:'#5C5C5C',head:'#D4A84B',legs:'#3D3025',detail:'#2D3047'}, details:[] },
  { id:'teresa', name:'Teresa Bellandi', colors:{body:'#6B4E3D',head:'#D4A84B',legs:'#3D3025',detail:'#8B7355'}, details:[] },
  { id:'neri', name:'Archivista Neri', colors:{body:'#8B7D6B',head:'#D4A84B',legs:'#3D3025',detail:'#A0A8B0'}, details:[] },
  { id:'valli', name:'Capitano Valli', colors:{body:'#4A5568',head:'#D4A84B',legs:'#2D3047',detail:'#3D5A3C'}, details:[] },
  { id:'osvaldo', name:'Osvaldo il Barista', colors:{body:'#8B7D6B',head:'#D4A84B',legs:'#3D3025',detail:'#B8A88A'}, details:[] },
  { id:'gino', name:'Gino il Postino', colors:{body:'#5C7A4B',head:'#D4A84B',legs:'#3D3025',detail:'#A0A8B0'}, details:[] }
];

/** Aree di gioco con funzioni di rendering procedurali */
var areas = {
  piazza: {
    name: 'Piazza del Borgo',
    walkableTop: 105,
    colliders: [
      {x:153, y:42, w:94, h:78},  // Municipio
      {x:78,  y:158, w:48, h:28},  // Fontana
      {x:30,  y:133, w:58, h:62},  // Bar Centrale
      {x:262, y:162, w:26, h:32}   // Albero + cabina
    ],
    npcs: [
      { id: 'ruggeri', x: 230, y: 135 },
      { id: 'valli', x: 320, y: 195 },
      { id: 'gino', x: 110, y: 195 }
    ],
    exits: [
      { dir: 'up', xRange: [170, 230], to: 'archivio', spawnX: 195, spawnY: 210, label: 'Archivio Comunale' },
      { dir: 'right', xRange: [0, 60], to: 'cascina', spawnX: 40, spawnY: 160, label: 'Cascina Bellandi' }
    ],
    draw: function(ctx) {
      // Cielo + stelle
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.creamPaper;
      [30,80,140,200,260,310,360,50,120,180,340,380].forEach(function(x,i){ctx.fillRect(x,12+(i*20)%48,2,2);});
      // Montagne
      ctx.fillStyle = PALETTE.violetBlue;
      ctx.beginPath(); ctx.moveTo(0,90); ctx.lineTo(60,60); ctx.lineTo(150,75); ctx.lineTo(220,50); ctx.lineTo(300,70); ctx.lineTo(400,85); ctx.lineTo(400,100); ctx.lineTo(0,100); ctx.fill();
      // Municipio
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(155,55,90,65);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(162,62,26,58); ctx.fillRect(210,62,26,58);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(155,45,90,12);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(170,75,6,8); ctx.fillRect(220,75,6,8);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(160,52,6,30); ctx.fillRect(234,52,6,30);
      // Fontana
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(80,170,40,12);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(90,160,20,12);
      ctx.fillStyle = PALETTE.violetBlue; ctx.fillRect(93,163,14,6);
      // Bar Centrale (porta cliccabile per entrare)
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(32,140,42,48);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(30,136,46,8);
      ctx.fillStyle = '#CC0000'; ctx.fillRect(34,144,38,14);
      ctx.font = '8px "Courier New",monospace'; ctx.fillStyle = '#FF4444'; ctx.fillText('BAR',42,154);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(42,164,14,20); ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(46,168,4,4);
      // Fiat 500
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(340,175,36,16);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(345,163,26,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(350,167,8,6); ctx.fillRect(365,167,8,6);
      // Lampioni
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(58,155,4,30); ctx.fillRect(335,148,4,30);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(56,150,8,8); ctx.fillRect(333,143,8,8);
      // Alone luce lampioni
      ctx.fillStyle = 'rgba(212,168,67,0.15)'; ctx.beginPath(); ctx.arc(60,170,22,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(337,163,22,0,Math.PI*2); ctx.fill();
      // Cabina SIP
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(260,160,14,24);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(263,163,8,16);
      // Albero
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(266,180,4,18);
      ctx.fillStyle = PALETTE.darkForest; ctx.beginPath(); ctx.arc(268,170,10,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(260,167,8,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(276,168,8,0,Math.PI*2); ctx.fill();
      // Suolo / pavé
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(0,185,CANVAS_W,65);
      ctx.fillStyle = PALETTE.earthBrown;
      for(var r=0;r<7;r++){for(var c=0;c<14;c++){ctx.fillRect(c*30+(r%2)*15,188+r*9,26,5);}}
      // Gatto rosso
      var cx=115,cy=156;
      ctx.fillStyle='#E8913A'; ctx.fillRect(cx,cy,8,5); ctx.fillRect(cx+3,cy-3,4,3);
      ctx.fillStyle='#44FF44'; ctx.fillRect(cx+2,cy-2,2,1);
      // Cartelli uscita
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(170,6,60,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(172,8,56,10);
      ctx.font = '8px "Courier New",monospace'; ctx.fillStyle = PALETTE.creamPaper; ctx.fillText('ARCHIVIO',174,16);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(350,155,50,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(352,157,46,10);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillText('CASCINA',353,165);
    }
  },

  archivio: {
    name: 'Archivio Comunale',
    walkableTop: 8,
    colliders: [
      {x:12, y:35, w:88, h:175},   // Scaffale sinistro
      {x:302, y:35, w:88, h:175},  // Scaffale destro
      {x:135, y:165, w:130, h:40}  // Scrivania area
    ],
    npcs: [
      { id: 'neri', x: 200, y: 145 }
    ],
    exits: [
      { dir: 'down', xRange: [170, 230], to: 'piazza', spawnX: 195, spawnY: 40, label: 'Piazza del Borgo' }
    ],
    draw: function(ctx) {
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(0,0,CANVAS_W,8);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(0,200,CANVAS_W,50);
      ctx.fillStyle = PALETTE.greyBrown;
      for(var t=0; t<10; t++){ ctx.fillRect(t*40+2,202,36,4); if(t<9) ctx.fillRect(t*40+20,206,32,4); }
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(17,42,80,170); ctx.fillRect(307,42,80,170);
      ctx.fillStyle = PALETTE.earthBrown;
      ctx.fillRect(15,40,80,170); ctx.fillRect(305,40,80,170);
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(13,40,84,4); ctx.fillRect(303,40,84,4);
      ctx.fillStyle = PALETTE.slateGrey;
      for(var s=0;s<5;s++){ctx.fillRect(15,45+s*38,80,4);ctx.fillRect(305,45+s*38,80,4);}
      var bookColors = [PALETTE.burntOrange,PALETTE.darkForest,PALETTE.violetBlue,PALETTE.greyBrown,PALETTE.nightBlue];
      for(var b=0;b<12;b++){
        var bx=20+(b%3)*24, by=52+Math.floor(b/3)*38;
        ctx.fillStyle=bookColors[b%5];ctx.fillRect(bx,by,12,24);
        ctx.fillStyle=PALETTE.creamPaper;ctx.fillRect(bx+2,by+2,2,6);
        if(b%4===1){ctx.save();ctx.translate(bx+6,by+12);ctx.rotate(0.12);ctx.fillStyle=bookColors[(b+2)%5];ctx.fillRect(-6,-12,12,24);ctx.restore();}
        ctx.fillStyle=bookColors[(b+1)%5];ctx.fillRect(312+(b%3)*24,52+Math.floor(b/3)*38,12,24);
        ctx.fillStyle=PALETTE.creamPaper;ctx.fillRect(314+(b%3)*24,54+Math.floor(b/3)*38,2,6);
        if((b+1)%4===0){ctx.save();ctx.translate(318+(b%3)*24,64+Math.floor(b/3)*38);ctx.rotate(-0.1);ctx.fillStyle=bookColors[b%5];ctx.fillRect(-6,-12,12,24);ctx.restore();}
      }
      ctx.strokeStyle='rgba(200,200,200,0.25)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(19,46);ctx.lineTo(29,56);ctx.stroke();
      ctx.beginPath();ctx.moveTo(19,46);ctx.lineTo(35,50);ctx.stroke();
      ctx.beginPath();ctx.moveTo(91,46);ctx.lineTo(81,56);ctx.stroke();
      ctx.beginPath();ctx.moveTo(91,46);ctx.lineTo(75,50);ctx.stroke();
      ctx.beginPath();ctx.moveTo(309,46);ctx.lineTo(319,56);ctx.stroke();
      ctx.beginPath();ctx.moveTo(309,46);ctx.lineTo(325,50);ctx.stroke();
      ctx.beginPath();ctx.moveTo(381,46);ctx.lineTo(371,56);ctx.stroke();
      ctx.beginPath();ctx.moveTo(381,46);ctx.lineTo(365,50);ctx.stroke();
      ctx.strokeStyle='#000';ctx.lineWidth=1;
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(142,186,120,16);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(140,184,120,14);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(145,190,10,30); ctx.fillRect(245,190,10,30);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(150,178,6,7); ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(149,182,8,2);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(162,179,14,10);
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(164,181,10,1); ctx.fillRect(165,183,8,1); ctx.fillRect(166,185,6,1);
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(202,175,7,9); ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(201,175,9,2);
      ctx.strokeStyle='rgba(200,200,200,0.4)'; ctx.beginPath(); ctx.moveTo(205,174); ctx.lineTo(205,170); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(203,173); ctx.lineTo(202,169); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(207,173); ctx.lineTo(208,169); ctx.stroke(); ctx.strokeStyle='#000';
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(230,178,1,8); ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(229,177,3,2);
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(260,150,4,18); ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(254,138,16,14);
      ctx.fillStyle='rgba(212,168,67,0.08)'; ctx.beginPath(); ctx.moveTo(258,138); ctx.lineTo(200,190); ctx.lineTo(320,190); ctx.closePath(); ctx.fill();
      ctx.fillStyle=PALETTE.lanternYel+'33'; ctx.beginPath(); ctx.arc(262,165,25,0,Math.PI*2); ctx.fill();
      for(var win=0;win<2;win++){
        var wx=win===0?120:230;
        ctx.fillStyle=PALETTE.nightBlue; ctx.fillRect(wx,30,48,58);
        ctx.fillStyle=PALETTE.earthBrown; ctx.fillRect(wx+22,30,4,58); ctx.fillRect(wx,56,48,4);
        ctx.strokeStyle=PALETTE.earthBrown; ctx.lineWidth=2; ctx.strokeRect(wx-2,28,52,62); ctx.strokeStyle='#000'; ctx.lineWidth=1;
      }
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(185,25,28,34);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(187,27,24,20);
      ctx.fillStyle = PALETTE.creamPaper; ctx.beginPath(); ctx.arc(199,33,6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(190,47,18,10);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(100,40,12,16);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(102,42,8,2);
      for(var cal=0;cal<4;cal++){ctx.fillStyle=PALETTE.greyBrown;ctx.fillRect(102,46+cal*3,8,1);}
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(330,42,50,34);
      ctx.fillStyle = PALETTE.oliveGreen; ctx.fillRect(334,46,18,12);
      ctx.fillStyle = PALETTE.violetBlue; ctx.fillRect(354,50,22,8);
      ctx.strokeStyle = PALETTE.earthBrown; ctx.strokeRect(330,42,50,34); ctx.strokeStyle='#000';
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(98,178,8,12);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(102,180,4,4);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.beginPath(); ctx.arc(104,176,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(100,170,8,3); ctx.fillRect(102,168,6,3);
      ctx.fillStyle = '#CE2B37'; ctx.fillRect(100,179,8,2);
      var gx=180, gy=200;
      ctx.fillStyle='#444'; ctx.fillRect(gx,gy,8,5); ctx.beginPath(); ctx.arc(gx+4,gy-1,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+1,gy-1); ctx.lineTo(gx,gy-5); ctx.lineTo(gx+3,gy-1); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+7,gy-1); ctx.lineTo(gx+8,gy-5); ctx.lineTo(gx+5,gy-1); ctx.fill();
      ctx.fillStyle='#44FF44'; ctx.fillRect(gx+3,gy-2,1,1); ctx.fillRect(gx+5,gy-2,1,1);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(170,CANVAS_H-18,55,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(172,CANVAS_H-16,51,10);
      ctx.font='8px "Courier New",monospace'; ctx.fillStyle = PALETTE.creamPaper;
      ctx.fillText('PIAZZA',175,CANVAS_H-8);
    }
  },

  cascina: {
    name: 'Cascina dei Bellandi',
    walkableTop: 100,
    colliders: [
      {x:197, y:38, w:150, h:105}, // Cascina edificio
      {x:39,  y:155, w:50, h:50},  // Pozzo
      {x:332, y:58, w:72, h:100},  // Fienile
      {x:0,   y:70, w:38, h:95},   // Albero sinistro
      {x:365, y:80, w:35, h:85}    // Albero destro
    ],
    npcs: [
      { id: 'teresa', x: 120, y: 175 },
      { id: 'gino', x: 340, y: 200 }
    ],
    exits: [
      { dir: 'left', xRange: [0, 30], to: 'piazza', spawnX: 360, spawnY: 160, label: 'Piazza del Borgo' },
      { dir: 'up', xRange: [160, 240], to: 'campo', spawnX: 195, spawnY: 210, label: 'Campo delle Luci' }
    ],
    draw: function(ctx) {
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.creamPaper;
      for(var s=0;s<22;s++){var sx=(s*83+25)%CANVAS_W,sy=8+(s*29)%55,ss=s%3===0?2:1;ctx.fillRect(sx,sy,ss,ss);}
      var mx=50, my=32;
      ctx.fillStyle='rgba(212,168,67,0.12)';ctx.beginPath();ctx.arc(mx,my,20,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(212,168,67,0.06)';ctx.beginPath();ctx.arc(mx,my,26,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=PALETTE.lanternYel;ctx.beginPath();ctx.arc(mx,my,14,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=PALETTE.nightBlue;ctx.beginPath();ctx.arc(mx+3,my-2,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(180,140,60,0.4)';ctx.beginPath();ctx.arc(mx+2,my-5,3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(180,140,60,0.3)';ctx.beginPath();ctx.arc(mx-3,my+4,2,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(180,140,60,0.35)';ctx.beginPath();ctx.arc(mx+4,my+6,2.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle = PALETTE.oliveGreen; ctx.fillRect(0,100,CANVAS_W,150);
      ctx.fillStyle = PALETTE.darkForest; ctx.fillRect(0,100,CANVAS_W,6);
      var tm=Date.now()*0.001;
      for(var wl=0;wl<CANVAS_W;wl+=8){
        ctx.fillRect(wl,104+Math.sin(wl*0.15+tm*2)*3,4,2);
        ctx.fillRect(wl+2,112+Math.sin(wl*0.13+tm*1.7)*3,4,2);
        ctx.fillRect(wl,120+Math.sin(wl*0.17+tm*2.2)*2,4,2);
      }
      ctx.fillStyle = PALETTE.oliveGreen; ctx.fillRect(180,100,40,150);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(190,100,20,150);
      ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(202,52,140,90);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(200,50,140,90);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(200,42,140,10);
      for(var tile=0;tile<20;tile++){ ctx.fillStyle='#B88550'; ctx.beginPath();ctx.arc(205+tile*7,43,4,Math.PI,0,false);ctx.fill(); }
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(280,38,12,20); ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(278,56,16,4);
      ctx.fillStyle='rgba(150,150,150,0.3)';
      for(var sm=0;sm<3;sm++){ var smx=286+Math.sin(tm*2+sm)*3, smy=34-sm*8+Math.sin(tm+sm)*2; ctx.beginPath();ctx.arc(smx,smy,4-sm*0.5,0,Math.PI*2);ctx.fill(); }
      ctx.fillStyle=PALETTE.darkForest; ctx.fillRect(200,60,8,14);ctx.fillRect(200,78,6,10);ctx.fillRect(202,92,8,12);ctx.fillRect(200,108,5,8);ctx.fillRect(200,120,7,10);
      ctx.fillStyle=PALETTE.oliveGreen; ctx.fillRect(202,65,4,10);ctx.fillRect(201,80,5,8);ctx.fillRect(203,95,5,10);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(250,78,36,62);
      ctx.fillStyle = PALETTE.earthBrown; ctx.beginPath();ctx.arc(268,78,18,Math.PI,0,false);ctx.fill();
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(254,88,2,10);ctx.fillRect(280,88,2,10); ctx.fillRect(256,94,6,2);ctx.fillRect(274,94,6,2);
      if(gameState.cluesFound.indexOf('simboli_portone')===-1){
        ctx.fillStyle = PALETTE.lanternYel;
        ctx.fillRect(256,88,3,5);ctx.fillRect(266,86,2,5);ctx.fillRect(274,90,4,2);
        ctx.fillRect(258,100,5,3);ctx.fillRect(272,98,3,4);
        ctx.fillRect(260,112,2,5);ctx.fillRect(270,108,4,3);ctx.fillRect(278,114,2,5);
      }
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(215,65,16,20); ctx.fillRect(310,65,16,20);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(213,63,20,4); ctx.fillRect(213,83,20,4); ctx.fillRect(308,63,20,4); ctx.fillRect(308,83,20,4);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(50,165,28,34);
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(42,160,44,8);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(55,170,18,12);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(340,70,55,80); ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(335,62,65,10);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(345,68,6,80); ctx.fillRect(385,68,6,80);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(150,180,3,3);ctx.fillRect(160,185,3,3);
      ctx.strokeStyle = PALETTE.earthBrown;ctx.beginPath();ctx.arc(115,178,6,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(115,178);ctx.lineTo(115,172);ctx.stroke();ctx.beginPath();ctx.moveTo(115,178);ctx.lineTo(121,178);ctx.stroke();ctx.strokeStyle='#000';
      var scx=65, scy=140;
      ctx.fillStyle=PALETTE.earthBrown;ctx.fillRect(scx+3,scy+16,2,16);ctx.fillRect(scx,scy+10,8,1);
      ctx.fillStyle=PALETTE.fadedBeige;ctx.fillRect(scx-2,scy+2,12,10);
      ctx.fillStyle=PALETTE.creamPaper;ctx.beginPath();ctx.arc(scx+4,scy-2,5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=PALETTE.slateGrey;ctx.beginPath();ctx.arc(scx+4,scy+2,6,Math.PI,0,false);ctx.fill();
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(8,75,20,50);
      ctx.fillStyle = PALETTE.darkForest; ctx.beginPath();ctx.arc(18,70,12,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(10,65,10,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(26,68,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(370,85,16,50);
      ctx.fillStyle = PALETTE.darkForest; ctx.beginPath();ctx.arc(378,80,12,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(370,75,10,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(386,78,10,0,Math.PI*2);ctx.fill();
      var gx=55, gy=210;
      ctx.fillStyle='#6B4E3D'; ctx.fillRect(gx,gy,8,5); ctx.beginPath(); ctx.arc(gx+4,gy-1,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+1,gy-1); ctx.lineTo(gx,gy-5); ctx.lineTo(gx+3,gy-1); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+7,gy-1); ctx.lineTo(gx+8,gy-5); ctx.lineTo(gx+5,gy-1); ctx.fill();
      ctx.fillStyle=PALETTE.lanternYel; ctx.fillRect(gx+3,gy-2,1,1); ctx.fillRect(gx+5,gy-2,1,1);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(4,140,45,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(6,142,41,10);
      ctx.font = '8px "Courier New",monospace';
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillText('PIAZZA',7,150);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(170,85,48,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(172,87,44,10);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillText('CAMPO',173,95);
    }
  },

  campo: {
    name: 'Campo delle Luci',
    walkableTop: 80,
    colliders: [
      {x:5,   y:85,  w:25, h:160},  // Pioppi sx
      {x:370, y:85,  w:25, h:160}   // Pioppi dx
    ],
    npcs: [],
    exits: [
      { dir: 'down', xRange: [160, 240], to: 'cascina', spawnX: 195, spawnY: 160, label: 'Cascina Bellandi' }
    ],
    draw: function(ctx) {
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.creamPaper;
      for(var s=0;s<60;s++){var sx=(s*53+13)%CANVAS_W,sy=8+(s*31)%55,ss=s%4===0?2:1;ctx.fillRect(sx,sy,ss,ss);}
      var t=Date.now()*0.001;
      for(var l=0;l<5;l++){
        var lx=60+(l*70), ly=10+(l*8)+Math.sin(t+l)*6;
        ctx.fillStyle=PALETTE.lanternYel+'11';
        ctx.beginPath();ctx.ellipse(lx,ly-Math.sin(t*0.5+l)*3,4,10,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=PALETTE.lanternYel+'66';
        ctx.beginPath();ctx.arc(lx,ly,6+Math.sin(t*2+l)*2,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=PALETTE.creamPaper;
        ctx.beginPath();ctx.arc(lx,ly,3,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle='rgba(160,168,176,0.08)';ctx.fillRect(0,55,CANVAS_W,22);
      ctx.fillStyle='rgba(160,168,176,0.05)';ctx.fillRect(0,72,CANVAS_W,18);
      ctx.fillStyle = PALETTE.darkForest; ctx.fillRect(0,100,CANVAS_W,40);
      ctx.fillStyle = PALETTE.oliveGreen; ctx.fillRect(0,115,CANVAS_W,140);
      for(var pp=0;pp<3;pp++){
        var px=[30,200,370][pp], ptop=[80,75,78][pp];
        ctx.fillStyle=PALETTE.earthBrown;ctx.fillRect(px-3,ptop+30,6,45);
        ctx.fillStyle=PALETTE.greyBrown;ctx.fillRect(px-2,ptop+35,2,18);ctx.fillRect(px+1,ptop+42,3,14);
        ctx.fillStyle=PALETTE.darkForest;
        ctx.beginPath();ctx.ellipse(px,ptop+12,9,28,0,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.ellipse(px,ptop+5,7,22,0.1,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=PALETTE.oliveGreen;
        for(var pl=0;pl<6;pl++){ctx.fillRect(px-4+pl*2,ptop+pl*3+Math.sin(t*3+pl)*2,2,1);}
      }
      ctx.fillStyle=PALETTE.lanternYel+'33'; ctx.beginPath();ctx.arc(195,165,42,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(195,165,35,0,Math.PI*2);ctx.fillStyle=PALETTE.oliveGreen;ctx.fill();
      ctx.fillStyle=PALETTE.lanternYel+'55'; ctx.beginPath();ctx.arc(195,165,35,0,Math.PI*2);ctx.lineWidth=2;ctx.stroke();ctx.lineWidth=1;
      ctx.fillStyle=PALETTE.lanternYel+'22'; ctx.beginPath();ctx.arc(240,172,15,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=PALETTE.oliveGreen;ctx.beginPath();ctx.arc(240,172,13,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(240,172,15,0,Math.PI*2);ctx.fillStyle=PALETTE.lanternYel+'33';ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle=PALETTE.creamPaper+'15';
      for(var a=0;a<36;a++){ var rad=a*Math.PI/18; ctx.fillRect(195+Math.cos(rad)*28-1,165+Math.sin(rad)*28-1,3,3); }
      ctx.fillStyle='rgba(160,140,80,0.2)';
      for(var a2=0;a2<24;a2++){ var rad2=a2*Math.PI/12; ctx.fillRect(195+Math.cos(rad2)*20-1,165+Math.sin(rad2)*20,2,1); }
      ctx.fillStyle='rgba(160,168,176,0.15)';ctx.beginPath();ctx.arc(195,165,12,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(200,210,220,0.08)';ctx.beginPath();ctx.arc(193,163,8,0,Math.PI*2);ctx.fill();
      var shx=330, shy=155;
      ctx.fillStyle=PALETTE.greyBrown;ctx.fillRect(shx,shy,16,20);
      ctx.fillStyle=PALETTE.slateGrey;ctx.fillRect(shx-2,shy-4,20,6);
      ctx.fillStyle=PALETTE.alumGrey;ctx.fillRect(shx+6,shy-10,4,8);ctx.fillRect(shx+5,shy-9,6,2);
      ctx.fillStyle=PALETTE.lanternYel;ctx.fillRect(shx+6,shy+4,2,4);
      ctx.fillStyle='rgba(255,200,100,0.5)';ctx.beginPath();ctx.arc(shx+7,shy+3,3+Math.sin(t*4)*0.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=PALETTE.burntOrange;ctx.fillRect(shx+3,shy+10,3,2);ctx.fillRect(shx+10,shy+12,3,2);
      ctx.fillStyle=PALETTE.oliveGreen;ctx.fillRect(shx+7,shy+8,3,1);
      var gx=315, gy=168;
      ctx.fillStyle='#C0C0C0'; ctx.fillRect(gx,gy,8,5); ctx.beginPath(); ctx.arc(gx+4,gy-1,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+1,gy-1); ctx.lineTo(gx,gy-5); ctx.lineTo(gx+3,gy-1); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+7,gy-1); ctx.lineTo(gx+8,gy-5); ctx.lineTo(gx+5,gy-1); ctx.fill();
      ctx.fillStyle='#44FF44'; ctx.fillRect(gx+3,gy-2,1,1); ctx.fillRect(gx+5,gy-2,1,1);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(165,CANVAS_H-18,55,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(167,CANVAS_H-16,51,10);
      ctx.font = '8px "Courier New",monospace';
      ctx.fillStyle = PALETTE.creamPaper;       ctx.fillText('CASCINA',168,CANVAS_H-8);
    }
  },

  bar_interno: {
    name: 'Bar Centrale',
    walkableTop: 8,
    colliders: [
      {x:5, y:38, w:135, h:50},
      {x:260, y:120, w:35, h:45}
    ],
    npcs: [
      { id: 'osvaldo', x: 120, y: 175 }
    ],
    exits: [
      { dir: 'down', xRange: [170, 230], to: 'piazza', spawnX: 48, spawnY: 195, label: 'Piazza del Borgo' }
    ],
    draw: function(ctx) {
      // Pareti
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(0,0,CANVAS_W,8);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(0,220,CANVAS_W,30);
      // Pavimento
      ctx.fillStyle = PALETTE.greyBrown;
      for(var r=0;r<5;r++){for(var c=0;c<8;c++){ctx.fillRect(c*50+(r%2)*25,190+r*10,46,8);}}
      // Bancone
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(10,70,120,14);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(14,38,112,36);
      // Bottiglie
      ctx.fillStyle='#44AA44';ctx.fillRect(80,62,4,10);
      ctx.fillStyle='#AA4444';ctx.fillRect(86,60,4,12);
      ctx.fillStyle='#D4A843';ctx.fillRect(102,58,3,14);
      // Sgabelli
      ctx.fillStyle=PALETTE.slateGrey;ctx.fillRect(50,185,4,18);ctx.fillRect(55,183,14,4);
      ctx.fillStyle=PALETTE.slateGrey;ctx.fillRect(70,185,4,18);ctx.fillRect(75,183,14,4);
      // Macchina caffè
      ctx.fillStyle=PALETTE.alumGrey;ctx.fillRect(30,50,16,22);
      // Jukebox
      ctx.fillStyle=PALETTE.earthBrown;ctx.fillRect(280,120,30,50);
      ctx.fillStyle=PALETTE.lanternYel;ctx.fillRect(284,124,22,16);
      // Lampada appesa
      ctx.fillStyle=PALETTE.slateGrey;ctx.fillRect(198,10,4,6);
      ctx.fillStyle=PALETTE.lanternYel;ctx.fillRect(192,15,16,4);
      ctx.fillStyle='rgba(212,168,67,0.12)';ctx.beginPath();ctx.arc(200,25,55,0,Math.PI*2);ctx.fill();
      // Insegna BAR
      ctx.fillStyle='#CC0000';ctx.fillRect(150,68,100,16);
      ctx.font='11px "Courier New",monospace';ctx.fillStyle='#FFFFFF';
      ctx.fillText('BAR CENTRALE',160,80);
      // Vetrina
      ctx.fillStyle=PALETTE.nightBlue;ctx.fillRect(260,30,50,40);
      ctx.fillStyle=PALETTE.earthBrown;ctx.fillRect(258,28,54,4);ctx.fillRect(258,68,54,4);
      // Uscita
      ctx.fillStyle=PALETTE.lanternYel;ctx.fillRect(170,CANVAS_H-18,60,14);
      ctx.fillStyle=PALETTE.nightBlue;ctx.fillRect(172,CANVAS_H-16,56,10);
      ctx.font='8px "Courier New",monospace';
      ctx.fillStyle=PALETTE.creamPaper;ctx.fillText('PIAZZA',175,CANVAS_H-8);
    }
  }
};

/** Albero dialoghi — tutti i nodi di conversazione */
var dialogueNodes = {
  /* ── SINDACO RUGGERI ── */
  ruggeri_s0: {
    text: 'Benvenuto a San Celeste, ispettore. Sono il sindaco Ruggeri. La situazione è sotto controllo... solo superstizioni popolari.',
    choices: [
      { text: 'Mi parli delle luci nel cielo.', next: 'ruggeri_s0_luci' },
      { text: 'Ci sono stati altri casi di sparizione?', next: 'ruggeri_s0_casi' },
      { text: 'Lei cosa pensa, sindaco?', next: 'ruggeri_s0_pensa' }
    ]
  },
  ruggeri_s0_luci: { text: 'Fandonie. Contadini che hanno bevuto troppo vino e scambiato un elicottero per... non so cosa. Non abbiamo tempo per queste sciocchezze.' },
  ruggeri_s0_casi: {
    text: 'Mah... nel 1861, a sentir le storie dei vecchi, due persone sparirono. Ma furono temporali forti quell\'anno. Forse annegati nel fiume. Chieda all\'archivista Neri, se proprio vuole.',
    effect: { hint: 'archivio' }
  },
  ruggeri_s0_pensa: { text: 'Penso che lei stia perdendo tempo, ispettore. La prefettura ha di meglio da fare che inseguire leggende. Ma faccia pure il suo lavoro.' },

  ruggeri_s1: {
    text: 'Quella lettera militare... non doveva trovarsi negli archivi comunali. Ci sono cose di cui è meglio non parlare.',
    choices: [
      { text: 'Che cosa nasconde, sindaco?', next: 'ruggeri_s1_nasconde' },
      { text: 'La lettera coinvolge l\'esercito?', next: 'ruggeri_s1_esercito' },
      { text: 'Lei sapeva delle sparizioni del \'61?', next: 'ruggeri_s1_sapeva' }
    ]
  },
  ruggeri_s1_nasconde: { text: 'Io proteggo questo paese, ispettore. Certe cose è meglio lasciarle stare. Non è il momento di scavare.' },
  ruggeri_s1_esercito: { text: '...Parli con il Capitano Valli. Era di stanza qui nel \'61. Lui sa più di me su certe... operazioni. Ma non le dirà niente se non ha qualcosa in mano.' },
  ruggeri_s1_sapeva: { text: 'Sapevo. Ma non potevo dire nulla. Ordini dall\'alto. Era per il bene comune, almeno così ci dissero.' },

  ruggeri_s2: {
    text: 'Dunque ha risolto il rompicapo. Vada al campo, ispettore. E qualunque cosa trovi laggiù... si ricordi che a volte la verità fa più paura di una bugia.',
    choices: [
      { text: 'Cosa troverò al Campo delle Luci?', next: 'ruggeri_s2_campo' },
      { text: 'Grazie, sindaco. Andrò a vedere.', next: 'ruggeri_s2_vai' }
    ]
  },
  ruggeri_s2_campo: { text: 'Non lo so con certezza. Ma so che ogni 116 anni qualcosa accade lì. Nel 1861, nel 1745... La storia si ripete.' },
  ruggeri_s2_vai: { text: 'Buona fortuna, ispettore. E che Dio l\'accompagni.' },

  /* ── TERESA BELLANDI ── */
  teresa_s0: {
    text: 'Sant\'Antonio ci protegga! Ha visto anche lei le luci? Erano sopra i campi, silenziose... Mio nipote Enzo è uscito a guardare e non è più tornato!',
    choices: [
      { text: 'Cosa ha visto esattamente quella notte?', next: 'teresa_s0_visto' },
      { text: 'Suo nipote: quand\'è successo?', next: 'teresa_s0_enzo' },
      { text: 'Si calmi, signora. Mi racconti con calma.', next: 'teresa_s0_calma' }
    ]
  },
  teresa_s0_visto: { text: 'Sfere di luce, grosse come automobili, fluttuavano sopra il campo a nord. Mio nonno diceva che nel 1861 fu uguale. Le stesse luci. Lo stesso silenzio.' },
  teresa_s0_enzo: { text: 'Tre notti fa. Enzo era un ragazzo curioso. Disse: "Nonna, vado a vedere". Non l\'ho più rivisto. La sua stanza è ancora come l\'ha lasciata...' },
  teresa_s0_calma: { text: 'Come posso stare calma? Mio nipote è sparito nel nulla! E nessuno mi crede! Dicono che sono pazza, che me lo sono immaginato... Ma io le ho viste, le luci.' },

  teresa_s1: {
    text: 'Quei segni sul portone... Sono apparsi la notte delle luci. Non erano lì prima. È un messaggio, lo so.',
    choices: [
      { text: 'Ha idea di chi possa averli fatti?', next: 'teresa_s1_chi' },
      { text: 'Ha trovato altro vicino alla cascina?', next: 'teresa_s1_altro', effect: { giveClue: 'frammento' } },
      { text: 'Enzo aveva un diario?', next: 'teresa_s1_diario' }
    ]
  },
  teresa_s1_chi: { text: 'Nessuno del paese sa fare cose del genere. E non sono simboli cristiani, glielo assicuro. Li ho mostrati al parroco. È impallidito e se n\'è andato.' },
  teresa_s1_altro: { text: 'Sì... ho trovato questo per terra, vicino al pozzo. Era freddo come il ghiaccio, anche se era piena estate. Lo prenda, magari serve alla sua indagine.' },
  teresa_s1_diario: {
    text: 'Il diario di Enzo? Sì, lo teneva sempre con sé. È sul comodino nella sua stanza. Ma io... io non ho il coraggio di leggerlo. Lo faccia lei.',
    effect: { giveClueHint: 'diario_enzo' }
  },

  teresa_s2: {
    text: 'Enzo scriveva di luci e cerchi nel grano. Diceva che "loro" sarebbero tornati dopo 116 anni. Io non so se siano angeli o demoni. Ma lei lo scoprirà.',
    choices: [
      { text: 'Troverò la verità, glielo prometto.', next: 'teresa_s2_promessa' },
      { text: 'Cosa intende con "loro"?', next: 'teresa_s2_loro' }
    ]
  },
  teresa_s2_promessa: { text: 'Grazie, ispettore. Qualunque cosa trovi... mi dica solo se Enzo è vivo. È tutto quello che chiedo.' },
  teresa_s2_loro: { text: 'Quelli che vengono dal cielo. Mio nonno li chiamava "i visitatori". Diceva che non sono cattivi... ma nemmeno buoni. Sono solo... diversi.' },

  /* ── ARCHIVISTA NERI ── */
  neri_s0: {
    text: 'Un investigatore della prefettura? Finalmente qualcuno di razionale in questo paese di superstiziosi. Io sono Neri, l\'archivista. Come posso aiutarla?',
    choices: [
      { text: 'Cosa sa delle sparizioni del 1861?', next: 'neri_s0_1861' },
      { text: 'Ci sono documenti militari negli archivi?', next: 'neri_s0_militari' },
      { text: 'Lei crede alle luci nel cielo?', next: 'neri_s0_luci' }
    ]
  },
  neri_s0_1861: { text: 'Registrate, sì. Due persone: un uomo e una donna. Mai ritrovati. Ma guardi che quell\'anno ci furono temporali violentissimi. Potrebbero essere annegati nel fiume.' },
  neri_s0_militari: { text: 'Abbiamo solo atti comunali. Anche se... in un fondo chiuso c\'è una busta gialla, mai protocollata. Con un timbro che non ho mai visto. Strana, molto strana.' },
  neri_s0_luci: { text: 'Fenomeni atmosferici. Gas di palude. Inversioni termiche. Niente di soprannaturale. La scienza spiega tutto, ispettore. O quasi tutto.' },

  neri_s1: {
    text: 'Forse mi sbagliavo. Ho confrontato le date: 1861 e 1977. Esattamente 116 anni di differenza. Non può essere una coincidenza.',
    choices: [
      { text: 'Cosa significa il ciclo di 116 anni?', next: 'neri_s1_ciclo' },
      { text: 'Ha trovato la lettera di cui parlava?', next: 'neri_s1_lettera', effect: { giveClue: 'lettera_censurata' } },
      { text: 'Ha una mappa dei terreni a nord?', next: 'neri_s1_mappa', effect: { giveClueHint: 'mappa_campi' } }
    ]
  },
  neri_s1_ciclo: { text: 'Non ne ho idea. Ma ho controllato: nel 1861 ci furono "temporali magnetici". E guarda caso, anche tre giorni fa gli aghi delle bussole impazzivano. C\'è uno schema.' },
  neri_s1_lettera: { text: 'L\'ho trovata. È del Ministero della Difesa, datata 1961 — un anno strano, a metà del ciclo. Parla di "recupero materiali non terrestri". È censurata quasi tutta. La legga lei.' },
  neri_s1_mappa: { text: 'Certo, la mappa catastale del 1890. Mostra tutti i terreni agricoli. Il campo a nord era chiamato "Podere Sant\'Elmo" — curioso, no? Sant\'Elmo è il patrono dei marinai... e dei fuochi fatui.' },

  neri_s2: {
    text: 'Vada al campo e porti prove scientifiche. Se quello che sospetto è vero... non siamo soli nell\'universo. E non lo siamo mai stati.',
    choices: [
      { text: 'Pensa davvero che siano extraterrestri?', next: 'neri_s2_extra' },
      { text: 'Andrò al campo. Grazie, Neri.', next: 'neri_s2_thanks' }
    ]
  },
  neri_s2_extra: { text: 'Non so cosa siano. Ma qualcosa torna ogni 116 anni, e lascia tracce che la nostra scienza non sa spiegare. Forse la risposta non è nei libri. Forse è là fuori.' },
  neri_s2_thanks: { text: 'Buona fortuna, ispettore. E mi raccomando: annoti tutto. La documentazione è l\'unica arma contro l\'ignoranza.' },

  /* ── CAPITANO VALLI ── */
  valli_s0: {
    text: 'Investigatore. Non ho niente da dirle. Buonasera.',
    choices: [
      { text: 'Aspetti, capitano. Ho bisogno del suo aiuto.', next: 'valli_s0_aspetta' }
    ]
  },
  valli_s0_aspetta: { text: 'Ho detto che non ho niente da dire. Cerchi altrove.' },

  valli_s1: {
    text: 'Quel frammento metallico... dove l\'ha trovato? È identico a quello che recuperammo nel \'61. Io c\'ero. Ero un soldato semplice, di guardia al perimetro.',
    choices: [
      { text: 'Cosa accadde esattamente nel 1961?', next: 'valli_s1_accadde' },
      { text: 'Era un\'astronave? Un velivolo militare?', next: 'valli_s1_cosa' },
      { text: 'Perché non ha mai parlato prima d\'ora?', next: 'valli_s1_perche' }
    ]
  },
  valli_s1_accadde: { text: 'Un oggetto precipitò nei campi. Non era un aereo. L\'esercito lo recuperò in una notte. Ci dissero che era un satellite russo, ma... non lo era. Non era umano.' },
  valli_s1_cosa: { text: 'Non lo so cosa fosse. Ma il metallo era freddo, leggerissimo. E la forma... non aveva giunture, non aveva rivetti. Era come se fosse stato... cresciuto, non costruito.' },
  valli_s1_perche: { text: 'Minacce. Dissero che se parlavo, sparivo anch\'io. Come i due del 1861. Non ho mai avuto il coraggio... fino ad ora.' },

  valli_s2: {
    text: 'Questa volta non starò zitto. L\'accompagno al campo. Deve vedere con i suoi occhi. Forse è il momento che la verità venga a galla.',
    choices: [
      { text: 'Andiamo, capitano.', next: 'valli_s2_andiamo' },
      { text: 'Cosa devo aspettarmi di trovare?', next: 'valli_s2_cosa' }
    ]
  },
  valli_s2_andiamo: { text: 'Ci vediamo al campo. Non abbia paura. Qualunque cosa siano... sono tornati per un motivo.' },
  valli_s2_cosa: { text: 'Non lo so. Spero risposte. Forse anche Enzo. Forse tutti quelli che sono spariti. O forse solo altre domande.' },

  /* ── OSVALDO IL BARISTA ── */
  osvaldo_s0: {
    text: 'Ah, Detective Maurizio! Il famoso investigatore! Un caffè? O preferisce una grappa? Qui dentro è il terzo caffè, fuori è già l\'ottavo. Io dico: sono i russi. O forse gli americani che fingono di essere russi. O forse...',
    choices: [
      {text:'Cosa ne pensa delle luci?', next:'osvaldo_luci'},
      {text:'Ha visto qualcosa di strano?', next:'osvaldo_strano'},
      {text:'Un caffè, grazie.', next:'osvaldo_caffe'}
    ]
  },
  osvaldo_luci: {text:'Le luci? Ma quali luci! Sarà mica la televisione che fa brutti scherzi. Mia moglie dice che sono gli extraterrestri. Io dico che sono i bergamaschi. Quelli sono capaci di tutto.'},
  osvaldo_strano: {text:'Strano? Mah... ieri ho visto Gino il postino che correva in mutande. Ma quello è normale per Gino. Ah, una cosa: la fontana in piazza perde acqua da 14 anni e nessuno la ripara. Questo sì che è strano.'},
  osvaldo_caffe: {text:'Ecco a lei. 200 lire. Scherzo, offre la casa. Sa, con tutto questo casino delle luci, i clienti scappano. Restano solo i vecchi. E Gino. Gino non paga mai.'},

  /* ── GINO IL POSTINO ── */
  gino_s0: {
    text:'Buongiorno, Detective! Gino, postino! Ho una lettera per lei! ...Ah no, è una multa. Divieto di sosta. La Fiat 500 blu è la sua? No, è del sindaco. Allora la multa non è sua. Però poteva esserlo. Comunque! Voci di paese!',
    choices:[
      {text:'Che voci girano?', next:'gino_voci'},
      {text:'Ha visto qualcosa la notte delle luci?', next:'gino_luci'},
      {text:'Lei crede agli alieni?', next:'gino_alieni'}
    ]
  },
  gino_voci: {text:'La signora Iole, quella del terzo piano... no, non c\'\u00e8 un terzo piano a San Celeste. Quella del piano terra! Dice di aver visto le luci mentre stendeva i panni. Dice che sembravano... come dire... grosse polpette luminose. Io non ci ho capito niente.'},
  gino_luci: {text:'Io quella notte dormivo. Ho il sonno pesante, sa? Mia moglie dice che neanche i bombardamenti mi svegliano. Però ho trovato questo per terra vicino alla cascina.'},
  gino_alieni: {text:'Alieni? Ma no! Se fossero alieni ci avrebbero già mangiato. O forse... forse sono alieni gentili. Alieni che vengono in vacanza. San Celeste è bella anche per loro, no? Cioè, se uno viene da Marte, magari apprezza il nostro lambrusco.'}
};

/** Effetti dei dialoghi applicati dopo la scelta */
var dialogueEffects = {
  hint_archivio: function() { showToast('Il Sindaco ha parlato dell\'Archivio Comunale.'); },
  give_frammento: function() {
    if(gameState.cluesFound.indexOf('frammento')===-1){
      gameState.cluesFound.push('frammento');
      updateHUD();
      showToast('Hai raccolto: Frammento metallico freddo');
    }
  },
  hint_diario_enzo: function() {
    var obj=areaObjects.cascina.find(function(o){return o.id==='diario_enzo';});
    if(obj)obj.requires=null;
    showToast('Teresa ha detto che il diario è nella stanza di Enzo.');
  },
  give_lettera: function() {
    if(gameState.cluesFound.indexOf('lettera_censurata')===-1){
      gameState.cluesFound.push('lettera_censurata');
      updateHUD();
      showToast('Hai raccolto: Lettera militare censurata');
    }
  },
  hint_mappa: function() { showToast('Neri ha una mappa. Forse è al Campo delle Luci?'); }
};
