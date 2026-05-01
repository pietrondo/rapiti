/* ═══════════════════════════════════════════════════════════════════════════════
   SCENE RENDERER
   Rendering schermate: prologo, titolo, intro, tutorial, ending
   ═══════════════════════════════════════════════════════════════════════════════ */

function _drawNightField(ctx, t) {
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = PALETTE.creamPaper;
  [30, 80, 140, 200, 260, 310, 360, 50, 120, 180, 340, 380].forEach(function (x, i) {
    ctx.fillRect(x, 8 + ((i * 23) % 40), 1 + ((i * 3) % 2), 1 + ((i * 7) % 2));
  });
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.beginPath();
  ctx.arc(60, 25, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.violetBlue;
  ctx.beginPath();
  ctx.moveTo(0, 80);
  ctx.lineTo(50, 50);
  ctx.lineTo(130, 65);
  ctx.lineTo(200, 45);
  ctx.lineTo(300, 60);
  ctx.lineTo(400, 78);
  ctx.lineTo(400, 90);
  ctx.lineTo(0, 90);
  ctx.fill();
  ctx.fillStyle = PALETTE.oliveGreen;
  ctx.fillRect(0, 95, CANVAS_W, 155);
  ctx.fillStyle = PALETTE.darkForest;
  for (var g = 0; g < CANVAS_W; g += 6) {
    var wave = Math.sin(g * 0.05 + t * 3) * 4;
    ctx.fillRect(g, 93 + wave, 3, 20 + Math.abs(wave));
  }
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(180, 90, 40, 160);
}

function _drawGroundLight(ctx, step, t) {
  var pulse = Math.sin(t * 4) * 0.3 + 0.7;
  var glowIntensity = Math.min(1, (step - 2) * 0.5 + pulse * 0.3);
  ctx.fillStyle = 'rgba(200,220,255,' + (glowIntensity * 0.6).toFixed(2) + ')';
  ctx.beginPath();
  ctx.arc(200, 130, 50 + Math.sin(t * 3) * 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,' + (glowIntensity * 0.8).toFixed(2) + ')';
  ctx.beginPath();
  ctx.arc(200, 130, 20 + Math.sin(t * 2) * 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(200,220,255,' + (glowIntensity * 0.3).toFixed(2) + ')';
  for (var r = 0; r < 8; r++) {
    ctx.fillRect(198 + r * 2, 70 + Math.sin(r + t * 2) * 5, 2, 60);
  }
}

function _drawConcentricCircles(ctx, step, t) {
  var circleAlpha = Math.min(1, (step - 4) * 0.4 + Math.sin(t * 2) * 0.1);
  ctx.strokeStyle = 'rgba(212,168,67,' + circleAlpha.toFixed(2) + ')';
  ctx.lineWidth = 2;
  for (var c = 0; c < 3; c++) {
    var radius = 15 + c * 18 + Math.sin(t * 3 + c) * 3;
    ctx.beginPath();
    ctx.arc(200, 130, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.lineWidth = 1;
  ctx.fillStyle = PALETTE.oliveGreen + 'AA';
  for (var a = 0; a < 24; a++) {
    var rad = (a * Math.PI) / 12;
    for (var r2 = 0; r2 < 3; r2++) {
      var rv = 20 + r2 * 16;
      ctx.fillRect(198 + Math.cos(rad) * rv, 128 + Math.sin(rad) * rv, 3, 2);
    }
  }
}

function _drawElena(ctx, step, t) {
  var elenaX = step >= 5 ? 200 : 50 + ((t * 20) % 150);
  var elenaY = 115;
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(elenaX - 3, elenaY + 8, 7, 2);
  ctx.fillStyle = '#6B4E3D';
  ctx.fillRect(elenaX - 2, elenaY + 4, 1, 5);
  ctx.fillRect(elenaX + 1, elenaY + 4, 1, 5);
  ctx.fillStyle = '#3D5A3C';
  ctx.fillRect(elenaX - 3, elenaY, 6, 5);
  ctx.fillStyle = '#D4A84B';
  ctx.fillRect(elenaX - 2, elenaY - 6, 5, 6);
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(elenaX - 1, elenaY - 4, 1, 1);
  ctx.fillRect(elenaX + 1, elenaY - 4, 1, 1);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(elenaX - 6, elenaY - 2, 3, 6);
  ctx.fillStyle = 'rgba(212,168,67,0.25)';
  ctx.beginPath();
  ctx.arc(elenaX - 5, elenaY + 1, 10, 0, Math.PI * 2);
  ctx.fill();
}

function _drawFragment(ctx) {
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(196, 132, 6, 4);
  ctx.fillStyle = PALETTE.creamPaper + '88';
  ctx.fillRect(197, 131, 4, 2);
}

function _drawWhiteFlash(ctx, step, timer) {
  var flash = Math.min(
    1,
    (step - 7) * 0.4 + (timer - (step === 7 ? 60 : 0)) * 0.02
  );
  ctx.fillStyle = 'rgba(255,255,255,' + Math.min(0.9, flash).toFixed(2) + ')';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function _drawTitleOnWhite(ctx) {
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.font = 'bold 20px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LE LUCI DI SAN CELESTE', 200, 120);
  ctx.font = '11px "Courier New",monospace';
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillText("1979 — Un'indagine della Prefettura", 200, 140);
  ctx.textAlign = 'start';
}

var _subtitles = [
  'San Celeste, 25 luglio 1979. Ore 23:40.',
  "Elena Bellandi corre tra l'erba alta.",
  '',
  'Una luce si accende dal terreno... non dal cielo.',
  '',
  'Tre cerchi appaiono nel grano.',
  'Elena si ferma.',
  'Raccoglie un piccolo oggetto metallico.',
  'La luce diventa accecante.',
  '',
];

function _drawSubtitles(ctx, step) {
  var txt = _subtitles[step] || '';
  if (!txt) return;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(50, 210, 300, 22);
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.font = '9px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText(txt, 200, 226);
  ctx.textAlign = 'start';
}

function _drawWaitPrompt(ctx) {
  var alpha = 0.4 + Math.sin(Date.now() * 0.003) * 0.4;
  ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
  ctx.font = '9px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Attendi...', 200, 230);
  ctx.textAlign = 'start';
}

export function renderPrologueCutscene(ctx) {
  var step = gameState.prologueStep;
  var t = gameState.prologueTimer * 0.016;

  if (step <= 1) _drawNightField(ctx, t);
  if (step >= 2) _drawGroundLight(ctx, step, t);
  if (step >= 4) _drawConcentricCircles(ctx, step, t);
  if (step >= 1 && step <= 5) _drawElena(ctx, step, t);
  if (step >= 6) _drawFragment(ctx);
  if (step >= 7) _drawWhiteFlash(ctx, step, gameState.prologueTimer);
  if (step >= 8) _drawTitleOnWhite(ctx);
  if (step < 8) _drawSubtitles(ctx, step);
  if (step === 8) _drawWaitPrompt(ctx);
}

export function renderTitle(ctx) {
  var t = Date.now() * 0.001;
  UIRenderer.drawTitleLandscape(ctx, t);
  UIRenderer.drawPixelPanel(ctx, 34, 154, 332, 74, null);
  ctx.fillStyle = UIRenderer.VISUAL.gold;
  ctx.font = 'bold 22px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LE LUCI', 200, 180);
  ctx.fillStyle = UIRenderer.VISUAL.paper;
  ctx.fillText('DI SAN CELESTE', 200, 200);
  ctx.fillStyle = PALETTE.burntOrange;
  ctx.font = '10px "Courier New",monospace';
  ctx.fillText('Italia Settentrionale / Estate 1978', 200, 216);
  UIRenderer.drawPrompt(ctx, 'Premi ENTER per iniziare', 200, 238);
  ctx.textAlign = 'start';
}

var _introSlides = [
  {
    title: 'SAN CELESTE',
    subtitle: '28 LUGLIO 1978',
    getLines: function () {
      return [
        '', 'Un piccolo borgo tra Parma e Piacenza.', '800 anime, una piazza,',
        'un campanile, un bar.', '', 'Da tre notti, strane luci appaiono',
        'nel cielo sopra i campi a nord.', '', 'Non sono stelle. Non sono aerei.',
        '', 'Il paese ha paura.',
      ];
    },
  },
  {
    title: 'LE SPARIZIONI',
    getLines: function () {
      return [
        '', 'Tre persone sono scomparse.', '', 'Enzo Bellandi, 19 anni.',
        'Era uscito a guardare le luci.', '', 'Sua nonna Teresa',
        "non dorme piu' da tre giorni.", '', 'La Prefettura di Parma',
        'ha mandato il suo miglior uomo.',
      ];
    },
  },
  {
    title: 'IL DETECTIVE',
    getLines: function (name) {
      return [
        '', "Quell'uomo sei tu,", name + '.', '',
        'Un detective pragmatico, razionale,', "con un debole per il caffe'",
        'e un sesto senso per i misteri.', '', 'Fuori ti aspettano',
        "la piazza, l'archivio, la cascina.", '', 'E il Campo delle Luci.',
      ];
    },
  },
  {
    title: "L'INCARICO",
    getLines: function (name) {
      return [
        '', '"Detective ' + name + ',', 'vada a San Celeste.',
        'Scopra cosa sta succedendo.', 'E torni con delle risposte."', '',
        'Non sai ancora', 'che quelle risposte', 'ti cambieranno per sempre.',
        '', 'Le luci sono tornate.', 'Come nel 1861. Come nel 1961.',
        '', "La verita' ti aspetta.",
      ];
    },
  },
];

var _introPrompts = [
  'Premi ENTER per continuare',
  'Premi ENTER per continuare',
  'Premi ENTER per personalizzare il detective',
  'Premi ENTER per iniziare',
];

export function renderIntroSlide(ctx) {
  var slide = gameState.introSlide;
  var t = Date.now() * 0.001;
  UIRenderer.drawTitleLandscape(ctx, t * 0.8);
  UIRenderer.drawPixelPanel(ctx, 24, 54, 352, 178, 'DOSSIER PREFETTURA');

  var name = gameState.playerName || 'Detective Maurizio';
  var slideData = _introSlides[slide];
  if (!slideData) return;

  ctx.fillStyle = PALETTE.lanternYel;
  ctx.font = 'bold 13px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText(slideData.title, 200, 82);
  if (slideData.subtitle) ctx.fillText(slideData.subtitle, 200, 98);
  ctx.textAlign = 'start';

  var lines = slideData.getLines(name);
  ctx.font = '10px "Courier New",monospace';
  for (var i = 0; i < lines.length; i++) {
    var ln = lines[i];
    if (ln.indexOf('"') === 0 || ln === name.toUpperCase() || ln.indexOf(name) === 0) {
      ctx.fillStyle = PALETTE.lanternYel;
    } else {
      ctx.fillStyle = PALETTE.creamPaper;
    }
    if (ln === name.toUpperCase()) ctx.font = 'bold 10px "Courier New",monospace';
    else ctx.font = '10px "Courier New",monospace';
    ctx.fillText(ln, 200, 114 + i * 13);
  }

  ctx.font = '10px "Courier New",monospace';
  UIRenderer.drawPrompt(ctx, _introPrompts[slide] || '', 200, 222);
  ctx.textAlign = 'start';
}

export function renderPrologue(ctx) {
  renderIntroSlide(ctx);
}

export function renderTutorial(ctx) {
  UIRenderer.fillGradientRect(ctx, 0, 0, CANVAS_W, CANVAS_H, '#080A13', '#1B211C');
  UIRenderer.drawFilmGrain(ctx);
  UIRenderer.drawPixelPanel(ctx, 30, 15, 340, 220, 'TACCUINO OPERATIVO');
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.font = 'bold 16px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ISTRUZIONI', 200, 45);
  ctx.font = '11px "Courier New",monospace';
  ctx.textAlign = 'start';
  var lines = [
    ['WASD / Frecce', 'Muovi il detective'],
    ['E', 'Interagisci / Parla / Raccogli'],
    ['J', 'Apri il Diario (indizi raccolti)'],
    ['I', "Apri l'Inventario"],
    ['T', 'Pannello Teoria (quando disponibile)'],
    ['N', 'Mostra / nascondi minimappa'],
    ['M', 'Musica ON / OFF'],
    ['ESC', 'Chiudi pannelli'],
    ['', ''],
    ['Obiettivo:', "Scopri la verita' dietro"],
    ['', 'le luci misteriose di San Celeste.'],
  ];
  for (var i = 0; i < lines.length; i++) {
    if (lines[i][0] !== '') {
      ctx.fillStyle = 'rgba(212,168,67,0.18)';
      ctx.fillRect(54, 66 + i * 15, 86, 12);
    }
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillText(lines[i][0], 60, 75 + i * 15);
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillText(lines[i][1], 60 + ctx.measureText(lines[i][0]).width + 8, 75 + i * 15);
  }
  ctx.textAlign = 'center';
  UIRenderer.drawPrompt(ctx, "Premi ENTER per iniziare l'indagine", 200, 230);
  ctx.textAlign = 'start';
}

export function renderEndingScreen(ctx) {
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  var t = Date.now() * 0.001;
  ctx.fillStyle = `${PALETTE.creamPaper}22`;
  for (var i = 0; i < 30; i++) {
    ctx.fillRect((i * 117) % CANVAS_W, (i * 53 + Math.sin(t + i) * 3) % CANVAS_H, 2, 2);
  }
}

// Export for other modules
window.SceneRenderer = {
  renderPrologueCutscene: renderPrologueCutscene,
  renderTitle: renderTitle,
  renderIntroSlide: renderIntroSlide,
  renderPrologue: renderPrologue,
  renderTutorial: renderTutorial,
  renderEndingScreen: renderEndingScreen,
};
