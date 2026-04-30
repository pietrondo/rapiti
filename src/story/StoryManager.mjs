/* ══════════════════════════════════════════════════════════════
   STORY MANAGER — Gestione Centralizzata della Narrazione
   ══════════════════════════════════════════════════════════════
   
   Il StoryManager è il cuore del sistema narrativo. Gestisce:
   - Capitoli della storia e progressione
   - Quest e obiettivi
   - Flag di stato (StoryFlags)
   - Trigger per dialoghi
   - Eventi speciali
   - Determinazione ending
   
   Per espandere la storia, modifica storyData.js, NON questo file.
   ══════════════════════════════════════════════════════════════ */

/**
 * StoryManager — Singleton per la gestione della narrazione
 */
const StoryManager = {
  
  /* ── STATO INTERNO ── */
  
  /** Capitolo attuale */
  currentChapter: null,
  
  /** Storia dei capitoli completati */
  completedChapters: [],
  
  /** Flag di stato dinamici */
  flags: {},
  
  /** Quest attive e completate */
  activeQuests: {},
  completedQuests: [],
  
  /** Obiettivi completati per capitolo */
  completedObjectives: {},
  
  /** Contatori per statistiche */
  stats: {
    talkedTo: {},
    visitedAreas: {},
    cluesFound: 0,
    puzzlesSolved: {},
    totalPlayTime: 0
  },
  
  /** Eventi già attivati (per evitare duplicati) */
  triggeredEvents: [],
  
  /** Achievement sbloccati */
  unlockedAchievements: [],
  
  /* ── INIZIALIZZAZIONE ── */
  
  /**
   * Inizializza il StoryManager
   */
  init: function() {
    this.currentChapter = null;
    this.completedChapters = [];
    this.flags = {};
    this.activeQuests = {};
    this.completedQuests = [];
    this.completedObjectives = {};
    this.stats = {
      talkedTo: {},
      visitedAreas: {},
      cluesFound: 0,
      puzzlesSolved: {},
      totalPlayTime: 0
    };
    this.triggeredEvents = [];
    this.unlockedAchievements = [];
    
    // Avvia dal primo capitolo
    this.startChapter('intro');
    
    console.log('[StoryManager] Inizializzato');
  },
  
  /**
   * Resetta tutto lo stato
   */
  reset: function() {
    this.init();
  },
  
  /* ── GESTIONE CAPITOLI ── */
  
  /**
   * Avvia un capitolo
   * @param {string} chapterId - ID del capitolo
   */
  startChapter: function(chapterId) {
    var chapter = storyChapters[chapterId];
    if (!chapter) {
      console.error('[StoryManager] Capitolo non trovato:', chapterId);
      return false;
    }
    
    this.currentChapter = chapterId;
    this.completedObjectives[chapterId] = [];
    
    // Attiva quest associate al capitolo
    this.activateQuestsForChapter(chapterId);
    
    console.log('[StoryManager] Capitolo avviato:', chapter.title);
    
    // Notifica
    if (typeof showToast === 'function') {
      showToast('Capitolo: ' + chapter.title);
    }
    
    return true;
  },
  
  /**
   * Completa il capitolo attuale e passa al successivo
   */
  completeCurrentChapter: function() {
    if (!this.currentChapter) return false;
    
    var chapter = storyChapters[this.currentChapter];
    this.completedChapters.push(this.currentChapter);
    
    // Esegui azioni di completamento
    if (chapter.onComplete) {
      if (chapter.onComplete.setFlag) {
        this.setFlag(chapter.onComplete.setFlag);
      }
      if (chapter.onComplete.unlockChapter) {
        this.startChapter(chapter.onComplete.unlockChapter);
      }
      if (chapter.onComplete.message && typeof showToast === 'function') {
        showToast(chapter.onComplete.message);
      }
    }
    
    return true;
  },
  
  /**
   * Verifica se un capitolo è completato
   */
  isChapterCompleted: function(chapterId) {
    return this.completedChapters.indexOf(chapterId) !== -1;
  },
  
  /**
   * Ottiene il capitolo attuale
   */
  getCurrentChapter: function() {
    return this.currentChapter ? storyChapters[this.currentChapter] : null;
  },
  
  /**
   * Ottiene i dati del capitolo corrente per compatibilità
   */
  getChapterData: function() {
    return this.getCurrentChapter();
  },
  
  /* ── GESTIONE OBIETTIVI ── */
  
  /**
   * Verifica se un obiettivo è completato
   */
  isObjectiveCompleted: function(chapterId, objectiveId) {
    var completed = this.completedObjectives[chapterId];
    return completed && completed.indexOf(objectiveId) !== -1;
  },
  
  /**
   * Completa un obiettivo
   */
  completeObjective: function(objectiveId) {
    if (!this.currentChapter) return false;
    
    var chapter = storyChapters[this.currentChapter];
    var objective = chapter.objectives.find(function(obj) { return obj.id === objectiveId; });
    
    if (!objective) return false;
    
    // Aggiungi alla lista completati
    if (!this.completedObjectives[this.currentChapter]) {
      this.completedObjectives[this.currentChapter] = [];
    }
    
    if (this.completedObjectives[this.currentChapter].indexOf(objectiveId) === -1) {
      this.completedObjectives[this.currentChapter].push(objectiveId);
      console.log('[StoryManager] Obiettivo completato:', objective.description);
      
      // Verifica se il capitolo è completato
      this.checkChapterCompletion();
      
      return true;
    }
    
    return false;
  },
  
  /**
   * Verifica se tutti gli obiettivi richiesti sono completati
   */
  checkChapterCompletion: function() {
    if (!this.currentChapter) return false;
    
    var chapter = storyChapters[this.currentChapter];
    var completed = this.completedObjectives[this.currentChapter] || [];
    
    var allRequiredCompleted = chapter.requiredObjectives.every(function(reqId) {
      return completed.indexOf(reqId) !== -1;
    });
    
    if (allRequiredCompleted) {
      this.completeCurrentChapter();
      return true;
    }
    
    return false;
  },
  
  /**
   * Ottiene la lista degli obiettivi attuali
   */
  getCurrentObjectives: function() {
    if (!this.currentChapter) return [];
    
    var chapter = storyChapters[this.currentChapter];
    var completed = this.completedObjectives[this.currentChapter] || [];
    
    return chapter.objectives.map(function(obj) {
      return {
        id: obj.id,
        description: obj.description,
        completed: completed.indexOf(obj.id) !== -1,
        required: chapter.requiredObjectives.indexOf(obj.id) !== -1
      };
    });
  },
  
  /* ── GESTIONE FLAG ── */
  
  /**
   * Imposta un flag
   */
  setFlag: function(flagName, value) {
    value = value !== undefined ? value : true;
    this.flags[flagName] = value;
    console.log('[StoryManager] Flag impostato:', flagName, value);
    
    // Verifica eventi
    this.checkEvents();
    
    return true;
  },
  
  /**
   * Ottiene un flag
   */
  getFlag: function(flagName) {
    return this.flags[flagName] || false;
  },
  
  /**
   * Verifica se un flag è attivo
   */
  hasFlag: function(flagName) {
    return !!this.flags[flagName];
  },
  
  /**
   * Rimuove un flag
   */
  clearFlag: function(flagName) {
    delete this.flags[flagName];
    return true;
  },
  
  /* ── GESTIONE QUEST ── */
  
  /**
   * Attiva le quest per un capitolo
   */
  activateQuestsForChapter: function(chapterId) {
    for (var questId in storyQuests) {
      var quest = storyQuests[questId];
      if (quest.chapter === chapterId && !this.activeQuests[questId] && 
          this.completedQuests.indexOf(questId) === -1) {
        this.activeQuests[questId] = {
          id: questId,
          currentStage: 0,
          stagesCompleted: []
        };
        console.log('[StoryManager] Quest attivata:', quest.title);
      }
    }
  },
  
  /**
   * Verifica il progresso delle quest attive
   */
  checkQuestProgress: function() {
    for (var questId in this.activeQuests) {
      var quest = storyQuests[questId];
      var progress = this.activeQuests[questId];
      
      if (!quest || !quest.stages) continue;
      
      var currentStage = quest.stages[progress.currentStage];
      if (!currentStage) continue;
      
      // Verifica se lo stage è completato
      if (this.checkCondition(currentStage.condition)) {
        // Applica reward
        if (currentStage.reward) {
          this.applyReward(currentStage.reward);
        }
        
        progress.stagesCompleted.push(currentStage.id);
        progress.currentStage++;
        
        console.log('[StoryManager] Quest stage completato:', currentStage.description);
        
        // Verifica se la quest è completata
        if (progress.currentStage >= quest.stages.length) {
          this.completeQuest(questId);
        }
      }
    }
  },
  
  /**
   * Completa una quest
   */
  completeQuest: function(questId) {
    delete this.activeQuests[questId];
    this.completedQuests.push(questId);
    
    var quest = storyQuests[questId];
    if (quest && quest.onComplete) {
      if (quest.onComplete.message && typeof showToast === 'function') {
        showToast(quest.onComplete.message);
      }
    }
    
    console.log('[StoryManager] Quest completata:', questId);
  },
  
  /**
   * Ottiene le quest attive
   */
  getActiveQuests: function() {
    var result = [];
    for (var questId in this.activeQuests) {
      var quest = storyQuests[questId];
      var progress = this.activeQuests[questId];
      result.push({
        id: questId,
        title: quest.title,
        description: quest.description,
        currentStage: progress.currentStage,
        totalStages: quest.stages.length,
        currentStageDescription: quest.stages[progress.currentStage] ? 
          quest.stages[progress.currentStage].description : null
      });
    }
    return result;
  },
  
  /* ── SISTEMA DIALOGHI ── */
  
  /**
   * Determina quale nodo di dialogo mostrare per un NPC
   * @param {string} npcId - ID dell'NPC
   * @returns {string} ID del nodo di dialogo
   */
  getDialogueNodeForNPC: function(npcId) {
    var trigger = storyDialogueTriggers[npcId];
    if (!trigger) {
      console.warn('[StoryManager] Nessun trigger per NPC:', npcId);
      return npcId + '_s0';
    }
    
    // Cerca lo stato che corrisponde alle condizioni attuali
    for (var i = 0; i < trigger.states.length; i++) {
      var state = trigger.states[i];
      if (this.checkCondition(state.condition)) {
        return state.node;
      }
    }
    
    // Fallback al default
    return trigger.defaultNode;
  },
  
  /**
   * Registra che un dialogo è stato avviato
   */
  onDialogueStarted: function(npcId) {
    this.stats.talkedTo[npcId] = true;
    
    // Verifica obiettivi
    this.checkObjectivesForEvent('talkedTo', npcId);
    this.checkObjectivesForEvent('talkedToCount', null);
    
    // Verifica quest
    this.checkQuestProgress();
    
    // Verifica eventi
    this.checkEvents();
  },
  
  /* ── SISTEMA CONDIZIONI ── */
  
  /**
   * Verifica una condizione
   * @param {Object} condition - Condizione da verificare
   * @returns {boolean}
   */
  checkCondition: function(condition) {
    if (!condition) return true; // Nessuna condizione = sempre vera
    
    // Condizione: capitolo attuale
    if (condition.chapter) {
      if (this.currentChapter !== condition.chapter) return false;
    }
    
    // Condizione: capitolo al massimo X
    if (condition.chapterAtMost) {
      var maxOrder = storyChapters[condition.chapterAtMost].order;
      var currentOrder = storyChapters[this.currentChapter].order;
      if (currentOrder > maxOrder) return false;
    }
    
    // Condizione: capitolo almeno X
    if (condition.chapterAtLeast) {
      var minOrder = storyChapters[condition.chapterAtLeast].order;
      var currentOrder = storyChapters[this.currentChapter].order;
      if (currentOrder < minOrder) return false;
    }
    
    // Condizione: ha un flag
    if (condition.hasFlag) {
      if (!this.hasFlag(condition.hasFlag)) return false;
    }
    
    // Condizione: manca un flag
    if (condition.missingFlag) {
      if (this.hasFlag(condition.missingFlag)) return false;
    }
    
    // Condizione: ha un indizio
    if (condition.hasClue) {
      if (gameState.cluesFound.indexOf(condition.hasClue) === -1) return false;
    }
    
    // Condizione: manca un indizio
    if (condition.missingClue) {
      if (gameState.cluesFound.indexOf(condition.missingClue) !== -1) return false;
    }
    
    // Condizione: ha tutti gli indizi specificati
    if (condition.hasClues) {
      for (var i = 0; i < condition.hasClues.length; i++) {
        if (gameState.cluesFound.indexOf(condition.hasClues[i]) === -1) return false;
      }
    }
    
    // Condizione: numero minimo di indizi
    if (condition.cluesMin) {
      if (gameState.cluesFound.length < condition.cluesMin) return false;
    }
    
    // Condizione: numero massimo di indizi
    if (condition.cluesMax) {
      if (gameState.cluesFound.length > condition.cluesMax) return false;
    }
    
    // Condizione: tutti gli indizi
    if (condition.cluesFound === 'all') {
      // Verifica contro il numero totale di indizi disponibili
      var totalClues = clues ? clues.length : 9;
      if (gameState.cluesFound.length < totalClues) return false;
    }
    
    // Condizione: numero di indizi trovati
    if (typeof condition.cluesFound === 'number') {
      if (gameState.cluesFound.length < condition.cluesFound) return false;
    }
    
    // Condizione: parlato con NPC
    if (condition.talkedTo) {
      if (!this.stats.talkedTo[condition.talkedTo]) return false;
    }
    
    // Condizione: parlato con N NPC
    if (condition.talkedToCount) {
      var count = Object.keys(this.stats.talkedTo).length;
      if (count < condition.talkedToCount) return false;
    }
    
    // Condizione: parlato con tutti gli NPC specificati
    if (condition.talkedToAll) {
      for (var j = 0; j < condition.talkedToAll.length; j++) {
        if (!this.stats.talkedTo[condition.talkedToAll[j]]) return false;
      }
    }
    
    // Condizione: puzzle risolto
    if (condition.puzzleSolved) {
      if (!this.stats.puzzlesSolved[condition.puzzleSolved]) return false;
    }
    
    // Condizione: tutti i puzzle risolti
    if (condition.puzzlesSolved) {
      for (var k = 0; k < condition.puzzlesSolved.length; k++) {
        if (!this.stats.puzzlesSolved[condition.puzzlesSolved[k]]) return false;
      }
    }
    
    // Condizione: area visitata
    if (condition.visitedArea) {
      if (!this.stats.visitedAreas[condition.visitedArea]) return false;
    }
    
    return true;
  },
  
  /**
   * Verifica obiettivi in risposta a un evento
   */
  checkObjectivesForEvent: function(eventType, target) {
    if (!this.currentChapter) return;
    
    var chapter = storyChapters[this.currentChapter];
    if (!chapter || !chapter.objectives) return;
    
    for (var i = 0; i < chapter.objectives.length; i++) {
      var obj = chapter.objectives[i];
      
      // Verifica se l'obiettivo corrisponde all'evento
      if (obj.condition) {
        if (eventType === 'talkedTo' && obj.condition.talkedTo === target) {
          this.completeObjective(obj.id);
        }
        if (eventType === 'talkedToCount' && obj.condition.talkedToCount) {
          var count = Object.keys(this.stats.talkedTo).length;
          if (count >= obj.condition.talkedToCount) {
            this.completeObjective(obj.id);
          }
        }
      }
    }
  },
  
  /* ── SISTEMA EVENTI ── */
  
  /**
   * Verifica e attiva eventi
   */
  checkEvents: function() {
    for (var eventId in storyEvents) {
      var event = storyEvents[eventId];
      
      // Verifica se già attivato (se once: true)
      if (event.once && this.triggeredEvents.indexOf(eventId) !== -1) {
        continue;
      }
      
      // Verifica condizione
      if (this.checkCondition(event.trigger)) {
        this.triggeredEvents.push(eventId);
        
        if (typeof event.action === 'function') {
          event.action();
        }
        
        console.log('[StoryManager] Evento attivato:', eventId);
      }
    }
  },
  
  /* ── SISTEMA REWARD ── */
  
  /**
   * Applica una reward
   */
  applyReward: function(reward) {
    if (!reward) return;
    
    if (reward.setFlag) {
      this.setFlag(reward.setFlag);
    }
    
    if (reward.updateNPCState) {
      for (var npcId in reward.updateNPCState) {
        if (gameState.npcStates) {
          gameState.npcStates[npcId] = reward.updateNPCState[npcId];
        }
      }
    }
    
    if (reward.giveClue && typeof collectClue === 'function') {
      collectClue(reward.giveClue);
    }
    
    if (reward.giveClueHint) {
      // Mostra hint per dove trovare l'indizio
      console.log('[StoryManager] Hint per indizio:', reward.giveClueHint);
    }
    
    if (reward.xp) {
      // Sistema XP (da implementare se necessario)
      console.log('[StoryManager] XP guadagnati:', reward.xp);
    }
  },
  
  /* ── SISTEMA ENDING ── */
  
  /**
   * Determina quale ending mostrare
   * @returns {Object} Dati dell'ending
   */
  determineEnding: function() {
    // Ordina le condizioni per priorità (più alta prima)
    var sortedEndings = [];
    for (var endingId in storyEndingConditions) {
      sortedEndings.push(storyEndingConditions[endingId]);
    }
    sortedEndings.sort(function(a, b) { return b.priority - a.priority; });
    
    // Trova la prima condizione che si verifica
    for (var i = 0; i < sortedEndings.length; i++) {
      var ending = sortedEndings[i];
      if (this.checkCondition(ending.conditions)) {
        return ending;
      }
    }
    
    // Fallback al finale psicologico
    return storyEndingConditions.psychological;
  },
  
  /* ── TRACKING STATISTICHE ── */
  
  /**
   * Registra visita a un'area
   */
  onAreaVisited: function(areaId) {
    this.stats.visitedAreas[areaId] = true;
    
    // Verifica obiettivi
    this.checkObjectivesForEvent('visitedArea', areaId);
    
    // Verifica quest
    this.checkQuestProgress();
    
    // Verifica eventi
    this.checkEvents();
  },
  
  /**
   * Registra raccolta indizio
   */
  onClueFound: function(clueId) {
    this.stats.cluesFound++;
    
    // Verifica obiettivi
    this.checkObjectivesForEvent('cluesFound', clueId);
    
    // Verifica quest
    this.checkQuestProgress();
    
    // Verifica eventi
    this.checkEvents();
  },
  
  /**
   * Registra puzzle risolto
   */
  onPuzzleSolved: function(puzzleId) {
    this.stats.puzzlesSolved[puzzleId] = true;
    
    // Aggiorna anche gameState per retrocompatibilità
    if (puzzleId === 'deduction') {
      gameState.puzzleSolved = true;
    }
    if (puzzleId === 'radio') {
      gameState.radioSolved = true;
    }
    
    // Verifica quest
    this.checkQuestProgress();
    
    // Verifica eventi
    this.checkEvents();
  },
  
  /* ── SERIALIZZAZIONE ── */
  
  /**
   * Esporta lo stato per il salvataggio
   */
  serialize: function() {
    return {
      currentChapter: this.currentChapter,
      completedChapters: this.completedChapters,
      flags: this.flags,
      activeQuests: this.activeQuests,
      completedQuests: this.completedQuests,
      completedObjectives: this.completedObjectives,
      stats: this.stats,
      triggeredEvents: this.triggeredEvents,
      unlockedAchievements: this.unlockedAchievements
    };
  },
  
  /**
   * Carica lo stato da un salvataggio
   */
  deserialize: function(data) {
    if (!data) return false;
    
    this.currentChapter = data.currentChapter || 'intro';
    this.completedChapters = data.completedChapters || [];
    this.flags = data.flags || {};
    this.activeQuests = data.activeQuests || {};
    this.completedQuests = data.completedQuests || [];
    this.completedObjectives = data.completedObjectives || {};
    this.stats = data.stats || { talkedTo: {}, visitedAreas: {}, cluesFound: 0, puzzlesSolved: {}, totalPlayTime: 0 };
    this.triggeredEvents = data.triggeredEvents || [];
    this.unlockedAchievements = data.unlockedAchievements || [];
    
    return true;
  }
};

/* ══════════════════════════════════════════════════════════════
   FUNZIONI DI UTILITÀ GLOBALI
   ══════════════════════════════════════════════════════════════ */

/**
 * Inizializza il StoryManager
 */
export function initStoryManager() {
  StoryManager.init();
}

/**
 * Resetta lo stato della storia
 */
export function resetStoryManager() {
  StoryManager.reset();
}

// Rendi disponibile globalmente
if (typeof window !== 'undefined') {
  window.StoryManager = StoryManager;
  window.initStoryManager = initStoryManager;
  window.resetStoryManager = resetStoryManager;
}
