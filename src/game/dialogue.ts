/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    DIALOGUE SYSTEM (TypeScript)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Gestisce i dialoghi con gli NPC e gli effetti post-scelta.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { Reward } from '../types.js';

/**
 * Avvia un dialogo con un NPC
 */
export function startDialogue(npcId: string): void {
  const gs = (window as any).gameState;
  const sm = (window as any).StoryManager;
  const dn = (window as any).dialogueNodes;

  gs.dialogueNpcId = npcId;
  gs.previousPhase = gs.gamePhase;
  gs.gamePhase = 'dialogue';

  // Usa StoryManager per determinare il nodo di dialogo
  const nodeKey = sm.getDialogueNodeForNPC(npcId);
  let node = dn[nodeKey];

  // Fallback se il nodo non esiste
  if (!node) {
    node = dn[`${npcId}_s0`];
  }

  gs.dialogueTree = node;

  // Registra che abbiamo parlato con questo NPC
  sm.onDialogueStarted(npcId);

  renderDialogueHTML();
  document.getElementById('dialogue-overlay')?.classList.add('active');
}

/**
 * Rende l'interfaccia HTML del dialogo
 */
export function renderDialogueHTML(): void {
  const gs = (window as any).gameState;
  const nd = (window as any).npcsData;
  const node = gs.dialogueTree;
  
  if (!node) {
    document.getElementById('dialogue-overlay')?.classList.remove('active');
    gs.gamePhase = gs.previousPhase || 'playing';
    return;
  }
  
  const npcId = gs.dialogueNpcId;
  const npcData = nd.find((n: any) => n.id === npcId);
  const npcName = npcData ? npcData.name : '???';
  
  const nameEl = document.getElementById('dialogue-npc-name');
  if (nameEl) nameEl.textContent = npcName;
  
  const textEl = document.getElementById('dialogue-text');
  if (textEl) {
    const rawText = node.text;
    if (node.memoryCorrupt) {
      let html = '';
      for (let c = 0; c < rawText.length; c++) {
        const ch = rawText[c];
        if (ch === '%' || ch === '#' || ch === '@') {
          const corruptChars = '▓▒░█▄▀■□▪▫●○◘◙';
          const rnd = corruptChars[Math.floor(Math.random() * corruptChars.length)];
          html += `<span style="color:#cc4444;text-shadow:0 0 4px #cc4444;animation:glitchPulse 0.3s infinite alternate">${rnd}</span>`;
        } else {
          html += ch;
        }
      }
      textEl.innerHTML = html;
    } else {
      textEl.textContent = rawText;
    }
  }
  
  const choicesDiv = document.getElementById('dialogue-choices');
  if (choicesDiv) {
    choicesDiv.innerHTML = '';
    if (node.choices && node.choices.length > 0) {
      for (let i = 0; i < node.choices.length; i++) {
        const ch = node.choices[i];
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = `${i + 1}. ${ch.text}`;
        btn.addEventListener('click', () => selectDialogueChoice(i));
        choicesDiv.appendChild(btn);
      }
    } else {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'choice-btn';
      closeBtn.textContent = '[Continua]';
      closeBtn.addEventListener('click', closeDialogue);
      choicesDiv.appendChild(closeBtn);
    }
  }
}

/**
 * Gestisce la selezione di una scelta
 */
export function selectDialogueChoice(index: number): void {
  const gs = (window as any).gameState;
  const dn = (window as any).dialogueNodes;
  const node = gs.dialogueTree;
  
  if (!node?.choices || index >= node.choices.length) return;
  
  const ch = node.choices[index];
  if (ch.effect) applyDialogueEffect(ch.effect);
  
  if (ch.next) {
    const nextNode = dn[ch.next];
    if (nextNode) {
      if (nextNode.effect) applyDialogueEffect(nextNode.effect);
      gs.dialogueTree = nextNode;
      renderDialogueHTML();
      return;
    }
  }
  closeDialogue();
}

/**
 * Applica gli effetti del dialogo (indizi, hint, flag)
 */
export function applyDialogueEffect(effect: any): void {
  const gs = (window as any).gameState;
  const sm = (window as any).StoryManager;
  const de = (window as any).dialogueEffects;

  if (effect.hint && effect.hint === 'chiesa' && de.hint_chiesa) {
    de.hint_chiesa();
  }
  
  if (effect.giveClue) {
    const cid = effect.giveClue;
    if (gs.cluesFound.indexOf(cid) === -1) {
      gs.cluesFound.push(cid);

      // Notifica StoryManager
      sm.onClueFound(cid);

      const action =
        cid === 'frammento'
          ? 'give_frammento'
          : cid === 'lettera_censurata'
            ? 'give_lettera'
            : null;
            
      if (action && de[action]) {
        de[action]();
      } else {
        (window as any).updateHUD();
        const cluesMap = (window as any).cluesMap;
        if (cluesMap && cluesMap[cid]) {
          (window as any).showToast(`Hai raccolto: ${cluesMap[cid].name}`);
        }
      }
    }
  }
  
  if (effect.giveClueHint) {
    if (effect.giveClueHint === 'diario_enzo' && de.hint_diario_enzo) de.hint_diario_enzo();
    if (effect.giveClueHint === 'mappa_campi' && de.hint_mappa) de.hint_mappa();
  }

  // Update Trust Levels from dialogue choice
  if (effect.addTrust) {
     for (const nid in effect.addTrust) {
        gs.npcTrust[nid] = (gs.npcTrust[nid] || 0) + effect.addTrust[nid];
        console.log(`[Dialogue] Trust added for ${nid}: +${effect.addTrust[nid]}`);
        const npcData = (window as any).npcsData.find((n: any) => n.id === nid);
        if (npcData) (window as any).showToast(`Fiducia di ${npcData.name} aumentata!`);
     }
  }
  if (effect.subTrust) {
     for (const nid in effect.subTrust) {
        gs.npcTrust[nid] = (gs.npcTrust[nid] || 0) - effect.subTrust[nid];
        console.log(`[Dialogue] Trust subtracted for ${nid}: -${effect.subTrust[nid]}`);
        const npcData = (window as any).npcsData.find((n: any) => n.id === nid);
        if (npcData) (window as any).showToast(`Fiducia di ${npcData.name} diminuita...`);
     }
  }

  // Aggiorna stati NPC tramite StoryManager
  sm.checkQuestProgress();

  // Mantieni retrocompatibilità
  if (typeof (window as any).updateNPCStates === 'function') {
    (window as any).updateNPCStates();
  }
}

/**
 * Chiude il pannello di dialogo
 */
export function closeDialogue(): void {
  const gs = (window as any).gameState;
  document.getElementById('dialogue-overlay')?.classList.remove('active');
  gs.gamePhase = gs.previousPhase || 'playing';
  gs.dialogueNpcId = null;
  gs.dialogueTree = null;
}

// Global exports for dynamic module loading compatibility
if (typeof window !== 'undefined') {
  (window as any).startDialogue = startDialogue;
  (window as any).closeDialogue = closeDialogue;
}
