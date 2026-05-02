/* ═══════════════════════════════════════════════════════════════════════════════
   INTRO RENDERER
   Schermata titolo, slide narrative, tutorial
   ═══════════════════════════════════════════════════════════════════════════════ */

export function renderTitle(ctx) {
  var t = Date.now() * 0.001;
  window.UIRenderer.drawTitleLandscape(ctx, t);
  window.UIRenderer.drawPixelPanel(ctx, 34, 154, 332, 74, null);
  ctx.fillStyle = window.UIRenderer.VISUAL.gold;
  ctx.font = 'bold 22px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('LE LUCI', 200, 180);
  ctx.fillStyle = window.UIRenderer.VISUAL.paper;
  ctx.fillText('DI SAN CELESTE', 200, 200);
  ctx.fillStyle = window.PALETTE.burntOrange;
  ctx.font = '10px "Courier New",monospace';
  ctx.fillText('Italia Settentrionale / Estate 1978', 200, 216);
  window.UIRenderer.drawPrompt(ctx, 'Premi ENTER per iniziare', 200, 238);
  ctx.textAlign = 'start';
}

var _introSlides = [
  {
    title: 'SAN CELESTE',
    subtitle: '28 LUGLIO 1978',
    getLines: () => [
      '',
      'Un piccolo borgo tra Parma e Piacenza.',
      '800 anime, una piazza,',
      'un campanile, un bar.',
      '',
      'Da tre notti, strane luci appaiono',
      'nel cielo sopra i campi a nord.',
      '',
      'Non sono stelle. Non sono aerei.',
      '',
      'Il paese ha paura.',
    ],
  },
  {
    title: 'LE SPARIZIONI',
    getLines: () => [
      '',
      'Tre persone sono scomparse.',
      '',
      'Enzo Bellandi, 19 anni.',
      'Era uscito a guardare le luci.',
      '',
      'Sua nonna Teresa',
      "non dorme piu' da tre giorni.",
      '',
      'La Prefettura di Parma',
      'ha mandato il suo miglior uomo.',
    ],
  },
  {
    title: 'IL DETECTIVE',
    getLines: (name) => [
      '',
      "Quell'uomo sei tu,",
      `${name}.`,
      '',
      'Un detective pragmatico, razionale,',
      "con un debole per il caffe'",
      'e un sesto senso per i misteri.',
      '',
      'Fuori ti aspettano',
      "la piazza, l'archivio, la cascina.",
      '',
      'E il Campo delle Luci.',
    ],
  },
  {
    title: "L'INCARICO",
    getLines: (name) => [
      '',
      `"Detective ${name},`,
      'vada a San Celeste.',
      'Scopra cosa sta succedendo.',
      'E torni con delle risposte."',
      '',
      'Non sai ancora',
      'che quelle risposte',
      'ti cambieranno per sempre.',
      '',
      'Le luci sono tornate.',
      'Come nel 1861. Come nel 1961.',
      '',
      "La verita' ti aspetta.",
    ],
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
  window.UIRenderer.drawTitleLandscape(ctx, t * 0.8);
  window.UIRenderer.drawPixelPanel(ctx, 24, 54, 352, 178, 'DOSSIER PREFETTURA');

  var name = gameState.playerName || 'Detective Maurizio';
  var slideData = _introSlides[slide];
  if (!slideData) return;

  ctx.fillStyle = window.PALETTE.lanternYel;
  ctx.font = 'bold 13px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText(slideData.title, 200, 82);
  if (slideData.subtitle) ctx.fillText(slideData.subtitle, 200, 98);
  ctx.textAlign = 'start';

  var lines = slideData.getLines(name);
  ctx.font = '10px "Courier New",monospace';
  var textX = 44; // margine sinistro allineato col bordo pannello + 20px padding
  var startY = 100; // spostato piu' in alto
  var lineSpacing = 11; // 11 righe max
  for (var i = 0; i < lines.length; i++) {
    var ln = lines[i];
    if (ln.indexOf('"') === 0 || ln === name.toUpperCase() || ln.indexOf(name) === 0) {
      ctx.fillStyle = window.PALETTE.lanternYel;
    } else {
      ctx.fillStyle = window.PALETTE.creamPaper;
    }
    if (ln === name.toUpperCase()) ctx.font = 'bold 10px "Courier New",monospace';
    else ctx.font = '10px "Courier New",monospace';
    ctx.fillText(ln, textX, startY + i * lineSpacing);
  }

  // Prompt fuori dal pannello per evitare overlap con l'ultima riga
  // drawPrompt disegna un rettangolo sfondo di 16px centrato su y
  // Il pannello finisce a y=232, quindi y=238 mette il rettangolo da 228 a 244
  ctx.font = '10px "Courier New",monospace';
  window.UIRenderer.drawPrompt(ctx, _introPrompts[slide] || '', 200, 238);
  ctx.textAlign = 'start';
}

export function renderPrologue(ctx) {
  renderIntroSlide(ctx);
}

export function renderTutorial(ctx) {
  window.UIRenderer.fillGradientRect(ctx, 0, 0, window.CANVAS_W, window.CANVAS_H, '#080A13', '#1B211C');
  window.UIRenderer.drawFilmGrain(ctx);
  window.UIRenderer.drawPixelPanel(ctx, 30, 15, 340, 220, 'TACCUINO OPERATIVO');
  ctx.fillStyle = window.PALETTE.lanternYel;
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
  var tutY = 70;
  var tutSpacing = 14;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i][0] !== '') {
      ctx.fillStyle = 'rgba(212,168,67,0.18)';
      ctx.fillRect(54, tutY - 9 + i * tutSpacing, 86, 12);
    }
    ctx.fillStyle = window.PALETTE.lanternYel;
    ctx.fillText(lines[i][0], 60, tutY + i * tutSpacing);
    ctx.fillStyle = window.PALETTE.creamPaper;
    ctx.fillText(lines[i][1], 60 + ctx.measureText(lines[i][0]).width + 8, tutY + i * tutSpacing);
  }
  ctx.textAlign = 'center';
  window.UIRenderer.drawPrompt(ctx, "Premi ENTER per iniziare l'indagine", 200, 230);
  ctx.textAlign = 'start';
}

window.SceneRenderer = window.SceneRenderer || {};
window.SceneRenderer.renderTitle = renderTitle;
window.SceneRenderer.renderIntroSlide = renderIntroSlide;
window.SceneRenderer.renderPrologue = renderPrologue;
window.SceneRenderer.renderTutorial = renderTutorial;
