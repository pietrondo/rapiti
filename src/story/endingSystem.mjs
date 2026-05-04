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
   * Determine which ending to show — Delegato a StoryEngine (TS)
   * @returns {Object} Ending data
   */
  determineEnding: () => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.determineEnding) {
      return StoryEngine.determineEnding();
    }
    return null;
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
