var bgMusic;
var ambientLoops = {};
var sfxCache = {};

export function initAudio() {
  bgMusic = document.getElementById('bg-music');
  if (bgMusic) bgMusic.volume = 0.25;
  console.log('[Audio] Sistema inizializzato');
}

/** Riproduce un effetto sonoro sintetico o da file */
export function playSFX(type, options) {
  if (!window.gameState.musicEnabled) return;
  options = options || {};
  
  // Per ora usiamo Web Audio API per generare suoni procedurali "retro"
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  if (type === 'step_grass') {
    osc.type = 'sine'; osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.start(); osc.stop(audioCtx.currentTime + 0.1);
  } else if (type === 'step_stone') {
    osc.type = 'square'; osc.frequency.setValueAtTime(100, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    osc.start(); osc.stop(audioCtx.currentTime + 0.08);
  } else if (type === 'clue_found') {
    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.start(); osc.stop(audioCtx.currentTime + 0.5);
  }
}

/** Aggiorna i suoni ambientali in base all'area */
export function updateAmbientSounds(areaId) {
  // Logica per loop di vento, ronzii, acqua...
  if (areaId === 'cimitero') {
     // playAmbient('wind_loop');
  }
}

export function startMusic() {
  if (!bgMusic) return;
  var playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked — will start on next user interaction
    });
  }
  updateMuteButton();
}

export function toggleMusic() {
  window.gameState.musicEnabled = !window.gameState.musicEnabled;
  if (!bgMusic) return;
  if (window.gameState.musicEnabled) {
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.pause();
  }
  updateMuteButton();
}

export function updateMuteButton() {
  var btn = document.getElementById('mute-btn');
  if (!btn) return;
  btn.textContent = window.gameState.musicEnabled ? '\uD83D\uDD0A' : '\uD83D\uDD07'; // 🔊 : 🔇
  if (!window.gameState.musicEnabled) btn.classList.add('muted');
  else btn.classList.remove('muted');
}

// Global exports for dynamic module loading compatibility
if (typeof window !== 'undefined') {
  window.initAudio = initAudio;
  window.startMusic = startMusic;
  window.toggleMusic = toggleMusic;
  window.playSFX = playSFX;
  window.updateMuteButton = updateMuteButton;
}
