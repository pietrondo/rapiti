/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    ENDING SYSTEM MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Determina il finale in base agli indizi raccolti e ai puzzle risolti.
 * Estratto da StoryEngine.mjs per ridurre il God Object.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const EndingSystem = {
  /**
   * Determine which ending to show
   * @returns {Object} Ending data
   */
  determineEnding: () => {
    if (typeof storyEndingConditions === 'undefined') {
      return {
        id: 'psychological',
        title: 'Fine Ambigua',
        description: 'La verità rimane nascosta.',
      };
    }

    var checkCondition =
      typeof ConditionSystem !== 'undefined'
        ? ConditionSystem.checkCondition.bind(ConditionSystem)
        : typeof StoryEngine !== 'undefined'
          ? StoryEngine.checkCondition.bind(StoryEngine)
          : () => true;

    var sortedEndings = [];
    for (var endingId in storyEndingConditions) {
      sortedEndings.push(storyEndingConditions[endingId]);
    }
    sortedEndings.sort((a, b) => b.priority - a.priority);

    for (var i = 0; i < sortedEndings.length; i++) {
      var ending = sortedEndings[i];
      if (checkCondition(ending.conditions)) {
        return ending;
      }
    }

    return storyEndingConditions.psychological || sortedEndings[0];
  },

  /**
   * Get available endings
   * @returns {Array}
   */
  getAvailableEndings: () => {
    if (typeof storyEndingConditions === 'undefined') return [];

    var endings = [];
    for (var id in storyEndingConditions) {
      endings.push({
        id: id,
        data: storyEndingConditions[id],
      });
    }
    return endings;
  },
};

if (typeof window !== 'undefined') {
  window.EndingSystem = EndingSystem;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EndingSystem;
}
