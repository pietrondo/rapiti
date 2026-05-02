/* ══════════════════════════════════════════════════════════════
   STORY ENDINGS — Condizioni per i finali
   ══════════════════════════════════════════════════════════════ */

const storyEndingConditions = {
  /* ── FINALE 1: Verità Militare ── */
  military: {
    id: 'military',
    title: 'Dossier "Occhio di Perseo"',
    description: "Hai dimostrato che le luci sono esperimenti radar illegali. Il Sindaco e i militari vengono indagati, ma le sparizioni restano 'danni collaterali' senza risposta.",
    priority: 10,
    conditions: {
      hasHypothesis: 'esperimento_militare',
      cluesMin: 5
    }
  },

  /* ── FINALE 2: Verità Aliena ── */
  alien: {
    id: 'alien',
    title: 'Incontro del Terzo Tipo',
    description: "Le prove sono inconfutabili: San Celeste è una stazione di raccolta aliena. Hai prelevato il campione di terreno vetrificato e il mondo non sarà più lo stesso.",
    priority: 15,
    conditions: {
      hasHypothesis: 'tecnologia_aliena',
      hasClue: 'tracce_circolari'
    }
  },

  /* ── FINALE 3: Corruzione ── */
  corruption: {
    id: 'corruption',
    title: 'Silenzio Assordante',
    description: "Hai accettato i soldi del Sindaco Ruggeri. Il dossier è stato bruciato. San Celeste continua a prosperare, ma a quale prezzo? Nuove luci appaiono all'orizzonte.",
    priority: 20,
    conditions: {
      hasFlag: 'ending_corruzione'
    }
  },

  /* ── FINALE 4: Fine Ambigua ── */
  psychological: {
    id: 'psychological',
    title: 'Nebbia Padana',
    description: "Non hai raccolto abbastanza prove. La Prefettura ti richiama a Parma. Le luci di San Celeste restano un racconto per spaventare i bambini nelle notti d'estate.",
    priority: 0,
    conditions: {}
  }
};

if (typeof window !== 'undefined') {
  window.storyEndingConditions = storyEndingConditions;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = storyEndingConditions;
}
