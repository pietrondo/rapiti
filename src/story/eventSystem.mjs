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
  /** Triggered event IDs */
  triggeredEvents: [],

  /**
   * Initialize event system
   */
  init: function () {
    this.triggeredEvents = [];
  },

  /**
   * Reset to initial state
   */
  reset: function () {
    this.init();
  },

  /**
   * Check and trigger events
   */
  checkEvents: function () {
    if (typeof storyEvents === 'undefined') return;

    var checkCondition =
      typeof ConditionSystem !== 'undefined'
        ? ConditionSystem.checkCondition.bind(ConditionSystem)
        : typeof StoryEngine !== 'undefined'
          ? StoryEngine.checkCondition.bind(StoryEngine)
          : () => true;

    for (var eventId in storyEvents) {
      var event = storyEvents[eventId];

      if (event.once && this.triggeredEvents.indexOf(eventId) !== -1) {
        continue;
      }

      if (checkCondition(event.trigger)) {
        this.triggeredEvents.push(eventId);

        if (typeof event.action === 'function') {
          event.action();
        }

        console.log('[EventSystem] Event triggered:', eventId);
      }
    }
  },

  /**
   * Check if event was triggered
   * @param {string} eventId - Event ID
   * @returns {boolean}
   */
  wasEventTriggered: function (eventId) {
    return this.triggeredEvents.indexOf(eventId) !== -1;
  },

  /**
   * Manually trigger an event
   * @param {string} eventId - Event ID
   */
  triggerEvent: function (eventId) {
    if (this.triggeredEvents.indexOf(eventId) === -1) {
      this.triggeredEvents.push(eventId);
    }

    if (typeof storyEvents === 'undefined') return;

    var event = storyEvents[eventId];
    if (event && typeof event.action === 'function') {
      event.action();
    }
  },

  /**
   * Serialize event state
   * @returns {Array}
   */
  serialize: function () {
    return this.triggeredEvents.slice();
  },

  /**
   * Deserialize event state
   * @param {Array} data - Serialized state
   */
  deserialize: function (data) {
    this.triggeredEvents = data || [];
  },
};

if (typeof window !== 'undefined') {
  window.EventSystem = EventSystem;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = EventSystem;
}
