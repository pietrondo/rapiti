/* ══════════════════════════════════════════════════════════════
   STORY DATA — Dati Narrativi Centralizzati
   ══════════════════════════════════════════════════════════════
   
   Questo file contiene tutti i dati narrativi del gioco:
   - Capitoli della storia
   - Quest e obiettivi
   - Trigger per dialoghi
   - Condizioni per ending
   - Eventi speciali
   
   Per espandere la storia, aggiungi nuovi capitoli/quest qui.
   La logica di gioco rimane separata in StoryManager.js
   ══════════════════════════════════════════════════════════════ */

/**
 * CAPITOLI DELLA STORIA
 * Ogni capitolo ha obiettivi da completare per procedere
 */
var storyChapters = {
  
  /* ── CAPITOLO 0: Introduzione ── */
  'intro': {
    id: 'intro',
    title: "L'Arrivo",
    description: "Il detective arriva a San Celeste. Deve familiarizzare con il paese e i suoi abitanti.",
    order: 0,
    objectives: [
      { id: 'explore_piazza', description: "Esplora la Piazza del Borgo", condition: { visitedArea: 'piazze' } },
      { id: 'talk_ruggeri', description: "Parla con il Sindaco Ruggeri", condition: { talkedTo: 'ruggeri' } },
      { id: 'talk_any_npc', description: "Parla con almeno 3 abitanti", condition: { talkedToCount: 3 } }
    ],
    requiredObjectives: ['talk_ruggeri'],
    onComplete: {
      unlockChapter: 'investigation',
      message: "Hai familiarizzato con il paese. Ora inizia l'indagine.",
      setFlag: 'intro_complete'
    }
  },
  
  /* ── CAPITOLO 1: Indagine ── */
  'investigation': {
    id: 'investigation',
    title: "Indagine",
    description: "Raccogli indizi sulle sparizioni. Parla con i sospettati e cerca prove.",
    order: 1,
    objectives: [
      { id: 'find_first_clue', description: "Trova il tuo primo indizio", condition: { cluesFound: 1 } },
      { id: 'talk_teresa', description: "Interroga Teresa Bellandi", condition: { talkedTo: 'teresa' } },
      { id: 'talk_neri', description: "Consulta l'Archivista Neri", condition: { talkedTo: 'neri' } },
      { id: 'explore_archivio', description: "Visita l'Archivio Comunale", condition: { visitedArea: 'chiesa' } },
      { id: 'find_registro', description: "Trova il Registro del 1861", condition: { hasClue: 'registro_1861' } }
    ],
    requiredObjectives: ['find_registro', 'talk_teresa'],
    onComplete: {
      unlockChapter: 'deepening',
      message: "Hai trovato il registro del 1861. Qualcosa di strano sta emergendo...",
      setFlag: 'investigation_complete'
    }
  },
  
  /* ── CAPITOLO 2: Approfondimento ── */
  'deepening': {
    id: 'deepening',
    title: "Approfondimento",
    description: "Scopri la connessione tra le sparizioni. Il ciclo di 116 anni.",
    order: 2,
    objectives: [
      { id: 'find_lettera', description: "Trova la Lettera Censurata", condition: { hasClue: 'lettera_censurata' } },
      { id: 'find_mappa', description: "Trova la Mappa dei Campi", condition: { hasClue: 'mappa_campi' } },
      { id: 'talk_valli', description: "Interroga il Capitano Valli", condition: { talkedTo: 'valli' } },
      { id: 'solve_radio', description: "Risolvi il puzzle della Radio", condition: { puzzleSolved: 'radio' } },
      { id: 'find_frammento', description: "Trova il Frammento Metallico", condition: { hasClue: 'frammento' } }
    ],
    requiredObjectives: ['find_lettera', 'find_mappa', 'find_frammento'],
    onComplete: {
      unlockChapter: 'deduction_phase',
      message: "Hai raccolto prove inquietanti. È tempo di fare una deduzione.",
      setFlag: 'deepening_complete'
    }
  },
  
  /* ── CAPITOLO 3: Deduzione ── */
  'deduction_phase': {
    id: 'deduction_phase',
    title: "La Deduzione",
    description: "Collega gli indizi nel pannello di deduzione. Trova la verità.",
    order: 3,
    objectives: [
      { id: 'solve_deduction', description: "Risolvi il puzzle di deduzione", condition: { puzzleSolved: 'deduction' } },
      { id: 'talk_all_key', description: "Parla con tutti i personaggi chiave", condition: { talkedToAll: ['ruggeri', 'teresa', 'neri', 'valli'] } },
      { id: 'find_tracce', description: "Trova le Tracce Circolari", condition: { hasClue: 'tracce_circolari' } }
    ],
    requiredObjectives: ['solve_deduction'],
    onComplete: {
      unlockChapter: 'finale',
      message: "Hai collegato gli indizi. Ora vai al Campo delle Luci per la verità finale.",
      setFlag: 'deduction_complete',
      unlockArea: 'giardini_tracce'  // Sblocca accesso alle tracce
    }
  },
  
  /* ── CAPITOLO 4: Finale ── */
  'finale': {
    id: 'finale',
    title: "La Verità",
    description: "Raccogli le tracce circolari al Campo delle Luci per scoprire la verità.",
    order: 4,
    objectives: [
      { id: 'collect_tracce', description: "Raccogli le Tracce Circolari", condition: { hasClue: 'tracce_circolari' } }
    ],
    requiredObjectives: ['collect_tracce'],
    onComplete: {
      triggerEnding: true,
      message: "Hai scoperto la verità su San Celeste..."
    }
  }
};

