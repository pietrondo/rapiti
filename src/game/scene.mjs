/* ══════════════════════════════════════════════════════════════
   SCENE INVESTIGATION PUZZLE — Cascina
   ══════════════════════════════════════════════════════════════ */

const sceneElements = [
  { id: 'scena_lanterna', name: 'Lanterna rotta', desc: "Caduta a terra, vetro rotto. Qualcuno l'ha lasciata cadere di corsa." },
  { id: 'scena_impronte', name: 'Impronte nel fango', desc: 'Impronte che girano in cerchio, poi tornano indietro.' },
  { id: 'scena_segni', name: 'Segni nel terreno', desc: 'Cerchi perfetti nel grano. Il centro è sprofondato.' },
  { id: 'scena_pietra', name: 'Pietra bruciata', desc: 'Una pietra annerita, ancora tiepida. Odore di ozono.' },
  { id: 'scena_stoffa', name: 'Brandello di stoffa', desc: 'Un pezzo di tessuto blu impigliato nel rovo vicino.' },
];

let sceneFound = [];
var _sceneSolved = false;

export function openScenePuzzle() {
  if (!document.getElementById('scene-overlay')) return;
  if (window.gameState.gamePhase !== 'playing') return;
  window.gameState.previousPhase = 'playing';
  window.gameState.gamePhase = 'scene';

  // Popola elementi trovati
  var foundDiv = document.getElementById('scene-elements');
  if (!foundDiv) return;
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
    if (!sel) continue;
    sel.innerHTML = '<option value="">---</option>';
    for (var e = 0; e < sceneFound.length; e++) {
      var opt = document.createElement('option');
      opt.value = sceneFound[e].id;
      opt.textContent = sceneFound[e].name;
      sel.appendChild(opt);
    }
    sel.addEventListener('change', updateSceneConfirm);
  }

  var sConfirm = document.getElementById('scene-confirm');
  if (sConfirm) sConfirm.disabled = true;
  var sResult = document.getElementById('scene-result');
  if (sResult) sResult.textContent = '';
  var sOverlay = document.getElementById('scene-overlay');
  if (sOverlay) sOverlay.classList.add('active');
}

export function closeScenePuzzle() {
  var sOverlay = document.getElementById('scene-overlay');
  if (!sOverlay) return;
  sOverlay.classList.remove('active');
  window.gameState.gamePhase = 'playing';
}

// Global exports for dynamic module loading compatibility
if (typeof window !== 'undefined') {
  window.openScenePuzzle = openScenePuzzle;
  window.closeScenePuzzle = closeScenePuzzle;
  window.checkScene = checkScene;
}

export function updateSceneConfirm() {
  var s1 = document.getElementById('scene-slot1');
  var s2 = document.getElementById('scene-slot2');
  var s3 = document.getElementById('scene-slot3');
  if (!s1 || !s2 || !s3) return;
  var sConfirm = document.getElementById('scene-confirm');
  if (sConfirm) sConfirm.disabled = !(s1.value && s2.value && s3.value);
}

export function checkScene() {
  var s1El = document.getElementById('scene-slot1');
  var s2El = document.getElementById('scene-slot2');
  var s3El = document.getElementById('scene-slot3');
  if (!s1El || !s2El || !s3El) return;
  var s1 = s1El.value;
  var s2 = s2El.value;
  var s3 = s3El.value;
  // Soluzione: Lanterna = partenza, Impronte = movimento, Segni = arrivo
  var correct = s1 === 'scena_lanterna' && s2 === 'scena_impronte' && s3 === 'scena_segni';
  var result = document.getElementById('scene-result');
  if (!result) return;
  if (correct) {
    window.gameState.puzzlesSolved.scene = true;
    window.updateNPCStates();
    window.playSFX?.('bell');
    result.textContent = '✓ Elena non stava scappando. Stava tornando verso qualcosa.';
    result.style.color = '#44cc44';
    var sConfirm2 = document.getElementById('scene-confirm');
    if (sConfirm2) sConfirm2.disabled = true;
    window.showToast('Scena ricostruita! Parla con Teresa nella stanza della cascina.');

    // Notifica StoryManager
    StoryManager.onPuzzleSolved('scene');

    // Sblocca Teresa state 1 (retrocompatibilità)
    if (window.gameState.npcStates.teresa < 1) window.gameState.npcStates.teresa = 1;

    setTimeout(() => {
      closeScenePuzzle();
    }, 1500);
  } else {
    var correctCount = 0;
    if (s1 === 'scena_lanterna') correctCount++;
    if (s2 === 'scena_impronte') correctCount++;
    if (s3 === 'scena_segni') correctCount++;
    result.textContent = `✗ ${correctCount} su 3 corretti. Riprova.`;
    result.style.color = correctCount >= 2 ? '#D4A843' : '#cc4444';
  }
}
