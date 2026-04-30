/* ═════════ AREE — PIXEL ART ATMOSFERICO ═════════
   Stile: silhouettes pulite, luci calde, contrasto forte.
   Usa PF helper da engine.js per elementi ricorrenti.
   Texture generate proceduralmente per dettagli pixel-level.
   ══════════════════════════════════════════════════ */

var areaTextures = {
  brick: null,
  wood: null,
  stone: null,
  grass: null
};

function getAreaTexture(type) {
  if (!areaTextures[type]) {
    areaTextures[type] = TextureGenerator.getOrCreateTexture(type, 400, 250);
  }
  return areaTextures[type];
}

var areas = {

  /* ── PIAZZE (centro hub) ── */
  piazze: {
    name: 'Piazza del Paese',
    walkableTop: 105,
    colliders: [
      {x:125, y:48, w:150, h:86},
      {x:182, y:145, w:42, h:28},
      {x:302, y:112, w:70, h:56},
      {x:82,  y:136, w:36, h:34}
    ],
    npcs: [],
    exits: [
      {dir:'up',   xRange:[168,232], to:'chiesa',        spawnX:200, spawnY:210},
      {dir:'down', xRange:[170,230], to:'residenziale',  spawnX:200, spawnY:132},
      {dir:'left', xRange:[100,140], to:'giardini',      spawnX:360, spawnY:125},
      {dir:'right',xRange:[122,176], to:'bar_exterior',  spawnX:40,  spawnY:145}
    ],
    draw: function(ctx) {
      PF.nightSky(ctx, 14);
      ctx.fillStyle = PALETTE.lanternYel; ctx.beginPath(); ctx.arc(340, 22, 14, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = PALETTE.nightBlue; ctx.beginPath(); ctx.arc(346, 18, 10, 0, Math.PI*2); ctx.fill();
      PF.mountains(ctx);
      var t = Date.now() * 0.001;
      ctx.fillStyle = PALETTE.oliveGreen;
      ctx.fillRect(0, 104, CANVAS_W, 146);
      ctx.fillStyle = PALETTE.darkForest;
      ctx.fillRect(0, 102, CANVAS_W, 4);

      var stoneTex = getAreaTexture('stone');
      ctx.drawImage(stoneTex, 0, 0, CANVAS_W, 120, 0, 130, CANVAS_W, 120);
      ctx.fillStyle = 'rgba(139,125,107,0.88)';
      ctx.fillRect(0, 130, CANVAS_W, 120);
      ctx.fillStyle = 'rgba(74,85,104,0.32)';
      for (var r=0; r<10; r++) {
        for (var c=0; c<15; c++) {
          ctx.fillRect(c*29+(r%2)*14, 136+r*11, 24, 3);
        }
      }

      ctx.fillStyle = PALETTE.greyBrown;
      ctx.beginPath();
      ctx.moveTo(170, 134); ctx.lineTo(230, 134); ctx.lineTo(258, 250); ctx.lineTo(142, 250); ctx.fill();
      ctx.fillStyle = 'rgba(232,220,200,0.14)';
      ctx.beginPath();
      ctx.moveTo(195, 134); ctx.lineTo(205, 134); ctx.lineTo(220, 250); ctx.lineTo(180, 250); ctx.fill();

      drawMunicipioFacade(ctx, 125, 48, 150, 86, t);
      drawPiazzaFountain(ctx, 182, 145, t);
      drawBarFacade(ctx, 302, 112, 70, 56, t);
      drawNoticeBoard(ctx, 82, 136, t);
      drawBench(ctx, 260, 166);
      PF.lamp(ctx, 48, 142);
      PF.lamp(ctx, 198, 138);
      PF.lamp(ctx, 352, 142);
      PF.tree(ctx, 36, 142);
      PF.tree(ctx, 292, 150);
      drawVignette(ctx);
    }
  },

  /* ── CHIESA ── */
  chiesa: {
    name: 'Chiesa di San Celeste',
    walkableTop: 100,
    colliders: [
      {x:140, y:20, w:120, h:120},
      {x:140, y:140, w:120, h:20}
    ],
    npcs: [
      { id: 'don_pietro', x: 200, y: 180 }
    ],
    exits: [
      {dir:'up',   xRange:[170,230], to:'cimitero',      spawnX:200, spawnY:112},
      {dir:'down', xRange:[170,230], to:'piazze',        spawnX:200, spawnY:188}
    ],
    draw: function(ctx) {
      var t = Date.now() * 0.001;
      drawChurchArea(ctx, t);
      drawVignette(ctx);
    }
  },

  /* ── CIMITERO ── */
  cimitero: {
    name: 'Cimitero Comunale',
    walkableTop: 80,
    colliders: [
      {x:0, y:80, w:30, h:170},
      {x:370, y:80, w:30, h:170}
    ],
    npcs: [],
    exits: [
      {dir:'down', xRange:[170,230], to:'chiesa', spawnX:200, spawnY:210}
    ],
    draw: function(ctx) {
      var t = Date.now() * 0.001;
      drawCemeteryArea(ctx, t);
      drawVignette(ctx);
    }
  },

  /* ── GIARDINI ── */
  giardini: {
    name: 'Giardini Pubblici',
    walkableTop: 90,
    colliders: [
      {x:0, y:90, w:25, h:160},
      {x:375, y:90, w:25, h:160},
      {x:170, y:155, w:60, h:18}
    ],
    npcs: [
      { id: 'anselmo', x: 120, y: 170 }
    ],
    exits: [
      {dir:'right', xRange:[100,140], to:'piazze', spawnX:40, spawnY:125}
    ],
    draw: function(ctx) {
      var t = Date.now() * 0.001;
      drawGardensArea(ctx, t);
      drawVignette(ctx);
    }
  },

  /* ── BAR EXTERIOR ── */
  bar_exterior: {
    name: 'Bar — Esterno',
    walkableTop: 100,
    colliders: [
      {x:82, y:34, w:236, h:96},
      {x:112, y:150, w:34, h:24},
      {x:226, y:150, w:34, h:24},
      {x:302, y:138, w:24, h:34}
    ],
    npcs: [
      { id: 'osvaldo', x: 280, y: 175 }
    ],
    exits: [
      {dir:'left', xRange:[122,176], to:'piazze', spawnX:360, spawnY:145}
    ],
    draw: function(ctx) {
      var t = Date.now() * 0.001;
      drawBarExteriorArea(ctx, t);
      drawVignette(ctx);
    }
  },

  /* ── RESIDENZIALE ── */
  residenziale: {
    name: 'Quartiere Residenziale',
    walkableTop: 90,
    colliders: [
      {x:20, y:30, w:80, h:85},
      {x:160, y:25, w:80, h:90},
      {x:300, y:35, w:80, h:80},
      {x:175, y:155, w:50, h:16}
    ],
    npcs: [
      { id: 'valli', x: 200, y: 180 }
    ],
    exits: [
      {dir:'up',   xRange:[170,230], to:'piazze',       spawnX:200, spawnY:210},
      {dir:'down', xRange:[170,230], to:'industriale',  spawnX:200, spawnY:128}
    ],
    draw: function(ctx) {
      var t = Date.now() * 0.001;
      drawResidentialArea(ctx, t);
      drawVignette(ctx);
    }
  },

  /* ── INDUSTRIALE ── */
  industriale: {
    name: 'Zona Industriale',
    walkableTop: 85,
    colliders: [
      {x:30, y:30, w:120, h:90},
      {x:200, y:40, w:100, h:80},
      {x:320, y:50, w:60, h:70},
      {x:0, y:85, w:25, h:165},
      {x:375, y:85, w:25, h:165}
    ],
    npcs: [],
    exits: [
      {dir:'up',   xRange:[170,230], to:'residenziale', spawnX:200, spawnY:210},
      {dir:'down', xRange:[170,230], to:'polizia',      spawnX:200, spawnY:130}
    ],
    draw: function(ctx) {
      var t = Date.now() * 0.001;
      drawIndustrialArea(ctx, t);
      drawVignette(ctx);
    }
  },

  /* ── POLIZIA ── */
  polizia: {
    name: 'Stazione di Polizia',
    walkableTop: 95,
    colliders: [
      {x:100, y:25, w:200, h:95},
      {x:280, y:140, w:60, h:35}
    ],
    npcs: [
      { id: 'neri', x: 200, y: 175 }
    ],
    exits: [
      {dir:'up', xRange:[170,230], to:'industriale', spawnX:200, spawnY:210}
    ],
    draw: function(ctx) {
      var t = Date.now() * 0.001;
      drawPoliceArea(ctx, t);
      drawVignette(ctx);
    }
  }
};

/* ── Helper condivisi ── */

function drawLitWindow(ctx, x, y, w, h, warm, t, phase) {
  var pulse = 0.5 + Math.sin(t * 2 + phase) * 0.18;
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = warm ? 'rgba(212,168,67,' + pulse.toFixed(2) + ')' : 'rgba(130,160,220,' + pulse.toFixed(2) + ')';
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x, y, w, 2);
  ctx.fillRect(x, y + h - 2, w, 2);
  ctx.fillRect(x, y, 2, h);
  ctx.fillRect(x + w - 2, y, 2, h);
  ctx.fillRect(x + Math.floor(w / 2) - 1, y, 2, h);
  ctx.fillRect(x, y + Math.floor(h / 2) - 1, w, 2);
}

