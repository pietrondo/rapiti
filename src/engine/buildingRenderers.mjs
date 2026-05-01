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
};

export function drawBuildingDetailed(ctx, x, y, width, height, options) {
  options = options || {};
  var wallColor = options.wallColor || C.wallBrick;
  var roofColor = options.roofColor || C.roofBrown;
  var windowColor = options.windowColor || C.glassSky;
  var doorColor = options.doorColor || C.doorWood;
  var style = options.style || 'classic';

  ctx.fillStyle = wallColor;
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.moveTo(x - 5, y);
  ctx.lineTo(x + width / 2, y - height * 0.2);
  ctx.lineTo(x + width + 5, y);
  ctx.closePath();
  ctx.fill();

  var windowRows = Math.floor(height / 40);
  var windowCols = Math.floor(width / 30);
  var windowW = 15;
  var windowH = 20;
  var startX = x + 10;
  var startY = y + 20;

  ctx.fillStyle = windowColor;
  for (var row = 0; row < windowRows; row++) {
    for (var col = 0; col < windowCols; col++) {
      var wx = startX + col * 25;
      var wy = startY + row * 35;
      if (wx + windowW < x + width - 10 && wy + windowH < y + height - 30) {
        ctx.fillRect(wx, wy, windowW, windowH);
        ctx.strokeStyle = C.doorWood;
        ctx.lineWidth = 2;
        ctx.strokeRect(wx, wy, windowW, windowH);
      }
    }
  }

  var doorW = 25;
  var doorH = 40;
  var doorX = x + width / 2 - doorW / 2;
  var doorY = y + height - doorH;
  ctx.fillStyle = doorColor;
  ctx.fillRect(doorX, doorY, doorW, doorH);

  ctx.fillStyle = C.gold;
  ctx.fillRect(doorX + doorW - 5, doorY + doorH / 2, 3, 3);

  if (style === 'classic') {
    ctx.fillStyle = C.goldMetallic;
    ctx.fillRect(x - 2, y + height * 0.15, width + 4, 5);
  } else if (style === 'rustic') {
    ctx.fillStyle = C.stoneDim;
    for (var i = 0; i < 5; i++) {
      ctx.fillRect(x + i * (width / 5), y + height - 15, 10, 10);
    }
  }
}

window.BuildingRenderers = window.BuildingRenderers || {};
window.BuildingRenderers.drawBuildingDetailed = drawBuildingDetailed;
