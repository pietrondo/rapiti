"use strict";

function render(ctx) {
  ctx.save();
  ctx.scale(2, 2);
  ctx.imageSmoothingEnabled = false;
  
  // Applica screen shake
  ScreenShake.apply(ctx);
  
  var ph = gameState.gamePhase;

  if (ph === 'title') { renderTitle(ctx); }
  else if (ph === 'prologue_cutscene') { renderPrologueCutscene(ctx); }
  else if (ph === 'intro') { renderIntroSlide(ctx); }
  else if (ph === 'prologue') { renderPrologue(ctx); }
  else if (ph === 'tutorial') { renderTutorial(ctx); }
  else if (ph === 'playing' || ph === 'dialogue' || ph === 'journal' || ph === 'inventory' || ph === 'deduction') {
    renderArea(ctx);
    renderPlayer(ctx);
    renderInteractionHint(ctx);
    // Effetti visivi avanzati
    LightingSystem.draw(ctx, gameState.player.x, gameState.player.y);
    ParticleSystem.draw(ctx);
    Vignette.draw(ctx, CANVAS_W, CANVAS_H);
  }
  else if (ph === 'ending') { renderEndingScreen(ctx); }
  if (ph === 'customize') { renderTitle(ctx); } // Background durante customize
  if (gameState.fadeDir !== 0) renderFade(ctx);

  ctx.restore();
}