function drawTileRoof(ctx, x, y, w, color) {
  ctx.fillStyle = '#35241D';
  ctx.fillRect(x - 5, y - 3, w + 10, 4);
  ctx.fillStyle = color || PALETTE.burntOrange;
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + w / 2, y - 24);
  ctx.lineTo(x + w + 8, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (var i = 0; i < w + 12; i += 8) {
    ctx.fillRect(x - 6 + i, y - 4 - (i % 16 === 0 ? 2 : 0), 6, 2);
  }
}

function drawWallTexture(ctx, x, y, w, h, base, alt) {
  ctx.fillStyle = base;
  ctx.fillRect(x, y, w, h);
  for (var i = 0; i < 34; i++) {
    var tx = x + (i * 17) % Math.max(1, w);
    var ty = y + (i * 11) % Math.max(1, h);
    ctx.fillStyle = i % 3 === 0 ? alt : 'rgba(255,255,255,0.06)';
    ctx.fillRect(tx, ty, 4 + (i % 3), 2);
  }
}

function drawMunicipioFacade(ctx, x, y, w, h, t) {
  drawWallTexture(ctx, x, y, w, h, PALETTE.fadedBeige, 'rgba(107,91,79,0.22)');
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x - 6, y + h - 8, w + 12, 8);
  ctx.fillStyle = PALETTE.burntOrange;
  ctx.fillRect(x - 4, y - 8, w + 8, 8);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x - 8, y - 12, w + 16, 5);
  ctx.fillStyle = PALETTE.fadedBeige;
  ctx.fillRect(x + w / 2 - 16, y - 30, 32, 24);
  drawTileRoof(ctx, x + w / 2 - 18, y - 30, 36, PALETTE.greyBrown);
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.beginPath(); ctx.arc(x + w / 2, y - 17, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x + w / 2 - 1, y - 22, 2, 6);
  ctx.fillRect(x + w / 2 - 1, y - 18, 6, 2);
  drawLitWindow(ctx, x + 12, y + 16, 16, 20, true, t, 0);
  drawLitWindow(ctx, x + w - 28, y + 16, 16, 20, true, t, 1);
  drawLitWindow(ctx, x + 38, y + 16, 14, 18, false, t, 2);
  drawLitWindow(ctx, x + w - 52, y + 16, 14, 18, false, t, 3);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x + w / 2 - 13, y + h - 36, 26, 34);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x + w / 2 - 10, y + h - 32, 8, 14);
  ctx.fillRect(x + w / 2 + 2, y + h - 32, 8, 14);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x + w / 2 + 6, y + h - 18, 3, 3);
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(x + w / 2 - 22, y + h - 2, 44, 3);
  ctx.fillRect(x + w / 2 - 18, y + h - 6, 36, 4);
  ctx.fillStyle = '#00853E';
  ctx.fillRect(x + w + 6, y + 12, 4, 14);
  ctx.fillStyle = '#F4F0E8';
  ctx.fillRect(x + w + 10, y + 12, 4, 14);
  ctx.fillStyle = '#C83737';
  ctx.fillRect(x + w + 14, y + 12, 4, 14);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x + w + 5, y + 10, 2, 18);
}

