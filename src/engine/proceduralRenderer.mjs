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
  nightSky: (ctx, stars, t) => {
    t = t || 0;
    // Gradient cielo più profondo
    var grad = ctx.createLinearGradient(0, 0, 0, 150);
    grad.addColorStop(0, '#05070A');
    grad.addColorStop(0.4, '#0A0E18');
    grad.addColorStop(1, '#1A1E28');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, window.CANVAS_W, window.CANVAS_H);

    // Stelle grandi con bagliore
    ctx.fillStyle = window.PALETTE.creamPaper;
    for (var i = 0; i < (stars || 16); i++) {
      var sx = 15 + ((i * 127) % (window.CANVAS_W - 30));
      var sy = 5 + ((i * 43) % 80);
      var blink = 0.5 + Math.sin(t * 2 + i) * 0.5;

      ctx.globalAlpha = 0.4 + blink * 0.5;
      var size = i % 4 === 0 ? 2 : 1;
      ctx.fillRect(sx, sy, size, size);

      // Alone stellare per quelle grandi
      if (size > 1 && blink > 0.7) {
        ctx.fillStyle = 'rgba(232, 220, 200, 0.2)';
        ctx.fillRect(sx - 1, sy, 5, 1);
        ctx.fillRect(sx + 0.5, sy - 2, 1, 5);
      }
      ctx.fillStyle = window.PALETTE.creamPaper;
    }

    // Via Lattea / Nebulosa leggera
    var milkyWay = ctx.createRadialGradient(200, 50, 20, 200, 50, 150);
    milkyWay.addColorStop(0, 'rgba(100, 120, 200, 0.05)');
    milkyWay.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = milkyWay;
    ctx.fillRect(0, 0, window.CANVAS_W, 120);

    ctx.globalAlpha = 1;
    // Stelle piccole fisse
    ctx.fillStyle = '#6A6A6A';
    for (var j = 0; j < 40; j++) {
      var px = 10 + ((j * 67) % window.CANVAS_W);
      var py = 2 + ((j * 31) % 100);
      ctx.fillRect(px, py, 1, 1);
    }
  },

  /** Montagne sullo sfondo */
  mountains: (ctx) => {
    // Montagne lontane (scure)
    ctx.fillStyle = '#0F111A';
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(40, 50);
    ctx.lineTo(110, 75);
    ctx.lineTo(180, 40);
    ctx.lineTo(260, 70);
    ctx.lineTo(340, 45);
    ctx.lineTo(400, 80);
    ctx.lineTo(400, 110);
    ctx.lineTo(0, 110);
    ctx.fill();

    // Montagne vicine con gradiente
    var mGrad = ctx.createLinearGradient(0, 50, 0, 110);
    mGrad.addColorStop(0, window.PALETTE.violetBlue);
    mGrad.addColorStop(1, '#1A1C2C');
    ctx.fillStyle = mGrad;

    ctx.beginPath();
    ctx.moveTo(0, 95);
    ctx.lineTo(70, 55);
    ctx.lineTo(160, 80);
    ctx.lineTo(230, 45);
    ctx.lineTo(320, 75);
    ctx.lineTo(400, 90);
    ctx.lineTo(400, 110);
    ctx.lineTo(0, 110);
    ctx.fill();

    // Bordo neve / Riflesso lunare
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(70, 55);
    ctx.lineTo(85, 65);
    ctx.lineTo(60, 68);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(230, 45);
    ctx.lineTo(250, 60);
    ctx.lineTo(210, 58);
    ctx.closePath();
    ctx.fill();
  },

  /** Edificio semplice migliorato */
  building: (ctx, x, y, w, h, windows, t) => {
    t = t || 0;
    // Muro base
    ctx.fillStyle = window.PALETTE.slateGrey;
    ctx.fillRect(x, y, w, h);

    // Ombra laterale per profondità
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(x + w - 4, y, 4, h);

    // Finestre
    for (var i = 0; i < (windows || 2); i++) {
      var wx = x + 8 + i * 20;
      var wy = y + 10;
      var isLit = Math.floor(x + i + t * 0.2) % 3 === 0;

      if (window.drawLitWindow) {
        window.drawLitWindow(ctx, wx, wy, 12, 18, isLit, t, i);
      } else {
        ctx.fillStyle = isLit ? window.PALETTE.lanternYel : '#1A1C20';
        ctx.fillRect(wx, wy, 12, 18);
      }
    }

    // Tetto
    ctx.fillStyle = window.PALETTE.burntOrange;
    ctx.fillRect(x - 2, y - 6, w + 4, 6);
  },

  /** Lampione con alone (usa BuildingRenderers se possibile) */
  lamp: (ctx, x, y, t) => {
    var BR = typeof BuildingRenderers !== 'undefined' ? BuildingRenderers : {};
    if (BR.drawStreetLamp) {
      BR.drawStreetLamp(ctx, x, y, true, t);
      return;
    }

    // Fallback migliorato
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(x - 1.5, y, 3, 30); // Palo
    ctx.fillRect(x - 4, y - 6, 8, 6); // Lanterna

    ctx.fillStyle = window.PALETTE.lanternYel;
    ctx.fillRect(x - 2, y - 4, 4, 3);

    // Luce
    var glow = 0.5 + Math.sin((t || 0) * 4) * 0.1;
    ctx.fillStyle = `rgba(212, 168, 67, ${glow * 0.2})`;
    ctx.beginPath();
    ctx.arc(x, y - 2, 30, 0, Math.PI * 2);
    ctx.fill();
  },

  /** Albero stilizzato migliorato */
  tree: (ctx, x, y) => {
    // Ombra portata
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(x, y + 15, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tronco
    var trunkGrad = ctx.createLinearGradient(x - 3, y, x + 3, y);
    trunkGrad.addColorStop(0, '#2D1E15');
    trunkGrad.addColorStop(1, '#4A3728');
    ctx.fillStyle = trunkGrad;
    ctx.fillRect(x - 3, y, 6, 18);

    // Chioma strati (stile "blob" EarthBound)
    var leafColors = ['#1A331A', '#224422', '#2D5A2D', '#3A6D3A'];

    function drawLeafBlob(ox, oy, r, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2);
      ctx.fill();
      // Riflesso su ogni blob
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.arc(x + ox - r * 0.3, y + oy - r * 0.3, r * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    drawLeafBlob(0, -10, 14, leafColors[0]);
    drawLeafBlob(-8, -4, 11, leafColors[1]);
    drawLeafBlob(8, -5, 10, leafColors[2]);
    drawLeafBlob(-2, -15, 9, leafColors[3]);
  },

  _buildingRenderers: (() => {
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
    var BR = typeof BuildingRenderers !== 'undefined' ? BuildingRenderers : {};
    var renderer = this._buildingRenderers[type];
    if (renderer) {
      renderer(ctx, x, y, w, h, animTime);
    } else if (BR.drawBuildingDetailed) {
      BR.drawBuildingDetailed(ctx, x, y, w, h, { type: type, animTime: animTime });
    } else {
      this.building(ctx, x, y, w, h, 2, animTime);
    }
  },
};

// Export for global access
window.PF = PF;