/** Prologo cutscene — Elena nel campo, luci, cerchi, frammento */
function renderPrologueCutscene(ctx) {
  var step = gameState.prologueStep;
  var t = gameState.prologueTimer * 0.016; // ~60fps timer

  // Step 0-1: campo notturno, erba ondulata
  if (step <= 1) {
    ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    // Stelle
    ctx.fillStyle = PALETTE.creamPaper;
    [30,80,140,200,260,310,360,50,120,180,340,380].forEach(function(x,i){
      ctx.fillRect(x, 8+(i*23)%40, 1+((i*3)%2), 1+((i*7)%2));
    });
    // Luna
    ctx.fillStyle = PALETTE.lanternYel; ctx.beginPath(); ctx.arc(60,25,12,0,Math.PI*2); ctx.fill();
    // Montagne
    ctx.fillStyle = PALETTE.violetBlue;
    ctx.beginPath(); ctx.moveTo(0,80); ctx.lineTo(50,50); ctx.lineTo(130,65); ctx.lineTo(200,45);
    ctx.lineTo(300,60); ctx.lineTo(400,78); ctx.lineTo(400,90); ctx.lineTo(0,90); ctx.fill();
    // Terreno / erba (ondulata)
    ctx.fillStyle = PALETTE.oliveGreen;
    ctx.fillRect(0,95,CANVAS_W,155);
    // Erba alta ondulata (animazione)
    ctx.fillStyle = PALETTE.darkForest;
    for(var g=0; g<CANVAS_W; g+=6){
      var wave = Math.sin(g*0.05 + t*3) * 4;
      ctx.fillRect(g, 93+wave, 3, 20+Math.abs(wave));
    }
    // Sentiero
    ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(180,90,40,160);
  }

  // Step 2: luce dal terreno
  if (step >= 2) {
    // Aggiungi luce pulsante dal terreno
    var pulse = Math.sin(t * 4) * 0.3 + 0.7;
    var glowIntensity = Math.min(1, (step - 2) * 0.5 + pulse * 0.3);
    ctx.fillStyle = 'rgba(200,220,255,' + (glowIntensity * 0.6).toFixed(2) + ')';
    ctx.beginPath(); ctx.arc(200, 130, 50 + Math.sin(t*3) * 15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,' + (glowIntensity * 0.8).toFixed(2) + ')';
    ctx.beginPath(); ctx.arc(200, 130, 20 + Math.sin(t*2) * 8, 0, Math.PI*2); ctx.fill();
    // Raggi di luce verso l'alto
    ctx.fillStyle = 'rgba(200,220,255,' + (glowIntensity * 0.3).toFixed(2) + ')';
    for(var r=0; r<8; r++){
      ctx.fillRect(198 + r*2, 70 + Math.sin(r+t*2)*5, 2, 60);
    }
  }

  // Step 4: 3 cerchi concentrici
  if (step >= 4) {
    var circleAlpha = Math.min(1, (step - 4) * 0.4 + Math.sin(t*2)*0.1);
    ctx.strokeStyle = 'rgba(212,168,67,' + circleAlpha.toFixed(2) + ')';
    ctx.lineWidth = 2;
    for(var c=0; c<3; c++){
      var radius = 15 + c * 18 + Math.sin(t*3 + c)*3;
      ctx.beginPath(); ctx.arc(200, 130, radius, 0, Math.PI*2); ctx.stroke();
    }
    ctx.lineWidth = 1;
    // Erba piegata dentro i cerchi
    ctx.fillStyle = PALETTE.oliveGreen + 'AA';
    for(var a=0; a<24; a++){
      var rad = a * Math.PI / 12;
      for(var r2=0; r2<3; r2++){
        var rv = 20 + r2 * 16;
        ctx.fillRect(198 + Math.cos(rad)*rv, 128 + Math.sin(rad)*rv, 3, 2);
      }
    }
  }

  // Step 5: Elena (sprite che corre)
  if (step >= 1 && step <= 5) {
    var elenaX = step >= 5 ? 200 : 50 + t * 20 % 150;
    var elenaY = 115;
    // Sprite di Elena (sagoma femminile semplice)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(elenaX-3, elenaY+8, 7, 2);
    ctx.fillStyle = '#6B4E3D'; ctx.fillRect(elenaX-2, elenaY+4, 1, 5); ctx.fillRect(elenaX+1, elenaY+4, 1, 5); // gambe
    ctx.fillStyle = '#3D5A3C'; ctx.fillRect(elenaX-3, elenaY, 6, 5); // vestito
    ctx.fillStyle = '#D4A84B'; ctx.fillRect(elenaX-2, elenaY-6, 5, 6); // testa
    ctx.fillStyle = '#1A1C20'; ctx.fillRect(elenaX-1, elenaY-4, 1, 1); ctx.fillRect(elenaX+1, elenaY-4, 1, 1); // occhi
    // Lanterna
    ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(elenaX-6, elenaY-2, 3, 6);
    ctx.fillStyle = 'rgba(212,168,67,0.25)'; ctx.beginPath(); ctx.arc(elenaX-5, elenaY+1, 10, 0, Math.PI*2); ctx.fill();
  }

  // Step 6: raccoglie frammento
  if (step >= 6) {
    ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(196, 132, 6, 4);
    ctx.fillStyle = PALETTE.creamPaper + '88'; ctx.fillRect(197, 131, 4, 2);
  }

  // Step 7-8: schermo si illumina / fade to white
  if (step >= 7) {
    var flash = Math.min(1, (step - 7) * 0.4 + (gameState.prologueTimer - (step === 7 ? 60 : 0)) * 0.02);
    ctx.fillStyle = 'rgba(255,255,255,' + Math.min(0.9, flash).toFixed(2) + ')';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Step 8: titolo su bianco
  if (step >= 8) {
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.font = 'bold 20px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('LE LUCI DI SAN CELESTE', 200, 120);
    ctx.font = '11px "Courier New",monospace';
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillText('1979 — Un\'indagine della Prefettura', 200, 140);
    ctx.textAlign = 'start';
  }

  // Testo didascalico in basso
  if (step < 8) {
    var subtitles = [
      'San Celeste, 25 luglio 1979. Ore 23:40.',
      'Elena Bellandi corre tra l\'erba alta.',
      '',
      'Una luce si accende dal terreno... non dal cielo.',
      '',
      'Tre cerchi appaiono nel grano.',
      'Elena si ferma.',
      'Raccoglie un piccolo oggetto metallico.',
      'La luce diventa accecante.',
      ''
    ];
    var txt = subtitles[step] || '';
    if (txt) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(50, 210, 300, 22);
      ctx.fillStyle = PALETTE.creamPaper; ctx.font = '9px "Courier New",monospace'; ctx.textAlign = 'center';
      ctx.fillText(txt, 200, 226);
      ctx.textAlign = 'start';
    }
  }
  if (step === 8) {
    var alpha = 0.4 + Math.sin(Date.now()*0.003)*0.4;
    ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
    ctx.font = '9px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('Attendi...', 200, 230);
    ctx.textAlign = 'start';
  }
}

