/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: INDUSTRIALE
 * Zona Industriale
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawIndustrialArea(ctx, t) {
  window.PF.nightSky(ctx, 18);
  window.PF.mountains(ctx);

  ctx.fillStyle = '#2a2a2a';
  ctx.fillRect(0, 85, window.CANVAS_W, 165);

  // Fabbrica
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(80, 50, 240, 70);

  // Ciminiere
  ctx.fillStyle = '#4a4a4a';
  ctx.fillRect(100, 20, 20, 30);
  ctx.fillRect(280, 15, 20, 35);

  // Fumo
  var smoke1 = 0.3 + Math.sin(t * 1.5) * 0.1;
  var smoke2 = 0.3 + Math.sin(t * 1.5 + 1) * 0.1;
  ctx.fillStyle = `rgba(100,100,100,${smoke1.toFixed(2)})`;
  ctx.beginPath();
  ctx.arc(110, 10, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(100,100,100,${smoke2.toFixed(2)})`;
  ctx.beginPath();
  ctx.arc(290, 5, 12, 0, Math.PI * 2);
  ctx.fill();

  // Finestre industriali
  for (var i = 0; i < 5; i++) {
    var glow = 0.4 + Math.sin(t * 2 + i * 0.5) * 0.1;
    ctx.fillStyle = `rgba(130,160,220,${glow.toFixed(2)})`;
    ctx.fillRect(90 + i * 45, 60, 30, 40);
  }

  // Container
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(20, 120, 60, 40);
  ctx.fillStyle = '#556B2F';
  ctx.fillRect(320, 130, 50, 35);

  // Recinzione
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 85, 25, 165);
  ctx.fillRect(375, 85, 25, 165);

  // Lampade industriali
  window.PF.lamp(ctx, 60, 100);
  window.PF.lamp(ctx, 340, 100);
}

const IndustrialeArea = {
  name: 'Zona Industriale',
  walkableTop: 85,
  colliders: [
    { x: 80, y: 50, w: 240, h: 70 },
    { x: 20, y: 120, w: 60, h: 40 },
    { x: 320, y: 50, w: 60, h: 70 },
    { x: 0, y: 85, w: 25, h: 165 },
    { x: 375, y: 85, w: 25, h: 165 },
  ],
  npcs: [],
  exits: [
    { dir: 'up', xRange: [170, 230], to: 'residenziale', spawnX: 200, spawnY: 210 },
    { dir: 'down', xRange: [170, 230], to: 'polizia', spawnX: 200, spawnY: 130 },
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
