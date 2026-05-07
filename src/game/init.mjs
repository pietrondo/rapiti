import { applyCustomization } from './customize.mjs';
import { checkDeduction, closeDeduction, setupDragDrop } from './deduction.mjs';
import { closePanels, openInventory, openJournal, openSettings } from './panelRenderer.mjs';
import { closeRadioPuzzle, setupRadio } from './radio.mjs';
import { checkRegistry, closeRegistryPuzzle, setupRegistry } from './registry.mjs';
import { openSaveMenu, renderSaveSlots } from './saveSlots.mjs';
import { checkScene, closeScenePuzzle } from './scene.mjs';

export { closePanels, openInventory, openJournal, openSaveMenu, openSettings };

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
  // Inizializza Settings (TypeScript)
  if (window.settingsManager) {
    window.settingsManager.load();
    window.settingsManager.apply();
  }

  // Inizializza InputManager (TypeScript)
  if (window.inputManager && typeof window.inputManager.init === 'function') {
    window.inputManager.init();
  }

  document.getElementById('journal-close').addEventListener('click', closePanels);
  document.getElementById('inventory-close').addEventListener('click', closePanels);
  document.getElementById('save-close').addEventListener('click', closePanels);
  document.getElementById('settings-close').addEventListener('click', closePanels);
  document.getElementById('settings-back').addEventListener('click', closePanels);
  document.getElementById('trust-close').addEventListener('click', closePanels);
  document.getElementById('deduction-close').addEventListener('click', closeDeduction);
  document.getElementById('deduction-confirm').addEventListener('click', checkDeduction);
  document.getElementById('radio-close').addEventListener('click', closeRadioPuzzle);
  document.getElementById('registry-close').addEventListener('click', closeRegistryPuzzle);
  document.getElementById('registry-confirm').addEventListener('click', checkRegistry);
  document.getElementById('scene-close').addEventListener('click', closeScenePuzzle);
  document.getElementById('scene-confirm').addEventListener('click', checkScene);
  document.getElementById('customize-start').addEventListener('click', applyCustomization);

  document.getElementById('btn-export-json').addEventListener('click', () => {
    const data = window.saveLoad.exportSave('slot1'); // Export slot1 by default
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sanceleste_save_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
    }
  });

  document.getElementById('btn-import-json').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (re) => {
        if (window.saveLoad.importSave(re.target.result, 'slot1')) {
          showToast('Salvataggio importato nello Slot 1');
          renderSaveSlots();
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });

  document.getElementById('btn-switch-lang').addEventListener('click', () => {
    const next = window.i18n.getLocale() === 'it' ? 'en' : 'it';
    window.i18n.setLocale(next);
    document.getElementById('btn-switch-lang').textContent = next === 'it' ? 'English' : 'Italiano';
    if (window.settingsManager) window.settingsManager.set('language', next);
    renderSaveSlots();
    updateHUD();
  });

  // Settings UI Events
  document.getElementById('btn-toggle-fs').addEventListener('click', () => {
    window.settingsManager.toggleFullscreen();
    updateSettingsUI();
  });

  document.getElementById('select-lang').addEventListener('change', (e) => {
    window.settingsManager.set('language', e.target.value);
    updateHUD();
  });

  document.getElementById('btn-toggle-audio').addEventListener('click', () => {
    const next = !window.settingsManager.get('audioEnabled');
    window.settingsManager.set('audioEnabled', next);
    updateSettingsUI();
  });

  document.getElementById('range-volume').addEventListener('input', (e) => {
    window.settingsManager.set('musicVolume', parseFloat(e.target.value));
  });

  document.getElementById('btn-toggle-map').addEventListener('click', () => {
    const next = !window.settingsManager.get('miniMapEnabled');
    window.settingsManager.set('miniMapEnabled', next);
    updateSettingsUI();
  });

  setupColorSwatches('coat-colors', 'body');
  setupColorSwatches('detail-colors', 'detail');
  setupDragDrop();
  setupRadio();
  setupRegistry();
}

/** Stub — mostra un messaggio toast temporaneo */
export function showToast(msg, params) {
  var toast = document.getElementById('toast');
  if (!toast) return;

  // Se msg è una chiave i18n, la traduce
  var localizedMsg = msg;
  if (msg.indexOf('.') > 0) {
    localizedMsg = window.t ? window.t(msg, params) : msg;
  }

  toast.textContent = localizedMsg;
  toast.classList.add('active');

  // Visual juice: small shake when toast appears
  if (window.ScreenShake) window.ScreenShake.shake(1, 5);

  setTimeout(() => {
    toast.classList.remove('active');
  }, 2500);
}

/** Implementazione reale di collectClue con Juice */
export function collectClue(clue) {
  var id = typeof clue === 'string' ? clue : clue.id;
  if (window.gameState.cluesFound.indexOf(id) >= 0) return;

  window.gameState.cluesFound.push(id);

  // Juice: Screen Shake + Particles + Discovery Jump
  if (window.ScreenShake) window.ScreenShake.shake(2.5, 12);
  window.gameState.player.discoveryJump = 20; // Timer per l'effetto jump

  if (window.ParticleSystem) {
    var p = window.gameState.player;
    window.ParticleSystem.createSparkles(p.x + 16, p.y + 8, '#FFD700');
  }

  var name = window.t ? window.t(`clue.${id}.name`) : typeof clue === 'string' ? clue : clue.name;
  if (!name || name === `[clue.${id}.name]`) {
    name = typeof clue === 'string' ? clue : clue.name;
  }

  showToast('toast.clue_found', { name: name });
  window.playSFX?.('clue_found');

  // Notifica StoryManager
  if (typeof StoryManager !== 'undefined') {
    StoryManager.onClueFound(id);
  }

  updateHUD();
  updateNPCStates();
}

