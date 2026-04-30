/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                         STORY MODULE INDEX
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Central hub for the modular story management system. Aggregates and exports
 * all story-related functionality including chapter management, quest system,
 * and the core story engine.
 * 
 * This module serves as the main entry point for the story system,
 * extracted from the original monolithic StoryManager.js
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

"use strict";

/**
 * StoryManager - Central narrative management system
 * Combines: ChapterManager, QuestManager, StoryEngine
 * 
 * This is the main API that replaces the original StoryManager.js
 */
var StoryManager = {
    /* ── SUBMODULE REFERENCES ── */

    /** Chapter management */
    chapters: typeof ChapterManager !== "undefined" ? ChapterManager : null,

    /** Quest management */
    quests: typeof QuestManager !== "undefined" ? QuestManager : null,

    /** Core story engine */
    engine: typeof StoryEngine !== "undefined" ? StoryEngine : null,

    /* ── INITIALIZATION ── */

    /**
     * Initialize all story subsystems
     */
    init: function () {
        if (this.chapters) this.chapters.init();
        if (this.quests) this.quests.init();
        if (this.engine) this.engine.init();

        // Start from first chapter
        if (this.chapters) {
            this.chapters.startChapter("intro");
        }

        console.log("[StoryManager] Initialized");
    },

    /**
     * Reset all story state
     */
    reset: function () {
        if (this.chapters) this.chapters.reset();
        if (this.quests) this.quests.reset();
        if (this.engine) this.engine.reset();

        // Restart from intro
        if (this.chapters) {
            this.chapters.startChapter("intro");
        }
    },

    /* ── DELEGATED API ── */

    // Chapter management
    startChapter: function (chapterId) {
        return this.chapters ? this.chapters.startChapter(chapterId) : false;
    },

    completeCurrentChapter: function () {
        return this.chapters ? this.chapters.completeCurrentChapter() : false;
    },

    isChapterCompleted: function (chapterId) {
        return this.chapters ? this.chapters.isChapterCompleted(chapterId) : false;
    },

    getCurrentChapter: function () {
        return this.chapters ? this.chapters.getCurrentChapter() : null;
    },

    getChapterData: function () {
        return this.chapters ? this.chapters.getChapterData() : null;
    },

    completeObjective: function (objectiveId) {
        return this.chapters ? this.chapters.completeObjective(objectiveId) : false;
    },

    isObjectiveCompleted: function (chapterId, objectiveId) {
        return this.chapters ? this.chapters.isObjectiveCompleted(chapterId, objectiveId) : false;
    },

    getCurrentObjectives: function () {
        return this.chapters ? this.chapters.getCurrentObjectives() : [];
    },

    checkChapterCompletion: function () {
        return this.chapters ? this.chapters.checkChapterCompletion() : false;
    },

    // Quest management
    activateQuestsForChapter: function (chapterId) {
        if (this.quests) {
            this.quests.activateQuestsForChapter(chapterId);
        }
    },

    checkQuestProgress: function () {
        if (this.quests && this.engine) {
            var self = this;
            this.quests.checkQuestProgress(function (condition) {
                return self.engine.checkCondition(condition);
            });
        }
    },

    completeQuest: function (questId) {
        return this.quests ? this.quests.completeQuest(questId) : false;
    },

    getActiveQuests: function () {
        return this.quests ? this.quests.getActiveQuests() : [];
    },

    applyReward: function (reward) {
        if (this.quests) this.quests.applyReward(reward);
    },

    // Flag management
    setFlag: function (flagName, value) {
        if (this.engine) {
            this.engine.setFlag(flagName, value);
            this.checkEvents();
        }
    },

    getFlag: function (flagName) {
        return this.engine ? this.engine.getFlag(flagName) : undefined;
    },

    hasFlag: function (flagName) {
        return this.engine ? this.engine.hasFlag(flagName) : false;
    },

    clearFlag: function (flagName) {
        return this.engine ? this.engine.clearFlag(flagName) : false;
    },

    // Dialogue system
    getDialogueNodeForNPC: function (npcId) {
        return this.engine ? this.engine.getDialogueNodeForNPC(npcId) : npcId + "_s0";
    },

    onDialogueStarted: function (npcId) {
        if (this.engine) {
            this.engine.onDialogueStarted(npcId);
            this.checkObjectivesForEvent("talkedTo", npcId);
            this.checkQuestProgress();
            this.checkEvents();
        }
    },

    // Condition system
    checkCondition: function (condition) {
        return this.engine ? this.engine.checkCondition(condition) : true;
    },

    // Event system
    checkEvents: function () {
        if (this.engine) this.engine.checkEvents();
    },

    triggerEvent: function (eventId) {
        if (this.engine) this.engine.triggerEvent(eventId);
    },

    wasEventTriggered: function (eventId) {
        return this.engine ? this.engine.wasEventTriggered(eventId) : false;
    },

    // Ending system
    determineEnding: function () {
        return this.engine ? this.engine.determineEnding() : null;
    },

    // Statistics tracking
    onAreaVisited: function (areaId) {
        if (this.engine) {
            this.engine.onAreaVisited(areaId);
            this.checkObjectivesForEvent("visitedArea", areaId);
            this.checkQuestProgress();
            this.checkEvents();
        }
    },

    onClueFound: function (clueId) {
        if (this.engine) {
            this.engine.onClueFound(clueId);
            this.checkObjectivesForEvent("cluesFound", clueId);
            this.checkQuestProgress();
            this.checkEvents();
        }
    },

    onPuzzleSolved: function (puzzleId) {
        if (this.engine) {
            this.engine.onPuzzleSolved(puzzleId);
            this.checkQuestProgress();
            this.checkEvents();
        }
    },

    getStats: function () {
        return this.engine ? this.engine.getStats() : {};
    },

    // Objective checking helper
    checkObjectivesForEvent: function (eventType, target) {
        if (!this.chapters || !this.chapters.currentChapter) return;

        var chapter = storyChapters ? storyChapters[this.chapters.currentChapter] : null;
        if (!chapter || !chapter.objectives) return;

        for (var i = 0; i < chapter.objectives.length; i++) {
            var obj = chapter.objectives[i];

            if (obj.condition) {
                if (eventType === "talkedTo" && obj.condition.talkedTo === target) {
                    this.completeObjective(obj.id);
                }
                if (eventType === "talkedToCount" && obj.condition.talkedToCount) {
                    var count = Object.keys(this.engine.stats.talkedTo).length;
                    if (count >= obj.condition.talkedToCount) {
                        this.completeObjective(obj.id);
                    }
                }
            }
        }
    },

    // Achievement system
    unlockAchievement: function (achievementId) {
        return this.engine ? this.engine.unlockAchievement(achievementId) : false;
    },

    hasAchievement: function (achievementId) {
        return this.engine ? this.engine.hasAchievement(achievementId) : false;
    },

    getUnlockedAchievements: function () {
        return this.engine ? this.engine.getUnlockedAchievements() : [];
    },

    /* ── SERIALIZATION ── */

    /**
     * Export state for saving
     * @returns {Object} Serialized state
     */
    serialize: function () {
        return {
            chapters: this.chapters ? this.chapters.serialize() : {},
            quests: this.quests ? this.quests.serialize() : {},
            engine: this.engine ? this.engine.serialize() : {}
        };
    },

    /**
     * Load state from save
     * @param {Object} data - Serialized state
     * @returns {boolean} Success status
     */
    deserialize: function (data) {
        if (!data) return false;

        if (this.chapters) this.chapters.deserialize(data.chapters);
        if (this.quests) this.quests.deserialize(data.quests);
        if (this.engine) this.engine.deserialize(data.engine);

        return true;
    },

    /* ── UTILITY ── */

    /**
     * Get complete story status summary
     * @returns {Object} Status summary
     */
    getStatus: function () {
        return {
            currentChapter: this.chapters ? this.chapters.getCurrentChapterId() : null,
            chapterProgress: this.chapters ? this.chapters.getChapterProgress() : 0,
            objectives: this.getCurrentObjectives(),
            activeQuests: this.getActiveQuests(),
            completedQuests: this.quests ? this.quests.getCompletedQuestCount() : 0,
            flags: this.engine ? this.engine.getAllFlags() : {},
            stats: this.getStats(),
            achievements: this.getUnlockedAchievements()
        };
    },

    /**
     * Version info
     */
    version: "2.0.0-modular",
    buildDate: new Date().toISOString()
};

/* ── GLOBAL UTILITY FUNCTIONS ── */

/**
 * Initialize StoryManager
 */
function initStoryManager() {
    StoryManager.init();
}

/**
 * Reset StoryManager
 */
function resetStoryManager() {
    StoryManager.reset();
}

// Global exports
if (typeof window !== "undefined") {
    window.StoryManager = StoryManager;
    window.initStoryManager = initStoryManager;
    window.resetStoryManager = resetStoryManager;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = StoryManager;
}
