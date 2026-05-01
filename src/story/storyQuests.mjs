/* ══════════════════════════════════════════════════════════════
   STORY QUESTS — Quest Parallele
   ══════════════════════════════════════════════════════════════ */

const storyQuests = {
  /* ── Quest: Il Mistero di Anselmo ── */
  anselmo_mystery: {
    id: 'anselmo_mystery',
    title: 'Il Mistero di Anselmo',
    description: 'Anselmo ha visto qualcosa nel 1952. Scopri cosa sa.',
    chapter: 'investigation',
    stages: [
      {
        id: 'meet_anselmo',
        description: 'Parla con Anselmo nei Giardini',
        condition: { talkedTo: 'anselmo' },
        reward: { setFlag: 'anselmo_met' },
      },
      {
        id: 'solve_radio',
        description: 'Risolvi il puzzle della Radio per sbloccare i suoi ricordi',
        condition: { puzzleSolved: 'radio' },
        reward: { setFlag: 'anselmo_remembering' },
      },
      {
        id: 'hear_story',
        description: 'Riascolta Anselmo dopo aver risolto la radio',
        condition: { talkedTo: 'anselmo', hasFlag: 'anselmo_remembering' },
        reward: { giveClueHint: 'registro_1861_location', setFlag: 'anselmo_quest_complete' },
      },
    ],
    onComplete: {
      xp: 50,
      message: 'Hai aiutato Anselmo a ricordare. Ora sai della connessione con il 1952.',
    },
  },

  /* ── Quest: I Simboli della Cascina ── */
  cascina_symbols: {
    id: 'cascina_symbols',
    title: 'I Simboli della Cascina',
    description: 'Teresa ha trovato strani simboli. Scopri cosa significano.',
    chapter: 'deepening',
    stages: [
      {
        id: 'talk_teresa_symbols',
        description: 'Parla con Teresa dei simboli',
        condition: { talkedTo: 'teresa', hasClue: 'simboli_portone' },
        reward: { setFlag: 'teresa_symbols_discussed' },
      },
      {
        id: 'find_scene_elements',
        description: 'Trova tutti gli elementi della scena',
        condition: { hasClue: 'scena_segni' },
        reward: { setFlag: 'scene_elements_complete' },
      },
      {
        id: 'solve_scene',
        description: 'Risolvi il puzzle della scena',
        condition: { puzzleSolved: 'scene' },
        reward: { giveClue: 'diario_enzo', setFlag: 'cascina_quest_complete' },
      },
    ],
    onComplete: {
      xp: 75,
      message: 'Hai decifrato i simboli. Il diario di Enzo è tuo.',
    },
  },

  /* ── Quest: Il Registro degli Archivi ── */
  archive_registry: {
    id: 'archive_registry',
    title: 'Il Registro degli Archivi',
    description: 'Riordina il registro delle sparizioni per scoprire il pattern.',
    chapter: 'investigation',
    stages: [
      {
        id: 'access_registry',
        description: "Accedi al registro nell'Archivio",
        condition: { visitedArea: 'chiesa', talkedTo: 'neri' },
        reward: { setFlag: 'registry_accessed' },
      },
      {
        id: 'solve_registry',
        description: "Ricostruisci l'ordine cronologico",
        condition: { puzzleSolved: 'registry' },
        reward: { setFlag: 'registry_solved', updateNPCState: { neri: 1 } },
      },
    ],
    onComplete: {
      xp: 50,
      message: 'Il pattern è chiaro: 1952, 1969, 1974, 1979...',
    },
  },

  /* ── Quest: Il Registratore di Monte Ferro ── */
  monte_ferro_recorder: {
    id: 'monte_ferro_recorder',
    title: 'Il Registratore di Monte Ferro',
    description: 'Ripara il registratore per ascoltare il messaggio del 1979.',
    chapter: 'deepening',
    stages: [
      {
        id: 'find_recorder',
        description: 'Trova il registratore nella Zona Industriale',
        condition: { visitedArea: 'industriale' },
        reward: { setFlag: 'recorder_found' },
      },
      {
        id: 'solve_recorder',
        description: 'Collega correttamente i cavi',
        condition: { puzzleSolved: 'recorder' },
        reward: { giveClue: 'registro_monte_ferro', setFlag: 'recorder_quest_complete' },
      },
    ],
    onComplete: {
      xp: 100,
      message: 'Hai ascoltato il messaggio. Qualcosa è andato storto nel 1979...',
    },
  },
};

if (typeof window !== 'undefined') {
  window.storyQuests = storyQuests;
}
