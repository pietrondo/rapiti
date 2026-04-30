/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * RENDER: Sprite Cache
 * Gestione cache per sprite sheet
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { SpriteGenerator } from '../game/spriteGenerator.js';

/**
 * Cache per sprite sheet
 */
export const spriteCache = {
  player: null,
  playerColors: null,
  npcs: {}
};

/**
 * Ottiene o crea lo sprite sheet del giocatore
 * @returns {HTMLCanvasElement} Sprite sheet del giocatore
 */
export function getOrCreatePlayerSheet(gameState) {
  if (!spriteCache.player || spriteCache.playerColors !== JSON.stringify(gameState.playerColors)) {
    spriteCache.playerColors = JSON.stringify(gameState.playerColors);
    const c = gameState.playerColors;
    spriteCache.player = SpriteGenerator.generatePlayerSheet({
      body: c.body,
      bodyLight: lighten(c.body, 15),
      bodyDark: darken(c.body, 20),
      detail: c.detail,
      detailLight: lighten(c.detail, 15),
      legs: c.legs,
      head: c.head,
      headShadow: darken(c.head, 15)
    });
  }
  return spriteCache.player;
}

/**
 * Ottiene o crea lo sprite sheet di un NPC
 * @param {string} npcId - ID del NPC
 * @param {Array} npcsData - Array dati NPC
 * @returns {HTMLCanvasElement|null} Sprite sheet del NPC
 */
export function getOrCreateNPCSheet(npcId, npcsData) {
  if (!spriteCache.npcs[npcId]) {
    let npcData = null;
    for (let i = 0; i < npcsData.length; i++) {
      if (npcsData[i].id === npcId) { 
        npcData = npcsData[i]; 
        break; 
      }
    }
    if (npcData) {
      spriteCache.npcs[npcId] = SpriteGenerator.generateNPCSheet(npcData);
    }
  }
  return spriteCache.npcs[npcId] || null;
}

/**
 * Svuota la cache
 */
export function clearSpriteCache() {
  spriteCache.player = null;
  spriteCache.playerColors = null;
  spriteCache.npcs = {};
}

/**
 * Schiarisci un colore hex
 * @param {string} hex - Colore in formato hex
 * @param {number} amount - Quantità di schiarimento
 * @returns {string} Colore schiarito
 */
export function lighten(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}

/**
 * Scurisci un colore hex
 * @param {string} hex - Colore in formato hex
 * @param {number} amount - Quantità di scurimento
 * @returns {string} Colore scurito
 */
export function darken(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);
  return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}
