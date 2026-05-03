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
export function showToast(msg, params) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  
  // Se msg è una chiave i18n, la traduce
  var localizedMsg = msg;
  if (msg.indexOf('.') > 0) {
    localizedMsg = window.t(msg, params);
  }
  
  toast.textContent = localizedMsg;
  toast.classList.add('active');
  
  // Visual juice: small shake when toast appears
  if (window.ScreenShake) window.ScreenShake.shake(1, 5);
  
  setTimeout(function () {
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
  
  var name = window.t('clue.' + id + '.name');
  if (name === '[' + 'clue.' + id + '.name' + ']') {
    name = typeof clue === 'string' ? clue : clue.name;
  }
  
  showToast('toast.clue_found', { name: name });
  
  // Notifica StoryManager
  if (typeof StoryManager !== 'undefined') {
    StoryManager.onClueFound(id);
  }
  
  updateHUD();
}

function getInteractiveObjects(area) {
  var areaObjects = window.areaObjects?.[window.gameState.currentArea] || [];
  var legacyObjects = area.objects || [];
  return legacyObjects.concat(areaObjects);
}

function canInteractWithObject(o) {
  if (!o.requires) return true;
  return window.gameState.cluesFound.indexOf(o.requires) >= 0;
}

/** Gestisce interazione con oggetti/NPC con feedback migliorato */
export function handleInteract() {
  // 1. Controlla prima le uscite manuali (Porte)
  if (window.triggerInteractExit && window.triggerInteractExit()) {
     return;
  }

  var p = window.gameState.player;
  var area = window.areas[window.gameState.currentArea];
  if (!area) return;

  // 2. Controlla NPC
  if (area.npcs) {
    for (var i = 0; i < area.npcs.length; i++) {
      var n = area.npcs[i];
      var dist = Math.sqrt(Math.pow(p.x + 16 - n.x, 2) + Math.pow(p.y - n.y, 2));
      if (dist < 25) {
        if (window.startDialogue) {
          window.startDialogue(n.id);
          return;
        }
      }
    }
  }

  // 2. Controlla Oggetti/Indizi
  var objects = getInteractiveObjects(area);
  if (objects.length > 0) {
    for (var j = 0; j < objects.length; j++) {
      var o = objects[j];
      if (window.gameState.cluesFound.indexOf(o.id) >= 0) continue;
      if (!canInteractWithObject(o)) continue;
      
      // Collisione rettangolare semplice
      if (p.x + 24 > o.x && p.x + 8 < o.x + (o.w || 20) &&
          p.y + 16 > o.y && p.y - 8 < o.y + (o.h || 20)) {
        
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
    content.innerHTML = '<p style="text-align:center;color:#6b7b6b;padding:20px">Nessun oggetto raccolto.</p>';
    return;
  }
  
  for (var i = 0; i < clues.length; i++) {
    var id = clues[i];
    var name = window.t('clue.' + id + '.name');
    var desc = window.t('clue.' + id + '.desc');
    
    var item = document.createElement('div');
    item.className = 'inventory-item';
    item.style.cssText = 'background:rgba(255,255,255,0.05);margin:8px;padding:10px;border:1px solid #444;border-radius:4px';
    item.innerHTML = `<h3 style="color:#d4a843;margin:0 0 4px 0">${name}</h3><p style="font-size:11px;margin:0;color:#aaa">${desc}</p>`;
    content.appendChild(item);
  }
}

/** Rende il diario HTML */
export function renderJournal() {
  var content = document.getElementById('journal-content');
  if (!content) return;
  content.innerHTML = '';
  
  // ... Logica per le note del diario (da implementare se presenti)
  content.innerHTML = '<p style="text-align:center;color:#6b7b6b;padding:20px">Il diario di Maurizio contiene gli appunti dell\'indagine.</p>';
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
    var npc = npcs.find(n => n.id === nid);
    var name = npc ? npc.name : nid;
    var value = trust[nid];
    
    var item = document.createElement('div');
    item.className = 'trust-item';
    item.style.cssText = 'margin:12px;background:rgba(0,0,0,0.2);padding:10px;border-radius:4px;border-left:4px solid ' + (value >= 0 ? '#4CAF50' : '#F44336');
    item.innerHTML = `<div style="display:flex;justify-content:space-between">
      <span style="color:#E8DCC8;font-weight:bold">${name}</span>
      <span style="color:#D4A843">Fiducia: ${value}</span>
    </div>
    <div style="background:#222;height:4px;margin-top:6px;position:relative">
      <div style="background:${value >= 0 ? '#4CAF50' : '#F44336'};height:100%;width:${Math.min(100, Math.abs(value) * 10)}%"></div>
    </div>`;
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
  if (document.getElementById('trust-overlay')) document.getElementById('trust-overlay').classList.remove('active');
}

/** Aggiorna HUD con i18n */
export function updateHUD() {
  var areaEl = document.getElementById('hud-area');
  if (areaEl) {
    var areaName = window.gameState.currentArea;
    areaEl.textContent = window.t('hud.area', { area: areaName });
  }
  var cluesEl = document.getElementById('hud-clues');
  if (cluesEl) {
    cluesEl.textContent = window.t('hud.clues', { 
      found: window.gameState.cluesFound.length, 
      total: 9 
    });
  }
  var timeEl = document.getElementById('hud-time');
  if (timeEl) {
    var totalMinutes = Math.floor(window.gameState.gameTime || 0);
    var hours = Math.floor(totalMinutes / 60) % 24;
    var minutes = totalMinutes % 60;
    timeEl.textContent = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
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
