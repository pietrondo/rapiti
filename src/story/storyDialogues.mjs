/* ══════════════════════════════════════════════════════════════
   STORY DIALOGUE TRIGGERS — Trigger per Dialoghi NPC
   ══════════════════════════════════════════════════════════════ */

const storyDialogueTriggers = {
  ruggeri: {
    npcId: 'ruggeri',
    states: [
      {
        id: 's4_corruzione',
        condition: { hasHypothesis: 'esperimento_militare', trustAtMost: { ruggeri: 0 } },
        node: 'ruggeri_s4_corruzione',
      },
      {
        id: 's3_esperimento',
        condition: { hasHypothesis: 'esperimento_militare' },
        node: 'ruggeri_s3_esperimento',
      },
      {
        id: 's1_lettera_trust',
        condition: { hasClue: 'lettera_censurata', trustAtLeast: { ruggeri: 10 } },
        node: 'ruggeri_s1_trust',
      },
      {
        id: 's1_lettera_mistrust',
        condition: { hasClue: 'lettera_censurata', trustAtMost: { ruggeri: -5 } },
        node: 'ruggeri_s1_mistrust',
      },
      {
        id: 's0_intro',
        condition: { chapterAtMost: 'intro' },
        node: 'ruggeri_s0',
      },
      {
        id: 's0_investigation',
        condition: { chapter: 'investigation', hasFlag: 'intro_complete' },
        node: 'ruggeri_s0',
      },
      {
        id: 's1_lettera',
        condition: { hasClue: 'lettera_censurata', chapterAtLeast: 'investigation' },
        node: 'ruggeri_s1',
      },
      {
        id: 's2_deduction',
        condition: { hasFlag: 'deduction_complete' },
        node: 'ruggeri_s2',
      },
    ],
    defaultNode: 'ruggeri_s0',
  },

  teresa: {
    npcId: 'teresa',
    states: [
      {
        id: 's0_intro',
        condition: { chapterAtMost: 'investigation' },
        node: 'teresa_s0',
      },
      {
        id: 's1_simboli',
        condition: { hasClue: 'simboli_portone' },
        node: 'teresa_s1',
      },
      {
        id: 's2_memory',
        condition: { hasFlag: 'deduction_complete' },
        node: 'teresa_s2_memory',
        special: 'memory_corrupt',
      },
      {
        id: 's2_normal',
        condition: { hasFlag: 'deduction_complete' },
        node: 'teresa_s2',
      },
    ],
    defaultNode: 'teresa_s0',
  },

  neri: {
    npcId: 'neri',
    states: [
      {
        id: 's0_intro',
        condition: { chapterAtMost: 'investigation' },
        node: 'neri_s0',
      },
      {
        id: 's1_registro',
        condition: { hasClue: 'registro_1861' },
        node: 'neri_s1',
      },
      {
        id: 's2_deduction',
        condition: { hasFlag: 'deduction_complete' },
        node: 'neri_s2',
      },
    ],
    defaultNode: 'neri_s0',
  },

  valli: {
    npcId: 'valli',
    states: [
      {
        id: 's0_cold',
        condition: { chapterAtMost: 'deepening', missingClue: 'frammento' },
        node: 'valli_s0',
      },
      {
        id: 's1_frammento',
        condition: { hasClue: 'frammento' },
        node: 'valli_s1',
      },
      {
        id: 's2_deduction',
        condition: { hasFlag: 'deduction_complete' },
        node: 'valli_s2',
      },
    ],
    defaultNode: 'valli_s0',
  },

  anselmo: {
    npcId: 'anselmo',
    states: [
      {
        id: 's3_tecnologia',
        condition: { hasHypothesis: 'tecnologia_aliena' },
        node: 'anselmo_s3_tecnologia',
      },
      {
        id: 's2_lore',
        condition: { hasFlag: 'anselmo_quest_complete', trustAtLeast: { anselmo: 20 } },
        node: 'anselmo_s2_lore',
      },
      {
        id: 's1_radio',
        condition: { hasFlag: 'anselmo_remembering' },
        node: 'anselmo_s1',
      },
      {
        id: 's0_intro',
        condition: { missingFlag: 'anselmo_remembering' },
        node: 'anselmo_s0',
      },
    ],
    defaultNode: 'anselmo_s0',
  },

  osvaldo: {
    npcId: 'osvaldo',
    states: [
      { id: 's1_menta', condition: { hasClue: 'menta' }, node: 'osvaldo_s1' },
      { id: 's0_always', condition: null, node: 'osvaldo_s0' }
    ],
    defaultNode: 'osvaldo_s0',
  },

  gino: {
    npcId: 'gino',
    states: [
      { id: 's1_lettera', condition: { hasClue: 'lettera_gino' }, node: 'gino_s1' },
      { id: 's0_always', condition: null, node: 'gino_s0' }
    ],
    defaultNode: 'gino_s0',
  },

  don_pietro: {
    npcId: 'don_pietro',
    states: [
      {
        id: 's1_religione',
        condition: { hasHypothesis: 'rapimento_ciclico' },
        node: 'don_pietro_s1',
      },
      { id: 's0_always', condition: null, node: 'don_pietro_s0' }
    ],
    defaultNode: 'don_pietro_s0',
  },
};

if (typeof window !== 'undefined') {
  window.storyDialogueTriggers = storyDialogueTriggers;
}
