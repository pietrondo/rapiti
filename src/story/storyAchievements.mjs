/* ══════════════════════════════════════════════════════════════
   STORY ACHIEVEMENTS — Obiettivi Globali
   ══════════════════════════════════════════════════════════════ */

const storyAchievements = {
  detective_novice: {
    id: 'detective_novice',
    title: 'Detective Novizio',
    description: 'Trova il tuo primo indizio',
    condition: { cluesFound: 1 },
  },
  detective_expert: {
    id: 'detective_expert',
    title: 'Detective Esperto',
    description: 'Trova tutti gli indizi',
    condition: { cluesFound: 'all' },
  },
  social_butterfly: {
    id: 'social_butterfly',
    title: 'Animale Sociale',
    description: 'Parla con tutti gli NPC',
    condition: {
      talkedToAll: [
        'ruggeri',
        'teresa',
        'neri',
        'valli',
        'anselmo',
        'osvaldo',
        'gino',
        'don_pietro',
      ],
    },
  },
  puzzle_master: {
    id: 'puzzle_master',
    title: 'Maestro degli Enigmi',
    description: 'Risolvi tutti i puzzle',
    condition: { puzzlesSolved: ['radio', 'registry', 'scene', 'recorder', 'deduction'] },
  },
  secret_ending: {
    id: 'secret_ending',
    title: 'La Verità',
    description: 'Scopri il finale segreto',
    condition: { endingReached: 'secret' },
  },
};

if (typeof window !== 'undefined') {
  window.storyAchievements = storyAchievements;
}
