import { applyCustomization } from './customize.mjs';
import { checkDeduction, closeDeduction, setupDragDrop } from './deduction.mjs';
import { closeRadioPuzzle, setupRadio } from './radio.mjs';
import { checkRegistry, closeRegistryPuzzle, setupRegistry } from './registry.mjs';
import { checkScene, closeScenePuzzle } from './scene.mjs';
import { settingsManager } from './settings.ts';

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
      a.download = `sanceleste_save_${new Date().toISOString().slice(0,10)}.json`;
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

/** Rende i tasti di salvataggio nel menu */
export function renderSaveSlots() {
  var container = document.getElementById('save-slots-container');
  if (!container) return;
  container.innerHTML = '';

  var saves = window.saveLoad.getAllSaves();

  saves.forEach(s => {
    var slotEl = document.createElement('div');
    slotEl.className = 'save-slot' + (s.exists ? '' : ' empty') + (s.slot === 'autosave' ? ' autosave' : '');
    
    var info = document.createElement('div');
    info.className = 'slot-info';
    
    var name = document.createElement('div');
    name.className = 'slot-name';
    var icon = s.slot === 'autosave' ? '🕒 ' : '💾 ';
    var label = s.slot === 'autosave' ? 'Autosave' : `Slot ${s.slot.replace('slot','')}`;
    name.textContent = s.exists ? (s.meta?.name || label) : `Slot ${s.slot.replace('slot','')} (Vuoto)`;
    if (s.slot === 'autosave' && !s.exists) return; // Non mostrare autosave se vuoto

    name.innerHTML = icon + name.textContent;
    
    var meta = document.createElement('div');
    meta.className = 'slot-meta';
    if (s.exists) {
      var date = new Date(s.timestamp).toLocaleString();
      var areaName = s.meta?.area || 'Area sconosciuta';
      var pct = s.meta?.completionPct;
      var pctStr = pct !== undefined ? ` | ${pct}% completato` : '';
      meta.textContent = `${areaName} — ${date}${pctStr}`;
    } else {
      meta.textContent = 'Nessun dato salvato';
    }
    
    info.appendChild(name);
    info.appendChild(meta);
    
    var actions = document.createElement('div');
    actions.className = 'slot-actions';
    
    if (s.slot !== 'autosave') {
      var saveBtn = document.createElement('button');
      saveBtn.className = 'btn-slot';
      saveBtn.textContent = 'SALVA';
      saveBtn.onclick = (e) => { e.stopPropagation(); handleSave(s.slot); };
      actions.appendChild(saveBtn);
    }
    
    if (s.exists) {
      var loadBtn = document.createElement('button');
      loadBtn.className = 'btn-slot';
      loadBtn.textContent = 'CARICA';
      loadBtn.onclick = (e) => { e.stopPropagation(); handleLoad(s.slot); };
      actions.appendChild(loadBtn);
      
      if (s.slot !== 'autosave') {
        var delBtn = document.createElement('button');
        delBtn.className = 'btn-slot delete';
        delBtn.textContent = 'ELIMINA';
        delBtn.onclick = (e) => { e.stopPropagation(); handleDelete(s.slot); };
        actions.appendChild(delBtn);
      }
    }
    
    slotEl.appendChild(info);
    slotEl.appendChild(actions);
    container.appendChild(slotEl);
  });
}

function handleSave(slot) {
  if (window.saveLoad.hasSave(slot)) {
    if (!confirm('Sovrascrivere il salvataggio esistente?')) return;
  }
  window.saveLoad.save(slot);
  renderSaveSlots();
}

function handleLoad(slot) {
  if (window.saveLoad.load(slot)) {
    closePanels();
    updateHUD();
    if (window.pixiRenderer) window.pixiRenderer.syncState?.();
  }
}

function handleDelete(slot) {
  if (confirm('Eliminare definitivamente questo salvataggio?')) {
    window.saveLoad.deleteSave(slot);
    renderSaveSlots();
  }
}

