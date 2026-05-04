/* ══════════════════════════════════════════════════════════════
   SCENE INVESTIGATION PUZZLE — Cascina
   ══════════════════════════════════════════════════════════════ */

const sceneElements = [
  {
    id: 'scena_lanterna',
    name: 'Lanterna rotta',
    desc: "Caduta a terra, vetro rotto. Qualcuno l'ha lasciata cadere di corsa.",
  },
  {
    id: 'scena_impronte',
    name: 'Impronte nel fango',
    desc: 'Impronte che girano in cerchio, poi tornano indietro. Movimento circolare.',
  },
  {
    id: 'scena_segni',
    name: 'Segni nel terreno',
    desc: 'Cerchi perfetti nel grano. Il centro è sprofondato di qualche centimetro.',
  },
];

let sceneFound = [];
var _sceneSolved = false;

export function openScenePuzzle() {
  if (window.gameState.gamePhase !== 'playing') return;
  window.gameState.previousPhase = 'playing';
  window.gameState.gamePhase = 'scene';

  // Popola elementi trovati
  var foundDiv = document.getElementById('scene-elements');
  foundDiv.innerHTML = '';
  sceneFound = [];
  for (var i = 0; i < sceneElements.length; i++) {
    if (window.gameState.cluesFound.indexOf(sceneElements[i].id) >= 0) {
      sceneFound.push(sceneElements[i]);
      var el = document.createElement('div');
      el.style.cssText = 'color:#44cc44;font-size:12px;margin:4px 0';
      el.textContent = `✓ ${sceneElements[i].name}`;
      foundDiv.appendChild(el);
    }
  }

  // Popola select
  var selects = ['scene-slot1', 'scene-slot2', 'scene-slot3'];
  for (var s = 0; s < selects.length; s++) {
    var sel = document.getElementById(selects[s]);
    sel.innerHTML = '<option value="">---</option>';
    for (var e = 0; e < sceneFound.length; e++) {
      var opt = document.createElement('option');
      opt.value = sceneFound[e].id;
      opt.textContent = sceneFound[e].name;
      sel.appendChild(opt);
    }
    sel.addEventListener('change', updateSceneConfirm);
  }

  document.getElementById('scene-confirm').disabled = true;
  document.getElementById('scene-result').textContent = '';
  document.getElementById('scene-overlay').classList.add('active');
}

export function closeScenePuzzle() {
  document.getElementById('scene-overlay').classList.remove('active');
  window.gameState.gamePhase = 'playing';
}

// Global exports for dynamic module loading compatibility
if (typeof window !== 'undefined') {
  window.openScenePuzzle = openScenePuzzle;
  window.closeScenePuzzle = closeScenePuzzle;
  window.checkScene = checkScene;
}

export function updateSceneConfirm() {
  var s1 = document.getElementById('scene-slot1').value;
  var s2 = document.getElementById('scene-slot2').value;
  var s3 = document.getElementById('scene-slot3').value;
  document.getElementById('scene-confirm').disabled = !(s1 && s2 && s3);
}

export function checkScene() {
  var s1 = document.getElementById('scene-slot1').value;
  var s2 = document.getElementById('scene-slot2').value;
  var s3 = document.getElementById('scene-slot3').value;
  // Soluzione: Lanterna = partenza, Impronte = movimento, Segni = arrivo
  var correct = s1 === 'scena_lanterna' && s2 === 'scena_impronte' && s3 === 'scena_segni';
  var result = document.getElementById('scene-result');
  if (correct) {
    window.gameState.puzzlesSolved.scene = true;
    result.textContent = '✓ Elena non stava scappando. Stava tornando verso qualcosa.';
    result.style.color = '#44cc44';
    document.getElementById('scene-confirm').disabled = true;
    window.showToast('Scena ricostruita! Parla con Teresa nella stanza della cascina.');

    // Notifica StoryManager
    StoryManager.onPuzzleSolved('scene');

    // Sblocca Teresa state 1 (retrocompatibilità)
    if (window.gameState.npcStates.teresa < 1) window.gameState.npcStates.teresa = 1;

    setTimeout(() => {
      closeScenePuzzle();
    }, 1500);
  } else {
    result.textContent = '✗ Ricostruzione errata. Riprova.';
    result.style.color = '#cc4444';
  }
}