function drawChurchFacade(ctx, x, y, w, h, t) {
  drawWallTexture(ctx, x, y, w, h, PALETTE.greyBrown, 'rgba(232,220,200,0.12)');
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x + w / 2, y - 28); ctx.lineTo(x + w + 10, y); ctx.fill();
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x + w / 2 - 22, y - 50, 44, 50);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.beginPath(); ctx.moveTo(x + w / 2 - 25, y - 50); ctx.lineTo(x + w / 2, y - 74); ctx.lineTo(x + w / 2 + 25, y - 50); ctx.fill();
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.fillRect(x + w / 2 - 2, y - 66, 4, 18);
  ctx.fillRect(x + w / 2 - 9, y - 59, 18, 4);
  ctx.fillStyle = 'rgba(212,168,67,0.18)';
  ctx.beginPath(); ctx.arc(x + w / 2, y + 56, 30 + Math.sin(t * 1.5) * 4, 0, Math.PI * 2); ctx.fill();
  drawLitWindow(ctx, x + 24, y + 22, 16, 30, true, t, 0);
  drawLitWindow(ctx, x + w - 40, y + 22, 16, 30, true, t, 1);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x + w / 2 - 14, y + h - 42, 28, 40);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x + w / 2 - 5, y + h - 34, 10, 10);
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(x - 10, y + h, w + 20, 8);
  for (var p = 0; p < 5; p++) {
    ctx.fillStyle = p % 2 ? PALETTE.greyBrown : PALETTE.earthBrown;
    ctx.fillRect(x + 8 + p * 22, y + h + 8, 16, 60);
  }
}

