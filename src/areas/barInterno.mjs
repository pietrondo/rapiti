/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: BAR INTERNO
 * Bar Centrale - Interno 1978
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.drawWallTexture, window.drawVignette */

export function drawBarInternoArea(ctx, t) {
  // Sfondo scuro per dare atmosfera noir/vintage
  ctx.fillStyle = '#1A120A';
  ctx.fillRect(0, 0, window.CANVAS_W, window.CANVAS_H);

  // Mura con texture carta da parati anni '70
  if (window.drawWallTexture) {
    window.drawWallTexture(ctx, 0, 0, window.CANVAS_W, 140, '#2A1A10', 'rgba(100,60,30,0.15)');
  }

  // Pavimento a scacchi (molto consumato)
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 140, window.CANVAS_W, 110);
  ctx.fillStyle = '#333';
  for (var r = 0; r < 6; r++) {
    for (var c = 0; c < 10; c++) {
      if ((r + c) % 2 === 0) {
        ctx.fillRect(c * 40, 140 + r * 20, 40, 20);
      }
    }
  }

  // Bancone in legno massiccio
  var barGrad = ctx.createLinearGradient(0, 130, 0, 190);
  barGrad.addColorStop(0, '#5D4037');
  barGrad.addColorStop(1, '#3E2723');
  ctx.fillStyle = barGrad;
  ctx.fillRect(40, 130, 320, 60);

  // Piano del bancone (marmo/zinco)
  ctx.fillStyle = '#A9A9A9';
  ctx.fillRect(35, 125, 330, 8);

  // Scaffale Bottiglie Retro
  ctx.fillStyle = '#2D1E15';
  ctx.fillRect(50, 20, 300, 80);

  // Bottiglie (puntini colorati retroilluminati)
  var colors = ['#CC4444', '#44CC44', '#4444CC', '#CCCC44', '#CC44CC'];
  for (var i = 0; i < 40; i++) {
    var bx = 60 + (i % 20) * 14;
    var by = 35 + Math.floor(i / 20) * 30;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(bx, by, 6, 12);
    // Riflesso vetro
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(bx + 1, by + 2, 1, 4);
  }

  // Macchina del caffè professionale (Gaggia style)
  ctx.fillStyle = '#CFD8DC';
  ctx.fillRect(280, 85, 50, 40);
  ctx.fillStyle = '#90A4AE';
  ctx.fillRect(285, 90, 40, 10); // Pannello comandi
  // Getto vapore animato
  var steam = 0.2 + Math.sin(t * 5) * 0.1;
  ctx.fillStyle = `rgba(255,255,255,${steam})`;
  ctx.beginPath();
  ctx.arc(290, 80 - (t % 2) * 10, 5, 0, Math.PI * 2);
  ctx.fill();

  // Insegna Neon "AMARO"
  var neon = 0.7 + Math.sin(t * 3) * 0.2;
  ctx.strokeStyle = `rgba(255,100,100,${neon})`;
  ctx.lineWidth = 1;
  ctx.font = 'bold 9px monospace';
  ctx.strokeText('AMARO SAN CELESTE', 120, 50);

  // Sgabelli
  ctx.fillStyle = '#111';
  for (var s = 0; s < 4; s++) {
    var sx = 80 + s * 80;
    ctx.fillRect(sx, 185, 12, 5); // Seduta
    ctx.fillRect(sx + 5, 190, 2, 25); // Gamba
  }

  // Radio d'epoca (Interattiva)
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(60, 100, 34, 25);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(65, 105, 24, 15);

  // Luci bancone calde
  var glow = 0.15 + Math.sin(t * 2) * 0.05;
  var lightGrad = ctx.createRadialGradient(200, 50, 20, 200, 50, 150);
  lightGrad.addColorStop(0, `rgba(255, 200, 100, ${glow})`);
  lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = lightGrad;
  ctx.fillRect(0, 0, window.CANVAS_W, 250);
}

const BarInternoArea = {
  name: 'Bar Centrale — Interno',
  walkableTop: 180,
  colliders: [
    { x: 40, y: 125, w: 320, h: 65 }, // Bancone
    { x: 0, y: 0, w: 50, h: 250 }, // Muro SX
    { x: 350, y: 0, w: 50, h: 250 }, // Muro DX
  ],
  npcs: [{ id: 'osvaldo', x: 150, y: 120 }], // Osvaldo dietro il bancone
  exits: [{ dir: 'down', xRange: [150, 250], to: 'bar_exterior', spawnX: 200, spawnY: 135 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawBarInternoArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BarInternoArea;
} else if (typeof window !== 'undefined') {
  window.BarInternoArea = BarInternoArea;
}
