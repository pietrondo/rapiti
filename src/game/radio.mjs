export function openRadioPuzzle() {
  if (!document.getElementById('radio-overlay')) return;
  if (window.gameState.gamePhase !== 'playing') return;
  window.gameState.previousPhase = 'playing';
  window.gameState.gamePhase = 'radio';
  window.gameState.radioFrequency = 0;
  updateRadioKnob(0);
  var rmsgEl = document.getElementById('radio-message');
  if (rmsgEl) rmsgEl.textContent = '';
  var roverlay = document.getElementById('radio-overlay');
  if (roverlay) roverlay.classList.add('active');
}

export function closeRadioPuzzle() {
  var roverlay = document.getElementById('radio-overlay');
  if (!roverlay) return;
  roverlay.classList.remove('active');
  window.gameState.gamePhase = 'playing';
}

// Global exports for dynamic module loading compatibility
if (typeof window !== 'undefined') {
  window.openRadioPuzzle = openRadioPuzzle;
  window.closeRadioPuzzle = closeRadioPuzzle;
}

export function setupRadio() {
  var bar = document.getElementById('radio-bar');
  var knob = document.getElementById('radio-knob');
  if (!bar || !knob) return;
  var dragging = false;

  var moveKnob = (clientX) => {
    var rect = bar.getBoundingClientRect();
    var pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    updateRadioKnob(pct);
  };

  bar.addEventListener('mousedown', (e) => {
    dragging = true;
    moveKnob(e.clientX);
  });
  document.addEventListener('mousemove', (e) => {
    if (dragging) moveKnob(e.clientX);
  });
  document.addEventListener('mouseup', () => {
    dragging = false;
  });
  // Touch support
  bar.addEventListener('touchstart', (e) => {
    dragging = true;
    moveKnob(e.touches[0].clientX);
  });
  document.addEventListener('touchmove', (e) => {
    if (dragging) moveKnob(e.touches[0].clientX);
  });
  document.addEventListener('touchend', () => {
    dragging = false;
  });
}

export function updateRadioKnob(pct) {
  window.gameState.radioFrequency = pct;
  var knob = document.getElementById('radio-knob');
  var fill = document.getElementById('radio-fill');
  if (!knob) return;
  knob.style.left = `${pct}%`;
  if (fill) fill.style.width = `${pct}%`;
  var rvalEl = document.getElementById('radio-value');
  if (rvalEl) rvalEl.textContent = (pct / 10).toFixed(1);

  // Status: 0-69 static, 70-74 interference, 75+ clear
  var statusEl = document.getElementById('radio-status');
  if (!statusEl) return;
  var target = window.gameState.radioTarget;
  var dist = Math.abs(pct - target);

  if (dist < 3) {
    statusEl.textContent = '\uD83D\uDFE2 Segnale chiaro';
    statusEl.className = 'radio-status clear';
    if (!window.gameState.puzzlesSolved.radio) {
      window.gameState.puzzlesSolved.radio = true;
      window.gameState.radioSolved = true;
      window.updateNPCStates();
      window.playSFX?.('bell');

      // Notifica StoryManager
      if (typeof StoryManager !== 'undefined') {
        StoryManager.onPuzzleSolved('radio');
      }

      var rmsgEl2 = document.getElementById('radio-message');
      if (rmsgEl2) {
        rmsgEl2.textContent = '"...non guardare... quando si ferma..."';
        rmsgEl2.className = 'radio-message-found';
      }
      // Aggiungi indizio audio al diario
      if (window.gameState.cluesFound.indexOf('radio_audio') === -1) {
        window.gameState.cluesFound.push('radio_audio');

        // Notifica StoryManager
        if (typeof StoryManager !== 'undefined') {
          StoryManager.onClueFound('radio_audio');
        }

        window.updateHUD();
        setTimeout(() => {
          window.showToast('Registrazione radio salvata nel diario.');
        }, 600);
      }
    }
  } else if (dist < 10) {
    statusEl.textContent = '\uD83D\uDFE1 Interferenza';
    statusEl.className = 'radio-status interference';
  } else {
    statusEl.textContent = '\uD83D\uDD34 Statico';
    statusEl.className = 'radio-status static';
  }
}
