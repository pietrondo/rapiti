/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: CHIESA
 * Chiesa di San Celeste — Estetica Gotico-Rurale 1978
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawChurchArea(ctx, t) {
  window.PF.nightSky(ctx, 12);
  window.PF.mountains(ctx);

  // Terreno: Sagrato in pietra antica
  ctx.fillStyle = '#37474F';
  ctx.fillRect(0, 130, window.CANVAS_W, 120);
  
  // Grandi lastre di pietra
  ctx.fillStyle = '#263238';
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 4; j++) {
      ctx.fillRect(i * 40 + (j % 2) * 20, 135 + j * 30, 38, 2);
      ctx.fillRect(i * 40 + (j % 2) * 20, 135 + j * 30, 2, 28);
    }
  }

  // Struttura Chiesa (Pietra/Mattone Scuro)
  var cx = 100;
  var cy = 30;
  var cw = 200;
  var ch = 100;

  // Facciata Principale
  ctx.fillStyle = '#455A64';
  ctx.fillRect(cx, cy + 30, cw, ch - 30);
  
  // Texture Pietra
  if (window.drawWallTexture) {
    window.drawWallTexture(ctx, cx, cy + 30, cw, ch - 30, '#37474F', 'rgba(0,0,0,0.1)');
  }

  // Tetto a spiovente (Gotico)
  ctx.fillStyle = '#263238';
  ctx.beginPath();
  ctx.moveTo(cx + cw / 2, cy);
  ctx.lineTo(cx + cw + 10, cy + 40);
  ctx.lineTo(cx - 10, cy + 40);
  ctx.fill();
  
  // Campanile laterale
  ctx.fillStyle = '#37474F';
  ctx.fillRect(cx + cw, cy + 10, 30, 120);
  ctx.fillStyle = '#263238';
  ctx.beginPath();
  ctx.moveTo(cx + cw - 5, cy + 10);
  ctx.lineTo(cx + cw + 15, cy - 15);
  ctx.lineTo(cx + cw + 35, cy + 10);
  ctx.fill();
  
  // Campana (Dettaglio oro)
  ctx.fillStyle = window.PALETTE.lanternYel;
  ctx.beginPath();
  ctx.arc(cx + cw + 15, cy + 35, 6, 0, Math.PI, true);
  ctx.fill();

  // Rosone centrale
  var roseGlow = 0.4 + Math.sin(t * 2) * 0.1;
  ctx.fillStyle = `rgba(212,168,67,${roseGlow})`;
  ctx.beginPath();
  ctx.arc(cx + cw / 2, cy + 60, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#263238';
  ctx.lineWidth = 2;
  ctx.stroke();
  // Intreccio Rosone
  ctx.beginPath();
  for(var a=0; a<8; a++) {
    ctx.moveTo(cx+cw/2, cy+60);
    ctx.lineTo(cx+cw/2 + Math.cos(a*Math.PI/4)*18, cy+60 + Math.sin(a*Math.PI/4)*18);
  }
  ctx.stroke();

  // Portone Monumentale
  ctx.fillStyle = '#212121';
  ctx.beginPath();
  ctx.roundRect(cx + cw / 2 - 25, cy + ch - 5, 50, 50, [25, 25, 0, 0]);
  ctx.fill();
  ctx.strokeStyle = '#D4A843';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Finestre monofore laterali
  if (window.drawLitWindow) {
    window.drawLitWindow(ctx, cx + 25, cy + 75, 12, 25, true, t, 0);
    window.drawLitWindow(ctx, cx + cw - 37, cy + 75, 12, 25, true, t, 1);
  }

  // Statue/Gargoyles stilizzati
  ctx.fillStyle = '#263238';
  ctx.fillRect(cx + 10, cy + 30, 8, 12);
  ctx.fillRect(cx + cw - 18, cy + 30, 8, 12);

  // Ombra alla base
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(cx - 20, cy + ch + 40, cw + 60, 10);

  // Elementi ambientali
  window.PF.lamp(ctx, 60, 150);
  window.PF.lamp(ctx, 340, 150);
  window.PF.tree(ctx, 40, 140);
  window.PF.tree(ctx, 360, 140);
}

const ChiesaArea = {
  name: 'Chiesa di San Celeste',
  walkableTop: 145, // Blocco fisico facciata
  colliders: [
    { x: 90, y: 0, w: 220, h: 145 }, // Struttura Chiesa principale
    { x: 290, y: 0, w: 50, h: 145 }, // Campanile
  ],
  npcs: [{ id: 'don_pietro', x: 200, y: 180 }],
  exits: [
    { dir: 'up', xRange: [175, 225], to: 'cimitero', spawnX: 200, spawnY: 112, requiresInteract: true },
    { dir: 'down', xRange: [150, 250], to: 'piazze', spawnX: 200, spawnY: 155 },
  ],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawChurchArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChiesaArea;
} else if (typeof window !== 'undefined') {
  window.ChiesaArea = ChiesaArea;
}
