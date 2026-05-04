export function openRadioPuzzle() {
  if (window.gameState.gamePhase !== 'playing') return;
  window.gameState.previousPhase = 'playing';
  window.gameState.gamePhase = 'radio';
  window.gameState.radioFrequency = 0;
  updateRadioKnob(0);
  document.getElementById('radio-message').textContent = '';
  document.getElementById('radio-overlay').classList.add('active');
}

export function closeRadioPuzzle() {
  document.getElementById('radio-overlay').classList.remove('active');
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
  document.getElementById('radio-value').textContent = (pct / 10).toFixed(1);

  // Status: 0-69 static, 70-74 interference, 75+ clear
  var statusEl = document.getElementById('radio-status');
  var target = window.gameState.radioTarget;
  var dist = Math.abs(pct - target);

  if (dist < 3) {
    statusEl.textContent = '\uD83D\uDFE2 Segnale chiaro';
    statusEl.className = 'radio-status clear';
    if (!window.gameState.puzzlesSolved.radio) {
      window.gameState.puzzlesSolved.radio = true;
      window.gameState.radioSolved = true; // Mantieni per retrocompatibilità temporanea

      // Notifica StoryManager
      if (typeof StoryManager !== 'undefined') {
        StoryManager.onPuzzleSolved('radio');
      }

      document.getElementById('radio-message').textContent =
        '"...non guardare... quando si ferma..."';
      document.getElementById('radio-message').className = 'radio-message-found';
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
