/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    STATS MANAGER MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Traccia statistiche di gioco: NPC parlati, aree visitate, indizi, puzzle.
 * Estratto da StoryManager.mjs per ridurre il God Object.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const StatsManager = {
  stats: {
    talkedTo: {},
    visitedAreas: {},
    cluesFound: 0,
    puzzlesSolved: {},
    totalPlayTime: 0,
  },

  init: function () {
    this.stats = {
      talkedTo: {},
      visitedAreas: {},
      cluesFound: 0,
      puzzlesSolved: {},
      totalPlayTime: 0,
    };
  },

  reset: function () {
    this.init();
  },

  onTalkedTo: function (npcId) {
    this.stats.talkedTo[npcId] = true;
  },

  onAreaVisited: function (areaId) {
    this.stats.visitedAreas[areaId] = true;
  },

  onClueFound: function () {
    this.stats.cluesFound++;
  },

  onPuzzleSolved: function (puzzleId) {
    this.stats.puzzlesSolved[puzzleId] = true;
  },

  hasTalkedTo: function (npcId) {
    return !!this.stats.talkedTo[npcId];
  },

  hasVisitedArea: function (areaId) {
    return !!this.stats.visitedAreas[areaId];
  },

  hasSolvedPuzzle: function (puzzleId) {
    return !!this.stats.puzzlesSolved[puzzleId];
  },

  getTalkedToCount: function () {
    return Object.keys(this.stats.talkedTo).length;
  },

  serialize: function () {
    return this.stats;
  },

  deserialize: function (data) {
    this.stats = data || {
      talkedTo: {},
      visitedAreas: {},
      cluesFound: 0,
      puzzlesSolved: {},
      totalPlayTime: 0,
    };
    return true;
  },
};

if (typeof window !== 'undefined') {
  window.StatsManager = StatsManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = StatsManager;
}
