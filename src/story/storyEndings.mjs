/* ══════════════════════════════════════════════════════════════
   STORY ENDINGS — Condizioni per il Finale
   ══════════════════════════════════════════════════════════════ */

const storyEndingConditions = {
  secret: {
    id: 'secret',
    title: 'NON È ARRIVATO. È STATO APERTO.',
    priority: 100,
    conditions: {
      cluesMin: 6,
      hasClues: [
        'lettera_censurata',
        'radio_audio',
        'registro_1861',
        'frammento',
        'tracce_circolari',
        'simboli_portone',
      ],
      puzzleSolved: ['deduction', 'radio', 'registry'],
    },
    description: 'Il finale vero - hai scoperto tutta la verità',
  },

  alien: {
    id: 'alien',
    title: 'NON SONO SOLI',
    priority: 80,
    conditions: {
      cluesMin: 4,
      hasClues: ['frammento', 'tracce_circolari', 'simboli_portone'],
      missingClues: ['lettera_censurata'],
    },
    description: 'Finale extraterrestre - prove di visita aliena',
  },

  military: {
    id: 'military',
    title: 'ESPERIMENTO FUORI CONTROLLO',
    priority: 60,
    conditions: {
      cluesMin: 3,
      hasClues: ['lettera_censurata', 'radio_audio', 'registro_1861'],
    },
    description: 'Finale militare - copertura governativa',
  },

  psychological: {
    id: 'psychological',
    title: 'ISTERIA COLLETTIVA',
    priority: 10,
    conditions: {
      cluesMax: 2,
    },
    description: 'Finale psicologico - mancanza di prove',
  },
};

if (typeof window !== 'undefined') {
  window.storyEndingConditions = storyEndingConditions;
}
