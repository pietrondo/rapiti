/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RENDER: Utils
 * Funzioni utilità per rendering
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { CANVAS_H, CANVAS_W } from '../config.js';

/**
 * Colori visuali standard
 */
export const VISUAL = {
  ink: '#0B0C12',
  panel: '#15161B',
  panel2: '#222631',
  gold: '#D4A843',
  amber: '#F0C15A',
  paper: '#E8DCC8',
  rust: '#C4956A',
  signal: '#91B7FF',
  danger: '#CC4444',
};

/**
 * Disegna un rettangolo con gradiente
 * @param {CanvasRenderingContext2D} ctx - Context canvas
 * @param {number} x - Posizione X
 * @param {number} y - Posizione Y
 * @param {number} w - Larghezza
 * @param {number} h - Altezza
 * @param {string} topColor - Colore inizio gradiente
 * @param {string} bottomColor - Colore fine gradiente
 */
export function fillGradientRect(ctx, x, y, w, h, topColor, bottomColor) {
  const grad = ctx.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
}

/**
 * Disegna un pannello pixel art
 * @param {CanvasRenderingContext2D} ctx - Context canvas
 * @param {number} x - Posizione X
 * @param {number} y - Posizione Y
 * @param {number} w - Larghezza
 * @param {number} h - Altezza
 * @param {string} [title] - Titolo opzionale
 */
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

/**
 * Disegna effetto grain pellicola
 * @param {CanvasRenderingContext2D} ctx - Context canvas
 */
export function drawFilmGrain(ctx) {
  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  for (let i = 0; i < 70; i++) {
    const x = (i * 37 + Math.floor(Date.now() * 0.02)) % CANVAS_W;
    const y = (i * 61 + Math.floor(Date.now() * 0.015)) % CANVAS_H;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let s = 0; s < CANVAS_H; s += 4) {
    ctx.fillRect(0, s, CANVAS_W, 1);
  }
}

/**
 * Disegna un prompt con effetto pulse
 * @param {CanvasRenderingContext2D} ctx - Context canvas
 * @param {string} text - Testo del prompt
 * @param {number} x - Posizione X
 * @param {number} y - Posizione Y
 */
export function drawPrompt(ctx, text, x, y) {
  const t = Date.now() * 0.001;
  const alpha = 0.55 + Math.sin(t * 3) * 0.35;
  const tw = ctx.measureText(text).width + 24;
  ctx.fillStyle = 'rgba(10,11,18,0.78)';
  ctx.fillRect(x - tw / 2, y - 10, tw, 16);
  ctx.strokeStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
  ctx.strokeRect(x - tw / 2 + 1, y - 9, tw - 2, 14);
  ctx.fillStyle = 'rgba(232,220,200,' + alpha.toFixed(2) + ')';
  ctx.fillText(text, x, y + 2);
}

/**
 * Ottiene il nome breve di un'area
 * @param {string} areaId - ID dell'area
 * @returns {string} Nome breve
 */
export function getAreaShortName(areaId) {
  const names = {
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

/**
 * Disegna una freccia direzionale
 * @param {CanvasRenderingContext2D} ctx - Context canvas
 * @param {string} dir - Direzione ('up', 'down', 'left', 'right')
 * @param {number} x - Posizione X
 * @param {number} y - Posizione Y
 */
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