function drawBarFacade(ctx, x, y, w, h, t) {
  drawWallTexture(ctx, x, y, w, h, '#BBA07A', 'rgba(80,54,38,0.18)');
  ctx.fillStyle = '#442B1F';
  ctx.fillRect(x - 8, y + h - 8, w + 16, 10);
  ctx.fillStyle = '#6B2F25';
  ctx.fillRect(x - 10, y - 10, w + 20, 12);
  ctx.fillStyle = '#2B1D18';
  ctx.fillRect(x - 14, y - 15, w + 28, 6);

  var neon = 0.62 + Math.sin(t * 4) * 0.28;
  ctx.fillStyle = 'rgba(110,18,18,0.72)';
  ctx.fillRect(x + 24, y - 33, w - 48, 25);
  ctx.fillStyle = 'rgba(220,54,42,' + neon.toFixed(2) + ')';
  ctx.fillRect(x + 28, y - 29, w - 56, 17);
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.font = 'bold 11px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BAR SAN CELESTE', x + w / 2, y - 16);
  ctx.textAlign = 'start';

  ctx.fillStyle = 'rgba(212,168,67,0.12)';
  ctx.fillRect(x + 14, y + 18, w - 28, 54);
  drawBarWindow(ctx, x + 18, y + 20, 46, 42, t, 0);
  drawBarWindow(ctx, x + w - 64, y + 20, 46, 42, t, 1);

  ctx.fillStyle = '#5A382A';
  ctx.fillRect(x + w / 2 - 18, y + h - 49, 36, 47);
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(x + w / 2 - 14, y + h - 45, 28, 34);
  ctx.fillStyle = 'rgba(130,160,220,0.38)';
  ctx.fillRect(x + w / 2 - 11, y + h - 42, 22, 27);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x + w / 2 + 9, y + h - 27, 3, 3);

  drawStripedAwning(ctx, x + 14, y + 66, w - 28, t);
  ctx.fillStyle = '#4A2F24';
  ctx.fillRect(x + 18, y + h - 4, w - 36, 4);
}

function drawBarWindow(ctx, x, y, w, h, t, phase) {
  ctx.fillStyle = '#35241D';
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = 'rgba(212,168,67,' + (0.42 + Math.sin(t * 2 + phase) * 0.12).toFixed(2) + ')';
  ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  ctx.fillStyle = '#4A2F24';
  ctx.fillRect(x + Math.floor(w / 2) - 1, y, 2, h);
  ctx.fillRect(x, y + Math.floor(h / 2) - 1, w, 2);
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillRect(x + 5, y + 6, 10, 2);
  ctx.fillRect(x + w - 16, y + 10, 8, 2);
}

function drawStripedAwning(ctx, x, y, w, t) {
  ctx.fillStyle = '#2B1D18';
  ctx.fillRect(x - 3, y - 4, w + 6, 5);
  for (var i = 0; i < 18; i++) {
    ctx.fillStyle = i % 2 ? PALETTE.creamPaper : '#B83232';
    ctx.fillRect(x + i * Math.ceil(w / 18), y + Math.sin(t * 2 + i) * 1, Math.ceil(w / 18), 16);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(x, y + 13, w, 3);
}

function drawVillageHouse(ctx, x, y, w, h, roofColor, t, phase) {
  drawWallTexture(ctx, x, y, w, h, PALETTE.fadedBeige, 'rgba(107,91,79,0.18)');
  drawTileRoof(ctx, x, y, w, roofColor);
  drawLitWindow(ctx, x + 12, y + 22, 18, 22, true, t, phase);
  drawLitWindow(ctx, x + w - 30, y + 22, 18, 22, true, t, phase + 1);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x + w / 2 - 9, y + h - 32, 18, 30);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x + w / 2 + 4, y + h - 18, 3, 3);
  ctx.fillStyle = PALETTE.darkForest;
  ctx.fillRect(x + 8, y + h, w - 16, 7);
  for (var f = 0; f < 5; f++) {
    ctx.fillStyle = f % 2 ? PALETTE.lanternYel : '#CC4444';
    ctx.fillRect(x + 14 + f * 9, y + h - 3, 3, 3);
  }
}

function drawIndustrialBuilding(ctx, x, y, w, h, t, variant) {
  drawWallTexture(ctx, x, y, w, h, PALETTE.slateGrey, 'rgba(160,168,176,0.16)');
  ctx.fillStyle = '#2A3038';
  ctx.fillRect(x - 3, y - 6, w + 6, 8);
  for (var i = 0; i < 3; i++) {
    var wx = x + 14 + i * 34;
    drawLitWindow(ctx, wx, y + 18, 22, 16, i !== 2, t * 2, i);
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(wx - 2, y + 16, 26, 2);
    ctx.fillRect(wx - 2, y + 34, 26, 2);
  }
  ctx.fillStyle = '#2A3038';
  ctx.fillRect(x + w / 2 - 16, y + h - 30, 32, 28);
  ctx.fillStyle = PALETTE.alumGrey;
  for (var d = 0; d < 4; d++) ctx.fillRect(x + w / 2 - 14, y + h - 26 + d * 6, 28, 2);
  if (variant) {
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x + w - 20, y - 45, 12, 45);
    var smokeAlpha = 0.18 + Math.sin(t * 1.5) * 0.08;
    for (var s = 0; s < 6; s++) {
      ctx.fillStyle = 'rgba(160,160,170,' + smokeAlpha.toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(x + w - 14 + Math.sin(t + s) * 5, y - 48 - s * 7, 4 + s, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawPoliceStation(ctx, x, y, w, h, t) {
  drawWallTexture(ctx, x, y, w, h, PALETTE.fadedBeige, 'rgba(74,85,104,0.18)');
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x - 5, y - 8, w + 10, 8);
  ctx.fillStyle = '#9F1E1E';
  ctx.fillRect(x + w / 2 - 55, y - 25, 110, 18);
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.font = '9px "Courier New",monospace';
  ctx.fillText('STAZIONE POLIZIA', x + w / 2 - 45, y - 12);
  for (var i = 0; i < 4; i++) {
    drawLitWindow(ctx, x + 20 + i * 42, y + 20, 28, 30, false, t, i);
    ctx.fillStyle = PALETTE.alumGrey;
    for (var b = 0; b < 4; b++) ctx.fillRect(x + 22 + i * 42, y + 23 + b * 7, 24, 2);
  }
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x + w / 2 - 17, y + h - 40, 34, 38);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x + w / 2 - 11, y + h - 32, 22, 14);
}

