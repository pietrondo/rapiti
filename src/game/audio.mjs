var bgMusic;

export function initAudio() {
  bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0.35;
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
  gameState.musicEnabled = !gameState.musicEnabled;
  if (!bgMusic) return;
  if (gameState.musicEnabled) {
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.pause();
  }
  updateMuteButton();
}

export function updateMuteButton() {
  var btn = document.getElementById('mute-btn');
  if (!btn) return;
  btn.textContent = gameState.musicEnabled ? '\uD83D\uDD0A' : '\uD83D\uDD07'; // 🔊 : 🔇
  if (!gameState.musicEnabled) btn.classList.add('muted');
  else btn.classList.remove('muted');
}

// Global exports for dynamic module loading compatibility
if (typeof window !== 'undefined') {
  window.initAudio = initAudio;
  window.startMusic = startMusic;
  window.toggleMusic = toggleMusic;
  window.updateMuteButton = updateMuteButton;
}
