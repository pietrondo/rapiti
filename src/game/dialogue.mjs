/**
 * Avvia un dialogo con un NPC
 * Usa StoryManager per determinare il nodo corretto
 */
export function startDialogue(npcId) {
  window.gameState.dialogueNpcId = npcId;
  window.gameState.previousPhase = window.gameState.gamePhase;
  window.gameState.gamePhase = 'dialogue';

  // Usa StoryManager per determinare il nodo di dialogo
  var nodeKey = StoryManager.getDialogueNodeForNPC(npcId);
  var node = dialogueNodes[nodeKey];

  // Fallback se il nodo non esiste
  if (!node) {
    node = dialogueNodes[`${npcId}_s0`];
  }

  window.gameState.dialogueTree = node;

  // Registra che abbiamo parlato con questo NPC
  StoryManager.onDialogueStarted(npcId);

  renderDialogueHTML();
  document.getElementById('dialogue-overlay').classList.add('active');
}

export function renderDialogueHTML() {
  var node = window.gameState.dialogueTree;
  if (!node) {
    document.getElementById('dialogue-overlay').classList.remove('active');
    window.gameState.gamePhase = window.gameState.previousPhase || 'playing';
    return;
  }
  var npcId = window.gameState.dialogueNpcId;
  var npcData = npcsData.find((n) => n.id === npcId);
  var npcName = npcData ? npcData.name : '???';
  document.getElementById('dialogue-npc-name').textContent = npcName;
  var rawText = node.text;
  if (node.memoryCorrupt) {
    var html = '';
    for (var c = 0; c < rawText.length; c++) {
      var ch = rawText[c];
      if (ch === '%' || ch === '#' || ch === '@') {
        var corruptChars = '▓▒░█▄▀■□▪▫●○◘◙';
        var rnd = corruptChars[Math.floor(Math.random() * corruptChars.length)];
        html +=
          '<span style="color:#cc4444;text-shadow:0 0 4px #cc4444;animation:glitchPulse 0.3s infinite alternate">' +
          rnd +
          '</span>';
      } else {
        html += ch;
      }
    }
    document.getElementById('dialogue-text').innerHTML = html;
  } else {
    document.getElementById('dialogue-text').textContent = rawText;
  }
  var choicesDiv = document.getElementById('dialogue-choices');
  choicesDiv.innerHTML = '';
  if (node.choices && node.choices.length > 0) {
    for (var i = 0; i < node.choices.length; i++) {
      var ch = node.choices[i];
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = `${i + 1}. ${ch.text}`;
      btn.addEventListener(
        'click',
        ((idx) => () => {
          selectDialogueChoice(idx);
        })(i)
      );
      choicesDiv.appendChild(btn);
    }
  } else {
    var closeBtn = document.createElement('button');
    closeBtn.className = 'choice-btn';
    closeBtn.textContent = '[Continua]';
    closeBtn.addEventListener('click', closeDialogue);
    choicesDiv.appendChild(closeBtn);
  }
}

export function selectDialogueChoice(index) {
  var node = window.gameState.dialogueTree;
  if (!node?.choices || index >= node.choices.length) return;
  var ch = node.choices[index];
  if (ch.effect) applyDialogueEffect(ch.effect);
  if (ch.next) {
    var nextNode = dialogueNodes[ch.next];
    if (nextNode) {
      if (nextNode.effect) applyDialogueEffect(nextNode.effect);
      window.gameState.dialogueTree = nextNode;
      renderDialogueHTML();
      return;
    }
  }
  closeDialogue();
}

export function applyDialogueEffect(effect) {
  if (effect.hint && effect.hint === 'chiesa') {
    window.dialogueEffects.hint_chiesa();
  }
  if (effect.giveClue) {
    var cid = effect.giveClue;
    if (window.gameState.cluesFound.indexOf(cid) === -1) {
      window.gameState.cluesFound.push(cid);

      // Notifica StoryManager
      StoryManager.onClueFound(cid);

      var action =
        cid === 'frammento'
          ? 'give_frammento'
          : cid === 'lettera_censurata'
            ? 'give_lettera'
            : null;
      if (action && window.dialogueEffects[action]) window.dialogueEffects[action]();
      else {
        window.updateHUD();
        window.showToast(`Hai raccolto: ${window.cluesMap[cid].name}`);
      }
    }
  }
  if (effect.giveClueHint) {
    if (effect.giveClueHint === 'diario_enzo') window.dialogueEffects.hint_diario_enzo();
    if (effect.giveClueHint === 'mappa_campi') window.dialogueEffects.hint_mappa();
  }

  // Aggiorna stati NPC tramite StoryManager
  window.StoryManager.checkQuestProgress();

  // Mantieni retrocompatibilità
  window.updateNPCStates();
}

export function closeDialogue() {
  document.getElementById('dialogue-overlay').classList.remove('active');
  window.gameState.gamePhase = window.gameState.previousPhase || 'playing';
  window.gameState.dialogueNpcId = null;
  window.gameState.dialogueTree = null;
}

// Global exports for dynamic module loading compatibility
if (typeof window !== 'undefined') {
  window.closeDialogue = closeDialogue;
}
