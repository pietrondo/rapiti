"use strict";

/* ══════════════════════════════════════════════════════════════
   SEZIONE 14: AVVIO
   ══════════════════════════════════════════════════════════════ */

window.onload = function() {
  ctx = initCanvas();
  initAudio();
  initEventListeners();
  updateHUD();
  updateMuteButton();
  // Override collectClue: trigger finale dopo aver raccolto le tracce al Campo
  var origCollect = collectClue;
  collectClue = function(obj) {
    origCollect(obj);
    if (obj.id === 'tracce_circolari' && gameState.puzzleSolved && gameState.currentArea === 'campo') {
      setTimeout(function() { triggerEnding(); }, 2500);
    }
  };
  requestAnimationFrame(gameLoop);
};
