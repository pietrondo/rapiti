/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CIVIC DRAW - Civic building facades and decorations
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Drawing helpers for civic buildings: municipio, church, bar, fountain,
 * notice board, bench. Extracted from areas.mjs.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.drawBrickPattern, window.BuildingRenderers */

import { drawLitWindow, drawTileRoof, drawWallTexture } from './drawCommon.mjs';

export function drawMunicipioFacade(ctx, x, y, w, h, t) {
  // Mura con pattern mattoni chiaro
  if (window.drawBrickPattern) {
    window.drawBrickPattern(ctx, x, y, w, h, window.PALETTE.fadedBeige);
  } else {
    drawWallTexture(ctx, x, y, w, h, window.PALETTE.fadedBeige, 'rgba(107,91,79,0.22)');
  }

  // Zoccolo e cornicioni
  ctx.fillStyle = window.PALETTE.greyBrown;
  ctx.fillRect(x - 6, y + h - 8, w + 12, 10);
  ctx.fillStyle = window.PALETTE.burntOrange;
  ctx.fillRect(x - 4, y - 8, w + 8, 8);
  
  // Timpano / Frontone
  ctx.fillStyle = window.PALETTE.earthBrown;
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 8);
  ctx.lineTo(x + w / 2, y - 24);
  ctx.lineTo(x + w + 10, y - 8);
  ctx.fill();

  // Torretta orologio
  ctx.fillStyle = window.PALETTE.fadedBeige;
  ctx.fillRect(x + w / 2 - 16, y - 40, 32, 24);
  if (window.drawTileRoof) {
    window.drawTileRoof(ctx, x + w / 2 - 18, y - 40, 36, window.PALETTE.greyBrown);
  } else {
    drawTileRoof(ctx, x + w / 2 - 18, y - 30, 36, window.PALETTE.greyBrown);
  }

  // Orologio
  ctx.fillStyle = window.PALETTE.creamPaper;
  ctx.beginPath();
  ctx.arc(x + w / 2, y - 28, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = window.PALETTE.nightBlue;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Lancette orologio
  ctx.fillStyle = window.PALETTE.nightBlue;
  ctx.fillRect(x + w / 2 - 0.5, y - 33, 1, 5);
  ctx.fillRect(x + w / 2 - 0.5, y - 28, 4, 1);

  // Finestre Municipio
  drawLitWindow(ctx, x + 12, y + 16, 16, 24, true, t, 0);
  drawLitWindow(ctx, x + w - 28, y + 16, 16, 24, true, t, 1);
  drawLitWindow(ctx, x + 38, y + 16, 14, 20, false, t, 2);
  drawLitWindow(ctx, x + w - 52, y + 16, 14, 20, false, t, 3);

  // Portone
  ctx.fillStyle = window.PALETTE.earthBrown;
  ctx.beginPath();
  ctx.roundRect(x + w / 2 - 14, y + h - 38, 28, 38, [8, 8, 0, 0]);
  ctx.fill();
  
  // Battenti porta
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + h - 38);
  ctx.lineTo(x + w / 2, y + h);
  ctx.stroke();

  // Bandiera Italiana
  ctx.fillStyle = window.PALETTE.slateGrey;
  ctx.fillRect(x + w + 5, y + 10, 2, 24); // Asta
  
  ctx.fillStyle = '#00853E';
  ctx.fillRect(x + w + 7, y + 12, 6, 12);
  ctx.fillStyle = '#F4F0E8';
  ctx.fillRect(x + w + 13, y + 12, 6, 12);
  ctx.fillStyle = '#C83737';
  ctx.fillRect(x + w + 19, y + 12, 6, 12);
}

