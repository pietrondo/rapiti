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
  /**
   * Unlock an achievement — Delegato a StoryEngine (TS)
   * @param {string} achievementId
   * @returns {boolean}
   */
  unlockAchievement: (achievementId) => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.unlockAchievement) {
      return StoryEngine.unlockAchievement(achievementId);
    }
    return false;
  },

  hasAchievement: (achievementId) => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.hasAchievement) {
      return StoryEngine.hasAchievement(achievementId);
    }
    return false;
  },

  getUnlockedAchievements: () => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.getUnlockedAchievements) {
      return StoryEngine.getUnlockedAchievements();
    }
    return [];
  },

  serialize: () => {
    if (typeof StoryEngine !== 'undefined' && StoryEngine.serialize) {
      return StoryEngine.serialize().unlockedAchievements;
    }
    return [];
  },

  deserialize: (_data) => {
    // Gestito da StoryEngine.deserialize
  },
};

if (typeof window !== 'undefined') {
  window.AchievementSystem = AchievementSystem;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AchievementSystem;
}