function drawPiazzaFountain(ctx, x, y, t) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath(); ctx.ellipse(x + 21, y + 24, 34, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(x, y + 12, 42, 16);
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x + 3, y + 15, 36, 10);
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x + 6, y + 17, 30, 6);
  ctx.fillStyle = 'rgba(130,160,220,0.45)';
  ctx.fillRect(x + 8, y + 18 + Math.sin(t * 2) * 1, 26, 2);
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(x + 17, y, 8, 16);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x + 14, y + 4, 14, 4);
  ctx.fillStyle = 'rgba(130,160,220,0.5)';
  ctx.fillRect(x + 20, y + 8, 2, 9);
}

function drawNoticeBoard(ctx, x, y, t) {
  ctx.fillStyle = 'rgba(0,0,0,0.24)';
  ctx.fillRect(x - 2, y + 28, 40, 4);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x, y, 36, 28);
  ctx.fillStyle = PALETTE.burntOrange;
  ctx.fillRect(x - 2, y - 4, 40, 6);
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.fillRect(x + 4, y + 5, 11, 14);
  ctx.fillRect(x + 20, y + 6, 10, 12);
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x + 6, y + 8, 7, 1);
  ctx.fillRect(x + 6, y + 11, 6, 1);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x + 18, y + 21, 3 + Math.sin(t * 4) * 1, 3);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x + 4, y + 28, 3, 16);
  ctx.fillRect(x + 29, y + 28, 3, 16);
}

function drawBench(ctx, x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(x - 2, y + 12, 44, 4);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x, y, 40, 4);
  ctx.fillRect(x, y + 7, 40, 4);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x + 5, y + 11, 3, 8);
  ctx.fillRect(x + 31, y + 11, 3, 8);
}

function drawMoon(ctx, x, y, r) {
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.beginPath(); ctx.arc(x + r * 0.35, y - r * 0.25, r * 0.75, 0, Math.PI * 2); ctx.fill();
}

function drawGroundPath(ctx, centerX, topY, bottomW, color) {
  ctx.fillStyle = color || PALETTE.greyBrown;
  ctx.beginPath();
  ctx.moveTo(centerX - 18, topY);
  ctx.lineTo(centerX + 18, topY);
  ctx.lineTo(centerX + bottomW / 2, CANVAS_H);
  ctx.lineTo(centerX - bottomW / 2, CANVAS_H);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(232,220,200,0.14)';
  ctx.beginPath();
  ctx.moveTo(centerX - 4, topY);
  ctx.lineTo(centerX + 4, topY);
  ctx.lineTo(centerX + bottomW / 6, CANVAS_H);
  ctx.lineTo(centerX - bottomW / 6, CANVAS_H);
  ctx.closePath();
  ctx.fill();
}

function drawChurchArea(ctx, t) {
  PF.nightSky(ctx, 20);
  drawMoon(ctx, 62, 28, 13);
  PF.mountains(ctx);
  ctx.fillStyle = PALETTE.oliveGreen;
  ctx.fillRect(0, 112, CANVAS_W, 138);
  ctx.fillStyle = PALETTE.darkForest;
  ctx.fillRect(0, 108, CANVAS_W, 6);
  drawGroundPath(ctx, 200, 132, 110, PALETTE.greyBrown);
  drawChurchFacade(ctx, 140, 40, 120, 100, t);
  ctx.fillStyle = 'rgba(212,168,67,0.12)';
  ctx.beginPath(); ctx.arc(200, 134, 44 + Math.sin(t * 2) * 4, 0, Math.PI * 2); ctx.fill();
  for (var i = 0; i < 4; i++) {
    PF.tree(ctx, 28 + i * 24, 108 + (i % 2) * 7);
    PF.tree(ctx, 300 + i * 23, 108 + ((i + 1) % 2) * 7);
  }
  drawLowWall(ctx, 0, 148, 138);
  drawLowWall(ctx, 262, 148, 138);
  PF.lamp(ctx, 118, 162);
  PF.lamp(ctx, 280, 162);
}

