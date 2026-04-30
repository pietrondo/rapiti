"use strict";

/* ══════════════════════════════════════════════════════════════
   RECORDER PUZZLE — Monte Ferro
   ══════════════════════════════════════════════════════════════ */

var recorderState = {
  cables: [false, false, false], // rosso, blu, verde
  bobin: -1,                     // 0=TestA, 1=TestB, 2=TestC
  powered: false,
  solved: false
};

function openRecorderPuzzle() {
  if (gameState.gamePhase !== 'playing') return;
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'recorder';
  if (!document.getElementById('recorder-overlay')) buildRecorderOverlay();
  refreshRecorderUI();
  document.getElementById('recorder-overlay').classList.add('active');
}

function closeRecorderPuzzle() {
  document.getElementById('recorder-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

function buildRecorderOverlay() {
  var div = document.createElement('div');
  div.id = 'recorder-overlay';
  div.className = 'overlay';
  div.innerHTML =
    '<div class="panel" style="max-width:480px">' +
    '<button class="pnl-close" id="recorder-close">✕</button>' +
    '<h2>📼 Attiva il Registratore</h2>' +
    '<p style="text-align:center;color:#6b7b6b;font-size:12px;margin-bottom:12px">Collega i cavi, scegli la bobina, accendi</p>' +
    '<div style="display:flex;gap:16px;flex-wrap:wrap;margin:12px 0">' +
    '  <div style="flex:1;min-width:140px">' +
    '    <h3 style="font-size:13px;color:#d4a843;margin-bottom:6px">🔌 Cavi (collega)</h3>' +
    '    <button class="rec-cable-btn" id="rec-cable-r" style="background:#cc4444;color:#fff">Rosso</button>' +
    '    <button class="rec-cable-btn" id="rec-cable-b" style="background:#4488cc;color:#fff">Blu</button>' +
    '    <button class="rec-cable-btn" id="rec-cable-g" style="background:#44aa44;color:#fff">Verde</button>' +
    '  </div>' +
    '  <div style="flex:1;min-width:140px">' +
    '    <h3 style="font-size:13px;color:#d4a843;margin-bottom:6px">📀 Bobina</h3>' +
    '    <button class="rec-bobin-btn" data-bobin="0">TEST A</button>' +
    '    <button class="rec-bobin-btn" data-bobin="1">TEST B</button>' +
    '    <button class="rec-bobin-btn" data-bobin="2">TEST C — 1979</button>' +
    '    <div id="rec-bobin-label" style="color:#6b7b6b;font-size:11px;margin-top:4px">Nessuna selezionata</div>' +
    '  </div>' +
    '  <div style="flex:1;min-width:140px">' +
    '    <h3 style="font-size:13px;color:#d4a843;margin-bottom:6px">⚡ Alimentazione</h3>' +
    '    <button class="rec-power-btn" id="rec-power" style="background:#2d3047;color:#6b7b6b;font-size:24px;padding:10px 20px">🔴</button>' +
    '    <div id="rec-power-label" style="color:#6b7b6b;font-size:11px;margin-top:4px">OFF</div>' +
    '  </div>' +
    '</div>' +
    '<button class="btn-primary" id="recorder-play" disabled>▶ Riproduci</button>' +
    '<div id="recorder-result" style="text-align:center;margin-top:8px;font-size:13px;min-height:20px"></div>' +
    '</div>';
  document.body.appendChild(div);

  // Event listeners
  document.getElementById('recorder-close').addEventListener('click', closeRecorderPuzzle);
  document.getElementById('recorder-play').addEventListener('click', playRecorder);

  // Cable buttons
  ['r','b','g'].forEach(function(color) {
    var btn = document.getElementById('rec-cable-' + color);
    btn.addEventListener('click', function() {
      var ci = color === 'r' ? 0 : color === 'b' ? 1 : 2;
      recorderState.cables[ci] = !recorderState.cables[ci];
      refreshRecorderUI();
    });
  });

  // Bobin buttons
  [].forEach.call(document.querySelectorAll('.rec-bobin-btn'), function(btn) {
    btn.addEventListener('click', function() {
      var bi = parseInt(this.getAttribute('data-bobin'));
      recorderState.bobin = (recorderState.bobin === bi) ? -1 : bi;
      refreshRecorderUI();
    });
  });

  // Power button
  document.getElementById('rec-power').addEventListener('click', function() {
    recorderState.powered = !recorderState.powered;
    refreshRecorderUI();
  });
}

function refreshRecorderUI() {
  var rs = recorderState;
  // Cable buttons
  ['r','b','g'].forEach(function(color, ci) {
    var btn = document.getElementById('rec-cable-' + color);
    btn.style.border = rs.cables[ci] ? '3px solid #d4a843' : '3px solid transparent';
    btn.textContent = rs.cables[ci] ? (color==='r'?'Rosso ✓':color==='b'?'Blu ✓':'Verde ✓') :
      (color==='r'?'Rosso':color==='b'?'Blu':'Verde');
  });

  // Bobin buttons
  [].forEach.call(document.querySelectorAll('.rec-bobin-btn'), function(btn) {
    var bi = parseInt(btn.getAttribute('data-bobin'));
    btn.style.background = (rs.bobin === bi) ? '#d4a843' : '#2d3047';
    btn.style.color = (rs.bobin === bi) ? '#1a1c20' : '#e8dcc8';
  });
  var bl = ['TEST A (prototipo)', 'TEST B (fase intermedia)', 'TEST C — 1979'];
  document.getElementById('rec-bobin-label').textContent = rs.bobin >= 0 ? bl[rs.bobin] : 'Nessuna selezionata';
  document.getElementById('rec-bobin-label').style.color = rs.bobin >= 0 ? '#d4a843' : '#6b7b6b';

  // Power
  document.getElementById('rec-power').textContent = rs.powered ? '🟢' : '🔴';
  document.getElementById('rec-power-label').textContent = rs.powered ? 'ON' : 'OFF';
  document.getElementById('rec-power-label').style.color = rs.powered ? '#44cc44' : '#6b7b6b';

  // Play button
  var allCables = rs.cables[0] && rs.cables[1] && rs.cables[2];
  document.getElementById('recorder-play').disabled = !(allCables && rs.bobin >= 0 && rs.powered);
}

function playRecorder() {
  var result = document.getElementById('recorder-result');
  var correct = recorderState.cables[0] && recorderState.cables[1] && recorderState.cables[2] && recorderState.bobin === 2 && recorderState.powered;

  if (correct) {
    recorderState.solved = true;
    result.textContent = '✓ Nastro: "Test fase tre... interferenza non prevista... risposta non classificabile... interrompere—" (disturbo)';
    result.style.color = '#44cc44';
    document.getElementById('recorder-play').disabled = true;
    
    // Notifica StoryManager
    if (typeof StoryManager !== 'undefined') {
      StoryManager.onPuzzleSolved('recorder');
    }
    
    // Add clue
    if (gameState.cluesFound.indexOf('registro_monte_ferro') === -1) {
      gameState.cluesFound.push('registro_monte_ferro');
      
      // Notifica StoryManager
      if (typeof StoryManager !== 'undefined') {
        StoryManager.onClueFound('registro_monte_ferro');
      }
      
      updateHUD();
      showToast('Registrazione Monte Ferro salvata nel diario.');
    }
    setTimeout(function() { closeRecorderPuzzle(); }, 2000);
  } else {
    result.textContent = '✗ Qualcosa non va. Controlla cavi, bobina e alimentazione.';
    result.style.color = '#cc4444';
  }
}
