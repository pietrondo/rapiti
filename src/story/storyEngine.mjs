/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    STORY ENGINE MODULE (Facade)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Core story engine — ora facade che orchestra sotto-moduli specializzati:
 * FlagManager, StatsManager, DialogueSystem, ConditionSystem, EventSystem,
 * EndingSystem, AchievementSystem.
 *
 * Mantiene API retrocompatibile al 100%.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const StoryEngine = {
  /* ── DELEGATION HELPERS ── */

  _fm: () => (typeof FlagManager !== 'undefined' ? FlagManager : null),
  _sm: () => (typeof StatsManager !== 'undefined' ? StatsManager : null),
  _ds: () => (typeof DialogueSystem !== 'undefined' ? DialogueSystem : null),
  _cs: () => (typeof ConditionSystem !== 'undefined' ? ConditionSystem : null),
  _es: () => (typeof EventSystem !== 'undefined' ? EventSystem : null),
  _ens: () => (typeof EndingSystem !== 'undefined' ? EndingSystem : null),
  _as: () => (typeof AchievementSystem !== 'undefined' ? AchievementSystem : null),

  /** Legacy state mirrors (for direct access compatibility) */
  flags: {},
  triggeredEvents: [],
  stats: {
    talkedTo: {},
    visitedAreas: {},
    cluesFound: 0,
    puzzlesSolved: {},
    totalPlayTime: 0,
  },
  unlockedAchievements: [],

  /* ── INITIALIZATION ── */

  init: function () {
    this.flags = {};
    this.triggeredEvents = [];
    this.stats = {
      talkedTo: {},
      visitedAreas: {},
      cluesFound: 0,
      puzzlesSolved: {},
      totalPlayTime: 0,
    };
    this.unlockedAchievements = [];

    var fm = this._fm();
    if (fm?.init) fm.init();
    var sm = this._sm();
    if (sm?.init) sm.init();
    var es = this._es();
    if (es?.init) es.init();
    var as = this._as();
    if (as?.init) as.init();
  },

  reset: function () {
    this.init();
  },

  /* ── FLAG MANAGEMENT ── */

  setFlag: function (flagName, value) {
    value = value !== undefined ? value : true;
    this.flags[flagName] = value;
    var fm = this._fm();
    if (fm?.setFlag) fm.setFlag(flagName, value);
    else console.log('[StoryEngine] Flag set:', flagName, value);
    return true;
  },

  getFlag: function (flagName) {
    var fm = this._fm();
    if (fm?.getFlag) return fm.getFlag(flagName);
    return this.flags[flagName];
  },

  hasFlag: function (flagName) {
    var fm = this._fm();
    if (fm?.hasFlag) return fm.hasFlag(flagName);
    return !!this.flags[flagName];
  },

  clearFlag: function (flagName) {
    delete this.flags[flagName];
    var fm = this._fm();
    if (fm?.clearFlag) fm.clearFlag(flagName);
    return true;
  },

  getAllFlags: function () {
    var fm = this._fm();
    if (fm?.flags) return Object.assign({}, fm.flags);
    return Object.assign({}, this.flags);
  },

  /* ── DIALOGUE SYSTEM ── */

  getDialogueNodeForNPC: function (npcId) {
    var ds = this._ds();
    if (ds?.getDialogueNodeForNPC) return ds.getDialogueNodeForNPC(npcId);

    // Fallback legacy
    var trigger =
      typeof storyDialogueTriggers !== 'undefined' ? storyDialogueTriggers[npcId] : null;
    if (!trigger) return `${npcId}_s0`;
    if (trigger.states) {
      for (var i = 0; i < trigger.states.length; i++) {
        if (this.checkCondition(trigger.states[i].condition)) {
          return trigger.states[i].node;
        }
      }
    }
    return trigger.defaultNode || `${npcId}_s0`;
  },

  onDialogueStarted: function (npcId) {
    this.stats.talkedTo[npcId] = true;
    var sm = this._sm();
    if (sm?.onTalkedTo) sm.onTalkedTo(npcId);
  },

  hasTalkedTo: function (npcId) {
    var sm = this._sm();
    if (sm?.hasTalkedTo) return sm.hasTalkedTo(npcId);
    return !!this.stats.talkedTo[npcId];
  },

  getTalkedToCount: function () {
    var sm = this._sm();
    if (sm?.getTalkedToCount) return sm.getTalkedToCount();
    return Object.keys(this.stats.talkedTo).length;
  },

  /* ── CONDITION SYSTEM ── */

  checkCondition: function (condition) {
    var cs = this._cs();
    if (cs?.checkCondition) return cs.checkCondition(condition);

    // Minimal inline fallback (preserves behaviour if subsystems missing)
    if (!condition) return true;

    if (condition.chapter) {
      var cc = typeof ChapterManager !== 'undefined' ? ChapterManager.getCurrentChapterId() : null;
      if (cc !== condition.chapter) return false;
    }

    if (condition.hasFlag && !this.hasFlag(condition.hasFlag)) return false;
    if (condition.missingFlag && this.hasFlag(condition.missingFlag)) return false;

    if (condition.hasClue && typeof window.gameState !== 'undefined') {
      if (window.gameState.cluesFound.indexOf(condition.hasClue) === -1) return false;
    }
    if (condition.missingClue && typeof window.gameState !== 'undefined') {
      if (window.gameState.cluesFound.indexOf(condition.missingClue) !== -1) return false;
    }
    if (condition.hasClues && typeof window.gameState !== 'undefined') {
      for (var i = 0; i < condition.hasClues.length; i++) {
        if (window.gameState.cluesFound.indexOf(condition.hasClues[i]) === -1) return false;
      }
    }
    if (condition.cluesMin && typeof window.gameState !== 'undefined') {
      if (window.gameState.cluesFound.length < condition.cluesMin) return false;
    }
    if (condition.cluesMax && typeof window.gameState !== 'undefined') {
      if (window.gameState.cluesFound.length > condition.cluesMax) return false;
    }
    if (condition.cluesFound === 'all' && typeof window.gameState !== 'undefined') {
      var totalClues = typeof clues !== 'undefined' ? clues.length : 9;
      if (window.gameState.cluesFound.length < totalClues) return false;
    }
    if (typeof condition.cluesFound === 'number' && typeof window.gameState !== 'undefined') {
      if (window.gameState.cluesFound.length < condition.cluesFound) return false;
    }

    if (condition.talkedTo && !this.hasTalkedTo(condition.talkedTo)) return false;
    if (condition.talkedToCount) {
      if (this.getTalkedToCount() < condition.talkedToCount) return false;
    }
    if (condition.talkedToAll) {
      for (var j = 0; j < condition.talkedToAll.length; j++) {
        if (!this.hasTalkedTo(condition.talkedToAll[j])) return false;
      }
    }

    if (condition.puzzleSolved && !this.stats.puzzlesSolved[condition.puzzleSolved]) return false;
    if (condition.puzzlesSolved) {
      for (var k = 0; k < condition.puzzlesSolved.length; k++) {
        if (!this.stats.puzzlesSolved[condition.puzzlesSolved[k]]) return false;
      }
    }

    if (condition.visitedArea && !this.stats.visitedAreas[condition.visitedArea]) return false;

    return true;
  },

  /* ── EVENT SYSTEM ── */

  checkEvents: function () {
    var es = this._es();
    if (es?.checkEvents) {
      es.checkEvents();
      this.triggeredEvents = es.triggeredEvents || this.triggeredEvents;
      return;
    }

    if (typeof storyEvents === 'undefined') return;
    for (var eventId in storyEvents) {
      var event = storyEvents[eventId];
      if (event.once && this.triggeredEvents.indexOf(eventId) !== -1) continue;
      if (this.checkCondition(event.trigger)) {
        this.triggeredEvents.push(eventId);
        if (typeof event.action === 'function') event.action();
        console.log('[StoryEngine] Event triggered:', eventId);
      }
    }
  },

  wasEventTriggered: function (eventId) {
    var es = this._es();
    if (es?.wasEventTriggered) return es.wasEventTriggered(eventId);
    return this.triggeredEvents.indexOf(eventId) !== -1;
  },

  triggerEvent: function (eventId) {
    var es = this._es();
    if (es?.triggerEvent) {
      es.triggerEvent(eventId);
      this.triggeredEvents = es.triggeredEvents || this.triggeredEvents;
      return;
    }

    if (this.triggeredEvents.indexOf(eventId) === -1) {
      this.triggeredEvents.push(eventId);
    }
    if (typeof storyEvents === 'undefined') return;
    var event = storyEvents[eventId];
    if (event && typeof event.action === 'function') event.action();
  },

  /* ── ENDING SYSTEM ── */

  determineEnding: function () {
    var ens = this._ens();
    if (ens?.determineEnding) return ens.determineEnding();

    if (typeof storyEndingConditions === 'undefined') {
      return {
        id: 'psychological',
        title: 'Fine Ambigua',
        description: 'La verità rimane nascosta.',
      };
    }
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
    return storyEndingConditions.psychological || sortedEndings[0];
  },

  getAvailableEndings: function () {
    var ens = this._ens();
    if (ens?.getAvailableEndings) return ens.getAvailableEndings();

    if (typeof storyEndingConditions === 'undefined') return [];
    var endings = [];
    for (var id in storyEndingConditions) {
      endings.push({ id: id, data: storyEndingConditions[id] });
    }
    return endings;
  },

  /* ── STATISTICS TRACKING ── */

  onAreaVisited: function (areaId) {
    this.stats.visitedAreas[areaId] = true;
    var sm = this._sm();
    if (sm?.onAreaVisited) sm.onAreaVisited(areaId);
  },

  onClueFound: function (_clueId) {
    this.stats.cluesFound++;
    var sm = this._sm();
    if (sm?.onClueFound) sm.onClueFound();
  },

  onPuzzleSolved: function (puzzleId) {
    this.stats.puzzlesSolved[puzzleId] = true;
    var sm = this._sm();
    if (sm?.onPuzzleSolved) sm.onPuzzleSolved(puzzleId);

    if (typeof window.gameState !== 'undefined') {
      if (puzzleId === 'deduction') window.gameState.puzzleSolved = true;
      if (puzzleId === 'radio') window.gameState.radioSolved = true;
    }
  },

  getStats: function () {
    var sm = this._sm();
    if (sm?.stats) {
      return Object.assign({}, sm.stats);
    }
    return Object.assign({}, this.stats);
  },

  addPlayTime: function (seconds) {
    this.stats.totalPlayTime += seconds;
    var sm = this._sm();
    if (sm?.stats) sm.stats.totalPlayTime += seconds;
  },

  /* ── ACHIEVEMENTS ── */

  unlockAchievement: function (achievementId) {
    var as = this._as();
    if (as?.unlockAchievement) {
      var result = as.unlockAchievement(achievementId);
      if (result) this.unlockedAchievements = as.unlockedAchievements.slice();
      return result;
    }

    if (this.unlockedAchievements.indexOf(achievementId) === -1) {
      this.unlockedAchievements.push(achievementId);
      console.log('[StoryEngine] Achievement unlocked:', achievementId);
      return true;
    }
    return false;
  },

  hasAchievement: function (achievementId) {
    var as = this._as();
    if (as?.hasAchievement) return as.hasAchievement(achievementId);
    return this.unlockedAchievements.indexOf(achievementId) !== -1;
  },

  getUnlockedAchievements: function () {
    var as = this._as();
    if (as?.getUnlockedAchievements) {
      this.unlockedAchievements = as.getUnlockedAchievements();
      return this.unlockedAchievements.slice();
    }
    return this.unlockedAchievements.slice();
  },

  /* ── SERIALIZATION ── */

  serialize: function () {
    return {
      flags: this.getAllFlags(),
      triggeredEvents: this.triggeredEvents.slice(),
      stats: this.getStats(),
      unlockedAchievements: this.getUnlockedAchievements(),
    };
  },

  deserialize: function (data) {
    if (!data) return false;

    this.flags = data.flags || {};
    this.triggeredEvents = data.triggeredEvents || [];
    this.stats = data.stats || {
      talkedTo: {},
      visitedAreas: {},
      cluesFound: 0,
      puzzlesSolved: {},
      totalPlayTime: 0,
    };
    this.unlockedAchievements = data.unlockedAchievements || [];

    var fm = this._fm();
    if (fm?.deserialize) fm.deserialize(this.flags);
    var sm = this._sm();
    if (sm?.deserialize) sm.deserialize(this.stats);
    var es = this._es();
    if (es?.deserialize) es.deserialize(this.triggeredEvents);
    var as = this._as();
    if (as?.deserialize) as.deserialize(this.unlockedAchievements);

    return true;
  },
};

if (typeof window !== 'undefined') {
  window.StoryEngine = StoryEngine;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = StoryEngine;
}