function drawLowWall(ctx, x, y, w) {
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x, y, w, 8);
  ctx.fillStyle = PALETTE.alumGrey;
  for (var i = 0; i < w; i += 14) {
    ctx.fillRect(x + i, y, 11, 5);
  }
}

function drawGrave(ctx, x, y, tall) {
  ctx.fillStyle = 'rgba(0,0,0,0.24)';
  ctx.fillRect(x - 2, y + (tall ? 20 : 16), 22, 4);
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(x, y + (tall ? 4 : 8), 18, tall ? 20 : 16);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x + 2, y + (tall ? 9 : 12), 14, 2);
  ctx.fillRect(x + 7, y + (tall ? 5 : 9), 4, tall ? 18 : 13);
  if (tall) ctx.fillRect(x + 4, y + 10, 10, 3);
}

function drawMausoleum(ctx, x, y, t) {
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x, y + 18, 62, 54);
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.beginPath(); ctx.moveTo(x - 6, y + 18); ctx.lineTo(x + 31, y); ctx.lineTo(x + 68, y + 18); ctx.fill();
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x + 22, y + 36, 18, 36);
  ctx.fillStyle = 'rgba(212,168,67,' + (0.16 + Math.sin(t * 2) * 0.06).toFixed(2) + ')';
  ctx.fillRect(x + 26, y + 42, 10, 12);
  for (var i = 0; i < 4; i++) {
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x + 6 + i * 14, y + 24, 5, 44);
  }
}

function drawCemeteryArea(ctx, t) {
  PF.nightSky(ctx, 22);
  drawMoon(ctx, 324, 28, 12);
  ctx.fillStyle = 'rgba(70,80,110,0.24)';
  ctx.fillRect(0, 58, CANVAS_W, 34);
  ctx.fillStyle = PALETTE.darkForest;
  ctx.fillRect(0, 80, CANVAS_W, 170);
  ctx.fillStyle = PALETTE.oliveGreen;
  ctx.fillRect(28, 86, 344, 164);
  drawGroundPath(ctx, 200, 82, 76, PALETTE.earthBrown);
  drawMausoleum(ctx, 286, 88, t);
  for (var g = 0; g < 12; g++) {
    var gx = 46 + (g % 4) * 72 + (Math.floor(g / 4) % 2) * 10;
    var gy = 104 + Math.floor(g / 4) * 44;
    drawGrave(ctx, gx, gy, g % 3 === 0);
  }
  for (var c = 0; c < 7; c++) {
    var cx = 18 + c * 60;
    ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(cx + 5, 62, 5, 36);
    ctx.fillStyle = PALETTE.darkForest;
    ctx.beginPath(); ctx.moveTo(cx + 7, 36); ctx.lineTo(cx - 4, 88); ctx.lineTo(cx + 18, 88); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 7, 48); ctx.lineTo(cx, 78); ctx.lineTo(cx + 15, 78); ctx.fill();
  }
  ctx.fillStyle = 'rgba(180,190,210,0.10)';
  for (var fog = 0; fog < 8; fog++) {
    var fx = (fog * 73 + Math.sin(t + fog) * 10) % 430 - 20;
    ctx.fillRect(fx, 112 + (fog % 3) * 24, 58, 7);
  }
}

function drawGardensArea(ctx, t) {
  PF.nightSky(ctx, 16);
  drawMoon(ctx, 78, 26, 10);
  ctx.fillStyle = PALETTE.oliveGreen;
  ctx.fillRect(0, 90, CANVAS_W, 160);
  ctx.fillStyle = PALETTE.darkForest;
  ctx.fillRect(0, 88, CANVAS_W, 4);
  drawGroundPath(ctx, 200, 98, 118, '#7D6D5D');
  drawPond(ctx, 170, 150, 60, 24, t);
  drawBench(ctx, 70, 156);
  drawBench(ctx, 250, 174);
  for (var i = 0; i < 5; i++) {
    PF.tree(ctx, 42 + i * 76, 88 + (i % 2) * 10);
  }
  for (var f = 0; f < 20; f++) {
    var fx = 30 + (f * 31) % 340;
    var fy = 112 + (f * 17) % 90;
    var fc = [PALETTE.burntOrange, PALETTE.lanternYel, PALETTE.creamPaper, '#CC44AA'];
    ctx.fillStyle = PALETTE.darkForest; ctx.fillRect(fx, fy, 2, 6);
    ctx.fillStyle = fc[f % 4]; ctx.fillRect(fx - 2, fy - 3, 6, 4);
  }
  drawParkLamp(ctx, 50, 142, t);
  drawParkLamp(ctx, 334, 146, t + 1);
  ctx.fillStyle = '#AA66CC';
  var bx = 252 + Math.sin(t * 1.2) * 18;
  var by = 120 + Math.cos(t * 1.8) * 8;
  ctx.fillRect(bx, by, 4, 3);
  ctx.fillRect(bx - 3, by - 1, 3, 2);
  ctx.fillRect(bx + 4, by - 1, 3, 2);
}