export function drawChurchFacade(ctx, x, y, w, h, t) {
  // Uso il modulo specializzato se disponibile, altrimenti fallback migliorato
  if (window.BuildingRenderers && window.BuildingRenderers.drawChurch) {
    window.BuildingRenderers.drawChurch(ctx, x, y, w, h);
    return;
  }

  drawWallTexture(ctx, x, y, w, h, window.PALETTE.greyBrown, 'rgba(232,220,200,0.12)');
  ctx.fillStyle = window.PALETTE.earthBrown;
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + w / 2, y - 28);
  ctx.lineTo(x + w + 10, y);
  ctx.fill();
  
  // Campanile
  ctx.fillStyle = window.PALETTE.greyBrown;
  ctx.fillRect(x + w / 2 - 22, y - 50, 44, 50);
  ctx.fillStyle = window.PALETTE.earthBrown;
  ctx.beginPath();
  ctx.moveTo(x + w / 2 - 25, y - 50);
  ctx.lineTo(x + w / 2, y - 74);
  ctx.lineTo(x + w / 2 + 25, y - 50);
  ctx.fill();
  
  // Croce
  ctx.fillStyle = window.PALETTE.creamPaper;
  ctx.fillRect(x + w / 2 - 2, y - 66, 4, 18);
  ctx.fillRect(x + w / 2 - 9, y - 59, 18, 4);
  
  // Effetto bagliore rosone
  ctx.fillStyle = 'rgba(212,168,67,0.18)';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 36, 25 + Math.sin(t * 1.5) * 4, 0, Math.PI * 2);
  ctx.fill();
  
  drawLitWindow(ctx, x + 24, y + 22, 16, 34, true, t, 0);
  drawLitWindow(ctx, x + w - 40, y + 22, 16, 34, true, t, 1);
  
  ctx.fillStyle = window.PALETTE.earthBrown;
  ctx.beginPath();
  ctx.roundRect(x + w / 2 - 16, y + h - 44, 32, 44, [12, 12, 0, 0]);
  ctx.fill();
}

export function drawBarFacade(ctx, x, y, w, h, t) {
  // Mura con pattern mattoni caldi
  if (window.drawBrickPattern) {
    window.drawBrickPattern(ctx, x, y, w, h, '#BBA07A');
  } else {
    drawWallTexture(ctx, x, y, w, h, '#BBA07A', 'rgba(80,54,38,0.18)');
  }
  
  ctx.fillStyle = '#442B1F';
  ctx.fillRect(x - 8, y + h - 8, w + 16, 10);
  
  // Insegna Neon
  var neon = 0.62 + Math.sin(t * 4) * 0.28;
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(x + 20, y - 35, w - 40, 30);
  ctx.strokeStyle = `rgba(220,54,42,${neon.toFixed(2)})`;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 22, y - 33, w - 44, 26);
  
  ctx.fillStyle = `rgba(255,100,100,${(neon * 0.8).toFixed(2)})`;
  ctx.font = 'bold 10px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BAR SAN CELESTE', x + w / 2, y - 16);
  ctx.textAlign = 'start';

  // Vetrine con riflessi
  drawBarWindow(ctx, x + 18, y + 20, 46, 42, t, 0);
  drawBarWindow(ctx, x + w - 64, y + 20, 46, 42, t, 1);

  // Porta
  ctx.fillStyle = '#5A382A';
  ctx.fillRect(x + w / 2 - 18, y + h - 50, 36, 50);
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(x + w / 2 - 14, y + h - 46, 28, 46);
  ctx.fillStyle = 'rgba(130,160,220,0.3)';
  ctx.fillRect(x + w / 2 - 11, y + h - 43, 22, 28);

  drawStripedAwning(ctx, x + 14, y + 66, w - 28, t);
}

export function drawBarWindow(ctx, x, y, w, h, t, phase) {
  ctx.fillStyle = '#35241D';
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = window.PALETTE.nightBlue;
  ctx.fillRect(x, y, w, h);
  
  var pulse = (0.42 + Math.sin(t * 2 + phase) * 0.12).toFixed(2);
  ctx.fillStyle = `rgba(212,168,67,${pulse})`;
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  
  // Riflesso diagonale
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.moveTo(x + 2, y + 2);
  ctx.lineTo(x + w * 0.5, y + 2);
  ctx.lineTo(x + 2, y + h * 0.5);
  ctx.fill();

  ctx.fillStyle = '#4A2F24';
  ctx.fillRect(x + Math.floor(w / 2) - 1, y, 2, h);
  ctx.fillRect(x, y + Math.floor(h / 2) - 1, w, 2);
}

