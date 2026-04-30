export function initCanvas() {
  var c = document.getElementById('gameCanvas');
  c.width = CANVAS_W * 2;
  c.height = CANVAS_H * 2;
  return c.getContext('2d');
}

export function initEventListeners() {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  document.getElementById('journal-close').addEventListener('click', closeJournal);
  document.getElementById('inventory-close').addEventListener('click', closeInventory);
  document.getElementById('deduction-close').addEventListener('click', closeDeduction);
  document.getElementById('deduction-confirm').addEventListener('click', checkDeduction);
  document.getElementById('radio-close').addEventListener('click', closeRadioPuzzle);
  document.getElementById('registry-close').addEventListener('click', closeRegistryPuzzle);
  document.getElementById('registry-confirm').addEventListener('click', checkRegistry);
  document.getElementById('scene-close').addEventListener('click', closeScenePuzzle);
  document.getElementById('scene-confirm').addEventListener('click', checkScene);
  document.getElementById('customize-start').addEventListener('click', applyCustomization);
  setupColorSwatches('coat-colors', 'body');
  setupColorSwatches('detail-colors', 'detail');
  setupDragDrop();
  setupRadio();
  setupRegistry();
}

/** Collega i click dei color-swatch al gameState.playerColors */
export function setupColorSwatches(containerId, colorKey) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.addEventListener('click', (e) => {
    var swatch = e.target.closest('.color-swatch');
    if (!swatch) return;
    // Deselect all
    var all = container.querySelectorAll('.color-swatch');
    for (var i = 0; i < all.length; i++) {
      all[i].classList.remove('selected');
    }
    swatch.classList.add('selected');
    gameState.playerColors[colorKey] = swatch.getAttribute('data-color');
    renderCustomizePreview();
  });
}
