/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: FIENILE
 * Fienile abbandonato — Paglia, attrezzi agricoli, raggio di luce dal tetto
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.drawVignette */

export function drawFienileArea(ctx, t) {
  var _PAL = window.PALETTE;

  // Interno scuro del fienile
  ctx.fillStyle = '#0E0E12';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Pareti in legno grezzo
  ctx.fillStyle = '#2A2218';
  ctx.fillRect(0, 0, CANVAS_W, 140);
  for (var p = 0; p < 8; p++) {
    ctx.fillStyle = p % 2 === 0 ? '#2A2218' : '#302820';
    ctx.fillRect(p * 50, 0, 50, 140);
    ctx.strokeStyle = '#1A1410';
    ctx.lineWidth = 1;
    ctx.strokeRect(p * 50 + 1, 1, 48, 138);
  }

  // Travi del tetto
  ctx.fillStyle = '#3E3022';
  for (var tv = 0; tv < 5; tv++) {
    ctx.fillRect(tv * 90 + 10, 15, 8, 8);
    ctx.fillRect(tv * 90 + 10, 10, 70, 3);
  }

  // Raggio di luce dal tetto (crepa)
  var rayAlpha = 0.12 + Math.sin(t * 0.7) * 0.04;
  var rayGrad = ctx.createLinearGradient(200, 0, 200, CANVAS_H);
  rayGrad.addColorStop(0, `rgba(255,240,200,${rayAlpha})`);
  rayGrad.addColorStop(0.3, `rgba(255,220,150,${rayAlpha * 0.7})`);
  rayGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = rayGrad;
  ctx.beginPath();
  ctx.moveTo(190, 0);
  ctx.lineTo(210, 0);
  ctx.lineTo(230, CANVAS_H);
  ctx.lineTo(170, CANVAS_H);
  ctx.fill();

  // Polvere sospesa nel raggio
  for (var d = 0; d < 20; d++) {
    var dy = (t * 15 + d * 37) % 250;
    var dx = 190 + Math.sin(d * 2.3) * 15 + dy * 0.08;
    ctx.fillStyle = `rgba(255,220,150,${0.06 + Math.sin(t * 2 + d) * 0.03})`;
    ctx.fillRect(dx, dy, 1, 1);
  }

  // Balloni di paglia (sinistra)
  for (var b = 0; b < 3; b++) {
    ctx.fillStyle = '#8B7D2E';
    ctx.beginPath();
    ctx.arc(40 + b * 30, 145 + (b % 2) * 15, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6B5D1E';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Dettagli paglia
    ctx.strokeStyle = '#A09040';
    for (var st = 0; st < 4; st++) {
      ctx.beginPath();
      ctx.arc(40 + b * 30 + (st - 1.5) * 8, 140 + (b % 2) * 15 + st * 3, 6, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Balloni paglia (destra)
  for (var b2 = 0; b2 < 2; b2++) {
    ctx.fillStyle = '#7A6D28';
    ctx.beginPath();
    ctx.arc(320 + b2 * 35, 150 + (b2 % 2) * 20, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // Attrezzi agricoli (parete destra)
  // Forcone
  ctx.fillStyle = '#5A4A3A';
  ctx.fillRect(340, 35, 2, 70);
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(337, 33, 8, 5);
  ctx.fillRect(338, 35, 2, 4);
  ctx.fillRect(342, 35, 2, 4);
  // Pala
  ctx.fillStyle = '#5A4A3A';
  ctx.fillRect(368, 30, 2, 75);
  ctx.fillStyle = '#6B5B4F';
  ctx.fillRect(362, 28, 14, 6);
  // Zappa
  ctx.fillStyle = '#5A4A3A';
  ctx.fillRect(380, 45, 2, 60);
  ctx.fillStyle = '#4A5568';
  ctx.fillRect(376, 42, 10, 6);

  // Scala a pioli (parete sinistra)
  ctx.strokeStyle = '#3E3022';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(15, 20);
  ctx.lineTo(15, 110);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(30, 20);
  ctx.lineTo(30, 110);
  ctx.stroke();
  for (var rung = 0; rung < 6; rung++) {
    ctx.beginPath();
    ctx.moveTo(15, 35 + rung * 15);
    ctx.lineTo(30, 35 + rung * 15);
    ctx.stroke();
  }

  // Finestra alta (fondo)
  ctx.fillStyle = '#0D1525';
  ctx.fillRect(180, 50, 40, 30);
  ctx.strokeStyle = '#2A2218';
  ctx.lineWidth = 2;
  ctx.strokeRect(180, 50, 40, 30);
  ctx.beginPath();
  ctx.moveTo(200, 50);
  ctx.lineTo(200, 80);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(180, 65);
  ctx.lineTo(220, 65);
  ctx.stroke();
  // Bagliore finestra
  ctx.fillStyle = `rgba(100,140,200,${0.06 + Math.sin(t * 2) * 0.02})`;
  ctx.fillRect(182, 52, 36, 26);

  // Pavimento in terra battuta con paglia
  ctx.fillStyle = '#1A1812';
  ctx.fillRect(0, 140, CANVAS_W, 110);
  for (var st2 = 0; st2 < 60; st2++) {
    ctx.fillStyle = st2 % 4 === 0 ? '#8B7D2E' : st2 % 4 === 1 ? '#7A6D28' : '#2A2218';
    ctx.fillRect(st2 * 7, 145 + ((st2 * 3) % 8), 3, 1);
  }

  // Luce calda diffusa
  var amb = ctx.createRadialGradient(200, 50, 10, 200, 50, 300);
  amb.addColorStop(0, `rgba(255,240,180,${0.06 + Math.sin(t * 0.5) * 0.02})`);
  amb.addColorStop(0.5, 'rgba(200,180,100,0.02)');
  amb.addColorStop(1, 'transparent');
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

const FienileArea = {
  name: 'Fienile',
  walkableTop: 80,
  colliders: [
    { x: 30, y: 130, w: 75, h: 30 }, // Balloni paglia sx
    { x: 310, y: 135, w: 80, h: 35 }, // Balloni paglia dx
  ],
  npcs: [],
  exits: [{ dir: 'right', xRange: [200, 250], to: 'cascina', spawnX: 40, spawnY: 130 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawFienileArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FienileArea;
} else if (typeof window !== 'undefined') {
  window.FienileArea = FienileArea;
}
