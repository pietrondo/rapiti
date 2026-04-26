"use strict";

function openCustomize() {
  gameState.gamePhase = 'customize';
  document.getElementById('custom-name').value = gameState.playerName;
  updateCustomizeSwatches();
  renderCustomizePreview();
  document.getElementById('customize-overlay').classList.add('active');
}

function updateCustomizeSwatches() {
  var containers = { 'coat-colors': 'body', 'detail-colors': 'detail' };
  for (var cid in containers) {
    var key = containers[cid];
    var container = document.getElementById(cid);
    if (!container) continue;
    var swatches = container.querySelectorAll('.color-swatch');
    for (var i = 0; i < swatches.length; i++) {
      var s = swatches[i];
      if (s.getAttribute('data-color') === gameState.playerColors[key]) {
        s.classList.add('selected');
      } else {
        s.classList.remove('selected');
      }
    }
  }
}

function applyCustomization() {
  var nameInput = document.getElementById('custom-name');
  var name = nameInput.value.trim();
  if (!name) name = 'Detective Maurizio';
  gameState.playerName = name;
  document.getElementById('customize-overlay').classList.remove('active');
  gameState.gamePhase = 'intro';
  gameState.introSlide = 3; // ultima slide narrativa
  startMusic();
}

function renderCustomizePreview() {
  var pv = document.getElementById('previewCanvas');
  if (!pv) return;
  var pctx = pv.getContext('2d');
  pctx.clearRect(0, 0, 48, 56);
  pctx.imageSmoothingEnabled = false;
  var s = 1;
  var cx = 24, cy = 28;
  var colors = gameState.playerColors;
  // Shadow
  pctx.fillStyle = 'rgba(0,0,0,0.3)'; pctx.fillRect(cx - 4*s, cy + 8*s, 8*s, 3*s);
  // Legs
  pctx.fillStyle = colors.legs;
  pctx.fillRect(cx - 3*s, cy + 4*s, 2*s, 5*s); pctx.fillRect(cx + 1*s, cy + 4*s, 2*s, 5*s);
  // Shoes
  pctx.fillStyle = '#1A1C20';
  pctx.fillRect(cx - 4*s, cy + 8*s, 3*s, 2*s); pctx.fillRect(cx + 1*s, cy + 8*s, 3*s, 2*s);
  // Body
  pctx.fillStyle = colors.body; pctx.fillRect(cx - 4*s, cy - s, 8*s, 6*s);
  // Detail
  pctx.fillStyle = colors.detail; pctx.fillRect(cx + 2*s, cy - s, 2*s, 6*s);
  // Head
  pctx.fillStyle = colors.head; pctx.fillRect(cx - 3*s, cy - 7*s, 6*s, 7*s);
  // Eyes
  pctx.fillStyle = '#1A1C20';
  pctx.fillRect(cx + 1*s, cy - 5*s, 2*s, 2*s); pctx.fillRect(cx + 3*s, cy - 5*s, 2*s, 2*s);
  // Hat
  pctx.fillStyle = colors.detail;
  pctx.fillRect(cx - 4*s, cy - 9*s, 9*s, 2*s); pctx.fillRect(cx - 3*s, cy - 10*s, 7*s, 2*s);
}
