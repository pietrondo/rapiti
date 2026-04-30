/* ═══════════════════════════════════════════════════════════════════════════════
   PROCEDURAL FALLBACK RENDERER (PF)
   Helper di disegno procedurale quando i PNG non sono disponibili
   ═══════════════════════════════════════════════════════════════════════════════ */

var PF = {
  /** Sfondo cielo notturno con stelle + luna */
  nightSky: (ctx, stars) => {
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = PALETTE.creamPaper;
    for (var i = 0; i < (stars || 14); i++) {
      ctx.fillRect(
        15 + ((i * 79) % CANVAS_W),
        5 + ((i * 27) % 50),
        i % 3 === 0 ? 2 : 1,
        i % 3 === 0 ? 2 : 1
      );
    }
  },

  /** Montagne sullo sfondo */
  mountains: (ctx) => {
    ctx.fillStyle = PALETTE.violetBlue;
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
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = PALETTE.fadedBeige;
    for (var i = 0; i < (windows || 2); i++) {
      var wx = x + 7 + i * 18,
        wy = y + 8;
      ctx.fillRect(wx, wy, 8, 16);
      ctx.fillStyle = PALETTE.lanternYel;
      ctx.fillRect(wx + 2, wy + 2, 4, 6);
      ctx.fillStyle = PALETTE.fadedBeige;
    }
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x, y - 8, w, 8);
  },

  /** Lampione con alone */
  lamp: (ctx, x, y) => {
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x, y, 3, 22);
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(x - 2, y - 6, 7, 7);
    ctx.fillStyle = 'rgba(212,168,67,0.15)';
    ctx.beginPath();
    ctx.arc(x + 1, y + 12, 18, 0, Math.PI * 2);
    ctx.fill();
  },

  /** Albero stilizzato */
  tree: (ctx, x, y) => {
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x - 1, y, 3, 14);
    ctx.fillStyle = PALETTE.darkForest;
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

  /** Edificio dettagliato stile EarthBound - dispatcher */
  buildingDetailed: function (ctx, x, y, w, h, type, animTime) {
    animTime = animTime || 0;

    switch (type) {
      case 'municipio':
        BuildingRenderers.drawMunicipio(ctx, x, y, w, h, animTime);
        break;
      case 'bar':
        BuildingRenderers.drawBar(ctx, x, y, w, h, animTime);
        break;
      case 'cascina':
        BuildingRenderers.drawCascina(ctx, x, y, w, h, animTime);
        break;
      case 'fienile':
        BuildingRenderers.drawFienile(ctx, x, y, w, h, animTime);
        break;
      case 'cabina':
        BuildingRenderers.drawCabina(ctx, x, y, w, h, animTime);
        break;
      case 'pozzo':
        BuildingRenderers.drawPozzo(ctx, x, y, w, h, animTime);
        break;
      default:
        this.building(ctx, x, y, w, h, 2);
    }
  },
};

// Export for global access
window.PF = PF;
