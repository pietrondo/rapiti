/* ══════════════════════════════════════════════════════════════
   DIALOGUE EFFECTS — Effetti applicati dopo scelte di dialogo
   ══════════════════════════════════════════════════════════════ */

var dialogueEffects = {
  hint_chiesa: () => {
    showToast('Il Sindaco ha parlato della Chiesa.');
  },
  give_frammento: () => {
    if (gameState.cluesFound.indexOf('frammento') === -1) {
      gameState.cluesFound.push('frammento');
      updateHUD();
      showToast('Hai raccolto: Frammento metallico freddo');
    }
  },
  hint_diario_enzo: () => {
    var obj = areaObjects.giardini.find((o) => o.id === 'diario_enzo');
    if (obj) obj.requires = null;
    showToast('Teresa ha detto che il diario è nella stanza di Enzo.');
  },
  give_lettera: () => {
    if (gameState.cluesFound.indexOf('lettera_censurata') === -1) {
      gameState.cluesFound.push('lettera_censurata');
      updateHUD();
      showToast('Hai raccolto: Lettera militare censurata');
    }
  },
  hint_mappa: () => {
    showToast('Neri ha una mappa. Forse è al Campo delle Luci?');
  },
};

if (typeof window !== 'undefined') {
  window.dialogueEffects = dialogueEffects;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dialogueEffects;
}
