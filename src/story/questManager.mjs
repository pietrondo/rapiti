/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    QUEST MANAGER MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Manages quests, quest stages, rewards, and quest progression.
 * Part of the modular StoryManager system.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * QuestManager - Handles quest system and rewards
 */
const QuestManager = {
    /** Active quests by ID */
    activeQuests: {},

    /** Completed quest IDs */
    completedQuests: [],

    /**
     * Initialize quest manager
     */
    init: function () {
        this.activeQuests = {};
        this.completedQuests = [];
    },

    /**
     * Reset to initial state
     */
    reset: function () {
        this.init();
    },

    /**
     * Activate quests for a chapter
     * @param {string} chapterId - Chapter to activate quests for
     */
    activateQuestsForChapter: function (chapterId) {
        if (!storyQuests) return;

        for (var questId in storyQuests) {
            var quest = storyQuests[questId];
            if (quest.chapter === chapterId &&
                !this.activeQuests[questId] &&
                this.completedQuests.indexOf(questId) === -1) {

                this.activeQuests[questId] = {
                    id: questId,
                    currentStage: 0,
                    stagesCompleted: []
                };

                console.log("[QuestManager] Quest activated:", quest.title);
            }
        }
    },

    /**
     * Check progress of active quests
     * @param {Function} checkConditionFn - Condition checker function
     */
    checkQuestProgress: function (checkConditionFn) {
        for (var questId in this.activeQuests) {
            var quest = storyQuests ? storyQuests[questId] : null;
            var progress = this.activeQuests[questId];

            if (!quest || !quest.stages || !progress) continue;

            var currentStage = quest.stages[progress.currentStage];
            if (!currentStage) continue;

            // Check if stage is completed
            if (checkConditionFn && checkConditionFn(currentStage.condition)) {
                // Apply reward
                if (currentStage.reward) {
                    this.applyReward(currentStage.reward);
                }

                progress.stagesCompleted.push(currentStage.id);
                progress.currentStage++;

                console.log("[QuestManager] Quest stage completed:", currentStage.description);

                // Check quest completion
                if (progress.currentStage >= quest.stages.length) {
                    this.completeQuest(questId);
                }
            }
        }
    },

    /**
     * Complete a quest
     * @param {string} questId - Quest to complete
     */
    completeQuest: function (questId) {
        delete this.activeQuests[questId];
        this.completedQuests.push(questId);

        var quest = storyQuests ? storyQuests[questId] : null;
        if (quest && quest.onComplete) {
            if (quest.onComplete.message && typeof showToast === "function") {
                showToast(quest.onComplete.message);
            }
            if (quest.onComplete.reward) {
                this.applyReward(quest.onComplete.reward);
            }
        }

        console.log("[QuestManager] Quest completed:", questId);
    },

    /**
     * Get list of active quests with progress
     * @returns {Array} Active quest data
     */
    getActiveQuests: function () {
        var result = [];

        for (var questId in this.activeQuests) {
            var quest = storyQuests ? storyQuests[questId] : null;
            var progress = this.activeQuests[questId];

            if (!quest || !progress) continue;

            var currentStageData = quest.stages[progress.currentStage];

            result.push({
                id: questId,
                title: quest.title,
                description: quest.description,
                currentStage: progress.currentStage,
                totalStages: quest.stages.length,
                currentStageDescription: currentStageData ?
                    currentStageData.description : null,
                progress: Math.round((progress.currentStage / quest.stages.length) * 100)
            });
        }

        return result;
    },

    /**
     * Get completed quests
     * @returns {Array} Completed quest IDs
     */
    getCompletedQuests: function () {
        return this.completedQuests.slice();
    },

    /**
     * Check if quest is active
     * @param {string} questId - Quest to check
     * @returns {boolean}
     */
    isQuestActive: function (questId) {
        return !!this.activeQuests[questId];
    },

    /**
     * Check if quest is completed
     * @param {string} questId - Quest to check
     * @returns {boolean}
     */
    isQuestCompleted: function (questId) {
        return this.completedQuests.indexOf(questId) !== -1;
    },

    /**
     * Apply a reward
     * @param {Object} reward - Reward configuration
     */
    applyReward: function (reward) {
        if (!reward) return;

        // Set flag
        if (reward.setFlag && typeof StoryManager !== "undefined") {
            StoryManager.setFlag(reward.setFlag);
        }

        // Update NPC state
        if (reward.updateNPCState && typeof gameState !== "undefined") {
            for (var npcId in reward.updateNPCState) {
                if (gameState.npcStates) {
                    gameState.npcStates[npcId] = reward.updateNPCState[npcId];
                }
            }
        }

        // Give clue
        if (reward.giveClue && typeof collectClue === "function") {
            collectClue(reward.giveClue);
        }

        // Clue hint
        if (reward.giveClueHint) {
            console.log("[QuestManager] Clue hint:", reward.giveClueHint);
        }

        // Experience points
        if (reward.xp) {
            console.log("[QuestManager] XP earned:", reward.xp);
        }

        // Unlock area
        if (reward.unlockArea) {
            console.log("[QuestManager] Area unlocked:", reward.unlockArea);
        }

        // Custom action
        if (reward.action && typeof reward.action === "function") {
            reward.action();
        }
    },

    /**
     * Get quest progress percentage
     * @param {string} questId - Quest ID
     * @returns {number} Percentage (0-100)
     */
    getQuestProgress: function (questId) {
        var progress = this.activeQuests[questId];
        var quest = storyQuests ? storyQuests[questId] : null;

        if (!progress || !quest || !quest.stages) return 0;

        return Math.round((progress.currentStage / quest.stages.length) * 100);
    },

    /**
     * Get total active quest count
     * @returns {number}
     */
    getActiveQuestCount: function () {
        return Object.keys(this.activeQuests).length;
    },

    /**
     * Get total completed quest count
     * @returns {number}
     */
    getCompletedQuestCount: function () {
        return this.completedQuests.length;
    },

    /**
     * Serialize quest state
     * @returns {Object} Serialized state
     */
    serialize: function () {
        return {
            activeQuests: this.activeQuests,
            completedQuests: this.completedQuests
        };
    },

    /**
     * Deserialize quest state
     * @param {Object} data - Serialized state
     * @returns {boolean} Success status
     */
    deserialize: function (data) {
        if (!data) return false;

        this.activeQuests = data.activeQuests || {};
        this.completedQuests = data.completedQuests || [];

        return true;
    }
};

// Global export
if (typeof window !== "undefined") {
    window.QuestManager = QuestManager;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = QuestManager;
}
