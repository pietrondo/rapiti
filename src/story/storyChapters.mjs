/* ══════════════════════════════════════════════════════════════
   STORY CHAPTERS — Capitoli della Storia
   ══════════════════════════════════════════════════════════════ */

const storyChapters = {
  /* ── CAPITOLO 0: Introduzione ── */
  intro: {
    id: 'intro',
    title: "L'Arrivo",
    description:
      'Il detective arriva a San Celeste. Deve familiarizzare con il paese e i suoi abitanti.',
    order: 0,
    objectives: [
      {
        id: 'explore_piazza',
        description: 'Esplora la Piazza del Borgo',
        condition: { visitedArea: 'piazze' },
      },
      {
        id: 'talk_ruggeri',
        description: 'Parla con il Sindaco Ruggeri',
        condition: { talkedTo: 'ruggeri' },
      },
      {
        id: 'talk_any_npc',
        description: 'Parla con almeno 3 abitanti',
        condition: { talkedToCount: 3 },
      },
    ],
    requiredObjectives: ['talk_ruggeri'],
    onComplete: {
      unlockChapter: 'investigation',
      message: "Hai familiarizzato con il paese. Ora inizia l'indagine.",
      setFlag: 'intro_complete',
    },
  },

  /* ── CAPITOLO 1: Indagine ── */
  investigation: {
    id: 'investigation',
    title: 'Indagine',
    description: 'Raccogli indizi sulle sparizioni. Parla con i sospettati e cerca prove.',
    order: 1,
    objectives: [
      {
        id: 'find_first_clue',
        description: 'Trova il tuo primo indizio',
        condition: { cluesFound: 1 },
      },
      {
        id: 'talk_teresa',
        description: 'Interroga Teresa Bellandi',
        condition: { talkedTo: 'teresa' },
      },
      {
        id: 'talk_neri',
        description: "Consulta l'Archivista Neri",
        condition: { talkedTo: 'neri' },
      },
      {
        id: 'explore_archivio',
        description: "Visita l'Archivio Comunale",
        condition: { visitedArea: 'chiesa' },
      },
      {
        id: 'find_registro',
        description: 'Trova il Registro del 1861',
        condition: { hasClue: 'registro_1861' },
      },
    ],
    requiredObjectives: ['find_registro', 'talk_teresa'],
    onComplete: {
      unlockChapter: 'deepening',
      message: 'Hai trovato il registro del 1861. Qualcosa di strano sta emergendo...',
      setFlag: 'investigation_complete',
    },
  },

  /* ── CAPITOLO 2: Approfondimento ── */
  deepening: {
    id: 'deepening',
    title: 'Approfondimento',
    description: 'Scopri la connessione tra le sparizioni. Il ciclo di 116 anni.',
    order: 2,
    objectives: [
      {
        id: 'find_lettera',
        description: 'Trova la Lettera Censurata',
        condition: { hasClue: 'lettera_censurata' },
      },
      {
        id: 'find_mappa',
        description: 'Trova la Mappa dei Campi',
        condition: { hasClue: 'mappa_campi' },
      },
      {
        id: 'talk_valli',
        description: 'Interroga il Capitano Valli',
        condition: { talkedTo: 'valli' },
      },
      {
        id: 'solve_radio',
        description: 'Risolvi il puzzle della Radio',
        condition: { puzzleSolved: 'radio' },
      },
      {
        id: 'find_frammento',
        description: 'Trova il Frammento Metallico',
        condition: { hasClue: 'frammento' },
      },
    ],
    requiredObjectives: ['find_lettera', 'find_mappa', 'find_frammento'],
    onComplete: {
      unlockChapter: 'deduction_phase',
      message: 'Hai raccolto prove inquietanti. È tempo di fare una deduzione.',
      setFlag: 'deepening_complete',
    },
  },

  /* ── CAPITOLO 3: Deduzione ── */
  deduction_phase: {
    id: 'deduction_phase',
    title: 'La Deduzione',
    description: 'Collega gli indizi nel pannello di deduzione. Trova la verità.',
    order: 3,
    objectives: [
      {
        id: 'solve_deduction',
        description: 'Risolvi il puzzle di deduzione',
        condition: { puzzleSolved: 'deduction' },
      },
      {
        id: 'talk_all_key',
        description: 'Parla con tutti i personaggi chiave',
        condition: { talkedToAll: ['ruggeri', 'teresa', 'neri', 'valli'] },
      },
      {
        id: 'find_tracce',
        description: 'Trova le Tracce Circolari',
        condition: { hasClue: 'tracce_circolari' },
      },
    ],
    requiredObjectives: ['solve_deduction'],
    onComplete: {
      unlockChapter: 'finale',
      message: 'Hai collegato gli indizi. Ora vai al Campo delle Luci per la verità finale.',
      setFlag: 'deduction_complete',
      unlockArea: 'giardini_tracce',
    },
  },

  /* ── CAPITOLO 4: Finale ── */
  finale: {
    id: 'finale',
    title: 'La Verità',
    description: 'Raccogli le tracce circolari al Campo delle Luci per scoprire la verità.',
    order: 4,
    objectives: [
      {
        id: 'collect_tracce',
        description: 'Raccogli le Tracce Circolari',
        condition: { hasClue: 'tracce_circolari' },
      },
    ],
    requiredObjectives: ['collect_tracce'],
    onComplete: {
      triggerEnding: true,
      message: 'Hai scoperto la verità su San Celeste...',
    },
  },
};

if (typeof window !== 'undefined') {
  window.storyChapters = storyChapters;
}
