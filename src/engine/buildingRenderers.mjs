/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    BUILDING RENDERERS MODULE (Facade)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Edificio generico con stili classico/moderno/rustico.
 * Funzioni specializzate spostate in civicBuildings.mjs,
 * industrialBuildings.mjs, buildingDecorations.mjs.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

var C = {
  wallBrick: '#8B4513',
  roofBrown: '#654321',
  glassSky: '#87CEEB',
  doorWood: '#4A3728',
  gold: '#FFD700',
  goldMetallic: '#D4AF37',
  stoneDim: '#696969',
  concrete: '#A9A9A9',
};

export function drawBuildingDetailed(ctx, x, y, width, height, options) {
  options = options || {};
  var wallColor = options.wallColor || C.wallBrick;
  var roofColor = options.roofColor || C.roofBrown;
  var windowColor = options.windowColor || C.glassSky;
  var doorColor = options.doorColor || C.doorWood;
  var style = options.style || 'classic';
  var animTime = options.animTime || 0;

  // Ombra alla base
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(x - 4, y + height - 5, width + 8, 10);

  // Muro con pattern mattoni
  if (window.drawBrickPattern) {
    window.drawBrickPattern(ctx, x, y, width, height, wallColor);
  } else {
    ctx.fillStyle = wallColor;
    ctx.fillRect(x, y, width, height);
  }

  // Zoccolo alla base (concrete)
  ctx.fillStyle = C.stoneDim;
  ctx.fillRect(x, y + height - 8, width, 8);

  // Tetto con tegole
  if (window.drawTileRoof) {
    window.drawTileRoof(ctx, x, y, width, roofColor);
  } else {
    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(x - 5, y);
    ctx.lineTo(x + width / 2, y - height * 0.2);
    ctx.lineTo(x + width + 5, y);
    ctx.closePath();
    ctx.fill();
  }

  // Finestre
  var windowRows = Math.floor(height / 40);
  var windowCols = Math.floor(width / 30);
  var windowW = 16;
  var windowH = 22;
  var startX = x + 10;
  var startY = y + 15;

  for (var row = 0; row < windowRows; row++) {
    for (var col = 0; col < windowCols; col++) {
      var wx = startX + col * (width / windowCols);
      var wy = startY + row * 40;

      if (wx + windowW < x + width - 5 && wy + windowH < y + height - 30) {
        if (window.drawLitWindow) {
          var isLit = (row + col + Math.floor(animTime)) % 3 === 0;
          window.drawLitWindow(
            ctx,
            wx,
            wy,
            windowW,
            windowH,
            isLit,
            animTime * 0.5,
            row * 10 + col
          );
        } else {
          ctx.fillStyle = windowColor;
          ctx.fillRect(wx, wy, windowW, windowH);
          ctx.strokeStyle = '#2A1A0A';
          ctx.lineWidth = 1;
          ctx.strokeRect(wx, wy, windowW, windowH);
        }
      }
    }
  }

  // Porta
  var doorW = 26;
  var doorH = 42;
  var doorX = x + width / 2 - doorW / 2;
  var doorY = y + height - doorH - 5;

  // Cornice porta
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(doorX - 2, doorY - 2, doorW + 4, doorH + 2);

  // Battente porta
  ctx.fillStyle = doorColor;
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Pomello oro
  ctx.fillStyle = C.gold;
  ctx.beginPath();
  ctx.arc(doorX + doorW - 6, doorY + doorH / 2, 2, 0, Math.PI * 2);
  ctx.fill();

  // Dettagli stile
  if (style === 'classic') {
    ctx.fillStyle = C.goldMetallic;
    ctx.fillRect(x - 2, y + 10, width + 4, 3); // Cornice sottotetto
    ctx.fillRect(x - 2, y + height * 0.4, width + 4, 2); // Fascia marcapiano
  } else if (style === 'modern') {
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 5, y + 5, width - 10, height - 15);
  }
}

window.BuildingRenderers = window.BuildingRenderers || {};
window.BuildingRenderers.drawBuildingDetailed = drawBuildingDetailed;
