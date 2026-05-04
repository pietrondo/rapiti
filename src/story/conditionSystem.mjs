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
   * Check a condition object — Delegato a StoryEngine (TS)
   * @param {Object} condition - Condition to check
   * @returns {boolean}
   */
  checkCondition: (condition) => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.checkCondition) {
      return StoryEngine.checkCondition(condition);
    }
    return true; // Fallback se il motore non è pronto
  },
};

if (typeof window !== 'undefined') {
  window.ConditionSystem = ConditionSystem;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ConditionSystem;
}