/** Apre il menu salvataggi */
export function openSaveMenu() {
  window.gameState.gamePhase = 'save';
  renderSaveSlots();
  document.getElementById('save-overlay').classList.add('active');
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

  var name = window.t ? window.t(`clue.${id}.name`) : (typeof clue === 'string' ? clue : clue.name);
  if (!name || name === `[clue.${id}.name]`) {
    name = typeof clue === 'string' ? clue : clue.name;
  }

  showToast('toast.clue_found', { name: name });

  // Notifica StoryManager
  if (typeof StoryManager !== 'undefined') {
    StoryManager.onClueFound(id);
  }

  updateHUD();
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

/** Rende l'inventario HTML */
export function renderInventory() {
  var content = document.getElementById('inventory-content');
  if (!content) return;
  content.innerHTML = '';

  var clues = window.gameState.cluesFound;
  if (clues.length === 0) {
    content.innerHTML =
      '<p style="text-align:center;color:#6b7b6b;padding:20px">Nessun oggetto raccolto.</p>';
    return;
  }

  for (var i = 0; i < clues.length; i++) {
    var id = clues[i];
    var name = window.t ? window.t(`clue.${id}.name`) : id;
    var desc = window.t ? window.t(`clue.${id}.desc`) : '';

    var item = document.createElement('div');
    item.className = 'inventory-item';
    item.style.cssText =
      'background:rgba(255,255,255,0.05);margin:8px;padding:10px;border:1px solid #444;border-radius:4px';

    var h3 = document.createElement('h3');
    h3.style.cssText = 'color:#d4a843;margin:0 0 4px 0';
    h3.textContent = name;

    var p = document.createElement('p');
    p.style.cssText = 'font-size:11px;margin:0;color:#aaa';
    p.textContent = desc;

    item.appendChild(h3);
    item.appendChild(p);
    content.appendChild(item);
  }
}

/** Rende il diario HTML */
export function renderJournal() {
  var content = document.getElementById('journal-content');
  if (!content) return;
  content.innerHTML = '';

  // ... Logica per le note del diario (da implementare se presenti)
  content.innerHTML =
    '<p style="text-align:center;color:#6b7b6b;padding:20px">Il diario di Maurizio contiene gli appunti dell\'indagine.</p>';
}

/** Apre il diario */
export function openJournal() {
  renderJournal();
  document.getElementById('journal-overlay').classList.add('active');
}

/** Apre l'inventario */
export function openInventory() {
  renderInventory();
  document.getElementById('inventory-overlay').classList.add('active');
}

/** Rende i livelli di fiducia NPC */
export function renderTrust() {
  var content = document.getElementById('trust-content');
  if (!content) return;
  content.innerHTML = '';

  var trust = window.gameState.npcTrust;
  var npcs = window.npcsData;

  for (var nid in trust) {
    var npc = npcs.find((n) => n.id === nid);
    var name = npc ? npc.name : nid;
    var value = trust[nid];

    var item = document.createElement('div');
    item.className = 'trust-item';
    item.style.cssText =
      'margin:12px;background:rgba(0,0,0,0.2);padding:10px;border-radius:4px;border-left:4px solid ' +
      (value >= 0 ? '#4CAF50' : '#F44336');

    var header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';

    var nameSpan = document.createElement('span');
    nameSpan.style.color = '#E8DCC8';
    nameSpan.style.fontWeight = 'bold';
    nameSpan.textContent = name;

    var trustSpan = document.createElement('span');
    trustSpan.style.color = '#D4A843';
    trustSpan.textContent = `Fiducia: ${value}`;

    header.appendChild(nameSpan);
    header.appendChild(trustSpan);

    var barBg = document.createElement('div');
    barBg.style.cssText = 'background:#222;height:4px;margin-top:6px;position:relative';

    var barFill = document.createElement('div');
    barFill.style.background = value >= 0 ? '#4CAF50' : '#F44336';
    barFill.style.height = '100%';
    barFill.style.width = `${Math.min(100, Math.abs(value) * 10)}%`;

    barBg.appendChild(barFill);
    item.appendChild(header);
    item.appendChild(barBg);
    content.appendChild(item);
  }
}

/** Apre il pannello fiducia */
export function openTrust() {
  renderTrust();
  document.getElementById('trust-overlay').classList.add('active');
}

/** Chiude pannelli aperti */
export function closePanels() {
  document.getElementById('journal-overlay').classList.remove('active');
  document.getElementById('inventory-overlay').classList.remove('active');
  document.getElementById('save-overlay').classList.remove('active');
  document.getElementById('settings-overlay').classList.remove('active');
  if (document.getElementById('trust-overlay'))
    document.getElementById('trust-overlay').classList.remove('active');

  if (['journal', 'inventory', 'save', 'settings'].includes(window.gameState.gamePhase)) {
    window.gameState.gamePhase = 'playing';
  }
}

/** Aggiorna UI del pannello impostazioni */
export function updateSettingsUI() {
  const sm = window.settingsManager;
  if (!sm) return;

  document.getElementById('btn-toggle-fs').textContent = sm.get('fullscreen') ? 'ON' : 'OFF';
  document.getElementById('select-lang').value = sm.get('language');
  document.getElementById('btn-toggle-audio').textContent = sm.get('audioEnabled') ? 'ON' : 'OFF';
  document.getElementById('range-volume').value = sm.get('musicVolume');
  document.getElementById('btn-toggle-map').textContent = sm.get('miniMapEnabled') ? 'ON' : 'OFF';
}

/** Apre il menu impostazioni */
export function openSettings() {
  window.gameState.gamePhase = 'settings';
  updateSettingsUI();
  document.getElementById('settings-overlay').classList.add('active');
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
      cluesEl.textContent = 'Indizi: ' + window.gameState.cluesFound.length + '/9';
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
