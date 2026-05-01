/* ══════════════════════════════════════════════════════════════
   STORY MANAGER — Facade della Narrazione
   ══════════════════════════════════════════════════════════════
   
   StoryManager e' ora un facade che coordina i manager specializzati:
   - ChapterManager: capitoli e obiettivi
   - QuestManager: quest e ricompense
   - FlagManager: flag booleani di stato
   - StatsManager: statistiche di gioco
   
   La logica orchestrativa (condizioni, dialoghi, ending) resta qui.
   ══════════════════════════════════════════════════════════════ */

const StoryManager = {
  /* ── INIZIALIZZAZIONE ── */

  init: () => {
    if (typeof ChapterManager !== 'undefined') ChapterManager.init();
    if (typeof QuestManager !== 'undefined') QuestManager.init();
    if (typeof FlagManager !== 'undefined') FlagManager.init();
    if (typeof StatsManager !== 'undefined') StatsManager.init();

    console.log('[StoryManager] Inizializzato');
  },

  reset: function () {
    this.init();
  },

  /* ── FACADE FLAG ── */

  setFlag: function (flagName, value) {
    if (typeof FlagManager !== 'undefined') {
      FlagManager.setFlag(flagName, value);
      this.checkEvents();
    }
    return true;
  },

  getFlag: (flagName) =>
    typeof FlagManager !== 'undefined' ? FlagManager.getFlag(flagName) : false,

  hasFlag: (flagName) =>
    typeof FlagManager !== 'undefined' ? FlagManager.hasFlag(flagName) : false,

  /* ── FACADE CAPITOLI (delega a ChapterManager) ── */

  startChapter: (chapterId) =>
    typeof ChapterManager !== 'undefined' ? ChapterManager.startChapter(chapterId) : false,

  completeCurrentChapter: () =>
    typeof ChapterManager !== 'undefined' ? ChapterManager.completeCurrentChapter() : false,

  isChapterCompleted: (chapterId) =>
    typeof ChapterManager !== 'undefined' ? ChapterManager.isChapterCompleted(chapterId) : false,

  getCurrentChapter: () =>
    typeof ChapterManager !== 'undefined' ? ChapterManager.getCurrentChapter() : null,

  getChapterData: function () {
    return this.getCurrentChapter();
  },

  completeObjective: (objectiveId) =>
    typeof ChapterManager !== 'undefined' ? ChapterManager.completeObjective(objectiveId) : false,

  isObjectiveCompleted: (chapterId, objectiveId) =>
    typeof ChapterManager !== 'undefined'
      ? ChapterManager.isObjectiveCompleted(chapterId, objectiveId)
      : false,

  getCurrentObjectives: () =>
    typeof ChapterManager !== 'undefined' ? ChapterManager.getCurrentObjectives() : [],

  /* ── FACADE QUEST (delega a QuestManager) ── */

  activateQuestsForChapter: (chapterId) => {
    if (typeof QuestManager !== 'undefined') QuestManager.activateQuestsForChapter(chapterId);
  },

  checkQuestProgress: function () {
    if (typeof QuestManager !== 'undefined')
      QuestManager.checkQuestProgress(this.checkCondition.bind(this));
  },

  completeQuest: (questId) => {
    if (typeof QuestManager !== 'undefined') QuestManager.completeQuest(questId);
  },

  getActiveQuests: () =>
    typeof QuestManager !== 'undefined' ? QuestManager.getActiveQuests() : [],

  /* ── SISTEMA DIALOGHI ── */

  getDialogueNodeForNPC: function (npcId) {
    var trigger =
      typeof storyDialogueTriggers !== 'undefined' ? storyDialogueTriggers[npcId] : null;
    if (!trigger) {
      console.warn('[StoryManager] Nessun trigger per NPC:', npcId);
      return `${npcId}_s0`;
    }

    for (var i = 0; i < trigger.states.length; i++) {
      var state = trigger.states[i];
      if (this.checkCondition(state.condition)) {
        return state.node;
      }
    }

    return trigger.defaultNode;
  },

  onDialogueStarted: function (npcId) {
    if (typeof StatsManager !== 'undefined') StatsManager.onTalkedTo(npcId);
    this.checkObjectivesForEvent('talkedTo', npcId);
    this.checkObjectivesForEvent('talkedToCount', null);
    this.checkQuestProgress();
    this.checkEvents();
  },

  /* ── SISTEMA CONDIZIONI ── */

  checkCondition: function (condition) {
    if (!condition) return true;

    var chapterMgr = typeof ChapterManager !== 'undefined' ? ChapterManager : null;
    var statsMgr = typeof StatsManager !== 'undefined' ? StatsManager : null;

    if (condition.chapter) {
      if (!chapterMgr || chapterMgr.getCurrentChapterId() !== condition.chapter) return false;
    }

    if (condition.chapterAtMost) {
      var maxOrder = storyChapters[condition.chapterAtMost].order;
      var currentOrder = chapterMgr?.getCurrentChapterId()
        ? storyChapters[chapterMgr.getCurrentChapterId()].order
        : 0;
      if (currentOrder > maxOrder) return false;
    }

    if (condition.chapterAtLeast) {
      var minOrder = storyChapters[condition.chapterAtLeast].order;
      var currentOrder = chapterMgr?.getCurrentChapterId()
        ? storyChapters[chapterMgr.getCurrentChapterId()].order
        : 0;
      if (currentOrder < minOrder) return false;
    }

    if (condition.hasFlag) {
      if (!this.hasFlag(condition.hasFlag)) return false;
    }

    if (condition.missingFlag) {
      if (this.hasFlag(condition.missingFlag)) return false;
    }

    if (condition.hasClue) {
      if (!gameState || gameState.cluesFound.indexOf(condition.hasClue) === -1) return false;
    }

    if (condition.missingClue) {
      if (gameState && gameState.cluesFound.indexOf(condition.missingClue) !== -1) return false;
    }

    if (condition.hasClues) {
      for (var i = 0; i < condition.hasClues.length; i++) {
        if (!gameState || gameState.cluesFound.indexOf(condition.hasClues[i]) === -1) return false;
      }
    }

    if (condition.cluesMin) {
      if (!gameState || gameState.cluesFound.length < condition.cluesMin) return false;
    }

    if (condition.cluesMax) {
      if (!gameState || gameState.cluesFound.length > condition.cluesMax) return false;
    }

    if (condition.cluesFound === 'all') {
      var totalClues = typeof clues !== 'undefined' ? clues.length : 9;
      if (!gameState || gameState.cluesFound.length < totalClues) return false;
    }

    if (typeof condition.cluesFound === 'number') {
      if (!gameState || gameState.cluesFound.length < condition.cluesFound) return false;
    }

    if (condition.talkedTo) {
      if (!statsMgr?.hasTalkedTo(condition.talkedTo)) return false;
    }

    if (condition.talkedToCount) {
      if (!statsMgr || statsMgr.getTalkedToCount() < condition.talkedToCount) return false;
    }

    if (condition.talkedToAll) {
      for (var j = 0; j < condition.talkedToAll.length; j++) {
        if (!statsMgr?.hasTalkedTo(condition.talkedToAll[j])) return false;
      }
    }

    if (condition.puzzleSolved) {
      if (!statsMgr?.hasSolvedPuzzle(condition.puzzleSolved)) return false;
    }

    if (condition.puzzlesSolved) {
      for (var k = 0; k < condition.puzzlesSolved.length; k++) {
        if (!statsMgr?.hasSolvedPuzzle(condition.puzzlesSolved[k])) return false;
      }
    }

    if (condition.visitedArea) {
      if (!statsMgr?.hasVisitedArea(condition.visitedArea)) return false;
    }

    return true;
  },

  /* ── SISTEMA EVENTI ── */

  checkEvents: function () {
    if (typeof storyEvents === 'undefined') return;

    var triggered =
      typeof ChapterManager !== 'undefined' && ChapterManager.triggeredEvents
        ? ChapterManager.triggeredEvents
        : [];

    for (var eventId in storyEvents) {
      var event = storyEvents[eventId];
      if (event.once && triggered.indexOf(eventId) !== -1) continue;
      if (this.checkCondition(event.trigger)) {
        triggered.push(eventId);
        if (typeof event.action === 'function') event.action();
        console.log('[StoryManager] Evento attivato:', eventId);
      }
    }
  },

  checkObjectivesForEvent: (eventType, target) => {
    var chapterMgr = typeof ChapterManager !== 'undefined' ? ChapterManager : null;
    if (!chapterMgr?.currentChapter) return;

    var chapter = storyChapters ? storyChapters[chapterMgr.currentChapter] : null;
    if (!chapter?.objectives) return;

    for (var i = 0; i < chapter.objectives.length; i++) {
      var obj = chapter.objectives[i];
      if (!obj.condition) continue;

      if (eventType === 'talkedTo' && obj.condition.talkedTo === target) {
        chapterMgr.completeObjective(obj.id);
      }
      if (eventType === 'talkedToCount' && obj.condition.talkedToCount) {
        var statsMgr = typeof StatsManager !== 'undefined' ? StatsManager : null;
        var count = statsMgr ? statsMgr.getTalkedToCount() : 0;
        if (count >= obj.condition.talkedToCount) {
          chapterMgr.completeObjective(obj.id);
        }
      }
    }
  },

  /* ── SISTEMA REWARD ── */

  applyReward: function (reward) {
    if (!reward) return;

    if (reward.setFlag) this.setFlag(reward.setFlag);

    if (reward.updateNPCState && gameState?.npcStates) {
      for (var npcId in reward.updateNPCState) {
        gameState.npcStates[npcId] = reward.updateNPCState[npcId];
      }
    }

    if (reward.giveClue && typeof collectClue === 'function') {
      collectClue(reward.giveClue);
    }

    if (reward.giveClueHint) {
      console.log('[StoryManager] Hint per indizio:', reward.giveClueHint);
    }

    if (reward.xp) {
      console.log('[StoryManager] XP guadagnati:', reward.xp);
    }
  },

  /* ── SISTEMA ENDING ── */

  determineEnding: function () {
    if (typeof storyEndingConditions === 'undefined') return null;

    var sortedEndings = [];
    for (var endingId in storyEndingConditions) {
      sortedEndings.push(storyEndingConditions[endingId]);
    }
    sortedEndings.sort((a, b) => b.priority - a.priority);

    for (var i = 0; i < sortedEndings.length; i++) {
      if (this.checkCondition(sortedEndings[i].conditions)) {
        return sortedEndings[i];
      }
    }

    return storyEndingConditions.psychological;
  },

  /* ── TRACKING STATISTICHE (delega a StatsManager) ── */

  onAreaVisited: function (areaId) {
    if (typeof StatsManager !== 'undefined') StatsManager.onAreaVisited(areaId);
    this.checkObjectivesForEvent('visitedArea', areaId);
    this.checkQuestProgress();
    this.checkEvents();
  },

  onClueFound: function (clueId) {
    if (typeof StatsManager !== 'undefined') StatsManager.onClueFound();
    this.checkObjectivesForEvent('cluesFound', clueId);
    this.checkQuestProgress();
    this.checkEvents();
  },

  onPuzzleSolved: function (puzzleId) {
    if (typeof StatsManager !== 'undefined') StatsManager.onPuzzleSolved(puzzleId);

    if (puzzleId === 'deduction' && gameState) gameState.puzzleSolved = true;
    if (puzzleId === 'radio' && gameState) gameState.radioSolved = true;

    this.checkQuestProgress();
    this.checkEvents();
  },

  /* ── SERIALIZZAZIONE ── */

  serialize: () => ({
    currentChapter: typeof ChapterManager !== 'undefined' ? ChapterManager.currentChapter : null,
    completedChapters:
      typeof ChapterManager !== 'undefined' ? ChapterManager.completedChapters : [],
    flags: typeof FlagManager !== 'undefined' ? FlagManager.serialize() : {},
    activeQuests: typeof QuestManager !== 'undefined' ? QuestManager.serialize().activeQuests : {},
    completedQuests:
      typeof QuestManager !== 'undefined' ? QuestManager.serialize().completedQuests : [],
    completedObjectives:
      typeof ChapterManager !== 'undefined' ? ChapterManager.completedObjectives : {},
    stats: typeof StatsManager !== 'undefined' ? StatsManager.serialize() : {},
    triggeredEvents:
      typeof ChapterManager !== 'undefined' && ChapterManager.triggeredEvents
        ? ChapterManager.triggeredEvents
        : [],
    unlockedAchievements: [],
  }),

  deserialize: (data) => {
    if (!data) return false;

    if (typeof ChapterManager !== 'undefined') {
      ChapterManager.deserialize({
        currentChapter: data.currentChapter,
        completedChapters: data.completedChapters,
        completedObjectives: data.completedObjectives,
      });
    }
    if (typeof FlagManager !== 'undefined') FlagManager.deserialize(data.flags);
    if (typeof QuestManager !== 'undefined')
      QuestManager.deserialize({
        activeQuests: data.activeQuests,
        completedQuests: data.completedQuests,
      });
    if (typeof StatsManager !== 'undefined') StatsManager.deserialize(data.stats);

    return true;
  },
};

/* ══════════════════════════════════════════════════════════════
   FUNZIONI DI UTILITÀ GLOBALI
   ══════════════════════════════════════════════════════════════ */

export function initStoryManager() {
  StoryManager.init();
}

export function resetStoryManager() {
  StoryManager.reset();
}

if (typeof window !== 'undefined') {
  window.StoryManager = StoryManager;
  window.initStoryManager = initStoryManager;
  window.resetStoryManager = resetStoryManager;
}
