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

function drawGrave(ctx, x, y, type, t) {
  var w = type === 2 ? 24 : (type === 1 ? 20 : 16);
  var h = type === 2 ? 28 : (type === 1 ? 22 : 16);
  // Ombra
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(x - 3, y + h - 2, w + 6, 5);
  // Base pietra
  var grad = type === 0 ? PALETTE.alumGrey : (type === 1 ? '#8A8A8A' : '#7A7A85');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
  // Bordi in rilievo
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(x, y, w, 2);
  ctx.fillRect(x, y, 2, h);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x, y + h - 2, w, 2);
  ctx.fillRect(x + w - 2, y, 2, h);
  // Iscrizioni/croci
  ctx.fillStyle = 'rgba(60,60,70,0.6)';
  if (type === 0) {
    // Croce semplice
    ctx.fillRect(x + w/2 - 1, y + 4, 2, h - 8);
    ctx.fillRect(x + 4, y + h/2 - 1, w - 8, 2);
  } else if (type === 1) {
    // Iscrizione linee
    for (var i = 0; i < 3; i++) {
      ctx.fillRect(x + 3, y + 6 + i * 5, w - 6, 1);
    }
  } else {
    // Arco decorativo
    ctx.fillRect(x + 3, y + h - 6, w - 6, 2);
    ctx.beginPath();
    ctx.arc(x + w/2, y + h - 6, w/2 - 3, Math.PI, 0);
    ctx.strokeStyle = 'rgba(60,60,70,0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  // Muschio/erba su alcune tombe
  if ((x + y) % 3 === 0) {
    ctx.fillStyle = 'rgba(60,80,50,0.4)';
    ctx.fillRect(x + 2, y + h - 4, w - 4, 3);
  }
}

function drawIronFence(ctx, x, y, w, h) {
  // Colonne
  ctx.fillStyle = '#2A2A2A';
  for (var i = 0; i <= w; i += 20) {
    ctx.fillRect(x + i - 2, y, 4, h);
    // Punta decorativa
    ctx.fillStyle = '#1A1A1A';
    ctx.beginPath();
    ctx.moveTo(x + i - 3, y);
    ctx.lineTo(x + i, y - 6);
    ctx.lineTo(x + i + 3, y);
    ctx.fill();
    ctx.fillStyle = '#2A2A2A';
  }
  // Sbarre orizzontali
  ctx.fillStyle = '#333333';
  ctx.fillRect(x, y + 6, w, 2);
  ctx.fillRect(x, y + h - 6, w, 2);
  // Sbarre verticali sottili
  ctx.fillStyle = '#3A3A3A';
  for (var j = 8; j < w; j += 12) {
    ctx.fillRect(x + j, y + 8, 1, h - 16);
  }
}

function drawDeadTree(ctx, x, y, h) {
  // Tronco nodoso
  ctx.fillStyle = '#3A3028';
  ctx.fillRect(x - 4, y - h, 8, h);
  // Rami contorti
  ctx.strokeStyle = '#3A3028';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y - h * 0.3);
  ctx.lineTo(x - 15, y - h * 0.6);
  ctx.moveTo(x, y - h * 0.5);
  ctx.lineTo(x + 18, y - h * 0.75);
  ctx.moveTo(x, y - h * 0.4);
  ctx.lineTo(x - 8, y - h * 0.85);
  ctx.stroke();
  // Qualche ramo spoglio
  ctx.fillStyle = '#4A4038';
  for (var i = 0; i < 5; i++) {
    var rx = x - 12 + i * 6 + (i % 2) * 3;
    var ry = y - h * 0.5 - i * 8;
    ctx.fillRect(rx, ry, 2, 4);
  }
}

