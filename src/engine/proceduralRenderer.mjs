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
  /** Sfondo cielo notturno con stelle + luna */
  nightSky: (ctx, stars) => {
    ctx.fillStyle = window.PALETTE.nightBlue;
    ctx.fillRect(0, 0, window.CANVAS_W, window.CANVAS_H);
    ctx.fillStyle = window.PALETTE.creamPaper;
    for (var i = 0; i < (stars || 14); i++) {
      ctx.fillRect(
        15 + ((i * 79) % window.CANVAS_W),
        5 + ((i * 27) % 50),
        i % 3 === 0 ? 2 : 1,
        i % 3 === 0 ? 2 : 1
      );
    }
  },

  /** Montagne sullo sfondo */
  mountains: (ctx) => {
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
    ctx.fillStyle = window.PALETTE.slateGrey;
    ctx.fillRect(x, y, 3, 22);
    ctx.fillStyle = window.PALETTE.lanternYel;
    ctx.fillRect(x - 2, y - 6, 7, 7);
    ctx.fillStyle = 'rgba(212,168,67,0.15)';
    ctx.beginPath();
    ctx.arc(x + 1, y + 12, 18, 0, Math.PI * 2);
    ctx.fill();
  },

  /** Albero stilizzato */
  tree: (ctx, x, y) => {
    ctx.fillStyle = window.PALETTE.earthBrown;
    ctx.fillRect(x - 1, y, 3, 14);
    ctx.fillStyle = window.PALETTE.darkForest;
    ctx.beginPath();
    ctx.arc(x, y - 6, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 5, y - 3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 5, y - 3, 5, 0, Math.PI * 2);
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
