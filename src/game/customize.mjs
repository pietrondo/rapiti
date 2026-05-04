export function openCustomize() {
  window.gameState.gamePhase = 'customize';
  document.getElementById('custom-name').value = window.gameState.playerName;
  updateCustomizeSwatches();
  renderCustomizePreview();
  document.getElementById('customize-overlay').classList.add('active');
}

export function updateCustomizeSwatches() {
  var containers = { 'coat-colors': 'body', 'detail-colors': 'detail' };
  for (var cid in containers) {
    var key = containers[cid];
    var container = document.getElementById(cid);
    if (!container) continue;
    var swatches = container.querySelectorAll('.color-swatch');
    for (var i = 0; i < swatches.length; i++) {
      var s = swatches[i];
      if (s.getAttribute('data-color') === window.gameState.playerColors[key]) {
        s.classList.add('selected');
      } else {
        s.classList.remove('selected');
      }
    }
  }
}

export function applyCustomization() {
  var nameInput = document.getElementById('custom-name');
  var name = nameInput.value.trim();
  if (!name) name = 'Detective Maurizio';
  window.gameState.playerName = name;
  document.getElementById('customize-overlay').classList.remove('active');
  window.gameState.gamePhase = 'tutorial';
  if (typeof startMusic === 'function') startMusic();
}

export function renderCustomizePreview() {
  var pv = document.getElementById('previewCanvas');
  if (!pv) return;
  var ctx = pv.getContext('2d');
  ctx.clearRect(0, 0, pv.width, pv.height);
  ctx.imageSmoothingEnabled = false;

  var colors = window.gameState.playerColors;
  var artist = window.SpriteManager.artist;
  var t = Date.now() * 0.001;

  // Visual effects for preview
  var scaleY = 1 + Math.sin(t * 4) * 0.02;
  var scaleX = 1 / scaleY;
  var bounceY = Math.sin(t * 8) * 1.5;

  ctx.save();
  // Center in the 48x56 preview canvas
  ctx.translate(pv.width / 2, pv.height / 2 + 5);
  ctx.scale(1.5 * scaleX, 1.5 * scaleY);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 14, 12 * scaleX, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw character parts using centralized artist
  var ox = -16;
  var oy = -16 + bounceY;

  artist.drawHat(ctx, ox, oy, 'down', colors, { type: 'player' });
  artist.drawHead(ctx, ox, oy + 6, colors, { type: 'player' });
  artist.drawEyes(ctx, ox, oy + 6, 'down', { type: 'player' });
  artist.drawBody(ctx, ox, oy + 17, 'down', colors, { type: 'player' });

  // Legs (simple for preview)
  var legs = colors.legs || '#4A3728';
  artist.drawPixelRect(ctx, ox + 11, oy + 26, 4, 6, legs);
  artist.drawPixelRect(ctx, ox + 17, oy + 26, 4, 6, legs);
  artist.drawPixelRect(ctx, ox + 10, oy + 30, 5, 2, '#111');
  artist.drawPixelRect(ctx, ox + 17, oy + 30, 5, 2, '#111');

  ctx.restore();

  if (window.gameState.gamePhase === 'customize') {
    requestAnimationFrame(renderCustomizePreview);
  }
}

// Global exports for dynamic module loading compatibility
if (typeof window !== 'undefined') {
  window.openCustomize = openCustomize;
  window.updateCustomizeSwatches = updateCustomizeSwatches;
  window.applyCustomization = applyCustomization;
  window.renderCustomizePreview = renderCustomizePreview;
}
