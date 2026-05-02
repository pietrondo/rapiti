import { handleKeyDown, handleKeyUp } from './input.ts';
import { closeDeduction, checkDeduction, setupDragDrop } from './deduction.mjs';
import { closeRadioPuzzle, setupRadio } from './radio.mjs';
import { closeRegistryPuzzle, checkRegistry, setupRegistry } from './registry.mjs';
import { closeScenePuzzle, checkScene } from './scene.mjs';
import { applyCustomization } from './customize.mjs';

export function initCanvas() {
  var c = document.getElementById('gameCanvas');
  c.width = window.CANVAS_W * 2;
  c.height = window.CANVAS_H * 2;
  return c.getContext('2d');
}

function closeJournal() {
  document.getElementById('journal-overlay').classList.remove('active');
}

function closeInventory() {
  document.getElementById('inventory-overlay').classList.remove('active');
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

/** Stub — mostra un messaggio toast temporaneo */
export function showToast(msg) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('active');
  setTimeout(function () {
    toast.classList.remove('active');
  }, 2500);
}

/** Stub — gestisce interazione con oggetti/NPC */
export function handleInteract() {
  console.log('[Interact] Interazione non ancora implementata');
}

/** Stub — apre il diario */
export function openJournal() {
  document.getElementById('journal-overlay').classList.add('active');
}

/** Stub — apre l'inventario */
export function openInventory() {
  document.getElementById('inventory-overlay').classList.add('active');
}

/** Stub — chiude pannelli aperti */
export function closePanels() {
  document.getElementById('journal-overlay').classList.remove('active');
  document.getElementById('inventory-overlay').classList.remove('active');
}

// Global exports for dynamic module loading compatibility
if (typeof window !== 'undefined') {
  window.initCanvas = initCanvas;
  window.initEventListeners = initEventListeners;
  window.setupColorSwatches = setupColorSwatches;
  window.setupDragDrop = setupDragDrop;
  window.setupRadio = setupRadio;
  window.setupRegistry = setupRegistry;
  window.showToast = showToast;
  window.handleInteract = handleInteract;
  window.openJournal = openJournal;
  window.openInventory = openInventory;
  window.closePanels = closePanels;
  window.closeJournal = closeJournal;
  window.closeInventory = closeInventory;
  window.updateNPCStates = updateNPCStates;
}

/** Stub — aggiorna stati NPC dopo puzzle/dialogo */
export function updateNPCStates() {
  console.log('[updateNPCStates] Stub — nessun aggiornamento NPC');
}

/** Collega i click dei color-swatch al window.gameState.playerColors */
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
    window.gameState.playerColors[colorKey] = swatch.getAttribute('data-color');
    renderCustomizePreview();
  });
}
