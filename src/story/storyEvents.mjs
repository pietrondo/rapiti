/* ══════════════════════════════════════════════════════════════
   STORY EVENTS — Eventi Speciali
   ══════════════════════════════════════════════════════════════ */

const storyEvents = {
  first_clue_found: {
    id: 'first_clue_found',
    trigger: { cluesFound: 1 },
    once: true,
    action: () => {
      window.showToast('Primo indizio raccolto! Controlla il Diario con [J]');
      StoryManager.setFlag('first_clue_found');
    },
  },

  half_clues_found: {
    id: 'half_clues_found',
    trigger: { cluesFound: 5 },
    once: true,
    action: () => {
      window.showToast('Hai raccolto metà degli indizi. Continua così!');
      StoryManager.setFlag('half_clues_found');
    },
  },

  all_clues_found: {
    id: 'all_clues_found',
    trigger: { cluesFound: 'all' },
    once: true,
    action: () => {
      window.showToast('Hai trovato TUTTI gli indizi! Sei pronto per la verità.');
      StoryManager.setFlag('all_clues_found');
    },
  },

  chapter_unlock_deduction: {
    id: 'chapter_unlock_deduction',
    trigger: { hasClues: ['registro_1861', 'mappa_campi', 'tracce_circolari'] },
    once: true,
    action: () => {
      window.showToast('Hai raccolto abbastanza indizi per la Deduzione! Premi [T]');
    },
  },

  teresa_memory_corrupt: {
    id: 'teresa_memory_corrupt',
    trigger: { hasFlag: 'deduction_complete', talkedTo: 'teresa' },
    once: true,
    action: () => {
      ScreenShake.shake(3, 20);
      window.showToast('La realtà sembra... instabile.');
    },
  },
};

if (typeof window !== 'undefined') {
  window.storyEvents = storyEvents;
}