function drawPond(ctx, x, y, w, h, t) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(x - 3, y + h - 1, w + 6, 5);
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  ctx.fillStyle = 'rgba(100,140,200,0.36)';
  for (var i = 0; i < 4; i++) {
    ctx.fillRect(x + 8 + i * 12, y + 8 + Math.sin(t * 2 + i) * 2, 8, 1);
  }
}

function drawParkLamp(ctx, x, y, t) {
  PF.lamp(ctx, x, y);
  ctx.fillStyle = 'rgba(212,168,67,' + (0.12 + Math.sin(t * 2) * 0.03).toFixed(2) + ')';
  ctx.beginPath(); ctx.arc(x + 1, y + 6, 24, 0, Math.PI * 2); ctx.fill();
}

function drawBarExteriorArea(ctx, t) {
  PF.nightSky(ctx, 14);
  drawMoon(ctx, 328, 23, 11);
  PF.mountains(ctx);
  ctx.fillStyle = PALETTE.oliveGreen;
  ctx.fillRect(0, 132, CANVAS_W, 118);
  ctx.fillStyle = PALETTE.darkForest;
  ctx.fillRect(0, 130, CANVAS_W, 4);
  ctx.fillStyle = '#6E655A';
  ctx.fillRect(0, 164, CANVAS_W, 86);
  ctx.fillStyle = 'rgba(232,220,200,0.12)';
  for (var p = 0; p < 9; p++) {
    ctx.fillRect(p * 48 + (p % 2) * 12, 172 + (p % 4) * 14, 32, 3);
  }
  drawGroundPath(ctx, 200, 128, 170, '#7D6D5D');
  drawBarFacade(ctx, 82, 34, 236, 96, t);
  drawCafeTable(ctx, 116, 150);
  drawCafeTable(ctx, 228, 150);
  drawMenuBoard(ctx, 304, 138);
  drawRadioStand(ctx, 300, 140, t);
  drawPlanter(ctx, 72, 142, t);
  drawPlanter(ctx, 326, 142, t + 1);
  PF.lamp(ctx, 48, 154);
  PF.lamp(ctx, 354, 154);
}

function drawCafeTable(ctx, x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.24)';
  ctx.fillRect(x - 18, y + 23, 52, 5);
  ctx.fillStyle = '#4A2F24';
  ctx.fillRect(x, y, 20, 5);
  ctx.fillRect(x + 9, y + 5, 2, 18);
  ctx.fillStyle = PALETTE.burntOrange;
  ctx.fillRect(x + 4, y - 3, 5, 3);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x - 16, y + 10, 12, 3);
  ctx.fillRect(x + 24, y + 10, 12, 3);
  ctx.fillRect(x - 14, y + 13, 2, 11);
  ctx.fillRect(x + 32, y + 13, 2, 11);
}

function drawMenuBoard(ctx, x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(x - 2, y + 29, 26, 4);
  ctx.fillStyle = '#2D3047';
  ctx.fillRect(x, y, 22, 30);
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.fillRect(x + 3, y + 4, 16, 20);
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x + 5, y + 8, 12, 1);
  ctx.fillRect(x + 5, y + 12, 9, 1);
  ctx.fillRect(x + 5, y + 16, 13, 1);
  ctx.fillRect(x + 5, y + 20, 8, 1);
}

function drawRadioStand(ctx, x, y, t) {
  ctx.fillStyle = 'rgba(212,168,67,' + (0.18 + Math.sin(t * 4) * 0.05).toFixed(2) + ')';
  ctx.beginPath(); ctx.arc(x + 16, y + 12, 20, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4A2F24';
  ctx.fillRect(x, y + 18, 34, 5);
  ctx.fillRect(x + 4, y + 23, 3, 16);
  ctx.fillRect(x + 27, y + 23, 3, 16);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x + 4, y, 24, 16);
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x + 8, y + 4, 10, 6);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x + 21, y + 4, 3, 3);
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.fillRect(x + 8, y - 7, 1, 7);
  ctx.fillRect(x + 9, y - 10, 1, 3);
}

function drawPlanter(ctx, x, y, t) {
  ctx.fillStyle = PALETTE.burntOrange;
  ctx.fillRect(x, y + 12, 22, 10);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x + 2, y + 14, 18, 4);
  for (var i = 0; i < 5; i++) {
    ctx.fillStyle = PALETTE.darkForest;
    ctx.fillRect(x + 3 + i * 4, y + 7, 2, 7);
    ctx.fillStyle = i % 2 ? PALETTE.lanternYel : '#CC4444';
    ctx.fillRect(x + 2 + i * 4, y + 5 + Math.sin(t + i) * 1, 4, 3);
  }
}