export function drawStripedAwning(ctx, x, y, w, _t) {
  ctx.fillStyle = '#6B2F25';
  ctx.fillRect(x - 6, y, w + 12, 3);
  var stripes = Math.floor(w / 12);
  for (var s = 0; s < stripes; s++) {
    ctx.fillStyle = s % 2 ? '#C83737' : '#F4F0E8';
    ctx.beginPath();
    ctx.moveTo(x + s * 12, y + 3);
    ctx.lineTo(x + s * 12 + 12, y + 3);
    ctx.lineTo(x + s * 12 + 10, y + 20);
    ctx.lineTo(x + s * 12 - 2, y + 20);
    ctx.closePath();
    ctx.fill();
    
    // Ombra interna tenda
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(x + s * 12, y + 3, 2, 15);
  }
}

export function drawPiazzaFountain(ctx, x, y, t) {
  if (window.BuildingRenderers && window.BuildingRenderers.drawFountain) {
    window.BuildingRenderers.drawFountain(ctx, x, y, 25, t);
    return;
  }
  
  ctx.fillStyle = window.PALETTE.stoneGrey;
  ctx.fillRect(x - 20, y + 10, 40, 12);
  ctx.fillStyle = window.PALETTE.darkForest;
  ctx.beginPath();
  ctx.moveTo(x - 24, y + 10);
  ctx.lineTo(x + 24, y + 10);
  ctx.lineTo(x, y - 18);
  ctx.fill();
}

export function drawNoticeBoard(ctx, x, y, _t) {
  // Ombra board
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(x + 2, y + 2, 44, 54);
  
  ctx.fillStyle = '#5A4030';
  ctx.fillRect(x - 2, y - 2, 44, 54);
  ctx.fillStyle = '#3A2820';
  ctx.fillRect(x, y, 40, 50);
  ctx.fillStyle = '#D4C4A8';
  ctx.fillRect(x + 4, y + 4, 32, 42);
  
  ctx.fillStyle = '#2A1C18';
  ctx.font = 'bold 8px monospace';
  ctx.fillText('AVVISI', x + 7, y + 14);
  
  // Post-it e foglietti
  ctx.fillStyle = '#FFF9C4';
  ctx.fillRect(x + 6, y + 18, 12, 10);
  ctx.fillStyle = '#E1F5FE';
  ctx.fillRect(x + 22, y + 22, 10, 12);
  ctx.fillStyle = '#F8BBD0';
  ctx.fillRect(x + 8, y + 32, 14, 8);
  
  // Testo finto
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 22); ctx.lineTo(x + 16, y + 22);
  ctx.moveTo(x + 8, y + 25); ctx.lineTo(x + 14, y + 25);
  ctx.stroke();
}

export function drawBench(ctx, x, y) {
  if (window.BuildingRenderers && window.BuildingRenderers.drawParkBench) {
    window.BuildingRenderers.drawParkBench(ctx, x, y, 44);
    return;
  }
  
  ctx.fillStyle = '#5A4030';
  ctx.fillRect(x - 2, y - 4, 44, 8);
  ctx.fillRect(x, y + 4, 4, 14);
  ctx.fillRect(x + 36, y + 4, 4, 14);
}

// Global exports
if (typeof window !== 'undefined') {
  window.drawMunicipioFacade = drawMunicipioFacade;
  window.drawChurchFacade = drawChurchFacade;
  window.drawBarFacade = drawBarFacade;
  window.drawBarWindow = drawBarWindow;
  window.drawStripedAwning = drawStripedAwning;
  window.drawPiazzaFountain = drawPiazzaFountain;
  window.drawNoticeBoard = drawNoticeBoard;
  window.drawBench = drawBench;
}