/**
 * QUEST PARALLELE
 * Quest opzionali che arricchiscono la storia
 */
var storyQuests = {
  
  /* ── Quest: Il Mistero di Anselmo ── */
  'anselmo_mystery': {
    id: 'anselmo_mystery',
    title: "Il Mistero di Anselmo",
    description: "Anselmo ha visto qualcosa nel 1952. Scopri cosa sa.",
    chapter: 'investigation',  // Disponibile dal capitolo investigation
    stages: [
      { 
        id: 'meet_anselmo', 
        description: "Parla con Anselmo nei Giardini",
        condition: { talkedTo: 'anselmo' },
        reward: { setFlag: 'anselmo_met' }
      },
      { 
        id: 'solve_radio', 
        description: "Risolvi il puzzle della Radio per sbloccare i suoi ricordi",
        condition: { puzzleSolved: 'radio' },
        reward: { setFlag: 'anselmo_remembering' }
      },
      { 
        id: 'hear_story', 
        description: "Riascolta Anselmo dopo aver risolto la radio",
        condition: { talkedTo: 'anselmo', hasFlag: 'anselmo_remembering' },
        reward: { giveClueHint: 'registro_1861_location', setFlag: 'anselmo_quest_complete' }
      }
    ],
    onComplete: {
      xp: 50,
      message: "Hai aiutato Anselmo a ricordare. Ora sai della connessione con il 1952."
    }
  },
  
  /* ── Quest: I Simboli della Cascina ── */
  'cascina_symbols': {
    id: 'cascina_symbols',
    title: "I Simboli della Cascina",
    description: "Teresa ha trovato strani simboli. Scopri cosa significano.",
    chapter: 'deepening',
    stages: [
      {
        id: 'talk_teresa_symbols',
        description: "Parla con Teresa dei simboli",
        condition: { talkedTo: 'teresa', hasClue: 'simboli_portone' },
        reward: { setFlag: 'teresa_symbols_discussed' }
      },
      {
        id: 'find_scene_elements',
        description: "Trova tutti gli elementi della scena",
        condition: { hasClue: 'scena_lanterna', hasClue: 'scena_impronte', hasClue: 'scena_segni' },
        reward: { setFlag: 'scene_elements_complete' }
      },
      {
        id: 'solve_scene',
        description: "Risolvi il puzzle della scena",
        condition: { puzzleSolved: 'scene' },
        reward: { giveClue: 'diario_enzo', setFlag: 'cascina_quest_complete' }
      }
    ],
    onComplete: {
      xp: 75,
      message: "Hai decifrato i simboli. Il diario di Enzo è tuo."
    }
  },
  
  /* ── Quest: Il Registro degli Archivi ── */
  'archive_registry': {
    id: 'archive_registry',
    title: "Il Registro degli Archivi",
    description: "Riordina il registro delle sparizioni per scoprire il pattern.",
    chapter: 'investigation',
    stages: [
      {
        id: 'access_registry',
        description: "Accedi al registro nell'Archivio",
        condition: { visitedArea: 'chiesa', talkedTo: 'neri' },
        reward: { setFlag: 'registry_accessed' }
      },
      {
        id: 'solve_registry',
        description: "Ricostruisci l'ordine cronologico",
        condition: { puzzleSolved: 'registry' },
        reward: { setFlag: 'registry_solved', updateNPCState: { neri: 1 } }
      }
    ],
    onComplete: {
      xp: 50,
      message: "Il pattern è chiaro: 1952, 1969, 1974, 1979..."
    }
  },
  
  /* ── Quest: Il Registratore di Monte Ferro ── */
  'monte_ferro_recorder': {
    id: 'monte_ferro_recorder',
    title: "Il Registratore di Monte Ferro",
    description: "Ripara il registratore per ascoltare il messaggio del 1979.",
    chapter: 'deepening',
    stages: [
      {
        id: 'find_recorder',
        description: "Trova il registratore nella Zona Industriale",
        condition: { visitedArea: 'industriale' },
        reward: { setFlag: 'recorder_found' }
      },
      {
        id: 'solve_recorder',
        description: "Collega correttamente i cavi",
        condition: { puzzleSolved: 'recorder' },
        reward: { giveClue: 'registro_monte_ferro', setFlag: 'recorder_quest_complete' }
      }
    ],
    onComplete: {
      xp: 100,
      message: "Hai ascoltato il messaggio. Qualcosa è andato storto nel 1979..."
    }
  }
};

