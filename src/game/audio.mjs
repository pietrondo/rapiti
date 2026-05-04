var bgMusic;
var _ambientLoops = {};
var _sfxCache = {};
var _masterVolume = 0.5;

export function initAudio() {
  bgMusic = document.getElementById('bg-music');
  if (bgMusic) {
     bgMusic.volume = _masterVolume * 0.5; // Music is generally quieter
  }
  console.log('[Audio] Sistema inizializzato');
}

/** Manager per integrazione con Settings */
export const audioManager = {
  setEnabled(enabled) {
    if (!bgMusic) return;
    if (enabled) bgMusic.play().catch(() => {});
    else bgMusic.pause();
    updateMuteButton();
  },
  setVolume(v) {
    _masterVolume = v;
    if (bgMusic) bgMusic.volume = v * 0.5;
  }
};

/** Riproduce un effetto sonoro sintetico procedurale */
export function playSFX(type, options) {
  if (!window.gameState.musicEnabled) return;
  options = options || {};

  var audioCtx = _getAudioCtx();
  var vol = _masterVolume * (options.volume || 1);

  if (type === 'step_grass') {
    _playNoise(audioCtx, vol * 0.08, 0.06, 200, 600);
  } else if (type === 'step_stone') {
    _playNoise(audioCtx, vol * 0.05, 0.04, 400, 1200);
  } else if (type === 'step_wood') {
    _playNoise(audioCtx, vol * 0.06, 0.07, 150, 400);
  } else if (type === 'step_gravel') {
    _playNoise(audioCtx, vol * 0.07, 0.08, 300, 800);
  } else if (type === 'clue_found') {
    var osc2 = audioCtx.createOscillator();
    var gain2 = audioCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
    osc2.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.3);
    gain2.gain.setValueAtTime(0.15 * vol, audioCtx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc2.connect(gain2); gain2.connect(audioCtx.destination);
    osc2.start(); osc2.stop(audioCtx.currentTime + 0.5);
  } else if (type === 'door_open') {
    var osc3 = audioCtx.createOscillator();
    var gain3 = audioCtx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(80, audioCtx.currentTime);
    osc3.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.3);
    gain3.gain.setValueAtTime(0.12 * vol, audioCtx.currentTime);
    gain3.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc3.connect(gain3); gain3.connect(audioCtx.destination);
    osc3.start(); osc3.stop(audioCtx.currentTime + 0.4);
  } else if (type === 'door_close') {
    var osc4 = audioCtx.createOscillator();
    var gain4 = audioCtx.createGain();
    osc4.type = 'sine';
    osc4.frequency.setValueAtTime(180, audioCtx.currentTime);
    osc4.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 0.25);
    gain4.gain.setValueAtTime(0.1 * vol, audioCtx.currentTime);
    gain4.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
    osc4.connect(gain4); gain4.connect(audioCtx.destination);
    osc4.start(); osc4.stop(audioCtx.currentTime + 0.35);
  } else if (type === 'bell') {
    var oscB = audioCtx.createOscillator();
    var gainB = audioCtx.createGain();
    oscB.type = 'triangle';
    oscB.frequency.setValueAtTime(220, audioCtx.currentTime);
    oscB.frequency.setValueAtTime(240, audioCtx.currentTime + 0.05);
    oscB.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 1.5);
    gainB.gain.setValueAtTime(0.15 * vol, audioCtx.currentTime);
    gainB.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);
    oscB.connect(gainB); gainB.connect(audioCtx.destination);
    oscB.start(); oscB.stop(audioCtx.currentTime + 1.5);
  } else if (type === 'radio_static') {
    _playNoise(audioCtx, vol * 0.04, 0.3, 100, 800);
  } else if (type === 'radio_click') {
    var oscC = audioCtx.createOscillator();
    var gainC = audioCtx.createGain();
    oscC.type = 'square';
    oscC.frequency.setValueAtTime(800, audioCtx.currentTime);
    gainC.gain.setValueAtTime(0.06 * vol, audioCtx.currentTime);
    gainC.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
    oscC.connect(gainC); gainC.connect(audioCtx.destination);
    oscC.start(); oscC.stop(audioCtx.currentTime + 0.03);
  } else if (type === 'recorder_click') {
    var oscR = audioCtx.createOscillator();
    var gainR = audioCtx.createGain();
    oscR.type = 'square';
    oscR.frequency.setValueAtTime(600, audioCtx.currentTime);
    gainR.gain.setValueAtTime(0.05 * vol, audioCtx.currentTime);
    gainR.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
    oscR.connect(gainR); gainR.connect(audioCtx.destination);
    oscR.start(); oscR.stop(audioCtx.currentTime + 0.04);
  } else if (type === 'wind') {
    _playNoise(audioCtx, vol * 0.03, 1.0, 50, 300);
  } else if (type === 'thunder') {
    _playNoise(audioCtx, vol * 0.12, 0.6, 30, 80);
    var oscT = audioCtx.createOscillator();
    var gainT = audioCtx.createGain();
    oscT.type = 'sine';
    oscT.frequency.setValueAtTime(30, audioCtx.currentTime);
    oscT.frequency.exponentialRampToValueAtTime(15, audioCtx.currentTime + 0.5);
    gainT.gain.setValueAtTime(0.1 * vol, audioCtx.currentTime);
    gainT.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
    oscT.connect(gainT); gainT.connect(audioCtx.destination);
    oscT.start(); oscT.stop(audioCtx.currentTime + 0.6);
  }
}

var _sharedCtx = null;
function _getAudioCtx() {
  if (!_sharedCtx) _sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _sharedCtx;
}

function _playNoise(ctx, volume, duration, lowFreq, highFreq) {
  var bufferSize = ctx.sampleRate * duration;
  var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  var data = buffer.getChannelData(0);
  for (var i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }
  var source = ctx.createBufferSource();
  source.buffer = buffer;

  var filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = (lowFreq + highFreq) / 2;
  filter.Q.value = 0.5;

  var gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  source.stop(ctx.currentTime + duration);
}

/** Aggiorna i suoni ambientali in base all'area */
export function updateAmbientSounds(areaId) {
  // Suoni ambientali per area
  if (areaId === 'cimitero' || areaId === 'campo') {
    playSFX('wind', { volume: 0.3 });
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
  window.audioManager = audioManager;
}