function drawMausoleum(ctx, x, y, t) {
  // Ombra base
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(x - 8, y + 68, 78, 8);
  // Struttura principale
  ctx.fillStyle = '#5A5A5A';
  ctx.fillRect(x, y + 18, 62, 54);
  // Texture pietra
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (var tx = 0; tx < 62; tx += 8) {
    for (var ty = 0; ty < 54; ty += 6) {
      if ((tx + ty) % 12 === 0) {
        ctx.fillRect(x + tx, y + 18 + ty, 6, 1);
      }
    }
  }
  // Tetto a spioventi
  ctx.fillStyle = '#4A4A4A';
  ctx.beginPath();
  ctx.moveTo(x - 6, y + 18);
  ctx.lineTo(x + 31, y);
  ctx.lineTo(x + 68, y + 18);
  ctx.fill();
  // Cornice tetto
  ctx.fillStyle = '#3A3A3A';
  ctx.fillRect(x - 8, y + 18, 78, 3);
  // Porta con luce misteriosa
  ctx.fillStyle = '#2A2520';
  ctx.fillRect(x + 22, y + 36, 18, 36);
  // Luce pulsante sotto la porta
  var glow = 0.12 + Math.sin(t * 1.5) * 0.08;
  ctx.fillStyle = 'rgba(100,80,60,' + glow.toFixed(2) + ')';
  ctx.fillRect(x + 24, y + 66, 14, 4);
  // Finestra sopra porta
  ctx.fillStyle = '#1A1A20';
  ctx.fillRect(x + 26, y + 42, 10, 12);
  ctx.fillStyle = 'rgba(212,168,67,' + (0.2 + Math.sin(t * 2) * 0.1).toFixed(2) + ')';
  ctx.fillRect(x + 28, y + 44, 6, 8);
  // Colonne decorative
  for (var i = 0; i < 4; i++) {
    var cx = x + 6 + i * 14;
    ctx.fillStyle = '#6A6A6A';
    ctx.fillRect(cx, y + 24, 5, 44);
    // Capitello
    ctx.fillStyle = '#5A5A5A';
    ctx.fillRect(cx - 1, y + 22, 7, 4);
    // Base
    ctx.fillRect(cx - 1, y + 66, 7, 4);
  }
  // Iscrizione sopra
  ctx.fillStyle = 'rgba(200,200,210,0.3)';
  ctx.fillRect(x + 15, y + 26, 32, 1);
  ctx.fillRect(x + 18, y + 28, 26, 1);
}

function drawCemeteryArea(ctx, t) {
  // Cielo notturno più scuro
  PF.nightSky(ctx, 28);
  // Luna piena con alone
  drawMoon(ctx, 340, 32, 14);
  ctx.fillStyle = 'rgba(212,168,67,0.08)';
  ctx.beginPath(); ctx.arc(340, 32, 28, 0, Math.PI * 2); ctx.fill();
  // Colline sfumate in lontananza
  ctx.fillStyle = 'rgba(40,45,55,0.6)';
  ctx.fillRect(0, 45, CANVAS_W, 35);
  // Terreno cimitero - erba scura
  ctx.fillStyle = '#2A3025';
  ctx.fillRect(0, 75, CANVAS_W, 175);
  // Area erba più chiara interna
  ctx.fillStyle = '#353B30';
  ctx.fillRect(20, 82, 360, 160);
  // Vialetto centrale in pietra
  drawGroundPath(ctx, 200, 78, 60, '#4A4A45');
  // Bordi vialetto
  ctx.fillStyle = '#5A5A55';
  ctx.fillRect(168, 78, 4, 172);
  ctx.fillRect(228, 78, 4, 172);
  // Mausoleo
  drawMausoleum(ctx, 290, 75, t);
  // Recinzione ferro battuto
  drawIronFence(ctx, 18, 78, 30, 85);
  drawIronFence(ctx, 352, 78, 30, 85);
  // Alberi morti
  drawDeadTree(ctx, 45, 140, 55);
  drawDeadTree(ctx, 355, 145, 48);
  // Tombe varie
  var gravePositions = [
    {x: 55, y: 110, type: 0}, {x: 85, y: 105, type: 1}, {x: 115, y: 112, type: 2},
    {x: 145, y: 108, type: 0}, {x: 55, y: 145, type: 1}, {x: 90, y: 140, type: 2},
    {x: 130, y: 148, type: 0}, {x: 60, y: 180, type: 2}, {x: 100, y: 175, type: 1},
    {x: 140, y: 182, type: 0}, {x: 250, y: 115, type: 1}, {x: 280, y: 110, type: 0},
    {x: 310, y: 118, type: 2}, {x: 260, y: 150, type: 0}, {x: 295, y: 145, type: 1}
  ];
  for (var g = 0; g < gravePositions.length; g++) {
    var gp = gravePositions[g];
    drawGrave(ctx, gp.x, gp.y, gp.type, t);
  }
  // Cipressi sullo sfondo
  for (var c = 0; c < 8; c++) {
    var cx = 25 + c * 45;
    var cy = 65;
    ctx.fillStyle = '#1A2015';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 8, cy + 30);
    ctx.lineTo(cx + 8, cy + 30);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy + 15);
    ctx.lineTo(cx - 6, cy + 35);
    ctx.lineTo(cx + 6, cy + 35);
    ctx.fill();
  }
  // Nebbia stratificata
  for (var fl = 0; fl < 5; fl++) {
    var fogAlpha = 0.08 + fl * 0.02;
    ctx.fillStyle = 'rgba(200,205,215,' + fogAlpha.toFixed(2) + ')';
    for (var f = 0; f < 6; f++) {
      var fx = (f * 80 + Math.sin(t * 0.5 + f + fl) * 20) % 450 - 30;
      var fy = 100 + fl * 25 + Math.sin(t + f * 0.5) * 5;
      ctx.fillRect(fx, fy, 70 + fl * 10, 12 + fl * 3);
    }
  }
  // Luci di candele su alcune tombe
  for (var cn = 0; cn < 4; cn++) {
    var candleX = 70 + cn * 80 + (cn % 2) * 20;
    var candleY = 125 + (cn % 3) * 35;
    var candlePulse = 0.4 + Math.sin(t * 3 + cn) * 0.2;
    ctx.fillStyle = 'rgba(212,168,67,' + candlePulse.toFixed(2) + ')';
    ctx.fillRect(candleX, candleY, 3, 5);
    ctx.fillStyle = 'rgba(255,200,100,' + (candlePulse * 0.5).toFixed(2) + ')';
    ctx.beginPath(); ctx.arc(candleX + 1.5, candleY - 2, 6, 0, Math.PI * 2); ctx.fill();
  }
}