/**
 * TRIGGER DIALOGHI
 * Definisce quale nodo di dialogo mostrare in base allo stato di gioco
 */
var storyDialogueTriggers = {
  
  'ruggeri': {
    npcId: 'ruggeri',
    states: [
      { 
        id: 's0_intro',
        condition: { chapterAtMost: 'intro' },
        node: 'ruggeri_s0'
      },
      {
        id: 's0_investigation',
        condition: { chapter: 'investigation', hasFlag: 'intro_complete' },
        node: 'ruggeri_s0'
      },
      {
        id: 's1_lettera',
        condition: { hasClue: 'lettera_censurata', chapterAtLeast: 'investigation' },
        node: 'ruggeri_s1'
      },
      {
        id: 's2_deduction',
        condition: { hasFlag: 'deduction_complete' },
        node: 'ruggeri_s2'
      }
    ],
    defaultNode: 'ruggeri_s0'
  },
  
  'teresa': {
    npcId: 'teresa',
    states: [
      {
        id: 's0_intro',
        condition: { chapterAtMost: 'investigation' },
        node: 'teresa_s0'
      },
      {
        id: 's1_simboli',
        condition: { hasClue: 'simboli_portone' },
        node: 'teresa_s1'
      },
      {
        id: 's2_memory',
        condition: { hasFlag: 'deduction_complete' },
        node: 'teresa_s2_memory',
        special: 'memory_corrupt'
      },
      {
        id: 's2_normal',
        condition: { hasFlag: 'deduction_complete' },
        node: 'teresa_s2'
      }
    ],
    defaultNode: 'teresa_s0'
  },
  
  'neri': {
    npcId: 'neri',
    states: [
      {
        id: 's0_intro',
        condition: { chapterAtMost: 'investigation' },
        node: 'neri_s0'
      },
      {
        id: 's1_registro',
        condition: { hasClue: 'registro_1861' },
        node: 'neri_s1'
      },
      {
        id: 's2_deduction',
        condition: { hasFlag: 'deduction_complete' },
        node: 'neri_s2'
      }
    ],
    defaultNode: 'neri_s0'
  },
  
  'valli': {
    npcId: 'valli',
    states: [
      {
        id: 's0_cold',
        condition: { chapterAtMost: 'deepening', missingClue: 'frammento' },
        node: 'valli_s0'
      },
      {
        id: 's1_frammento',
        condition: { hasClue: 'frammento' },
        node: 'valli_s1'
      },
      {
        id: 's2_deduction',
        condition: { hasFlag: 'deduction_complete' },
        node: 'valli_s2'
      }
    ],
    defaultNode: 'valli_s0'
  },
  
  'anselmo': {
    npcId: 'anselmo',
    states: [
      {
        id: 's0_intro',
        condition: { missingFlag: 'anselmo_remembering' },
        node: 'anselmo_s0'
      },
      {
        id: 's1_radio',
        condition: { hasFlag: 'anselmo_remembering' },
        node: 'anselmo_s1'
      }
    ],
    defaultNode: 'anselmo_s0'
  },
  
  'osvaldo': {
    npcId: 'osvaldo',
    states: [
      { id: 's0_always', condition: null, node: 'osvaldo_s0' }
    ],
    defaultNode: 'osvaldo_s0'
  },
  
  'gino': {
    npcId: 'gino',
    states: [
      { id: 's0_always', condition: null, node: 'gino_s0' }
    ],
    defaultNode: 'gino_s0'
  },
  
  'don_pietro': {
    npcId: 'don_pietro',
    states: [
      { id: 's0_always', condition: null, node: 'don_pietro_s0' }
    ],
    defaultNode: 'don_pietro_s0'
  }
};

/**
 * CONDIZIONI ENDING
 * Definisce come calcolare il finale in base agli indizi raccolti
 */