function renderTitle(ctx) {
  ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  var t = Date.now() * 0.001;
  ctx.fillStyle = PALETTE.creamPaper;
  for (var i = 0; i < 40; i++) {
    ctx.fillRect((i * 97) % CANVAS_W, (i * 43 + Math.sin(t + i) * 2) % CANVAS_H, 1 + ((i * 3) % 2), 1 + ((i * 7) % 2));
  }
  ctx.fillStyle = PALETTE.lanternYel + '55';
  ctx.beginPath(); ctx.arc(200, 40, 20 + Math.sin(t * 1.5) * 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.creamPaper + '77';
  ctx.beginPath(); ctx.arc(200, 40, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.lanternYel + '33';
  ctx.beginPath(); ctx.arc(140, 60, 14 + Math.sin(t * 2 + 1) * 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(260, 55, 16 + Math.sin(t * 1.8 + 2) * 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.violetBlue; ctx.fillRect(0, 130, CANVAS_W, 120);
  ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(130, 115, 140, 50);
  ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(130, 108, 140, 8);
  ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(150, 128, 6, 8); ctx.fillRect(240, 128, 6, 8);
  ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(195, 70, 10, 50);
  ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(190, 65, 20, 6);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.font = 'bold 22px "Courier New",monospace'; ctx.textAlign = 'center';
  ctx.fillText('LE LUCI DI SAN CELESTE', 200, 185);
  ctx.font = '11px "Courier New",monospace';
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.fillText('Italia Settentrionale — Estate 1978', 200, 205);
  var alpha = 0.4 + Math.sin(t * 3) * 0.4;
  ctx.fillStyle = 'rgba(232,220,200,' + alpha.toFixed(2) + ')';
  ctx.fillText('Premi ENTER per iniziare', 200, 230);
  ctx.textAlign = 'start';
}

function renderIntroSlide(ctx) {
  var slide = gameState.introSlide;
  ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Stelle fisse di sfondo
  ctx.fillStyle = PALETTE.creamPaper + '44';
  [30,80,140,200,260,310,360,50,120,180,340,380,95,220,290,160,70,350].forEach(function(x,i){
    ctx.fillRect(x, 10+(i*27)%55, 1+((i*3)%2), 1+((i*7)%2));
  });

  // Luci animate sempre visibili
  var t = Date.now() * 0.001;
  ctx.fillStyle = PALETTE.lanternYel + '33';
  ctx.beginPath(); ctx.arc(200, 30, 16 + Math.sin(t * 2) * 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.lanternYel + '22';
  ctx.beginPath(); ctx.arc(140, 45, 10 + Math.sin(t * 1.5 + 1) * 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(260, 40, 12 + Math.sin(t * 1.8 + 2) * 3, 0, Math.PI * 2); ctx.fill();

  // Pannello narrativo
  ctx.fillStyle = 'rgba(26,28,32,0.85)'; ctx.fillRect(25, 60, 350, 170);
  ctx.strokeStyle = PALETTE.lanternYel; ctx.lineWidth = 2; ctx.strokeRect(25, 60, 350, 170);
  ctx.lineWidth = 1;

  var name = gameState.playerName || 'Detective Maurizio';
  var lines = [];

  if (slide === 0) {
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.font = 'bold 13px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('SAN CELESTE', 200, 82);
    ctx.fillText('28 LUGLIO 1978', 200, 98);
    lines = [
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
      'Il paese ha paura.'
    ];
  } else if (slide === 1) {
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.font = 'bold 13px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('LE SPARIZIONI', 200, 82);
    lines = [
      '',
      'Tre persone sono scomparse.',
      '',
      'Enzo Bellandi, 19 anni.',
      'Era uscito a guardare le luci.',
      '',
      'Sua nonna Teresa',
      'non dorme piu\' da tre giorni.',
      '',
      'La Prefettura di Parma',
      'ha mandato il suo miglior uomo.'
    ];
  } else if (slide === 2) {
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.font = 'bold 13px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('IL DETECTIVE', 200, 82);
    lines = [
      '',
      'Quell\'uomo sei tu,',
      name + '.',
      '',
      'Un detective pragmatico, razionale,',
      'con un debole per il caffe\'',
      'e un sesto senso per i misteri.',
      '',
      'Fuori ti aspettano',
      'la piazza, l\'archivio, la cascina.',
      '',
      'E il Campo delle Luci.'
    ];
  } else {
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.font = 'bold 13px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('L\'INCARICO', 200, 82);
    lines = [
      '',
      '"Detective ' + name + ',',
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
      'La verita\' ti aspetta.'
    ];
  }

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

  // Prompt ENTER
  var alpha = 0.4 + Math.sin(Date.now() * 0.003) * 0.4;
  ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
  ctx.font = '10px "Courier New",monospace';
  var prompt = slide < 2 ? 'Premi ENTER per continuare' : (slide === 2 ? 'Premi ENTER per personalizzare il detective' : 'Premi ENTER per iniziare');
  ctx.fillText(prompt, 200, 222);
  ctx.textAlign = 'start';
}

function renderPrologue(ctx) { renderIntroSlide(ctx); }

function renderTutorial(ctx) {
  ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = 'rgba(26,28,32,0.8)'; ctx.fillRect(30, 15, 340, 220);
  ctx.strokeStyle = PALETTE.lanternYel; ctx.lineWidth = 2; ctx.strokeRect(30, 15, 340, 220);
  ctx.lineWidth = 1;
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.font = 'bold 16px "Courier New",monospace'; ctx.textAlign = 'center';
  ctx.fillText('ISTRUZIONI', 200, 45);
  ctx.font = '11px "Courier New",monospace'; ctx.textAlign = 'start';
  var lines = [
    ['WASD / Frecce', 'Muovi il detective'],
    ['E', 'Interagisci / Parla / Raccogli'],
    ['J', 'Apri il Diario (indizi raccolti)'],
    ['I', 'Apri l\'Inventario'],
    ['T', 'Pannello Teoria (quando disponibile)'],
    ['M', 'Musica ON / OFF'],
    ['ESC', 'Chiudi pannelli'],
    ['', ''],
    ['Obiettivo:', 'Scopri la verita\' dietro'],
    ['', 'le luci misteriose di San Celeste.']
  ];
  for (var i = 0; i < lines.length; i++) {
    ctx.fillStyle = PALETTE.lanternYel; ctx.fillText(lines[i][0], 60, 75 + i * 15);
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillText(lines[i][1], 60 + ctx.measureText(lines[i][0]).width + 8, 75 + i * 15);
  }
  var alpha2 = 0.4 + Math.sin(Date.now() * 0.003) * 0.4;
  ctx.fillStyle = 'rgba(212,168,67,' + alpha2.toFixed(2) + ')'; ctx.textAlign = 'center';
  ctx.fillText('Premi ENTER per iniziare l\'indagine', 200, 230);
  ctx.textAlign = 'start';
}

function renderArea(ctx) {
  var area = areas[gameState.currentArea];
  area.draw(ctx);
  // Render NPCs
  for (var i = 0; i < area.npcs.length; i++) {
    var n = area.npcs[i];
    var npc = null;
    for (var j = 0; j < npcsData.length; j++) { if (npcsData[j].id === n.id) { npc = npcsData[j]; break; } }
    if (!npc) continue;
    drawSprite(ctx, n.x, n.y, npc.colors, npc.details, 'npc');
    var tw = ctx.measureText(npc.name).width + 8;
    ctx.fillStyle = 'rgba(26,28,32,0.85)';
    ctx.fillRect(n.x - tw / 2, n.y - 24, tw, 10);
    ctx.fillStyle = PALETTE.lanternYel; ctx.font = '7px "Courier New",monospace';
    ctx.textAlign = 'center'; ctx.fillText(npc.name, n.x, n.y - 16); ctx.textAlign = 'start';
  }
  // Render interactable objects
  var objs = areaObjects[gameState.currentArea] || [];
  for (var k = 0; k < objs.length; k++) {
    var o = objs[k];
    if (o.type === 'gatto') {
      ctx.fillStyle = '#C4956A'; ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.fillStyle = '#D4A843'; ctx.fillRect(o.x + 1, o.y, 3, 2);
      ctx.fillStyle = '#1A1C20'; ctx.fillRect(o.x + 2, o.y + 1, 1, 1); ctx.fillRect(o.x + 5, o.y + 1, 1, 1);
      continue;
    }
    if (o.type === 'radio') {
      var pulse = Math.sin(Date.now() * 0.006) * 0.3 + 0.5;
      ctx.fillStyle = 'rgba(212,168,67,' + pulse.toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(o.x + o.w/2, o.y + o.h/2, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(o.x+2, o.y, o.w-4, o.h);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(o.x+4, o.y+2, 2, 2);
      continue;
    }
    if (gameState.cluesFound.indexOf(o.id) >= 0) continue;
    if (o.requires && gameState.cluesFound.indexOf(o.requires) < 0) continue;
    if (!o.drawHint) continue;
    var pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.5;
    ctx.fillStyle = 'rgba(212,168,67,' + pulse.toFixed(2) + ')';
    ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, 6, 0, Math.PI * 2); ctx.fill();
  }
}

function renderPlayer(ctx) {
  var p = gameState.player;
  drawSprite(ctx, Math.round(p.x + p.w / 2), Math.round(p.y + p.h / 2),
    gameState.playerColors, [['trenchcoat', 'fedora']], 'player', p.dir);
}

function drawSprite(ctx, cx, cy, colors, details, type, dir) {
  var s = type === 'player' ? 1 : 0.85;
  dir = dir || 'down';
  var isLeft = (dir === 'left');
  var isUp = (dir === 'up');
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(cx - 4 * s, cy + 8 * s, 8 * s, 3 * s);
  ctx.fillStyle = colors.legs;
  ctx.fillRect(cx - 3 * s, cy + 4 * s, 2 * s, 5 * s); ctx.fillRect(cx + 1 * s, cy + 4 * s, 2 * s, 5 * s);
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(cx - 4 * s, cy + 8 * s, 3 * s, 2 * s); ctx.fillRect(cx + 1 * s, cy + 8 * s, 3 * s, 2 * s);
  ctx.fillStyle = colors.body; ctx.fillRect(cx - 4 * s, cy - s, 8 * s, 6 * s);
  ctx.fillStyle = colors.detail;
  if (isLeft) { ctx.fillRect(cx - 4 * s, cy - s, 2 * s, 6 * s); }
  else { ctx.fillRect(cx + 2 * s, cy - s, 2 * s, 6 * s); }
  ctx.fillStyle = colors.head; ctx.fillRect(cx - 3 * s, cy - 7 * s, 6 * s, 7 * s);
  if (!isUp) {
    ctx.fillStyle = '#1A1C20';
    if (isLeft) {
      ctx.fillRect(cx - 3 * s, cy - 5 * s, 2 * s, 2 * s); ctx.fillRect(cx - 1 * s, cy - 5 * s, 2 * s, 2 * s);
    } else {
      ctx.fillRect(cx + 1 * s, cy - 5 * s, 2 * s, 2 * s); ctx.fillRect(cx + 3 * s, cy - 5 * s, 2 * s, 2 * s);
    }
  }
  if (type === 'player') {
    ctx.fillStyle = colors.detail;
    ctx.fillRect(cx - 4 * s, cy - 9 * s, 9 * s, 2 * s); ctx.fillRect(cx - 3 * s, cy - 10 * s, 7 * s, 2 * s);
  }
}

function renderInteractionHint(ctx) {
  var t = gameState.interactionTarget;
  if (!t) return;
  var px = gameState.player.x + gameState.player.w / 2;
  var py = gameState.player.y - 16;
  var label = '???';
  if (t.type === 'npc') label = 'Parla';
  else if (t.type === 'object') label = 'Raccogli';
  else if (t.type === 'door') label = 'Entra / Esci';
  else if (t.type === 'radio') label = 'Accendi Radio';
  else if (t.type === 'recorder') label = 'Usa Registratore';
  else if (t.type === 'scene') label = 'Esamina';
  else if (t.type === 'gatto') label = 'Accarezza';
  ctx.fillStyle = PALETTE.nightBlue + 'CC'; ctx.fillRect(px - 35, py - 10, 70, 12);
  ctx.fillStyle = PALETTE.lanternYel; ctx.font = '8px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('[E] ' + label, px, py);
  ctx.textAlign = 'start';
}

function renderFade(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,' + (gameState.fadeAlpha / 100).toFixed(2) + ')';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function renderEndingScreen(ctx) {
  ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  var t = Date.now() * 0.001;
  ctx.fillStyle = PALETTE.creamPaper + '22';
  for (var i = 0; i < 30; i++) {
    ctx.fillRect((i * 117) % CANVAS_W, (i * 53 + Math.sin(t + i) * 3) % CANVAS_H, 2, 2);
  }
}
