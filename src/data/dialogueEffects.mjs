/* ══════════════════════════════════════════════════════════════
   DIALOGUE EFFECTS — Effetti applicati dopo scelte di dialogo
   ══════════════════════════════════════════════════════════════ */

var dialogueEffects = {
  hint_chiesa: () => {
    window.showToast('Il Sindaco ha parlato della Chiesa.');
  },
  give_frammento: () => {
    if (window.gameState.cluesFound.indexOf('frammento') === -1) {
      window.gameState.cluesFound.push('frammento');
      window.updateHUD();
      window.showToast('Hai raccolto: Frammento metallico freddo');
    }
  },
  hint_diario_enzo: () => {
    var obj = window.areaObjects.giardini.find((o) => o.id === 'diario_enzo');
    if (obj) obj.requires = null;
    window.showToast('Teresa ha detto che il diario è nella stanza di Enzo.');
  },
  give_lettera: () => {
    if (window.gameState.cluesFound.indexOf('lettera_censurata') === -1) {
      window.gameState.cluesFound.push('lettera_censurata');
      window.updateHUD();
      window.showToast('Hai raccolto: Lettera militare censurata');
    }
  },
  hint_mappa: () => {
    window.showToast('Neri ha una mappa. Forse è al Campo delle Luci?');
  },
};

if (typeof window !== 'undefined') {
  window.dialogueEffects = dialogueEffects;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dialogueEffects;
}
