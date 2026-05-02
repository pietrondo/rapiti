/* ═══════════════════════════════════════════════════════════════════════════════
   PROCEDURAL FALLBACK RENDERER (PF)
   Helper di disegno procedurale quando i PNG non sono disponibili
   ═══════════════════════════════════════════════════════════════════════════════ */

// Import side-effect modules that populate window.BuildingRenderers
import './buildingRenderers.mjs';
import './civicBuildings.mjs';
import './industrialBuildings.mjs';
import './buildingDecorations.mjs';

const PF = {
  /** Sfondo cielo notturno con stelle + gradiente */
  nightSky: (ctx, stars) => {
    // Gradient cielo
    var grad = ctx.createLinearGradient(0, 0, 0, 100);
    grad.addColorStop(0, '#0A0C10');
    grad.addColorStop(0.5, '#12151C');
    grad.addColorStop(1, '#1A1E28');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, window.CANVAS_W, window.CANVAS_H);
    // Stelle grandi
    ctx.fillStyle = window.PALETTE.creamPaper;
    for (var i = 0; i < (stars || 14); i++) {
      var sx = 15 + ((i * 79) % window.CANVAS_W);
      var sy = 5 + ((i * 27) % 50);
      var size = i % 3 === 0 ? 2 : 1;
      ctx.globalAlpha = 0.6 + Math.sin(i * 1.5) * 0.3;
      ctx.fillRect(sx, sy, size, size);
    }
    ctx.globalAlpha = 1;
    // Stelle piccole (più numerose)
    ctx.fillStyle = '#8A8A8A';
    for (var i = 0; i < 25; i++) {
      var sx = 10 + ((i * 53) % window.CANVAS_W);
      var sy = 2 + ((i * 19) % 60);
      ctx.globalAlpha = 0.3 + Math.sin(i * 2.3) * 0.2;
      ctx.fillRect(sx, sy, 1, 1);
    }
    ctx.globalAlpha = 1;
  },

  /** Montagne sullo sfondo */
  mountains: (ctx) => {
    // Montagne lontane (scure)
    ctx.fillStyle = '#1A1D2E';
    ctx.beginPath();
    ctx.moveTo(0, 95);
    ctx.lineTo(40, 55);
    ctx.lineTo(100, 70);
    ctx.lineTo(160, 45);
    ctx.lineTo(240, 65);
    ctx.lineTo(320, 50);
    ctx.lineTo(400, 75);
    ctx.lineTo(400, 100);
    ctx.lineTo(0, 100);
    ctx.fill();
    // Montagne vicine
    ctx.fillStyle = window.PALETTE.violetBlue;
    ctx.beginPath();
    ctx.moveTo(0, 90);
    ctx.lineTo(60, 60);
    ctx.lineTo(150, 75);
    ctx.lineTo(220, 50);
    ctx.lineTo(300, 70);
    ctx.lineTo(400, 85);
    ctx.lineTo(400, 100);
    ctx.lineTo(0, 100);
    ctx.fill();
    // Bordo neve
    ctx.fillStyle = '#2A2D3E';
    ctx.beginPath();
    ctx.moveTo(40, 62);
    ctx.lineTo(60, 60);
    ctx.lineTo(80, 65);
    ctx.lineTo(140, 68);
    ctx.lineTo(160, 45);
    ctx.lineTo(180, 52);
    ctx.lineTo(200, 57);
    ctx.lineTo(220, 50);
    ctx.lineTo(240, 58);
    ctx.lineTo(300, 70);
    ctx.lineTo(320, 65);
    ctx.lineTo(340, 72);
    ctx.lineTo(360, 68);
    ctx.fill();
  },

  /** Edificio semplice */
  building: (ctx, x, y, w, h, windows) => {
    ctx.fillStyle = window.PALETTE.slateGrey;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = window.PALETTE.fadedBeige;
    for (var i = 0; i < (windows || 2); i++) {
      var wx = x + 7 + i * 18,
        wy = y + 8;
      ctx.fillRect(wx, wy, 8, 16);
      ctx.fillStyle = window.PALETTE.lanternYel;
      ctx.fillRect(wx + 2, wy + 2, 4, 6);
      ctx.fillStyle = window.PALETTE.fadedBeige;
    }
    ctx.fillStyle = window.PALETTE.burntOrange;
    ctx.fillRect(x, y - 8, w, 8);
  },

  /** Lampione con alone */
  lamp: (ctx, x, y) => {
    // Palo
    ctx.fillStyle = '#2A2D35';
    ctx.fillRect(x, y, 4, 26);
    ctx.fillStyle = '#3A3D45';
    ctx.fillRect(x + 1, y, 2, 26);
    // Braccio
    ctx.fillStyle = '#2A2D35';
    ctx.fillRect(x - 3, y - 2, 10, 3);
    // Lanterna
    ctx.fillStyle = '#1A1C20';
    ctx.fillRect(x - 4, y - 10, 12, 10);
    ctx.fillStyle = window.PALETTE.lanternYel;
    ctx.fillRect(x - 2, y - 8, 8, 6);
    // Luce intensa
    ctx.fillStyle = 'rgba(255,220,120,0.6)';
    ctx.beginPath();
    ctx.arc(x + 2, y - 5, 5, 0, Math.PI * 2);
    ctx.fill();
    // Alone luce
    ctx.fillStyle = 'rgba(212,168,67,0.12)';
    ctx.beginPath();
    ctx.arc(x + 2, y + 8, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(212,168,67,0.06)';
    ctx.beginPath();
    ctx.arc(x + 2, y + 12, 45, 0, Math.PI * 2);
    ctx.fill();
    // Ombra del lampione
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(x - 2, y + 26, 8, 3);
  },

  /** Albero stilizzato */
  tree: (ctx, x, y) => {
    // Ombra
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(x + 1, y + 14, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tronco
    ctx.fillStyle = '#3A2A1A';
    ctx.fillRect(x - 2, y + 2, 5, 14);
    ctx.fillStyle = '#4A3A2A';
    ctx.fillRect(x - 1, y + 2, 3, 14);
    // Rami
    ctx.fillStyle = '#3A2A1A';
    ctx.fillRect(x - 6, y + 4, 4, 2);
    ctx.fillRect(x + 3, y + 6, 4, 2);
    // Chioma - strati
    ctx.fillStyle = '#1A3A1A';
    ctx.beginPath();
    ctx.arc(x, y - 8, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1E421E';
    ctx.beginPath();
    ctx.arc(x - 4, y - 5, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#224822';
    ctx.beginPath();
    ctx.arc(x + 5, y - 6, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#264E26';
    ctx.beginPath();
    ctx.arc(x, y - 10, 7, 0, Math.PI * 2);
    ctx.fill();
  },

  _buildingRenderers: (function () {
    var BR = typeof BuildingRenderers !== 'undefined' ? BuildingRenderers : {};
    return {
      municipio: BR.drawMunicipio || null,
      bar: BR.drawBar || null,
      cascina: BR.drawCascina || null,
      fienile: BR.drawFienile || null,
      cabina: BR.drawCabina || null,
      pozzo: BR.drawPozzo || null,
    };
  })(),

  /** Edificio dettagliato stile EarthBound - dispatcher */
  buildingDetailed: function (ctx, x, y, w, h, type, animTime) {
    animTime = animTime || 0;
    var renderer = this._buildingRenderers[type];
    if (renderer) {
      renderer(ctx, x, y, w, h, animTime);
    } else {
      this.building(ctx, x, y, w, h, 2);
    }
  },
};

// Export for global access
window.PF = PF;