function getInteractiveObjects() {
  return window.areaObjects?.[window.gameState.currentArea] || [];
}

function canInteractWithObject(o) {
  if (!o.requires) return true;
  return window.gameState.cluesFound.indexOf(o.requires) >= 0;
}

/** Gestisce interazione con oggetti/NPC con feedback migliorato */
export function handleInteract() {
  // 1. Controlla prima le uscite manuali (Porte)
  if (window.triggerInteractExit?.()) {
    return;
  }

  var p = window.gameState.player;
  var area = window.areas[window.gameState.currentArea];
  if (!area) return;

  // 2. Controlla NPC
  if (area.npcs) {
    for (var i = 0; i < area.npcs.length; i++) {
      var n = area.npcs[i];
      var dist = Math.sqrt((p.x + 16 - n.x) ** 2 + (p.y - n.y) ** 2);
      if (dist < 25) {
        if (window.startDialogue) {
          window.startDialogue(n.id);
          return;
        }
      }
    }
  }

  // 2. Controlla Oggetti/Indizi
  var objects = getInteractiveObjects();
  if (objects.length > 0) {
    for (var j = 0; j < objects.length; j++) {
      var o = objects[j];
      if (window.gameState.cluesFound.indexOf(o.id) >= 0) continue;
      if (!canInteractWithObject(o)) continue;

      // Collisione rettangolare semplice
      if (
        p.x + 24 > o.x &&
        p.x + 8 < o.x + (o.w || 20) &&
        p.y + 16 > o.y &&
        p.y - 8 < o.y + (o.h || 20)
      ) {
        if (o.type === 'radio' && window.openRadioPuzzle) {
          window.openRadioPuzzle();
        } else if (o.type === 'recorder' && window.openRecorderPuzzle) {
          window.openRecorderPuzzle();
        } else if (o.type === 'scene' && window.openScenePuzzle) {
          collectClue(o);
          // Se ha raccolto abbastanza indizi scena, apre il puzzle
          var sceneClues = ['scena_lanterna', 'scena_impronte', 'scena_segni'];
          var foundCount = 0;
          for (var k = 0; k < sceneClues.length; k++) {
            if (window.gameState.cluesFound.indexOf(sceneClues[k]) >= 0) foundCount++;
          }
          if (foundCount >= 3) window.openScenePuzzle();
        } else {
          collectClue(o);
        }
        return;
      }
    }
  }

  // 3. Controlla Porte/Uscite interattive
  if (area.exits) {
    for (var k = 0; k < area.exits.length; k++) {
      var ex = area.exits[k];
      if (ex.requiresInteract) {
        // Logica delegata a transition.mjs se necessario
      }
    }
  }
}

/** Aggiorna HUD con i18n */
export function updateHUD() {
  var areaEl = document.getElementById('hud-area');
  if (areaEl) {
    var areaId = window.gameState.currentArea;
    var areaName = window.t ? window.t(`area.${areaId}`) : areaId;
    if (!areaName || areaName === `[area.${areaId}]`) areaName = areaId;
    areaEl.textContent = window.t ? window.t('hud.area', { area: areaName }) : areaName;
  }
  var cluesEl = document.getElementById('hud-clues');
  if (cluesEl) {
    if (window.t) {
      cluesEl.textContent = window.t('hud.clues', {
        found: window.gameState.cluesFound.length,
        total: 9,
      });
    } else {
      cluesEl.textContent = `Indizi: ${window.gameState.cluesFound.length}/9`;
    }
  }
  var timeEl = document.getElementById('hud-time');
  if (timeEl) {
    var totalMinutes = Math.floor(window.gameState.gameTime || 0);
    var hours = Math.floor(totalMinutes / 60) % 24;
    var minutes = totalMinutes % 60;
    timeEl.textContent = `${(hours < 10 ? '0' : '') + hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }
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
  window.renderSaveSlots = renderSaveSlots;
  window.openSaveMenu = openSaveMenu;
  window.updateNPCStates = updateNPCStates;
}

/** Aggiorna stati NPC dopo raccolta indizi o completamento puzzle */
export function updateNPCStates() {
  var gs = window.gameState;
  var clues = gs.cluesFound || [];
  var puzzles = gs.puzzlesSolved || {};

  // Clue → NPC s1 mapping
  var clueToNpcS1 = {
    lettera_censurata: 'ruggeri',
    registro_1861: 'neri',
    simboli_portone: 'teresa',
    radio_audio: 'anselmo',
    frammento: 'valli',
    giornale_1952: 'osvaldo',
    registro_monte_ferro: 'neri',
  };

  // Puzzle → NPC s2 mapping
  var puzzleToNpcS2 = {
    deduction: 'ruggeri',
    registry: 'neri',
    scene: 'teresa',
    radio: 'osvaldo',
    recorder: 'valli',
  };

  // Aggiorna s1 per indizi raccolti
  for (var clueId in clueToNpcS1) {
    if (clues.indexOf(clueId) >= 0) {
      var npc = clueToNpcS1[clueId];
      if (gs.npcStates[npc] !== undefined && gs.npcStates[npc] < 1) {
        gs.npcStates[npc] = 1;
      }
    }
  }

  // Aggiorna s2 per puzzle risolti
  for (var puzzleId in puzzleToNpcS2) {
    if (puzzles[puzzleId]) {
      var npc2 = puzzleToNpcS2[puzzleId];
      if (gs.npcStates[npc2] !== undefined && gs.npcStates[npc2] < 2) {
        gs.npcStates[npc2] = 2;
      }
    }
  }

  // Teresa s2 speciale (memoria instabile) quando scene risolto
  if (puzzles.scene && gs.npcStates.teresa < 2) {
    gs.npcStates.teresa = 2;
  }
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
