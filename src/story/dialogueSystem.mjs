/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    DIALOGUE SYSTEM MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Gestisce i nodi di dialogo per NPC in base allo stato di gioco.
 * Estratto da StoryEngine.mjs per ridurre il God Object.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const DialogueSystem = {
  /**
   * Get dialogue node for NPC based on current state
   * @param {string} npcId - NPC identifier
   * @returns {string} Dialogue node ID
   */
  getDialogueNodeForNPC: function (npcId) {
    var trigger =
      typeof storyDialogueTriggers !== 'undefined' ? storyDialogueTriggers[npcId] : null;
    if (!trigger) {
      console.warn('[DialogueSystem] No dialogue trigger for NPC:', npcId);
      return npcId + '_s0';
    }

    if (trigger.states) {
      for (var i = 0; i < trigger.states.length; i++) {
        var state = trigger.states[i];
        if (this.checkCondition(state.condition)) {
          return state.node;
        }
      }
    }

    return trigger.defaultNode || npcId + '_s0';
  },

  /**
   * Check a condition object (minimal local copy for independence)
   * @param {Object} condition - Condition to check
   * @returns {boolean}
   */
  checkCondition: (condition) => {
    if (!condition) return true;

    if (typeof StoryEngine !== 'undefined' && StoryEngine.checkCondition) {
      return StoryEngine.checkCondition(condition);
    }

    // Minimal fallback
    if (condition.hasFlag && typeof FlagManager !== 'undefined') {
      if (!FlagManager.hasFlag(condition.hasFlag)) return false;
    }
    if (condition.hasClue && typeof gameState !== 'undefined') {
      if (gameState.cluesFound.indexOf(condition.hasClue) === -1) return false;
    }
    return true;
  },
};

if (typeof window !== 'undefined') {
  window.DialogueSystem = DialogueSystem;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DialogueSystem;
}
