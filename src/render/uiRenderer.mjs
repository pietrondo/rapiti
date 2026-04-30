/* ═══════════════════════════════════════════════════════════════════════════════
   UI RENDERER
   Elementi UI, pannelli, effetti visivi e minimappa
   ═══════════════════════════════════════════════════════════════════════════════ */

const VISUAL = {
  ink: '#0B0C12',
  panel: '#15161B',
  panel2: '#222631',
  gold: '#D4A843',
  amber: '#F0C15A',
  paper: '#E8DCC8',
  rust: '#C4956A',
  signal: '#91B7FF',
  danger: '#CC4444'
};

export function fillGradientRect(ctx, x, y, w, h, topColor, bottomColor) {
  var grad = ctx.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
}

export function drawPixelPanel(ctx, x, y, w, h, title) {
  ctx.fillStyle = 'rgba(5,6,10,0.45)';
  ctx.fillRect(x + 4, y + 5, w, h);
  ctx.fillStyle = VISUAL.panel;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = VISUAL.panel2;
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(x + 4, y + 4, w - 8, 10);
  ctx.strokeStyle = VISUAL.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(232,220,200,0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
  if (title) {
    ctx.fillStyle = VISUAL.gold;
    ctx.fillRect(x + 12, y - 6, Math.min(w - 24, title.length * 7 + 14), 12);
    ctx.fillStyle = VISUAL.ink;
    ctx.font = '8px "Courier New",monospace';
    ctx.fillText(title, x + 18, y + 3);
  }
}

export function drawFilmGrain(ctx) {
  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  for (var i = 0; i < 70; i++) {
    var x = (i * 37 + Math.floor(Date.now() * 0.02)) % CANVAS_W;
    var y = (i * 61 + Math.floor(Date.now() * 0.015)) % CANVAS_H;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (var s = 0; s < CANVAS_H; s += 4) {
    ctx.fillRect(0, s, CANVAS_W, 1);
  }
}

export function drawPrompt(ctx, text, x, y) {
  var t = Date.now() * 0.001;
  var alpha = 0.55 + Math.sin(t * 3) * 0.35;
  var tw = ctx.measureText(text).width + 24;
  ctx.fillStyle = 'rgba(10,11,18,0.78)';
  ctx.fillRect(x - tw / 2, y - 10, tw, 16);
  ctx.strokeStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
  ctx.strokeRect(x - tw / 2 + 1, y - 9, tw - 2, 14);
  ctx.fillStyle = 'rgba(232,220,200,' + alpha.toFixed(2) + ')';
  ctx.fillText(text, x, y + 2);
}

export function drawTitleLandscape(ctx, t) {
  fillGradientRect(ctx, 0, 0, CANVAS_W, CANVAS_H, '#060714', '#1A1C20');
  ctx.fillStyle = PALETTE.creamPaper;
  for (var i = 0; i < 70; i++) {
    var sx = (i * 97) % CANVAS_W;
    var sy = (i * 43 + Math.sin(t + i) * 2) % 118;
    var size = i % 11 === 0 ? 2 : 1;
    ctx.globalAlpha = 0.25 + (i % 5) * 0.12;
    ctx.fillRect(sx, sy, size, size);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = 'rgba(120,150,255,0.12)';
  ctx.beginPath(); ctx.arc(210 + Math.sin(t * 0.7) * 12, 48, 34 + Math.sin(t * 1.7) * 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(232,240,255,0.82)';
  ctx.beginPath(); ctx.arc(210 + Math.sin(t * 0.7) * 12, 48, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(145,183,255,0.12)';
  ctx.beginPath();
  ctx.moveTo(198, 62);
  ctx.lineTo(170 + Math.sin(t) * 8, 168);
  ctx.lineTo(246 + Math.sin(t * 1.2) * 8, 168);
  ctx.lineTo(222, 62);
  ctx.fill();

  ctx.fillStyle = '#111824';
  ctx.beginPath();
  ctx.moveTo(0, 134); ctx.lineTo(45, 100); ctx.lineTo(105, 122); ctx.lineTo(162, 88);
  ctx.lineTo(232, 118); ctx.lineTo(295, 92); ctx.lineTo(400, 132); ctx.lineTo(400, 170); ctx.lineTo(0, 170); ctx.fill();
  ctx.fillStyle = '#17251E';
  ctx.fillRect(0, 150, CANVAS_W, 100);

  ctx.fillStyle = '#202735';
  ctx.fillRect(130, 110, 140, 54);
  ctx.fillStyle = '#4F3428';
  ctx.fillRect(122, 104, 156, 9);
  ctx.fillStyle = '#131722';
  ctx.fillRect(195, 70, 10, 42);
  ctx.fillStyle = '#4F3428';
  ctx.fillRect(188, 64, 24, 7);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(150, 126, 8, 10);
  ctx.fillRect(240, 126, 8, 10);
  ctx.fillStyle = 'rgba(212,168,67,0.18)';
  ctx.fillRect(144, 120, 20, 22);
  ctx.fillRect(234, 120, 20, 22);

  for (var g = 0; g < 32; g++) {
    ctx.fillStyle = g % 2 === 0 ? '#21351F' : '#2B4426';
    ctx.fillRect(g * 13, 170 + (g % 3) * 4, 9, 80);
  }
  drawFilmGrain(ctx);
}

export function drawObjectIcon(ctx, o) {
  var cx = Math.round(o.x + o.w / 2);
  var cy = Math.round(o.y + o.h / 2);
  var pulse = Math.sin(Date.now() * 0.005) * 0.25 + 0.55;
  ctx.fillStyle = 'rgba(212,168,67,' + (pulse * 0.22).toFixed(2) + ')';
  ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(232,220,200,0.18)';
  ctx.beginPath(); ctx.arc(cx, cy, 7 + Math.sin(Date.now() * 0.006) * 2, 0, Math.PI * 2); ctx.fill();

  if (o.id === 'mappa_campi') {
    ctx.fillStyle = '#CDBB86'; ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = '#8B7355'; ctx.fillRect(o.x + 2, o.y + 3, o.w - 4, 1); ctx.fillRect(o.x + 4, o.y + 7, o.w - 6, 1);
    ctx.fillStyle = '#3D5A3C'; ctx.fillRect(o.x + 3, o.y + 9, 5, 3);
  } else if (o.id === 'lanterna_rotta') {
    ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(o.x + 3, o.y, 5, 7);
    ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(o.x, o.y + 7, 10, 2); ctx.fillRect(o.x + 9, o.y + 4, 3, 2);
    ctx.fillStyle = VISUAL.danger; ctx.fillRect(o.x + 1, o.y + 9, 2, 1); ctx.fillRect(o.x + 8, o.y + 9, 2, 1);
  } else if (o.id === 'registro_1861' || o.id === 'diario_enzo') {
    ctx.fillStyle = o.id === 'registro_1861' ? '#6B3F2A' : '#7A2323';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(o.x + 3, o.y + 3, o.w - 6, 2);
    ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(o.x + 2, o.y, 2, o.h);
  } else if (o.id === 'lettera_censurata') {
    ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = '#1A1C20'; ctx.fillRect(o.x + 2, o.y + 3, o.w - 4, 2); ctx.fillRect(o.x + 2, o.y + 8, o.w - 7, 1);
    ctx.fillStyle = VISUAL.danger; ctx.fillRect(o.x + o.w - 5, o.y + 2, 3, 3);
  } else if (o.id === 'simboli_portone') {
    ctx.strokeStyle = VISUAL.signal; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(cx - 1, cy - 8, 2, 16); ctx.fillRect(cx - 8, cy - 1, 16, 2);
  } else if (o.id === 'frammento') {
    ctx.fillStyle = '#C8D0DA'; ctx.fillRect(o.x + 1, o.y, 7, 3); ctx.fillRect(o.x, o.y + 3, 9, 3); ctx.fillRect(o.x + 2, o.y + 6, 5, 2);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(o.x + 2, o.y + 1, 4, 1);
  } else if (o.id === 'tracce_circolari') {
    ctx.strokeStyle = PALETTE.lanternYel; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx, cy, 20, 10, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, cy, 12, 6, 0, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(cx - 4, cy - 4, 8, 8);
  }
  ctx.lineWidth = 1;
}

export function getAreaShortName(areaId) {
  var names = {
    piazze: 'Piazza',
    chiesa: 'Chiesa',
    cimitero: 'Cimitero',
    giardini: 'Giardini',
    bar_exterior: 'Bar',
    residenziale: 'Case',
    industriale: 'Industria',
    polizia: 'Polizia'
  };
  return names[areaId] || areaId;
}

export function drawArrow(ctx, dir, x, y) {
  ctx.beginPath();
  if (dir === 'up') {
    ctx.moveTo(x, y - 5); ctx.lineTo(x - 6, y + 4); ctx.lineTo(x + 6, y + 4);
  } else if (dir === 'down') {
    ctx.moveTo(x, y + 5); ctx.lineTo(x - 6, y - 4); ctx.lineTo(x + 6, y - 4);
  } else if (dir === 'left') {
    ctx.moveTo(x - 5, y); ctx.lineTo(x + 4, y - 6); ctx.lineTo(x + 4, y + 6);
  } else {
    ctx.moveTo(x + 5, y); ctx.lineTo(x - 4, y - 6); ctx.lineTo(x - 4, y + 6);
  }
  ctx.closePath();
  ctx.fill();
}

export function renderAreaExitMarkers(ctx, area) {
  if (!area || !area.exits) return;
  var tick = Date.now() * 0.006;
  for (var i = 0; i < area.exits.length; i++) {
    var ex = area.exits[i];
    var mid = Math.round((ex.xRange[0] + ex.xRange[1]) / 2);
    var label = getAreaShortName(ex.to);
    var x = mid;
    var y = Math.max(area.walkableTop + 10, 112);
    var boxW = Math.max(44, label.length * 7 + 25);
    var alpha = 0.2 + Math.sin(tick + i) * 0.08;

    if (ex.dir === 'up') {
      ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
      ctx.fillRect(ex.xRange[0], area.walkableTop - 2, ex.xRange[1] - ex.xRange[0], 8);
      y = area.walkableTop + 62;
    } else if (ex.dir === 'down') {
      ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
      ctx.fillRect(ex.xRange[0], CANVAS_H - 10, ex.xRange[1] - ex.xRange[0], 10);
      y = CANVAS_H - 18;
    } else if (ex.dir === 'left') {
      x = 36;
      y = mid;
      ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
      ctx.fillRect(0, ex.xRange[0], 10, ex.xRange[1] - ex.xRange[0]);
    } else {
      x = CANVAS_W - 36;
      y = mid;
      ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
      ctx.fillRect(CANVAS_W - 10, ex.xRange[0], 10, ex.xRange[1] - ex.xRange[0]);
    }

    ctx.fillStyle = 'rgba(8,9,14,0.84)';
    ctx.fillRect(x - boxW / 2, y - 9, boxW, 18);
    ctx.strokeStyle = 'rgba(212,168,67,0.82)';
    ctx.strokeRect(x - boxW / 2 + 1, y - 8, boxW - 2, 16);
    ctx.fillStyle = PALETTE.lanternYel;
    drawArrow(ctx, ex.dir, x - boxW / 2 + 11, y);
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.font = '7px "Courier New",monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 7, y + 3);
    ctx.textAlign = 'start';
  }
}

export function renderMiniMap(ctx) {
  var nodes = {
    cimitero: { x: 45, y: 9 },
    chiesa: { x: 45, y: 24 },
    piazze: { x: 45, y: 44 },
    giardini: { x: 17, y: 44 },
    bar_exterior: { x: 73, y: 44 },
    residenziale: { x: 45, y: 64 },
    industriale: { x: 45, y: 84 },
    polizia: { x: 45, y: 101 }
  };
  var x = 8;
  var y = 8;
  var w = 90;
  var h = 116;
  var current = gameState.currentArea;
  drawPixelPanel(ctx, x, y, w, h, 'MAPPA');
  ctx.strokeStyle = 'rgba(160,168,176,0.36)';
  ctx.lineWidth = 1;
  drawMapLink(ctx, nodes, x, y, 'cimitero', 'chiesa');
  drawMapLink(ctx, nodes, x, y, 'chiesa', 'piazze');
  drawMapLink(ctx, nodes, x, y, 'piazze', 'giardini');
  drawMapLink(ctx, nodes, x, y, 'piazze', 'bar_exterior');
  drawMapLink(ctx, nodes, x, y, 'piazze', 'residenziale');
  drawMapLink(ctx, nodes, x, y, 'residenziale', 'industriale');
  drawMapLink(ctx, nodes, x, y, 'industriale', 'polizia');
  for (var id in nodes) {
    var n = nodes[id];
    var active = id === current;
    ctx.fillStyle = active ? PALETTE.lanternYel : 'rgba(232,220,200,0.82)';
    ctx.fillRect(x + n.x - 3, y + n.y - 3, 6, 6);
    if (active) {
      ctx.strokeStyle = 'rgba(212,168,67,0.9)';
      ctx.strokeRect(x + n.x - 5, y + n.y - 5, 10, 10);
    }
  }
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.font = '7px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText(getAreaShortName(current), x + w / 2, y + h - 8);
  ctx.textAlign = 'start';
}

export function drawMapLink(ctx, nodes, ox, oy, a, b) {
  ctx.beginPath();
  ctx.moveTo(ox + nodes[a].x, oy + nodes[a].y);
  ctx.lineTo(ox + nodes[b].x, oy + nodes[b].y);
  ctx.stroke();
}

export function renderFade(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,' + (gameState.fadeAlpha / 100).toFixed(2) + ')';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

// Export for other modules
window.UIRenderer = {
  VISUAL: VISUAL,
  fillGradientRect: fillGradientRect,
  drawPixelPanel: drawPixelPanel,
  drawFilmGrain: drawFilmGrain,
  drawPrompt: drawPrompt,
  drawTitleLandscape: drawTitleLandscape,
  drawObjectIcon: drawObjectIcon,
  getAreaShortName: getAreaShortName,
  drawArrow: drawArrow,
  renderAreaExitMarkers: renderAreaExitMarkers,
  renderMiniMap: renderMiniMap,
  drawMapLink: drawMapLink,
  renderFade: renderFade
};
