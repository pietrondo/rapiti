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
  var colors = gameState.playerColors;

  // Derive light/dark variants
  var coat = colors.body;
  var coatLight = _lighten(coat, 15);
  var coatDark = _darken(coat, 20);
  var hat = colors.detail;
  var hatLight = _lighten(hat, 15);
  var skin = colors.head;
  var skinShadow = _darken(skin, 15);
  var pants = colors.legs;

  var s = 1;
  var ox = 8;
  var oy = 0;

  // === CAPELLO (fedora) ===
  pctx.fillStyle = hat;
  pctx.fillRect(ox + 8 * s, oy + 2 * s, 16 * s, 3 * s);
  pctx.fillRect(ox + 11 * s, oy - 2 * s, 10 * s, 5 * s);
  pctx.fillStyle = hatLight;
  pctx.fillRect(ox + 13 * s, oy - 1 * s, 6 * s, 3 * s);
  pctx.fillStyle = coatLight;
  pctx.fillRect(ox + 11 * s, oy + 2 * s, 10 * s, 1 * s);

  // === TESTA ===
  pctx.fillStyle = skin;
  pctx.fillRect(ox + 10 * s, oy + 4 * s, 12 * s, 10 * s);
  pctx.fillStyle = skinShadow;
  pctx.fillRect(ox + 10 * s, oy + 4 * s, 12 * s, 2 * s);

  // Occhi
  pctx.fillStyle = '#FFFFFF';
  pctx.fillRect(ox + 12 * s, oy + 7 * s, 3 * s, 3 * s);
  pctx.fillRect(ox + 17 * s, oy + 7 * s, 3 * s, 3 * s);
  pctx.fillStyle = '#1A1A2A';
  pctx.fillRect(ox + 13 * s, oy + 8 * s, 2 * s, 2 * s);
  pctx.fillRect(ox + 18 * s, oy + 8 * s, 2 * s, 2 * s);
  pctx.fillStyle = '#4A3020';
  pctx.fillRect(ox + 12 * s, oy + 6 * s, 3 * s, 1 * s);
  pctx.fillRect(ox + 17 * s, oy + 6 * s, 3 * s, 1 * s);
  pctx.fillStyle = '#A07060';
  pctx.fillRect(ox + 14 * s, oy + 11 * s, 4 * s, 1 * s);
  pctx.fillStyle = skinShadow;
  pctx.fillRect(ox + 13 * s, oy + 12 * s, 6 * s, 2 * s);

  // === COLLO / CAMICIA / CRAVATTA ===
  pctx.fillStyle = '#E8E0D0';
  pctx.fillRect(ox + 13 * s, oy + 14 * s, 6 * s, 3 * s);
  pctx.fillStyle = '#D0C8B8';
  pctx.fillRect(ox + 14 * s, oy + 15 * s, 4 * s, 2 * s);
  pctx.fillStyle = '#F0E8D8';
  pctx.fillRect(ox + 12 * s, oy + 14 * s, 3 * s, 2 * s);
  pctx.fillRect(ox + 17 * s, oy + 14 * s, 3 * s, 2 * s);
  pctx.fillStyle = '#8B1A1A';
  pctx.fillRect(ox + 15 * s, oy + 14 * s, 2 * s, 4 * s);
  pctx.fillStyle = '#A02020';
  pctx.fillRect(ox + 15 * s, oy + 14 * s, 2 * s, 2 * s);

  // === CORPO (trenchcoat) ===
  pctx.fillStyle = coat;
  pctx.fillRect(ox + 10 * s, oy + 17 * s, 12 * s, 8 * s);
  pctx.fillStyle = coatDark;
  pctx.fillRect(ox + 10 * s, oy + 17 * s, 2 * s, 8 * s);
  pctx.fillStyle = coatLight;
  pctx.fillRect(ox + 18 * s, oy + 17 * s, 2 * s, 8 * s);
  pctx.fillStyle = coatLight;
  pctx.fillRect(ox + 15 * s, oy + 18 * s, 2 * s, 1 * s);
  pctx.fillRect(ox + 15 * s, oy + 20 * s, 2 * s, 1 * s);
  pctx.fillRect(ox + 15 * s, oy + 22 * s, 2 * s, 1 * s);
  pctx.fillStyle = coatLight;
  pctx.fillRect(ox + 11 * s, oy + 17 * s, 3 * s, 2 * s);
  pctx.fillRect(ox + 18 * s, oy + 17 * s, 3 * s, 2 * s);
  pctx.fillStyle = coatDark;
  pctx.fillRect(ox + 11 * s, oy + 21 * s, 3 * s, 3 * s);
  pctx.fillRect(ox + 18 * s, oy + 21 * s, 3 * s, 3 * s);

  // === BRACCIA ===
  pctx.fillStyle = coat;
  pctx.fillRect(ox + 7 * s, oy + 17 * s, 3 * s, 8 * s);
  pctx.fillStyle = coatDark;
  pctx.fillRect(ox + 7 * s, oy + 17 * s, 1 * s, 8 * s);
  pctx.fillStyle = skin;
  pctx.fillRect(ox + 7 * s, oy + 24 * s, 3 * s, 2 * s);

  pctx.fillStyle = coat;
  pctx.fillRect(ox + 22 * s, oy + 17 * s, 3 * s, 8 * s);
  pctx.fillStyle = coatLight;
  pctx.fillRect(ox + 24 * s, oy + 17 * s, 1 * s, 8 * s);
  pctx.fillStyle = skin;
  pctx.fillRect(ox + 22 * s, oy + 24 * s, 3 * s, 2 * s);

  // === GAMBE ===
  pctx.fillStyle = pants;
  pctx.fillRect(ox + 11 * s, oy + 25 * s, 4 * s, 5 * s);
  pctx.fillRect(ox + 11 * s, oy + 29 * s, 4 * s, 2 * s);
  pctx.fillStyle = coatDark;
  pctx.fillRect(ox + 11 * s, oy + 25 * s, 1 * s, 5 * s);

  pctx.fillStyle = pants;
  pctx.fillRect(ox + 17 * s, oy + 25 * s, 4 * s, 5 * s);
  pctx.fillRect(ox + 17 * s, oy + 29 * s, 4 * s, 2 * s);
  pctx.fillStyle = coatDark;
  pctx.fillRect(ox + 17 * s, oy + 25 * s, 1 * s, 5 * s);

  // === SCARPE ===
  pctx.fillStyle = '#1A1510';
  pctx.fillRect(ox + 10 * s, oy + 30 * s, 5 * s, 2 * s);
  pctx.fillRect(ox + 17 * s, oy + 30 * s, 5 * s, 2 * s);
  pctx.fillStyle = '#2A2015';
  pctx.fillRect(ox + 11 * s, oy + 30 * s, 3 * s, 1 * s);
  pctx.fillRect(ox + 18 * s, oy + 30 * s, 3 * s, 1 * s);
}

function _lighten(hex, amount) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return (
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')
  );
}

function _darken(hex, amount) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);
  return (
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')
  );
}