function drawResidentialArea(ctx, t) {
  PF.nightSky(ctx, 14);
  drawMoon(ctx, 50, 28, 10);
  ctx.fillStyle = PALETTE.oliveGreen;
  ctx.fillRect(0, 126, CANVAS_W, 124);
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(0, 158, CANVAS_W, 92);
  drawGroundPath(ctx, 200, 116, 100, '#766B5E');
  drawVillageHouse(ctx, 20, 30, 80, 85, PALETTE.burntOrange, t, 0);
  drawVillageHouse(ctx, 160, 25, 80, 90, PALETTE.greyBrown, t, 1.4);
  drawVillageHouse(ctx, 300, 35, 80, 80, PALETTE.burntOrange, t, 2.8);
  drawClothesline(ctx, 36, 123);
  drawClothesline(ctx, 252, 124);
  PF.lamp(ctx, 100, 158);
  PF.lamp(ctx, 300, 158);
}

function drawClothesline(ctx, x, y) {
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.fillRect(x, y, 72, 2);
  ctx.fillRect(x + 2, y - 2, 2, 6);
  ctx.fillRect(x + 68, y - 2, 2, 6);
  var clothes = ['#CC4444', PALETTE.slateGrey, PALETTE.fadedBeige, '#3D5A3C'];
  for (var i = 0; i < 4; i++) {
    ctx.fillStyle = clothes[i];
    ctx.fillRect(x + 8 + i * 14, y + 3, 10, 9);
  }
}

function drawIndustrialArea(ctx, t) {
  PF.nightSky(ctx, 8);
  ctx.fillStyle = '#303641';
  ctx.fillRect(0, 126, CANVAS_W, 124);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(0, 170, CANVAS_W, 80);
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(0, 168, CANVAS_W, 4);
  drawIndustrialBuilding(ctx, 30, 30, 120, 90, t, false);
  drawIndustrialBuilding(ctx, 200, 40, 100, 80, t, false);
  drawIndustrialBuilding(ctx, 320, 50, 60, 70, t, true);
  drawChainFence(ctx, 0, 88, 400, 84);
  drawControlBox(ctx, 80, 140, t);
  ctx.fillStyle = 'rgba(212,168,67,0.12)';
  ctx.fillRect(190, 122, 54, 50);
}

function drawChainFence(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(x, y + h, w, 4);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x, y, 25, h);
  ctx.fillRect(x + w - 25, y, 25, h);
  for (var i = 0; i < w; i += 40) ctx.fillRect(x + i, y, 3, h);
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(x, y, w, 3);
  ctx.fillRect(x, y + h - 3, w, 3);
}

function drawControlBox(ctx, x, y, t) {
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x, y, 42, 30);
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(x + 3, y + 3, 36, 24);
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.beginPath(); ctx.arc(x + 21, y + 15, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(212,168,67,' + (0.45 + Math.sin(t * 5) * 0.25).toFixed(2) + ')';
  ctx.fillRect(x + 17, y + 11, 8, 8);
}

function drawPoliceArea(ctx, t) {
  PF.nightSky(ctx, 12);
  ctx.fillStyle = PALETTE.oliveGreen;
  ctx.fillRect(0, 148, CANVAS_W, 102);
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(0, 168, CANVAS_W, 82);
  drawGroundPath(ctx, 200, 120, 90, '#766B5E');
  drawPoliceStation(ctx, 100, 25, 200, 95, t);
  drawPoliceCar(ctx, 280, 140, t);
  PF.lamp(ctx, 60, 154);
  PF.lamp(ctx, 340, 154);
}

function drawPoliceCar(ctx, x, y, t) {
  ctx.fillStyle = 'rgba(0,0,0,0.24)';
  ctx.fillRect(x + 2, y + 30, 58, 5);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x, y + 8, 62, 28);
  ctx.fillStyle = '#2244AA';
  ctx.fillRect(x + 5, y + 13, 52, 18);
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x + 12, y + 16, 16, 10);
  ctx.fillRect(x + 34, y + 16, 16, 10);
  var flash = Math.sin(t * 8) > 0;
  ctx.fillStyle = flash ? '#FF3333' : '#3355FF';
  ctx.fillRect(x + 17, y + 6, 8, 4);
  ctx.fillStyle = flash ? '#3355FF' : '#FF3333';
  ctx.fillRect(x + 36, y + 6, 8, 4);
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(x + 10, y + 31, 7, 7);
  ctx.fillRect(x + 45, y + 31, 7, 7);
}

function drawExitSign(ctx, x, y, label) {
  if (y < 20) y = 108;
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x, y, label.length * 8 + 12, 14);
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x + 2, y + 2, label.length * 8 + 8, 10);
  ctx.font = '8px "Courier New",monospace';
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.fillText(label, x + 4, y + 11);
}

function drawVignette(ctx) {
}
