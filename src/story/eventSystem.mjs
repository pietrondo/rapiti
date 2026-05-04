/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    EVENT SYSTEM MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Gestisce eventi speciali one-shot attivati da condizioni di gioco.
 * Estratto da StoryEngine.mjs per ridurre il God Object.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const EventSystem = {
  /**
   * Check and trigger events — Delegato a StoryEngine (TS)
   */
  checkEvents: () => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.checkEvents) {
      StoryEngine.checkEvents();
    }
  },

  wasEventTriggered: (eventId) => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.wasEventTriggered) {
      return StoryEngine.wasEventTriggered(eventId);
    }
    return false;
  },

  triggerEvent: (eventId) => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.triggerEvent) {
      StoryEngine.triggerEvent(eventId);
    }
  },

  serialize: () => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.serialize) {
      return StoryEngine.serialize().triggeredEvents;
    }
    return [];
  },

  deserialize: (data) => {
    // La deserializzazione è gestita da StoryEngine.deserialize
  },
};

if (typeof window !== 'undefined') {
  window.EventSystem = EventSystem;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EventSystem;
}
