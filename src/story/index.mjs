/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                         STORY MANAGER (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central narrative management system with ES6+ class syntax.
 * Combines: ChapterManager, QuestManager, StoryEngine
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class StoryManager {
  constructor() {
    /** Chapter management submodule */
    this.chapters = typeof ChapterManager !== 'undefined' ? ChapterManager : null;

    /** Quest management submodule */
    this.quests = typeof QuestManager !== 'undefined' ? QuestManager : null;

    /** Core story engine submodule */
    this.engine = typeof StoryEngine !== 'undefined' ? StoryEngine : null;

    /** Version info */
    this.version = '3.0.0-es6';
    this.buildDate = new Date().toISOString();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Initialize all story subsystems
   */
  init() {
    this.chapters?.init();
    this.quests?.init();
    this.engine?.init();

    // Start from first chapter
    this.chapters?.startChapter('intro');

    console.log(`[StoryManager] Initialized v${this.version}`);
  }

  /**
   * Reset all story state
   */
  reset() {
    this.chapters?.reset();
    this.quests?.reset();
    this.engine?.reset();

    // Restart from intro
    this.chapters?.startChapter('intro');
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CHAPTER MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  startChapter(chapterId) {
    return this.chapters?.startChapter(chapterId) ?? false;
  }

  completeCurrentChapter() {
    return this.chapters?.completeCurrentChapter() ?? false;
  }

  isChapterCompleted(chapterId) {
    return this.chapters?.isChapterCompleted(chapterId) ?? false;
  }

  getCurrentChapter() {
    return this.chapters?.getCurrentChapter() ?? null;
  }

  getChapterData() {
    return this.chapters?.getChapterData() ?? null;
  }

  completeObjective(objectiveId) {
    return this.chapters?.completeObjective(objectiveId) ?? false;
  }

  isObjectiveCompleted(chapterId, objectiveId) {
    return this.chapters?.isObjectiveCompleted(chapterId, objectiveId) ?? false;
  }

  getCurrentObjectives() {
    return this.chapters?.getCurrentObjectives() ?? [];
  }

  checkChapterCompletion() {
    return this.chapters?.checkChapterCompletion() ?? false;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // QUEST MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  activateQuestsForChapter(chapterId) {
    this.quests?.activateQuestsForChapter(chapterId);
  }

  checkQuestProgress() {
    if (this.quests && this.engine) {
      this.quests.checkQuestProgress((condition) => this.engine.checkCondition(condition));
    }
  }

  completeQuest(questId) {
    return this.quests?.completeQuest(questId) ?? false;
  }

  getActiveQuests() {
    return this.quests?.getActiveQuests() ?? [];
  }

  applyReward(reward) {
    this.quests?.applyReward(reward);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // FLAG MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  setFlag(flagName, value) {
    this.engine?.setFlag(flagName, value);
    this.checkEvents();
  }

  getFlag(flagName) {
    return this.engine?.getFlag(flagName);
  }

  hasFlag(flagName) {
    return this.engine?.hasFlag(flagName) ?? false;
  }

  clearFlag(flagName) {
    return this.engine?.clearFlag(flagName) ?? false;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // DIALOGUE SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  getDialogueNodeForNPC(npcId) {
    return this.engine?.getDialogueNodeForNPC(npcId) ?? `${npcId}_s0`;
  }

  onDialogueStarted(npcId) {
    this.engine?.onDialogueStarted(npcId);
    this.checkObjectivesForEvent('talkedTo', npcId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONDITION SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  checkCondition(condition) {
    return this.engine?.checkCondition(condition) ?? true;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // EVENT SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  checkEvents() {
    this.engine?.checkEvents();
  }

  triggerEvent(eventId) {
    this.engine?.triggerEvent(eventId);
  }

  wasEventTriggered(eventId) {
    return this.engine?.wasEventTriggered(eventId) ?? false;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ENDING SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  determineEnding() {
    return this.engine?.determineEnding() ?? null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STATISTICS TRACKING
  // ═══════════════════════════════════════════════════════════════════════════════

  onAreaVisited(areaId) {
    this.engine?.onAreaVisited(areaId);
    this.checkObjectivesForEvent('visitedArea', areaId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  onClueFound(clueId) {
    this.engine?.onClueFound(clueId);
    this.checkObjectivesForEvent('cluesFound', clueId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  onPuzzleSolved(puzzleId) {
    this.engine?.onPuzzleSolved(puzzleId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  getStats() {
    return this.engine?.getStats() ?? {};
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // OBJECTIVE CHECKING HELPER
  // ═══════════════════════════════════════════════════════════════════════════════

  checkObjectivesForEvent(eventType, target) {
    if (!this.chapters?.currentChapter) return;

    const chapter = storyChapters?.[this.chapters.currentChapter];
    if (!chapter?.objectives) return;

    for (const obj of chapter.objectives) {
      if (obj.condition) {
        if (eventType === 'talkedTo' && obj.condition.talkedTo === target) {
          this.completeObjective(obj.id);
        }
        if (eventType === 'talkedToCount' && obj.condition.talkedToCount) {
          const count = Object.keys(this.engine?.stats?.talkedTo ?? {}).length;
          if (count >= obj.condition.talkedToCount) {
            this.completeObjective(obj.id);
          }
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ACHIEVEMENTS
  // ═══════════════════════════════════════════════════════════════════════════════

  unlockAchievement(achievementId) {
    return this.engine?.unlockAchievement(achievementId) ?? false;
  }

  hasAchievement(achievementId) {
    return this.engine?.hasAchievement(achievementId) ?? false;
  }

  getUnlockedAchievements() {
    return this.engine?.getUnlockedAchievements() ?? [];
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SERIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════

  serialize() {
    return {
      chapters: this.chapters?.serialize() ?? {},
      quests: this.quests?.serialize() ?? {},
      engine: this.engine?.serialize() ?? {},
    };
  }

  deserialize(data) {
    if (!data) return false;

    this.chapters?.deserialize(data.chapters);
    this.quests?.deserialize(data.quests);
    this.engine?.deserialize(data.engine);

    return true;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // UTILITY
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get complete story status summary
   * @returns {Object} Status summary
   */
  getStatus() {
    return {
      currentChapter: this.chapters?.getCurrentChapterId() ?? null,
      chapterProgress: this.chapters?.getChapterProgress() ?? 0,
      objectives: this.getCurrentObjectives(),
      activeQuests: this.getActiveQuests(),
      completedQuests: this.quests?.getCompletedQuestCount() ?? 0,
      flags: this.engine?.getAllFlags() ?? {},
      stats: this.getStats(),
      achievements: this.getUnlockedAchievements(),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

const storyManager = new StoryManager();

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function initStoryManager() {
  storyManager.init();
}

export function resetStoryManager() {
  storyManager.reset();
}

// Global exports
if (typeof window !== 'undefined') {
  window.StoryManager = storyManager;
  window.initStoryManager = initStoryManager;
  window.resetStoryManager = resetStoryManager;
}

export { StoryManager, storyManager };
export default storyManager;
