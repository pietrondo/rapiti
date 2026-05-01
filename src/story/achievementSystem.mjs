/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    ACHIEVEMENT SYSTEM MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Gestisce sblocco e tracciamento degli obiettivi globali.
 * Estratto da StoryEngine.mjs per ridurre il God Object.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const AchievementSystem = {
  /** Unlocked achievement IDs */
  unlockedAchievements: [],

  /**
   * Initialize achievement system
   */
  init: function () {
    this.unlockedAchievements = [];
  },

  /**
   * Reset to initial state
   */
  reset: function () {
    this.init();
  },

  /**
   * Unlock an achievement
   * @param {string} achievementId - Achievement ID
   * @returns {boolean} Whether it was newly unlocked
   */
  unlockAchievement: function (achievementId) {
    if (this.unlockedAchievements.indexOf(achievementId) === -1) {
      this.unlockedAchievements.push(achievementId);
      console.log('[AchievementSystem] Achievement unlocked:', achievementId);
      return true;
    }
    return false;
  },

  /**
   * Check if achievement is unlocked
   * @param {string} achievementId - Achievement ID
   * @returns {boolean}
   */
  hasAchievement: function (achievementId) {
    return this.unlockedAchievements.indexOf(achievementId) !== -1;
  },

  /**
   * Get unlocked achievements
   * @returns {Array}
   */
  getUnlockedAchievements: function () {
    return this.unlockedAchievements.slice();
  },

  /**
   * Serialize achievement state
   * @returns {Array}
   */
  serialize: function () {
    return this.unlockedAchievements.slice();
  },

  /**
   * Deserialize achievement state
   * @param {Array} data - Serialized state
   */
  deserialize: function (data) {
    this.unlockedAchievements = data || [];
  },
};

if (typeof window !== 'undefined') {
  window.AchievementSystem = AchievementSystem;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AchievementSystem;
}
