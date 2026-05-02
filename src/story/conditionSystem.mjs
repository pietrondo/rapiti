/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    CONDITION SYSTEM MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Valuta condizioni narrative su flag, indizi, capitoli, puzzle, ecc.
 * Estratto da StoryEngine.mjs per ridurre il God Object.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const ConditionSystem = {
  /**
   * Check a condition object
   * @param {Object} condition - Condition to check
   * @returns {boolean}
   */
  checkCondition: (condition) => {
    if (!condition) return true;

    var currentChapter =
      typeof ChapterManager !== 'undefined' ? ChapterManager.getCurrentChapterId() : null;

    // Chapter conditions
    if (condition.chapter && currentChapter !== condition.chapter) {
      return false;
    }

    if (condition.chapterAtMost && typeof storyChapters !== 'undefined') {
      var maxOrder = storyChapters[condition.chapterAtMost].order;
      var currentOrder = storyChapters[currentChapter] ? storyChapters[currentChapter].order : -1;
      if (currentOrder > maxOrder) return false;
    }

    if (condition.chapterAtLeast && typeof storyChapters !== 'undefined') {
      var minOrder = storyChapters[condition.chapterAtLeast].order;
      var currentOrd = storyChapters[currentChapter] ? storyChapters[currentChapter].order : -1;
      if (currentOrd < minOrder) return false;
    }

    // Flag conditions
    if (condition.hasFlag) {
      var hasFlag =
        typeof FlagManager !== 'undefined'
          ? FlagManager.hasFlag(condition.hasFlag)
          : typeof StoryEngine !== 'undefined'
            ? StoryEngine.hasFlag(condition.hasFlag)
            : false;
      if (!hasFlag) return false;
    }

    if (condition.missingFlag) {
      var hasMissing =
        typeof FlagManager !== 'undefined'
          ? FlagManager.hasFlag(condition.missingFlag)
          : typeof StoryEngine !== 'undefined'
            ? StoryEngine.hasFlag(condition.missingFlag)
            : false;
      if (hasMissing) return false;
    }

    // Clue conditions
    if (condition.hasClue && typeof window.gameState !== 'undefined') {
      if (window.gameState.cluesFound.indexOf(condition.hasClue) === -1) {
        return false;
      }
    }

    if (condition.missingClue && typeof window.gameState !== 'undefined') {
      if (window.gameState.cluesFound.indexOf(condition.missingClue) !== -1) {
        return false;
      }
    }

    if (condition.hasClues && typeof window.gameState !== 'undefined') {
      for (var i = 0; i < condition.hasClues.length; i++) {
        if (window.gameState.cluesFound.indexOf(condition.hasClues[i]) === -1) {
          return false;
        }
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

    // Talk conditions
    if (condition.talkedTo) {
      var talkedTo =
        typeof StatsManager !== 'undefined'
          ? StatsManager.hasTalkedTo(condition.talkedTo)
          : typeof StoryEngine !== 'undefined'
            ? StoryEngine.hasTalkedTo(condition.talkedTo)
            : false;
      if (!talkedTo) return false;
    }

    if (condition.talkedToCount) {
      var count =
        typeof StatsManager !== 'undefined'
          ? StatsManager.getTalkedToCount()
          : typeof StoryEngine !== 'undefined'
            ? StoryEngine.getTalkedToCount()
            : 0;
      if (count < condition.talkedToCount) return false;
    }

    if (condition.talkedToAll) {
      for (var j = 0; j < condition.talkedToAll.length; j++) {
        var hasTalked =
          typeof StatsManager !== 'undefined'
            ? StatsManager.hasTalkedTo(condition.talkedToAll[j])
            : typeof StoryEngine !== 'undefined'
              ? StoryEngine.hasTalkedTo(condition.talkedToAll[j])
              : false;
        if (!hasTalked) return false;
      }
    }

    // Puzzle conditions
    if (condition.puzzleSolved) {
      var solved =
        typeof StatsManager !== 'undefined'
          ? StatsManager.hasSolvedPuzzle(condition.puzzleSolved)
          : typeof StoryEngine !== 'undefined'
            ? StoryEngine.stats?.puzzlesSolved?.[condition.puzzleSolved]
            : false;
      if (!solved) return false;
    }

    if (condition.puzzlesSolved) {
      for (var k = 0; k < condition.puzzlesSolved.length; k++) {
        var psolved =
          typeof StatsManager !== 'undefined'
            ? StatsManager.hasSolvedPuzzle(condition.puzzlesSolved[k])
            : typeof StoryEngine !== 'undefined'
              ? StoryEngine.stats?.puzzlesSolved?.[condition.puzzlesSolved[k]]
              : false;
        if (!psolved) return false;
      }
    }

    // Area conditions
    if (condition.visitedArea) {
      var visited =
        typeof StatsManager !== 'undefined'
          ? StatsManager.hasVisitedArea(condition.visitedArea)
          : typeof StoryEngine !== 'undefined'
            ? StoryEngine.stats?.visitedAreas?.[condition.visitedArea]
            : false;
      if (!visited) return false;
    }

    return true;
  },
};

if (typeof window !== 'undefined') {
  window.ConditionSystem = ConditionSystem;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConditionSystem;
}
