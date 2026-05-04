/* ═══════════════════════════════════════════════════════════════════════════════
   MAP RENDERER
   Minimappa, indicatori uscite, nomi aree
   ═══════════════════════════════════════════════════════════════════════════════ */

export function getAreaShortName(areaId) {
  var names = {
    piazze: 'Piazza',
    chiesa: 'Chiesa',
    cimitero: 'Cimitero',
    giardini: 'Giardini',
    bar_exterior: 'Bar',
    residenziale: 'Case',
    industriale: 'Industria',
    polizia: 'Polizia',
  };
  return names[areaId] || areaId;
}

export function drawArrow(ctx, dir, x, y) {
  ctx.beginPath();
  if (dir === 'up') {
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x - 6, y + 4);
    ctx.lineTo(x + 6, y + 4);
  } else if (dir === 'down') {
    ctx.moveTo(x, y + 5);
    ctx.lineTo(x - 6, y - 4);
    ctx.lineTo(x + 6, y - 4);
  } else if (dir === 'left') {
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x + 4, y - 6);
    ctx.lineTo(x + 4, y + 6);
  } else {
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x - 4, y - 6);
    ctx.lineTo(x - 4, y + 6);
  }
  ctx.closePath();
  ctx.fill();
}

export function renderAreaExitMarkers(ctx, area) {
  if (!area?.exits) return;
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
      ctx.fillStyle = `rgba(212,168,67,${alpha.toFixed(2)})`;
      ctx.fillRect(ex.xRange[0], area.walkableTop - 2, ex.xRange[1] - ex.xRange[0], 8);
      y = area.walkableTop + 62;
    } else if (ex.dir === 'down') {
      ctx.fillStyle = `rgba(212,168,67,${alpha.toFixed(2)})`;
      ctx.fillRect(ex.xRange[0], window.CANVAS_H - 10, ex.xRange[1] - ex.xRange[0], 10);
      y = window.CANVAS_H - 18;
    } else if (ex.dir === 'left') {
      x = 36;
      y = mid;
      ctx.fillStyle = `rgba(212,168,67,${alpha.toFixed(2)})`;
      ctx.fillRect(0, ex.xRange[0], 10, ex.xRange[1] - ex.xRange[0]);
    } else {
      x = window.CANVAS_W - 36;
      y = mid;
      ctx.fillStyle = `rgba(212,168,67,${alpha.toFixed(2)})`;
      ctx.fillRect(window.CANVAS_W - 10, ex.xRange[0], 10, ex.xRange[1] - ex.xRange[0]);
    }

    ctx.fillStyle = 'rgba(8,9,14,0.84)';
    ctx.fillRect(x - boxW / 2, y - 9, boxW, 18);
    ctx.strokeStyle = 'rgba(212,168,67,0.82)';
    ctx.strokeRect(x - boxW / 2 + 1, y - 8, boxW - 2, 16);
    ctx.fillStyle = window.PALETTE.lanternYel;
    drawArrow(ctx, ex.dir, x - boxW / 2 + 11, y);
    ctx.fillStyle = window.PALETTE.creamPaper;
    ctx.font = '7px "Courier New",monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 7, y + 3);
    ctx.textAlign = 'start';
  }
}

export function renderMiniMap(ctx) {
  var nodes = {
    cimitero: { x: 45, y: 15 },
    chiesa: { x: 45, y: 30 },
    piazze: { x: 45, y: 50 },
    giardini: { x: 17, y: 50 },
    bar_exterior: { x: 73, y: 50 },
    residenziale: { x: 45, y: 70 },
    industriale: { x: 45, y: 90 },
    polizia: { x: 45, y: 105 },
  };
  var x = 8;
  var y = 8;
  var w = 90;
  var h = 125;
  var current = window.gameState.currentArea;
  var t = Date.now() * 0.001;

  window.UIRenderer.drawPixelPanel(ctx, x, y, w, h, 'MAPPA');

  // Linee di collegamento migliorate
  ctx.strokeStyle = 'rgba(160,168,176,0.25)';
  ctx.setLineDash([2, 2]);
  ctx.lineWidth = 1;
  drawMapLink(ctx, nodes, x, y, 'cimitero', 'chiesa');
  drawMapLink(ctx, nodes, x, y, 'chiesa', 'piazze');
  drawMapLink(ctx, nodes, x, y, 'piazze', 'giardini');
  drawMapLink(ctx, nodes, x, y, 'piazze', 'bar_exterior');
  drawMapLink(ctx, nodes, x, y, 'piazze', 'residenziale');
  drawMapLink(ctx, nodes, x, y, 'residenziale', 'industriale');
  drawMapLink(ctx, nodes, x, y, 'industriale', 'polizia');
  ctx.setLineDash([]);

  for (var id in nodes) {
    var n = nodes[id];
    var active = id === current;
    var areaData = window.areas ? window.areas[id] : null;

    // Rettangolo area
    ctx.fillStyle = active ? window.PALETTE.lanternYel : 'rgba(80, 80, 80, 0.8)';
    ctx.fillRect(x + n.x - 4, y + n.y - 4, 8, 8);

    if (active) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      var pulse = Math.abs(Math.sin(t * 4)) * 3;
      ctx.strokeRect(x + n.x - 5 - pulse / 2, y + n.y - 5 - pulse / 2, 10 + pulse, 10 + pulse);
    }

    // Indicatori dinamici
    if (areaData) {
      // 1. NPC presenti (puntini colorati)
      if (areaData.npcs && areaData.npcs.length > 0) {
        for (var i = 0; i < areaData.npcs.length; i++) {
          ctx.fillStyle = '#6EEBFF';
          ctx.fillRect(x + n.x + 5, y + n.y - 6 + i * 3, 2, 2);
        }
      }

      // 2. Obiettivi / Quest (Stella o Punto Esclamativo)
      var hasObjective = false;
      if (window.StoryManager) {
        var objectives = window.StoryManager.getCurrentObjectives();
        // Semplificazione: se l'area e' menzionata negli obiettivi
        for (var j = 0; j < objectives.length; j++) {
          if (
            !objectives[j].completed &&
            objectives[j].description.toLowerCase().indexOf(getAreaShortName(id).toLowerCase()) >= 0
          ) {
            hasObjective = true;
            break;
          }
        }
      }

      if (hasObjective) {
        var flash = Math.sin(t * 10) > 0;
        ctx.fillStyle = flash ? '#FF5555' : '#AA0000';
        ctx.font = 'bold 8px monospace';
        ctx.fillText('!', x + n.x - 12, y + n.y + 4);
      }
    }
  }

  // Nome area corrente in basso
  ctx.fillStyle = window.PALETTE.creamPaper;
  ctx.font = '7px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText(getAreaShortName(current).toUpperCase(), x + w / 2, y + h - 8);
  ctx.textAlign = 'start';
}

export function drawMapLink(ctx, nodes, ox, oy, a, b) {
  ctx.beginPath();
  ctx.moveTo(ox + nodes[a].x, oy + nodes[a].y);
  ctx.lineTo(ox + nodes[b].x, oy + nodes[b].y);
  ctx.stroke();
}

window.UIRenderer = window.UIRenderer || {};
window.UIRenderer.getAreaShortName = getAreaShortName;
window.UIRenderer.drawArrow = drawArrow;
window.UIRenderer.renderAreaExitMarkers = renderAreaExitMarkers;
window.UIRenderer.renderMiniMap = renderMiniMap;
window.UIRenderer.drawMapLink = drawMapLink;
