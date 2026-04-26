"use strict";

/* ══════════════════════════════════════════════════════════════
   SEZIONE 7: DIALOGHI
   ══════════════════════════════════════════════════════════════ */

function startDialogue(npcId) {
  gameState.dialogueNpcId = npcId;
  gameState.previousPhase = gameState.gamePhase;
  gameState.gamePhase = 'dialogue';
  // Osvaldo e Gino hanno solo stato 0
  if (npcId === 'osvaldo' || npcId === 'gino') {
    gameState.dialogueTree = dialogueNodes[npcId + '_s0'];
  } else {
    var state = gameState.npcStates[npcId];
    var nodeKey = npcId + '_s' + state;
    var node = dialogueNodes[nodeKey];
    if (!node) node = dialogueNodes[npcId + '_s0'];
    gameState.dialogueTree = node;
  }
  renderDialogueHTML();
  document.getElementById('dialogue-overlay').classList.add('active');
}

function renderDialogueHTML() {
  var node = gameState.dialogueTree;
  if (!node) {
    document.getElementById('dialogue-overlay').classList.remove('active');
    gameState.gamePhase = gameState.previousPhase || 'playing';
    return;
  }
  var npcId = gameState.dialogueNpcId;
  var npcData = npcsData.find(function(n) { return n.id === npcId; });
  var npcName = npcData ? npcData.name : '???';
  document.getElementById('dialogue-npc-name').textContent = npcName;
  document.getElementById('dialogue-text').textContent = node.text;
  var choicesDiv = document.getElementById('dialogue-choices');
  choicesDiv.innerHTML = '';
  if (node.choices && node.choices.length > 0) {
    for (var i = 0; i < node.choices.length; i++) {
      var ch = node.choices[i];
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = (i + 1) + '. ' + ch.text;
      btn.addEventListener('click', (function(idx) {
        return function() { selectDialogueChoice(idx); };
      })(i));
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

function selectDialogueChoice(index) {
  var node = gameState.dialogueTree;
  if (!node || !node.choices || index >= node.choices.length) return;
  var ch = node.choices[index];
  if (ch.effect) applyDialogueEffect(ch.effect);
  if (ch.next) {
    var nextNode = dialogueNodes[ch.next];
    if (nextNode) {
      if (nextNode.effect) applyDialogueEffect(nextNode.effect);
      gameState.dialogueTree = nextNode;
      renderDialogueHTML();
      return;
    }
  }
  closeDialogue();
}

function applyDialogueEffect(effect) {
  if (effect.hint && effect.hint === 'archivio') { dialogueEffects.hint_archivio(); }
  if (effect.giveClue) {
    var cid = effect.giveClue;
    if (gameState.cluesFound.indexOf(cid) === -1) {
      gameState.cluesFound.push(cid);
      var action = cid === 'frammento' ? 'give_frammento' : cid === 'lettera_censurata' ? 'give_lettera' : null;
      if (action && dialogueEffects[action]) dialogueEffects[action]();
      else { updateHUD(); showToast('Hai raccolto: ' + cluesMap[cid].name); }
    }
  }
  if (effect.giveClueHint) {
    if (effect.giveClueHint === 'diario_enzo') dialogueEffects.hint_diario_enzo();
    if (effect.giveClueHint === 'mappa_campi') dialogueEffects.hint_mappa();
  }
  updateNPCStates();
}

function closeDialogue() {
  document.getElementById('dialogue-overlay').classList.remove('active');
  gameState.gamePhase = gameState.previousPhase || 'playing';
  gameState.dialogueNpcId = null;
  gameState.dialogueTree = null;
}
