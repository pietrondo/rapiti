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
   * Get dialogue node for NPC — Delegato a StoryEngine (TS)
   * @param {string} npcId
   * @returns {string} Node ID
   */
  getDialogueNodeForNPC: (npcId) => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.getDialogueNodeForNPC) {
      return StoryEngine.getDialogueNodeForNPC(npcId);
    }
    return `${npcId}_s0`;
  },

  /**
   * Called when dialogue starts — Delegato a StoryEngine (TS)
   * @param {string} npcId
   */
  onDialogueStarted: (npcId) => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.onDialogueStarted) {
      StoryEngine.onDialogueStarted(npcId);
    }
  },

  /** Check condition — Delegato a StoryEngine (TS) */
  checkCondition: (condition) => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.checkCondition) {
      return StoryEngine.checkCondition(condition);
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
