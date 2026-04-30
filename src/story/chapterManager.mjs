/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    CHAPTER MANAGER MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Manages story chapters, objectives, and chapter progression.
 * Part of the modular StoryManager system.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * ChapterManager - Handles chapter progression and objectives
 */
const ChapterManager = {
  /** Current chapter ID */
  currentChapter: null,

  /** List of completed chapter IDs */
  completedChapters: [],

  /** Completed objectives by chapter */
  completedObjectives: {},

  /**
   * Initialize chapter manager
   */
  init: function () {
    this.currentChapter = null;
    this.completedChapters = [];
    this.completedObjectives = {};
  },

  /**
   * Reset to initial state
   */
  reset: function () {
    this.init();
  },

  /**
   * Start a chapter by ID
   * @param {string} chapterId - Chapter identifier
   * @returns {boolean} Success status
   */
  startChapter: function (chapterId) {
    var chapter = storyChapters ? storyChapters[chapterId] : null;
    if (!chapter) {
      console.error('[ChapterManager] Chapter not found:', chapterId);
      return false;
    }

    this.currentChapter = chapterId;
    this.completedObjectives[chapterId] = [];

    console.log('[ChapterManager] Chapter started:', chapter.title);

    // Notify via toast if available
    if (typeof showToast === 'function') {
      showToast(`Capitolo: ${chapter.title}`);
    }

    return true;
  },

  /**
   * Complete current chapter and advance
   * @returns {boolean} Success status
   */
  completeCurrentChapter: function () {
    if (!this.currentChapter) return false;

    var chapter = storyChapters[this.currentChapter];
    this.completedChapters.push(this.currentChapter);

    // Execute completion actions
    if (chapter?.onComplete) {
      if (chapter.onComplete.setFlag && typeof StoryManager !== 'undefined') {
        StoryManager.setFlag(chapter.onComplete.setFlag);
      }
      if (chapter.onComplete.unlockChapter) {
        this.startChapter(chapter.onComplete.unlockChapter);
      }
      if (chapter.onComplete.message && typeof showToast === 'function') {
        showToast(chapter.onComplete.message);
      }
    }

    console.log('[ChapterManager] Chapter completed:', this.currentChapter);
    return true;
  },

  /**
   * Check if chapter is completed
   * @param {string} chapterId - Chapter to check
   * @returns {boolean}
   */
  isChapterCompleted: function (chapterId) {
    return this.completedChapters.indexOf(chapterId) !== -1;
  },

  /**
   * Get current chapter data
   * @returns {Object|null} Chapter data
   */
  getCurrentChapter: function () {
    return this.currentChapter && storyChapters ? storyChapters[this.currentChapter] : null;
  },

  /**
   * Alias for getCurrentChapter (compatibility)
   * @returns {Object|null}
   */
  getChapterData: function () {
    return this.getCurrentChapter();
  },

  /**
   * Get current chapter ID
   * @returns {string|null}
   */
  getCurrentChapterId: function () {
    return this.currentChapter;
  },

  /**
   * Check if objective is completed
   * @param {string} chapterId - Chapter ID
   * @param {string} objectiveId - Objective ID
   * @returns {boolean}
   */
  isObjectiveCompleted: function (chapterId, objectiveId) {
    var completed = this.completedObjectives[chapterId];
    return completed && completed.indexOf(objectiveId) !== -1;
  },

  /**
   * Complete an objective
   * @param {string} objectiveId - Objective to complete
   * @returns {boolean} Success status
   */
  completeObjective: function (objectiveId) {
    if (!this.currentChapter) return false;

    var chapter = storyChapters[this.currentChapter];
    if (!chapter?.objectives) return false;

    var objective = null;
    for (var i = 0; i < chapter.objectives.length; i++) {
      if (chapter.objectives[i].id === objectiveId) {
        objective = chapter.objectives[i];
        break;
      }
    }

    if (!objective) return false;

    // Add to completed list
    if (!this.completedObjectives[this.currentChapter]) {
      this.completedObjectives[this.currentChapter] = [];
    }

    if (this.completedObjectives[this.currentChapter].indexOf(objectiveId) === -1) {
      this.completedObjectives[this.currentChapter].push(objectiveId);
      console.log('[ChapterManager] Objective completed:', objective.description);

      // Check chapter completion
      this.checkChapterCompletion();
      return true;
    }

    return false;
  },

  /**
   * Check if all required objectives are completed
   * @returns {boolean} Whether chapter is complete
   */
  checkChapterCompletion: function () {
    if (!this.currentChapter) return false;

    var chapter = storyChapters[this.currentChapter];
    if (!chapter?.requiredObjectives) return false;

    var completed = this.completedObjectives[this.currentChapter] || [];

    var allRequiredCompleted = true;
    for (var i = 0; i < chapter.requiredObjectives.length; i++) {
      if (completed.indexOf(chapter.requiredObjectives[i]) === -1) {
        allRequiredCompleted = false;
        break;
      }
    }

    if (allRequiredCompleted) {
      this.completeCurrentChapter();
      return true;
    }

    return false;
  },

  /**
   * Get list of current objectives with status
   * @returns {Array} Objectives with completion status
   */
  getCurrentObjectives: function () {
    if (!this.currentChapter) return [];

    var chapter = storyChapters[this.currentChapter];
    if (!chapter?.objectives) return [];

    var completed = this.completedObjectives[this.currentChapter] || [];
    var required = chapter.requiredObjectives || [];

    return chapter.objectives.map((obj) => ({
      id: obj.id,
      description: obj.description,
      completed: completed.indexOf(obj.id) !== -1,
      required: required.indexOf(obj.id) !== -1,
    }));
  },

  /**
   * Get completion percentage for current chapter
   * @returns {number} Percentage (0-100)
   */
  getChapterProgress: function () {
    if (!this.currentChapter) return 0;

    var chapter = storyChapters[this.currentChapter];
    if (!chapter?.objectives || chapter.objectives.length === 0) {
      return 100;
    }

    var completed = this.completedObjectives[this.currentChapter] || [];
    return Math.round((completed.length / chapter.objectives.length) * 100);
  },

  /**
   * Serialize chapter state
   * @returns {Object} Serialized state
   */
  serialize: function () {
    return {
      currentChapter: this.currentChapter,
      completedChapters: this.completedChapters,
      completedObjectives: this.completedObjectives,
    };
  },

  /**
   * Deserialize chapter state
   * @param {Object} data - Serialized state
   * @returns {boolean} Success status
   */
  deserialize: function (data) {
    if (!data) return false;

    this.currentChapter = data.currentChapter || null;
    this.completedChapters = data.completedChapters || [];
    this.completedObjectives = data.completedObjectives || {};

    return true;
  },
};

// Global export
if (typeof window !== 'undefined') {
  window.ChapterManager = ChapterManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChapterManager;
}