function drawGardensArea(ctx, t) {
  // Cielo con stelle
  PF.nightSky(ctx, 18);
  // Luna romantica
  drawMoon(ctx, 320, 35, 12);
  ctx.fillStyle = 'rgba(212,168,67,0.06)';
  ctx.beginPath(); ctx.arc(320, 35, 24, 0, Math.PI * 2); ctx.fill();
  // Terreno erba
  ctx.fillStyle = '#2D3A25';
  ctx.fillRect(0, 85, CANVAS_W, 165);
  ctx.fillStyle = '#35452D';
  ctx.fillRect(15, 90, 370, 155);
  // Bordi siepi
  ctx.fillStyle = '#1A2515';
  ctx.fillRect(0, 85, CANVAS_W, 6);
  ctx.fillRect(0, 85, 15, 165);
  ctx.fillRect(385, 85, 15, 165);
  // Vialetto principale
  drawGroundPath(ctx, 200, 92, 130, '#6B5B4D');
  // Fontana centrale
  drawFountain(ctx, 185, 145, 50, 40, t);
  // Laghetto laterale
  drawPond(ctx, 60, 160, 45, 28, t);
  // Cespugli ornamentali
  for (var b = 0; b < 8; b++) {
    var bx = 30 + b * 45 + (b % 2) * 20;
    var by = 115 + (b % 3) * 25;
    drawBush(ctx, bx, by, 12 + (b % 3) * 3);
  }
  // Alberi grandi
  for (var i = 0; i < 6; i++) {
    var tx = 25 + i * 70;
    var ty = 88 + (i % 2) * 4;
    drawGardenTree(ctx, tx, ty, 35 + (i % 3) * 8);
  }
  // Fiori colorati
  for (var f = 0; f < 35; f++) {
    var fx = 40 + (f * 23) % 320;
    var fy = 125 + (f * 11) % 100;
    var flowerColors = [PALETTE.burntOrange, PALETTE.lanternYel, '#E85A7A', '#9B59B6', '#F39C12'];
    drawFlower(ctx, fx, fy, flowerColors[f % 5], t);
  }
  // Panchine
  drawBench(ctx, 75, 165);
  drawBench(ctx, 285, 175);
  drawBench(ctx, 130, 195);
  // Lanterne parco
  drawParkLamp(ctx, 45, 148, t);
  drawParkLamp(ctx, 355, 152, t + 1);
  drawParkLamp(ctx, 200, 120, t + 2);
  // Farfalle animate
  for (var bf = 0; bf < 3; bf++) {
    var bfx = 150 + bf * 60 + Math.sin(t * 2 + bf) * 15;
    var bfy = 130 + bf * 20 + Math.cos(t * 1.5 + bf) * 10;
    drawButterfly(ctx, bfx, bfy, bf, t);
  }
}