var storyEndingConditions = {
  
  'secret': {
    id: 'secret',
    title: "NON È ARRIVATO. È STATO APERTO.",
    priority: 100,  // Priorità più alta
    conditions: {
      cluesMin: 6,
      hasClues: ['lettera_censurata', 'radio_audio', 'registro_1861', 'frammento', 'tracce_circolari', 'simboli_portone'],
      puzzleSolved: ['deduction', 'radio', 'registry']
    },
    description: "Il finale vero - hai scoperto tutta la verità"
  },
  
  'alien': {
    id: 'alien',
    title: "NON SONO SOLI",
    priority: 80,
    conditions: {
      cluesMin: 4,
      hasClues: ['frammento', 'tracce_circolari', 'simboli_portone'],
      missingClues: ['lettera_censurata']
    },
    description: "Finale extraterrestre - prove di visita aliena"
  },
  
  'military': {
    id: 'military',
    title: "ESPERIMENTO FUORI CONTROLLO",
    priority: 60,
    conditions: {
      cluesMin: 3,
      hasClues: ['lettera_censurata', 'radio_audio', 'registro_1861']
    },
    description: "Finale militare - copertura governativa"
  },
  
  'psychological': {
    id: 'psychological',
    title: "ISTERIA COLLETTIVA",
    priority: 10,  // Priorità più bassa, fallback
    conditions: {
      cluesMax: 2
    },
    description: "Finale psicologico - mancanza di prove"
  }
};

/**
 * EVENTI SPECIALI
 * Eventi che si attivano in condizioni specifiche
 */
var storyEvents = {
  
  'first_clue_found': {
    id: 'first_clue_found',
    trigger: { cluesFound: 1 },
    once: true,
    action: function() {
      showToast("Primo indizio raccolto! Controlla il Diario con [J]");
      StoryManager.setFlag('first_clue_found');
    }
  },
  
  'half_clues_found': {
    id: 'half_clues_found',
    trigger: { cluesFound: 5 },
    once: true,
    action: function() {
      showToast("Hai raccolto metà degli indizi. Continua così!");
      StoryManager.setFlag('half_clues_found');
    }
  },
  
  'all_clues_found': {
    id: 'all_clues_found',
    trigger: { cluesFound: 'all' },
    once: true,
    action: function() {
      showToast("Hai trovato TUTTI gli indizi! Sei pronto per la verità.");
      StoryManager.setFlag('all_clues_found');
    }
  },
  
  'chapter_unlock_deduction': {
    id: 'chapter_unlock_deduction',
    trigger: { hasClues: ['registro_1861', 'mappa_campi', 'tracce_circolari'] },
    once: true,
    action: function() {
      showToast("Hai raccolto abbastanza indizi per la Deduzione! Premi [T]");
    }
  },
  
  'teresa_memory_corrupt': {
    id: 'teresa_memory_corrupt',
    trigger: { hasFlag: 'deduction_complete', talkedTo: 'teresa' },
    once: true,
    action: function() {
      // Effetto speciale: corrompi la memoria di Teresa
      ScreenShake.shake(3, 20);
      showToast("La realtà sembra... instabile.");
    }
  }
};

/**
 * OBIETTIVI GLOBALI (achievements)
 */
var storyAchievements = {
  'detective_novice': {
    id: 'detective_novice',
    title: "Detective Novizio",
    description: "Trova il tuo primo indizio",
    condition: { cluesFound: 1 }
  },
  'detective_expert': {
    id: 'detective_expert',
    title: "Detective Esperto",
    description: "Trova tutti gli indizi",
    condition: { cluesFound: 'all' }
  },
  'social_butterfly': {
    id: 'social_butterfly',
    title: "Animale Sociale",
    description: "Parla con tutti gli NPC",
    condition: { talkedToAll: ['ruggeri', 'teresa', 'neri', 'valli', 'anselmo', 'osvaldo', 'gino', 'don_pietro'] }
  },
  'puzzle_master': {
    id: 'puzzle_master',
    title: "Maestro degli Enigmi",
    description: "Risolvi tutti i puzzle",
    condition: { puzzlesSolved: ['radio', 'registry', 'scene', 'recorder', 'deduction'] }
  },
  'secret_ending': {
    id: 'secret_ending',
    title: "La Verità",
    description: "Scopri il finale segreto",
    condition: { endingReached: 'secret' }
  }
};

/* ══════════════════════════════════════════════════════════════
   ESPORTA DATI
   ══════════════════════════════════════════════════════════════ */

// Rendi disponibili globalmente
if (typeof window !== 'undefined') {
  window.storyChapters = storyChapters;
  window.storyQuests = storyQuests;
  window.storyDialogueTriggers = storyDialogueTriggers;
  window.storyEndingConditions = storyEndingConditions;
  window.storyEvents = storyEvents;
  window.storyAchievements = storyAchievements;
}
