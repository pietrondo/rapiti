/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: RESIDENZIALE
 * Quartiere Residenziale - San Celeste 1978
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette, window.drawBrickPattern, window.drawLitWindow */

export function drawResidentialArea(ctx, t) {
  window.PF.nightSky(ctx, 12, t);
  window.PF.mountains(ctx);

  // Terreno: Erba scura
  ctx.fillStyle = '#1D2A14';
  ctx.fillRect(0, 80, window.CANVAS_W, 170);
  
  // Marciapiede
  ctx.fillStyle = '#3A3F4B';
  ctx.fillRect(0, 115, window.CANVAS_W, 15);
  ctx.fillStyle = '#2C313B';
  for (var i = 0; i < 20; i++) {
    ctx.fillRect(i * 20, 115, 1, 15);
  }

  // Case (Spostate più in alto/dietro)
  var houses = [
    { x: 15, y: 35, w: 75, h: 80, color: '#6D4C41', brick: true, roof: '#BF360C' },
    { x: 155, y: 30, w: 85, h: 85, color: '#D7CCC8', brick: false, roof: '#5D4037' },
    { x: 305, y: 40, w: 80, h: 75, color: '#546E7A', brick: true, roof: '#263238' },
  ];

  for (var i = 0; i < houses.length; i++) {
    var h = houses[i];
    
    // Ombra edificio
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(h.x + 5, h.y + h.h - 5, h.w, 10);

    // Corpo casa
    ctx.fillStyle = h.color;
    ctx.fillRect(h.x, h.y, h.w, h.h);

    if (h.brick && window.drawBrickPattern) {
      window.drawBrickPattern(ctx, h.x, h.y, h.w, h.h, h.color === '#6D4C41' ? '#5D4037' : '#455A64');
    }

    // Tetto
    ctx.fillStyle = h.roof;
    ctx.beginPath();
    ctx.moveTo(h.x - 6, h.y + 2);
    ctx.lineTo(h.x + h.w / 2, h.y - 18);
    ctx.lineTo(h.x + h.w + 6, h.y + 2);
    ctx.fill();

    // Finestre
    for (var f = 0; f < 2; f++) {
      var fx = h.x + 12 + f * (h.w - 44);
      var fy = h.y + 18;
      if (window.drawLitWindow) {
        window.drawLitWindow(ctx, fx, fy, 20, 24, true, t, i + f);
      } else {
        ctx.fillStyle = window.PALETTE.lanternYel;
        ctx.fillRect(fx, fy, 20, 24);
      }
    }

    // Porta
    ctx.fillStyle = '#2A1D15';
    ctx.fillRect(h.x + h.w / 2 - 12, h.y + h.h - 32, 24, 32);
    ctx.fillStyle = window.PALETTE.lanternYel;
    ctx.beginPath();
    ctx.arc(h.x + h.w / 2 + 8, h.y + h.h - 16, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Strada (Senza collider ora)
  ctx.fillStyle = '#2A2E35';
  ctx.fillRect(0, 130, window.CANVAS_W, 100);
  
  // Strisce stradali rovinate
  ctx.fillStyle = 'rgba(200, 200, 200, 0.15)';
  for (var j = 0; j < 5; j++) {
    ctx.fillRect(20 + j * 80, 175, 40, 2);
  }

  // Dettagli ambientali
  window.PF.tree(ctx, 110, 105);
  window.PF.tree(ctx, 270, 110);
  
  // Siepi
  ctx.fillStyle = '#1A331A';
  for (var k = 0; k < 6; k++) {
    ctx.beginPath();
    ctx.arc(45 + k * 60, 125, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Lampioni
  window.PF.lamp(ctx, 35, 140, t);
  window.PF.lamp(ctx, 365, 140, t);
}

const ResidenzialeArea = {
  name: 'Quartiere Residenziale',
  walkableTop: 115,
  colliders: [
    { x: 15, y: 0, w: 75, h: 115 },  // Casa 1
    { x: 155, y: 0, w: 85, h: 115 }, // Casa 2
    { x: 305, y: 0, w: 80, h: 115 }, // Casa 3
    { x: 100, y: 105, w: 20, h: 10 }, // Albero 1
    { x: 260, y: 110, w: 20, h: 10 }, // Albero 2
  ],
  npcs: [{ id: 'valli', x: 200, y: 180 }],
  exits: [
    { dir: 'up', xRange: [160, 240], to: 'piazze', spawnX: 200, spawnY: 220 },
    { dir: 'down', xRange: [160, 240], to: 'industriale', spawnX: 200, spawnY: 130 },
  ],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawResidentialArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResidenzialeArea;
} else if (typeof window !== 'undefined') {
  window.ResidenzialeArea = ResidenzialeArea;
}
