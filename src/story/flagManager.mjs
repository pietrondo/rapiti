/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    FLAG MANAGER MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Gestisce flag booleani di stato della narrazione.
 * Estratto da StoryManager.mjs per ridurre il God Object.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const FlagManager = {
  flags: {},

  init: function () {
    this.flags = {};
  },

  reset: function () {
    this.init();
  },

  setFlag: function (flagName, value) {
    value = value !== undefined ? value : true;
    this.flags[flagName] = value;
    console.log('[FlagManager] Flag impostato:', flagName, value);
    return true;
  },

  getFlag: function (flagName) {
    return this.flags[flagName] || false;
  },

  hasFlag: function (flagName) {
    return !!this.flags[flagName];
  },

  clearFlag: function (flagName) {
    delete this.flags[flagName];
    return true;
  },

  serialize: function () {
    return this.flags;
  },

  deserialize: function (data) {
    this.flags = data || {};
    return true;
  },
};

if (typeof window !== 'undefined') {
  window.FlagManager = FlagManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FlagManager;
}
