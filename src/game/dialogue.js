"use strict";

function startDialogue(npcId) {
  gameState.dialogueNpcId = npcId;
  gameState.previousPhase = gameState.gamePhase;
  gameState.gamePhase = 'dialogue';
  if (npcId === 'osvaldo' || npcId === 'gino') {
    gameState.dialogueTree = dialogueNodes[npcId + '_s0'];
  } else {
    var state = gameState.npcStates[npcId];
    // Teresa state 2: memoria instabile
    if (npcId === 'teresa' && state >= 2) {
      gameState.dialogueTree = dialogueNodes['teresa_s2_memory'];
    } else {
      var nodeKey = npcId + '_s' + state;
      var node = dialogueNodes[nodeKey];
      if (!node) node = dialogueNodes[npcId + '_s0'];
      gameState.dialogueTree = node;
    }
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
  var rawText = node.text;
  if (node.memoryCorrupt) {
    var html = '';
    for (var c = 0; c < rawText.length; c++) {
      var ch = rawText[c];
      if (ch === '%' || ch === '#' || ch === '@') {
        var corruptChars = '▓▒░█▄▀■□▪▫●○◘◙';
        var rnd = corruptChars[Math.floor(Math.random() * corruptChars.length)];
        html += '<span style="color:#cc4444;text-shadow:0 0 4px #cc4444;animation:glitchPulse 0.3s infinite alternate">' + rnd + '</span>';
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
