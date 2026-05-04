/* ══════════════════════════════════════════════════════════════
   STORY ENDINGS — Condizioni e Testi per i finali
   ══════════════════════════════════════════════════════════════ */

const storyEndingConditions = {
  /* ── FINALE SEGRETO: La Falla Dimensionale ── */
  secret: {
    id: 'secret',
    title: 'NON È ARRIVATO. È STATO APERTO.',
    description:
      'Hai capito tutto. Il fenomeno esisteva PRIMA dei test militari. I test radio hanno solo aperto una porta che doveva restare chiusa.',
    priority: 100,
    conditions: {
      hasHypotheses: ['falle_dimensionali', 'segnale_risposta'],
      cluesMin: 8,
    },
    variant: {
      trustAtLeast: { anselmo: 25 },
      text: 'Anselmo ti guarda partire. Lui sa che non è finita, ma almeno ora non è più solo con i suoi ricordi.',
    },
  },

  /* ── FINALE 1: Verità Militare ── */
  military: {
    id: 'military',
    title: 'Dossier "Progetto SIRIO"',
    description:
      "Hai dimostrato che le luci sono esperimenti radar illegali. I militari vengono indagati, ma le sparizioni restano senza una risposta ufficiale.",
    priority: 50,
    conditions: {
      hasHypothesis: 'esperimento_militare',
    },
    variants: [
      {
        condition: { trustAtLeast: { neri: 20 } },
        text: 'Neri ha consegnato i suoi appunti privati alla stampa. La verità non potrà essere insabbiata.',
      },
      {
        condition: { trustAtLeast: { valli: 20 } },
        text: 'Il Capitano Valli ha deciso di testimoniare, rompendo il giuramento di silenzio.',
      },
    ],
  },

  /* ── FINALE 2: Verità Aliena ── */
  alien: {
    id: 'alien',
    title: 'Incontro del Terzo Tipo',
    description:
      'Le prove sono inconfutabili: San Celeste è una stazione di raccolta aliena. Il mondo non sarà più lo stesso.',
    priority: 40,
    conditions: {
      hasHypothesis: 'tecnologia_aliena',
      hasClue: 'tracce_circolari',
    },
    variant: {
      condition: { trustAtLeast: { teresa: 20 } },
      text: 'Teresa ha finalmente trovato pace, sapendo che Enzo è "nella luce".',
    },
  },

  /* ── FINALE 3: Corruzione ── */
  corruption: {
    id: 'corruption',
    title: 'Silenzio Assordante',
    description:
      "Hai accettato l'accordo del Sindaco Ruggeri. Il dossier è stato bruciato. San Celeste continua a prosperare, ma nuove luci appaiono all'orizzonte.",
    priority: 80,
    conditions: {
      hasFlag: 'ending_corruzione',
    },
  },

  /* ── FINALE 4: Complotto Locale ── */
  conspiracy: {
    id: 'conspiracy',
    title: 'Infiltrazione Istituzionale',
    description:
      'Hai scoperto che il Comune era complice dei militari. Il Sindaco Ruggeri viene rimosso, ma il Progetto Sirius continua in segreto altrove.',
    priority: 30,
    conditions: {
      hasHypothesis: 'complotto_comunale',
    },
  },

  /* ── FINALE 5: Fine Ambigua ── */
  psychological: {
    id: 'psychological',
    title: 'Nebbia Padana',
    description:
      "Non hai raccolto abbastanza prove. La Prefettura ti richiama a Parma. Le luci di San Celeste restano solo una leggenda locale.",
    priority: 0,
    conditions: {},
  },
};

if (typeof window !== 'undefined') {
  window.storyEndingConditions = storyEndingConditions;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = storyEndingConditions;
}