function drawGardenTree(ctx, x, y, h) {
  // Tronco
  ctx.fillStyle = '#4A3A2A';
  ctx.fillRect(x - 5, y, 10, h);
  // Chioma a strati
  var colors = ['#2D5016', '#3A6518', '#457A1A'];
  for (var l = 0; l < 3; l++) {
    ctx.fillStyle = colors[l];
    var ly = y - h * 0.3 - l * h * 0.25;
    var lw = 25 - l * 5;
    var lh = 18;
    ctx.beginPath();
    ctx.ellipse(x, ly, lw, lh, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Dettagli foglie
  ctx.fillStyle = 'rgba(100,140,50,0.3)';
  for (var d = 0; d < 8; d++) {
    ctx.fillRect(x - 15 + d * 4, y - h * 0.5 + (d % 3) * 6, 3, 3);
  }
}

function drawBush(ctx, x, y, r) {
  ctx.fillStyle = '#2D5016';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3A6518';
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.2, r * 0.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + r * 0.3, y - r * 0.1, r * 0.6, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlower(ctx, x, y, color, t) {
  // Stelo
  ctx.fillStyle = '#2D5016';
  ctx.fillRect(x, y, 1, 4);
  // Petali
  ctx.fillStyle = color;
  var sway = Math.sin(t * 2 + x) * 0.5;
  ctx.fillRect(x - 2 + sway, y - 3, 5, 3);
  ctx.fillRect(x - 1 + sway, y - 5, 3, 2);
  // Centro
  ctx.fillStyle = '#F4D03F';
  ctx.fillRect(x + sway, y - 3, 2, 2);
}

function drawFountain(ctx, x, y, w, h, t) {
  // Ombra base
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(x - 5, y + h - 5, w + 10, 8);
  // Vasca esterna
  ctx.fillStyle = '#5A5A55';
  ctx.fillRect(x, y + h - 15, w, 15);
  ctx.fillStyle = '#6A6A65';
  ctx.fillRect(x + 3, y + h - 12, w - 6, 9);
  // Acqua nella vasca
  ctx.fillStyle = '#2A4A6A';
  ctx.fillRect(x + 5, y + h - 10, w - 10, 5);
  // Riflessi acqua animati
  ctx.fillStyle = 'rgba(130,180,220,0.4)';
  for (var r = 0; r < 3; r++) {
    var rx = x + 10 + r * 12 + Math.sin(t * 3 + r) * 2;
    ctx.fillRect(rx, y + h - 8, 6, 1);
  }
  // Colonna centrale
  ctx.fillStyle = '#7A7A75';
  ctx.fillRect(x + w/2 - 6, y + 8, 12, h - 20);
  // Capitello
  ctx.fillStyle = '#8A8A85';
  ctx.fillRect(x + w/2 - 10, y + 4, 20, 6);
  // Getto d'acqua
  ctx.fillStyle = 'rgba(180,210,240,0.6)';
  var sprayHeight = 12 + Math.sin(t * 4) * 3;
  ctx.fillRect(x + w/2 - 2, y - sprayHeight + 8, 4, sprayHeight);
  // Gocce
  for (var d = 0; d < 5; d++) {
    var dropY = y + 5 - (d * 4) + Math.sin(t * 5 + d) * 2;
    ctx.fillStyle = 'rgba(200,230,255,0.5)';
    ctx.fillRect(x + w/2 - 4 + d * 2, dropY, 2, 2);
  }
  // Vaso superiore
  ctx.fillStyle = '#6A6A65';
  ctx.fillRect(x + w/2 - 8, y, 16, 6);
}

function drawButterfly(ctx, x, y, id, t) {
  var wing = Math.abs(Math.sin(t * 8 + id)) * 4;
  ctx.fillStyle = id === 0 ? '#E74C3C' : (id === 1 ? '#3498DB' : '#F39C12');
  // Ali
  ctx.fillRect(x - wing, y, wing, 3);
  ctx.fillRect(x + 2, y, wing, 3);
  // Corpo
  ctx.fillStyle = '#2C3E50';
  ctx.fillRect(x, y - 1, 2, 5);
}

function drawPond(ctx, x, y, w, h, t) {
  // Ombra
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(x - 4, y + h - 2, w + 8, 6);
  // Bordo pietra
  ctx.fillStyle = '#5A5A55';
  ctx.fillRect(x, y, w, h);
  // Acqua
  ctx.fillStyle = '#1A3A5A';
  ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  // Riflessi luna animati
  ctx.fillStyle = 'rgba(180,200,230,0.35)';
  for (var i = 0; i < 5; i++) {
    var rx = x + 6 + i * ((w-12)/4) + Math.sin(t * 2 + i * 0.5) * 2;
    var ry = y + 6 + Math.sin(t * 1.5 + i) * 1.5;
    ctx.fillRect(rx, ry, 8 + i * 2, 1);
  }
  // Ninfee
  for (var n = 0; n < 3; n++) {
    var nx = x + 10 + n * 12;
    var ny = y + 8 + (n % 2) * 6;
    ctx.fillStyle = '#2D5016';
    ctx.fillRect(nx, ny, 6, 3);
    ctx.fillStyle = n % 2 === 0 ? '#E85A7A' : '#F4D03F';
    ctx.fillRect(nx + 2, ny - 2, 3, 3);
  }
}

function drawParkLamp(ctx, x, y, t) {
  PF.lamp(ctx, x, y);
  ctx.fillStyle = 'rgba(212,168,67,' + (0.12 + Math.sin(t * 2) * 0.03).toFixed(2) + ')';
  ctx.beginPath(); ctx.arc(x + 1, y + 6, 24, 0, Math.PI * 2); ctx.fill();
}

function drawBarExteriorArea(ctx, t) {
  // Cielo urbano
  PF.nightSky(ctx, 10);
  drawMoon(ctx, 340, 28, 10);
  PF.mountains(ctx);
  // Marciapiede
  ctx.fillStyle = '#5A5550';
  ctx.fillRect(0, 130, CANVAS_W, 120);
  // Bordo marciapiede
  ctx.fillStyle = '#4A4540';
  ctx.fillRect(0, 130, CANVAS_W, 4);
  // Strada
  ctx.fillStyle = '#3A3835';
  ctx.fillRect(0, 165, CANVAS_W, 85);
  // Linea strada
  ctx.fillStyle = '#6A6560';
  ctx.fillRect(0, 205, CANVAS_W, 2);
  for (var ls = 0; ls < 8; ls++) {
    ctx.fillRect(ls * 55 + 20, 205, 25, 2);
  }
  // Vialetto al bar
  drawGroundPath(ctx, 200, 128, 160, '#6B6560');
  // Facciata bar
  drawBarFacade(ctx, 82, 34, 236, 96, t);
  // Insegna neon
  drawNeonSign(ctx, 140, 15, 'BAR', t);
  // Tavolini esterni
  drawCafeTable(ctx, 116, 155);
  drawCafeTable(ctx, 228, 155);
  drawCafeTable(ctx, 172, 175);
  // Sedie
  drawCafeChair(ctx, 95, 160);
  drawCafeChair(ctx, 135, 160);
  drawCafeChair(ctx, 207, 160);
  drawCafeChair(ctx, 247, 160);
  // Menu board
  drawMenuBoard(ctx, 304, 138);
  // Radio stand
  drawRadioStand(ctx, 300, 140, t);
  // Fioriere
  drawPlanter(ctx, 72, 142, t);
  drawPlanter(ctx, 326, 142, t + 1);
  // Lampioni strada
  drawStreetLamp(ctx, 35, 145, t);
  drawStreetLamp(ctx, 365, 145, t + 1);
  // Bidone
  drawTrashCan(ctx, 55, 168);
  // Pozzanghere riflesse
  drawPuddle(ctx, 120, 200, t);
  drawPuddle(ctx, 280, 210, t + 2);
}

function drawNeonSign(ctx, x, y, text, t) {
  var flicker = 0.85 + Math.sin(t * 3) * 0.15;
  var flicker2 = Math.random() > 0.95 ? 0.3 : 1;
  // Sfondo insegna
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(x - 5, y - 5, text.length * 18 + 10, 26);
  // Tubo neon rosso
  var neonAlpha = (0.8 * flicker * flicker2).toFixed(2);
  ctx.fillStyle = 'rgba(255,50,50,' + neonAlpha + ')';
  ctx.fillRect(x - 2, y - 2, text.length * 18 + 4, 20);
  // Alone luminoso
  ctx.fillStyle = 'rgba(255,80,80,' + (0.3 * flicker).toFixed(2) + ')';
  ctx.fillRect(x - 6, y - 6, text.length * 18 + 12, 28);
  // Testo
  ctx.font = 'bold 14px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,' + flicker.toFixed(2) + ')';
  ctx.fillText(text, x + text.length * 9, y + 12);
  ctx.textAlign = 'start';
}

function drawStreetLamp(ctx, x, y, t) {
  // Palo
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(x, y, 4, 55);
  // Base
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(x - 2, y + 50, 8, 5);
  // Braccio
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(x, y + 5, 18, 3);
  // Lampada
  ctx.fillStyle = '#3A3A3A';
  ctx.fillRect(x + 14, y + 2, 10, 8);
  // Luce
  var pulse = 0.7 + Math.sin(t * 2) * 0.1;
  ctx.fillStyle = 'rgba(212,168,67,' + pulse.toFixed(2) + ')';
  ctx.fillRect(x + 16, y + 3, 6, 5);
  // Alone luce
  ctx.fillStyle = 'rgba(212,168,67,' + (0.15 * pulse).toFixed(2) + ')';
  ctx.beginPath(); ctx.arc(x + 19, y + 25, 35, 0, Math.PI * 2); ctx.fill();
}

function drawCafeChair(ctx, x, y) {
  // Ombra
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x - 2, y + 18, 14, 3);
  // Gambe
  ctx.fillStyle = '#3A3A3A';
  ctx.fillRect(x, y + 8, 2, 12);
  ctx.fillRect(x + 8, y + 8, 2, 12);
  // Seduta
  ctx.fillStyle = '#5A4A3A';
  ctx.fillRect(x - 1, y + 6, 12, 4);
  // Schienale
  ctx.fillRect(x - 1, y, 2, 8);
  ctx.fillRect(x + 9, y, 2, 8);
  ctx.fillRect(x - 1, y, 12, 3);
}

function drawTrashCan(ctx, x, y) {
  // Ombra
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x - 2, y + 22, 14, 4);
  // Corpo
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(x, y, 10, 22);
  // Righe
  ctx.fillStyle = '#3A3A3A';
  for (var i = 0; i < 3; i++) {
    ctx.fillRect(x - 1, y + 4 + i * 6, 12, 1);
  }
  // Coperchio
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(x - 1, y - 2, 12, 4);
}

function drawPuddle(ctx, x, y, t) {
  // Riflesso luce
  ctx.fillStyle = 'rgba(130,140,160,0.25)';
  ctx.beginPath();
  ctx.ellipse(x + Math.sin(t) * 2, y, 18, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Riflesso neon
  ctx.fillStyle = 'rgba(255,80,80,0.15)';
  ctx.fillRect(x - 8, y - 2, 16, 3);
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
  // Cielo residenziale
  PF.nightSky(ctx, 12);
  drawMoon(ctx, 60, 32, 11);
  // Vialetto principale
  ctx.fillStyle = '#6A6560';
  ctx.fillRect(0, 126, CANVAS_W, 124);
  ctx.fillStyle = '#5A5550';
  ctx.fillRect(0, 158, CANVAS_W, 92);
  drawGroundPath(ctx, 200, 116, 110, '#7A7570');
  // Marciapiedi laterali
  ctx.fillStyle = '#6B6660';
  ctx.fillRect(0, 126, 45, 124);
  ctx.fillRect(355, 126, 45, 124);
  // Bordi marciapiede
  ctx.fillStyle = '#5A5550';
  ctx.fillRect(45, 126, 3, 124);
  ctx.fillRect(352, 126, 3, 124);
  // Case residenziali
  drawVillageHouse(ctx, 15, 25, 85, 95, PALETTE.burntOrange, t, 0);
  drawVillageHouse(ctx, 155, 20, 90, 100, PALETTE.greyBrown, t, 1.4);
  drawVillageHouse(ctx, 295, 28, 85, 92, '#8B7355', t, 2.8);
  // Recinzioni giardino
  drawPicketFence(ctx, 15, 120, 85);
  drawPicketFence(ctx, 155, 120, 90);
  drawPicketFence(ctx, 295, 120, 85);
  // Piante da giardino
  for (var g = 0; g < 6; g++) {
    drawGardenBush(ctx, 25 + g * 60 + (g % 2) * 15, 115 + (g % 3) * 3);
  }
  // Filo steso
  drawClothesline(ctx, 36, 128);
  drawClothesline(ctx, 252, 128);
  // Bidoni della spazzatura
  drawTrashCan(ctx, 50, 165);
  drawTrashCan(ctx, 340, 165);
  // Lampioni strada
  drawStreetLamp(ctx, 75, 145, t);
  drawStreetLamp(ctx, 200, 145, t + 1);
  drawStreetLamp(ctx, 325, 145, t + 2);
  // Gatti randagi
  drawCat(ctx, 120 + Math.sin(t * 0.5) * 10, 175, t);
  // Auto parcheggiata
  drawParkedCar(ctx, 260, 155, t);
  // Cartelli stradali
  drawStreetSign(ctx, 48, 140, 'VIA');
  drawStreetSign(ctx, 340, 140, 'ROMA');
}

function drawPicketFence(ctx, x, y, w) {
  // Palo iniziale
  ctx.fillStyle = '#F5F5DC';
  ctx.fillRect(x, y - 8, 4, 20);
  // Pali
  for (var i = 0; i < w; i += 12) {
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(x + i, y - 6, 3, 16);
    // Punta
    ctx.beginPath();
    ctx.moveTo(x + i, y - 6);
    ctx.lineTo(x + i + 1.5, y - 10);
    ctx.lineTo(x + i + 3, y - 6);
    ctx.fill();
  }
  // Traverse
  ctx.fillStyle = '#E8E4C8';
  ctx.fillRect(x, y - 2, w, 2);
  ctx.fillRect(x, y + 4, w, 2);
}

function drawGardenBush(ctx, x, y) {
  ctx.fillStyle = '#2D5016';
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3A6518';
  ctx.beginPath();
  ctx.arc(x - 3, y - 2, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawCat(ctx, x, y, t) {
  // Ombra
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x - 4, y + 6, 12, 3);
  // Corpo
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(x, y - 2, 10, 6);
  // Testa
  ctx.fillRect(x - 4, y - 5, 6, 6);
  // Orecchie
  ctx.fillStyle = '#4A4A4A';
  ctx.beginPath();
  ctx.moveTo(x - 4, y - 5); ctx.lineTo(x - 6, y - 8); ctx.lineTo(x - 2, y - 5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x, y - 5); ctx.lineTo(x - 2, y - 8); ctx.lineTo(x + 2, y - 5);
  ctx.fill();
  // Coda
  var tail = Math.sin(t * 3) * 3;
  ctx.fillRect(x + 10, y - 2 + tail, 4, 2);
  // Occhi (riflessi)
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(x - 3, y - 3, 1, 1);
  ctx.fillRect(x - 1, y - 3, 1, 1);
}

function drawParkedCar(ctx, x, y, t) {
  // Ombra
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x - 2, y + 18, 56, 6);
  // Carrozzeria
  ctx.fillStyle = '#2C3E50';
  ctx.fillRect(x, y + 5, 52, 15);
  ctx.fillRect(x + 8, y, 36, 8);
  // Finestrini
  ctx.fillStyle = '#1A252F';
  ctx.fillRect(x + 10, y + 2, 14, 5);
  ctx.fillRect(x + 28, y + 2, 14, 5);
  // Ruote
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(x + 6, y + 18, 10, 6);
  ctx.fillRect(x + 36, y + 18, 10, 6);
  // Luci
  ctx.fillStyle = '#FF4444';
  ctx.fillRect(x + 1, y + 12, 3, 4);
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(x + 48, y + 12, 3, 4);
  // Riflesso finestrino
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(x + 12, y + 3, 4, 2);
}

function drawStreetSign(ctx, x, y, text) {
  // Palo
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(x + 8, y, 3, 25);
  // Cartello
  ctx.fillStyle = '#2C3E50';
  ctx.fillRect(x, y - 8, text.length * 7 + 6, 10);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '6px "Courier New",monospace';
  ctx.fillText(text, x + 3, y - 1);
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
  // Cielo industriale (più scuro)
  PF.nightSky(ctx, 6);
  // Terreno industriale
  ctx.fillStyle = '#252830';
  ctx.fillRect(0, 126, CANVAS_W, 124);
  // Asfalto
  ctx.fillStyle = '#2A3038';
  ctx.fillRect(0, 170, CANVAS_W, 80);
  // Bordo asfalto
  ctx.fillStyle = '#353B45';
  ctx.fillRect(0, 168, CANVAS_W, 4);
  // Binari industriali
  ctx.fillStyle = '#1A1D22';
  ctx.fillRect(0, 185, CANVAS_W, 12);
  ctx.fillStyle = '#4A5058';
  ctx.fillRect(0, 188, CANVAS_W, 2);
  ctx.fillRect(0, 192, CANVAS_W, 2);
  // Traversine
  ctx.fillStyle = '#3A3028';
  for (var tr = 0; tr < 20; tr++) {
    ctx.fillRect(tr * 22, 185, 4, 12);
  }
  // Edifici industriali
  drawIndustrialBuilding(ctx, 25, 25, 130, 100, t, true);
  drawIndustrialBuilding(ctx, 195, 35, 110, 90, t, false);
  drawIndustrialBuilding(ctx, 330, 45, 55, 80, t, true);
  // Ciminiere con fumo
  drawSmokestack(ctx, 40, 10, t, 0);
  drawSmokestack(ctx, 340, 15, t, 1);
  drawSmokestack(ctx, 130, 5, t, 2);
  // Recinzione industriale
  drawChainFence(ctx, 0, 88, 400, 84);
  // Cancello
  drawIndustrialGate(ctx, 180, 88, 50, 84);
  // Scatola elettrica
  drawControlBox(ctx, 75, 145, t);
  // Barili industriali
  drawBarrel(ctx, 95, 165);
  drawBarrel(ctx, 110, 168);
  drawBarrel(ctx, 285, 162);
  // Pallet
  drawPallet(ctx, 150, 175);
  // Luce industriale
  drawIndustrialLight(ctx, 100, 100, t);
  drawIndustrialLight(ctx, 300, 105, t + 1);
  // Riflessi gialli
  ctx.fillStyle = 'rgba(212,168,67,0.08)';
  ctx.fillRect(185, 120, 60, 55);
}

function drawSmokestack(ctx, x, y, t, id) {
  // Base
  ctx.fillStyle = '#3A3A3A';
  ctx.fillRect(x - 8, y + 60, 16, 15);
  // Ciminiera
  ctx.fillStyle = '#454545';
  ctx.fillRect(x - 5, y, 10, 65);
  // Banda rossa
  ctx.fillStyle = '#8B3A3A';
  ctx.fillRect(x - 6, y + 20, 12, 4);
  ctx.fillRect(x - 6, y + 40, 12, 4);
  // Fumo
  for (var s = 0; s < 8; s++) {
    var smokeY = y - 10 - s * 8 + (t * 10 + id * 20) % 70;
    var smokeX = x + Math.sin(t + s * 0.5 + id) * (s * 2);
    var smokeAlpha = 0.35 - s * 0.04;
    var smokeSize = 6 + s * 2;
    ctx.fillStyle = 'rgba(120,120,130,' + Math.max(0, smokeAlpha).toFixed(2) + ')';
    ctx.beginPath();
    ctx.arc(smokeX, smokeY, smokeSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawIndustrialGate(ctx, x, y, w, h) {
  // Telaio
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(x, y, 4, h);
  ctx.fillRect(x + w - 4, y, 4, h);
  ctx.fillRect(x, y + h - 8, w, 8);
  // Sbarre
  ctx.fillStyle = '#3A3A3A';
  for (var i = 0; i < w - 8; i += 12) {
    ctx.fillRect(x + 4 + i, y, 3, h - 8);
  }
  // Traverse
  ctx.fillRect(x + 4, y + 20, w - 8, 3);
  ctx.fillRect(x + 4, y + 50, w - 8, 3);
  // Cartello
  ctx.fillStyle = '#8B3A3A';
  ctx.fillRect(x + 10, y + 28, w - 20, 14);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '6px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PRIVATO', x + w/2, y + 38);
  ctx.textAlign = 'start';
}

function drawBarrel(ctx, x, y) {
  // Ombra
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(x - 2, y + 18, 18, 4);
  // Corpo
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(x, y, 14, 18);
  // Anelli
  ctx.fillStyle = '#5A5A5A';
  ctx.fillRect(x - 1, y + 3, 16, 2);
  ctx.fillRect(x - 1, y + 13, 16, 2);
  // Ruggine
  ctx.fillStyle = '#6B4423';
  ctx.fillRect(x + 3, y + 6, 3, 2);
  ctx.fillRect(x + 8, y + 10, 2, 3);
}

function drawPallet(ctx, x, y) {
  // Ombra
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x - 2, y + 10, 26, 4);
  // Tavole
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(x, y, 22, 3);
  ctx.fillRect(x, y + 4, 22, 3);
  ctx.fillRect(x, y + 8, 22, 3);
  // Supporti
  ctx.fillStyle = '#6B5344';
  ctx.fillRect(x + 2, y + 3, 3, 4);
  ctx.fillRect(x + 17, y + 3, 3, 4);
}

function drawIndustrialLight(ctx, x, y, t) {
  // Supporto
  ctx.fillStyle = '#3A3A3A';
  ctx.fillRect(x, y, 3, 15);
  ctx.fillRect(x - 5, y + 12, 13, 3);
  // Lampada
  ctx.fillStyle = '#4A4A4A';
  ctx.fillRect(x - 8, y + 15, 19, 8);
  // Luce gialla industriale
  var flicker = 0.9 + Math.sin(t * 10) * 0.05;
  ctx.fillStyle = 'rgba(212,168,67,' + flicker.toFixed(2) + ')';
  ctx.fillRect(x - 6, y + 17, 15, 4);
  // Alone
  ctx.fillStyle = 'rgba(212,168,67,' + (0.2 * flicker).toFixed(2) + ')';
  ctx.beginPath(); ctx.arc(x + 1.5, y + 35, 40, 0, Math.PI * 2); ctx.fill();
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
