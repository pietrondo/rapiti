/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: INDUSTRIALE
 * Zona Industriale
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawIndustrialArea(ctx, t) {
  window.PF.nightSky(ctx, 18, t);
  window.PF.mountains(ctx);

  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 85, window.CANVAS_W, 165);

  // Terreno industriale sporco
  if (window.drawWallTexture) {
    window.drawWallTexture(ctx, 0, 85, window.CANVAS_W, 165, '#2a2a2a', 'rgba(0,0,0,0.2)');
  }

  // Fabbrica principale (Mattoni scuri)
  if (window.drawBrickPattern) {
    window.drawBrickPattern(ctx, 80, 50, 240, 70, '#3a3a3a');
  } else {
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(80, 50, 240, 70);
  }

  // Zoccolo cemento fabbrica
  ctx.fillStyle = '#444';
  ctx.fillRect(80, 112, 240, 8);

  // Ciminiere con dettagli
  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(100, 20, 20, 35);
  ctx.fillRect(280, 15, 20, 40);
  ctx.fillStyle = '#333';
  ctx.fillRect(100, 20, 20, 4);
  ctx.fillRect(280, 15, 20, 4);

  // Fumo volumetrico migliorato
  function drawSteam(sx, sy, size, seed) {
    var smoke = 0.2 + Math.sin(t * 1.5 + seed) * 0.1;
    var drift = Math.sin(t * 0.8 + seed) * 10;
    ctx.fillStyle = `rgba(120,120,120,${smoke})`;
    ctx.beginPath();
    ctx.arc(sx + drift, sy - (t % 5) * 10, size, 0, Math.PI * 2);
    ctx.arc(sx + drift * 0.5, sy - 15 - (t % 3) * 8, size * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  drawSteam(110, 15, 12, 0);
  drawSteam(290, 10, 10, 1);

  // Finestre industriali illuminate
  for (var i = 0; i < 5; i++) {
    var wx = 95 + i * 45;
    var wy = 65;
    if (window.drawLitWindow) {
      window.drawLitWindow(ctx, wx, wy, 24, 34, false, t, i);
    } else {
      var glow = 0.4 + Math.sin(t * 2 + i * 0.5) * 0.1;
      ctx.fillStyle = `rgba(130,160,220,${glow})`;
      ctx.fillRect(wx, wy, 24, 34);
    }
  }

  // Container con texture ruggine
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(20, 120, 60, 40);
  if (window.drawWallTexture)
    window.drawWallTexture(ctx, 20, 120, 60, 40, '#8B4513', 'rgba(100,0,0,0.1)');

  ctx.fillStyle = '#556B2F';
  ctx.fillRect(320, 130, 50, 35);
  if (window.drawWallTexture)
    window.drawWallTexture(ctx, 320, 130, 50, 35, '#556B2F', 'rgba(0,50,0,0.1)');

  // Recinzione metallica (Pattern)
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  for (var rx = 0; rx < 25; rx += 4) {
    ctx.beginPath();
    ctx.moveTo(rx, 85);
    ctx.lineTo(rx, 250);
    ctx.moveTo(375 + rx, 85);
    ctx.lineTo(375 + rx, 250);
    ctx.stroke();
  }

  // Insegna STAZIONE RADIO
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(90, 35, 220, 16);
  ctx.fillStyle = '#D4A843';
  ctx.font = 'bold 8px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('STAZIONE RADIO MONTE FERRO', 200, 47);
  ctx.textAlign = 'start';
  window.PF.lamp(ctx, 60, 110, t);
  window.PF.lamp(ctx, 340, 110, t);
}

const IndustrialeArea = {
  name: 'Zona Industriale',
  walkableTop: 115,
  colliders: [
    { x: 80, y: 0, w: 240, h: 110 }, // Fabbrica (lascia spazio per interagire con la porta)
    { x: 20, y: 120, w: 60, h: 40 }, // Container
    { x: 310, y: 100, w: 70, h: 50 }, // Container DX
  ],
  npcs: [],
  exits: [
    {
      dir: 'up',
      xRange: [180, 220],
      to: 'residenziale',
      spawnX: 200,
      spawnY: 210,
      requiresInteract: true,
    },
    { dir: 'down', xRange: [170, 230], to: 'polizia', spawnX: 200, spawnY: 130 },
    { dir: 'left', xRange: [0, 40], to: 'monte_ferro', spawnX: 200, spawnY: 200 },
  ],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawIndustrialArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = IndustrialeArea;
} else if (typeof window !== 'undefined') {
  window.IndustrialeArea = IndustrialeArea;
}
