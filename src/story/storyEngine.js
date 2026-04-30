/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    STORY ENGINE MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Core story engine handling conditions, events, endings, and dialogue triggers.
 * Part of the modular StoryManager system.
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

"use strict";

/**
 * StoryEngine - Core narrative system
 */
var StoryEngine = {
    /** Dynamic state flags */
    flags: {},

    /** Triggered event IDs */
    triggeredEvents: [],

    /** Statistics tracking */
    stats: {
        talkedTo: {},
        visitedAreas: {},
        cluesFound: 0,
        puzzlesSolved: {},
        totalPlayTime: 0
    },

    /** Unlocked achievements */
    unlockedAchievements: [],

    /**
     * Initialize story engine
     */
    init: function () {
        this.flags = {};
        this.triggeredEvents = [];
        this.stats = {
            talkedTo: {},
            visitedAreas: {},
            cluesFound: 0,
            puzzlesSolved: {},
            totalPlayTime: 0
        };
        this.unlockedAchievements = [];
    },

    /**
     * Reset to initial state
     */
    reset: function () {
        this.init();
    },

    /* ── FLAG MANAGEMENT ── */

    /**
     * Set a flag
     * @param {string} flagName - Flag name
     * @param {*} value - Flag value
     * @returns {boolean}
     */
    setFlag: function (flagName, value) {
        value = value !== undefined ? value : true;
        this.flags[flagName] = value;
        console.log("[StoryEngine] Flag set:", flagName, value);
        return true;
    },

    /**
     * Get a flag value
     * @param {string} flagName - Flag name
     * @returns {*}
     */
    getFlag: function (flagName) {
        return this.flags[flagName];
    },

    /**
     * Check if flag exists and is truthy
     * @param {string} flagName - Flag name
     * @returns {boolean}
     */
    hasFlag: function (flagName) {
        return !!this.flags[flagName];
    },

    /**
     * Clear/remove a flag
     * @param {string} flagName - Flag name
     * @returns {boolean}
     */
    clearFlag: function (flagName) {
        delete this.flags[flagName];
        return true;
    },

    /**
     * Get all flags
     * @returns {Object}
     */
    getAllFlags: function () {
        return Object.assign({}, this.flags);
    },

    /* ── DIALOGUE SYSTEM ── */

    /**
     * Get dialogue node for NPC based on current state
     * @param {string} npcId - NPC identifier
     * @returns {string} Dialogue node ID
     */
    getDialogueNodeForNPC: function (npcId) {
        var trigger = storyDialogueTriggers ? storyDialogueTriggers[npcId] : null;
        if (!trigger) {
            console.warn("[StoryEngine] No dialogue trigger for NPC:", npcId);
            return npcId + "_s0";
        }

        // Find matching state
        if (trigger.states) {
            for (var i = 0; i < trigger.states.length; i++) {
                var state = trigger.states[i];
                if (this.checkCondition(state.condition)) {
                    return state.node;
                }
            }
        }

        return trigger.defaultNode || npcId + "_s0";
    },

    /**
     * Register dialogue started
     * @param {string} npcId - NPC identifier
     */
    onDialogueStarted: function (npcId) {
        this.stats.talkedTo[npcId] = true;
    },

    /**
     * Check if talked to NPC
     * @param {string} npcId - NPC identifier
     * @returns {boolean}
     */
    hasTalkedTo: function (npcId) {
        return !!this.stats.talkedTo[npcId];
    },

    /**
     * Get talk count
     * @returns {number}
     */
    getTalkedToCount: function () {
        return Object.keys(this.stats.talkedTo).length;
    },

    /* ── CONDITION SYSTEM ── */

    /**
     * Check a condition object
     * @param {Object} condition - Condition to check
     * @returns {boolean}
     */
    checkCondition: function (condition) {
        if (!condition) return true;

        var currentChapter = typeof ChapterManager !== "undefined" ?
            ChapterManager.getCurrentChapterId() : null;

        // Chapter conditions
        if (condition.chapter && currentChapter !== condition.chapter) {
            return false;
        }

        if (condition.chapterAtMost && storyChapters) {
            var maxOrder = storyChapters[condition.chapterAtMost].order;
            var currentOrder = storyChapters[currentChapter].order;
            if (currentOrder > maxOrder) return false;
        }

        if (condition.chapterAtLeast && storyChapters) {
            var minOrder = storyChapters[condition.chapterAtLeast].order;
            var currentOrd = storyChapters[currentChapter].order;
            if (currentOrd < minOrder) return false;
        }

        // Flag conditions
        if (condition.hasFlag && !this.hasFlag(condition.hasFlag)) {
            return false;
        }

        if (condition.missingFlag && this.hasFlag(condition.missingFlag)) {
            return false;
        }

        // Clue conditions
        if (condition.hasClue && typeof gameState !== "undefined") {
            if (gameState.cluesFound.indexOf(condition.hasClue) === -1) {
                return false;
            }
        }

        if (condition.missingClue && typeof gameState !== "undefined") {
            if (gameState.cluesFound.indexOf(condition.missingClue) !== -1) {
                return false;
            }
        }

        if (condition.hasClues && typeof gameState !== "undefined") {
            for (var i = 0; i < condition.hasClues.length; i++) {
                if (gameState.cluesFound.indexOf(condition.hasClues[i]) === -1) {
                    return false;
                }
            }
        }

        if (condition.cluesMin && typeof gameState !== "undefined") {
            if (gameState.cluesFound.length < condition.cluesMin) return false;
        }

        if (condition.cluesMax && typeof gameState !== "undefined") {
            if (gameState.cluesFound.length > condition.cluesMax) return false;
        }

        if (condition.cluesFound === "all" && typeof gameState !== "undefined") {
            var totalClues = typeof clues !== "undefined" ? clues.length : 9;
            if (gameState.cluesFound.length < totalClues) return false;
        }

        if (typeof condition.cluesFound === "number" && typeof gameState !== "undefined") {
            if (gameState.cluesFound.length < condition.cluesFound) return false;
        }

        // Talk conditions
        if (condition.talkedTo && !this.stats.talkedTo[condition.talkedTo]) {
            return false;
        }

        if (condition.talkedToCount) {
            var count = Object.keys(this.stats.talkedTo).length;
            if (count < condition.talkedToCount) return false;
        }

        if (condition.talkedToAll) {
            for (var j = 0; j < condition.talkedToAll.length; j++) {
                if (!this.stats.talkedTo[condition.talkedToAll[j]]) {
                    return false;
                }
            }
        }

        // Puzzle conditions
        if (condition.puzzleSolved && !this.stats.puzzlesSolved[condition.puzzleSolved]) {
            return false;
        }

        if (condition.puzzlesSolved) {
            for (var k = 0; k < condition.puzzlesSolved.length; k++) {
                if (!this.stats.puzzlesSolved[condition.puzzlesSolved[k]]) {
                    return false;
                }
            }
        }

        // Area conditions
        if (condition.visitedArea && !this.stats.visitedAreas[condition.visitedArea]) {
            return false;
        }

        return true;
    },

    /* ── EVENT SYSTEM ── */

    /**
     * Check and trigger events
     */
    checkEvents: function () {
        if (!storyEvents) return;

        for (var eventId in storyEvents) {
            var event = storyEvents[eventId];

            // Skip if already triggered and event is once-only
            if (event.once && this.triggeredEvents.indexOf(eventId) !== -1) {
                continue;
            }

            // Check trigger condition
            if (this.checkCondition(event.trigger)) {
                this.triggeredEvents.push(eventId);

                if (typeof event.action === "function") {
                    event.action();
                }

                console.log("[StoryEngine] Event triggered:", eventId);
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

        var event = storyEvents ? storyEvents[eventId] : null;
        if (event && typeof event.action === "function") {
            event.action();
        }
    },

    /* ── ENDING SYSTEM ── */

    /**
     * Determine which ending to show
     * @returns {Object} Ending data
     */
    determineEnding: function () {
        if (!storyEndingConditions) {
            return { id: "psychological", title: "Fine Ambigua", description: "La verità rimane nascosta." };
        }

        // Sort by priority (highest first)
        var sortedEndings = [];
        for (var endingId in storyEndingConditions) {
            sortedEndings.push(storyEndingConditions[endingId]);
        }
        sortedEndings.sort(function (a, b) { return b.priority - a.priority; });

        // Find first matching condition
        for (var i = 0; i < sortedEndings.length; i++) {
            var ending = sortedEndings[i];
            if (this.checkCondition(ending.conditions)) {
                return ending;
            }
        }

        // Fallback to psychological ending
        return storyEndingConditions.psychological || sortedEndings[0];
    },

    /**
     * Get available endings
     * @returns {Array}
     */
    getAvailableEndings: function () {
        if (!storyEndingConditions) return [];

        var endings = [];
        for (var id in storyEndingConditions) {
            endings.push({
                id: id,
                data: storyEndingConditions[id]
            });
        }
        return endings;
    },

    /* ── STATISTICS TRACKING ── */

    /**
     * Register area visit
     * @param {string} areaId - Area identifier
     */
    onAreaVisited: function (areaId) {
        this.stats.visitedAreas[areaId] = true;
    },

    /**
     * Register clue found
     * @param {string} clueId - Clue identifier
     */
    onClueFound: function (clueId) {
        this.stats.cluesFound++;
    },

    /**
     * Register puzzle solved
     * @param {string} puzzleId - Puzzle identifier
     */
    onPuzzleSolved: function (puzzleId) {
        this.stats.puzzlesSolved[puzzleId] = true;

        // Update gameState for compatibility
        if (typeof gameState !== "undefined") {
            if (puzzleId === "deduction") gameState.puzzleSolved = true;
            if (puzzleId === "radio") gameState.radioSolved = true;
        }
    },

    /**
     * Get statistics
     * @returns {Object}
     */
    getStats: function () {
        return Object.assign({}, this.stats);
    },

    /**
     * Update play time
     * @param {number} seconds - Seconds to add
     */
    addPlayTime: function (seconds) {
        this.stats.totalPlayTime += seconds;
    },

    /* ── ACHIEVEMENTS ── */

    /**
     * Unlock an achievement
     * @param {string} achievementId - Achievement ID
     * @returns {boolean} Whether it was newly unlocked
     */
    unlockAchievement: function (achievementId) {
        if (this.unlockedAchievements.indexOf(achievementId) === -1) {
            this.unlockedAchievements.push(achievementId);
            console.log("[StoryEngine] Achievement unlocked:", achievementId);
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

    /* ── SERIALIZATION ── */

    /**
     * Serialize engine state
     * @returns {Object}
     */
    serialize: function () {
        return {
            flags: this.flags,
            triggeredEvents: this.triggeredEvents,
            stats: this.stats,
            unlockedAchievements: this.unlockedAchievements
        };
    },

    /**
     * Deserialize engine state
     * @param {Object} data - Serialized state
     * @returns {boolean}
     */
    deserialize: function (data) {
        if (!data) return false;

        this.flags = data.flags || {};
        this.triggeredEvents = data.triggeredEvents || [];
        this.stats = data.stats || { talkedTo: {}, visitedAreas: {}, cluesFound: 0, puzzlesSolved: {}, totalPlayTime: 0 };
        this.unlockedAchievements = data.unlockedAchievements || [];

        return true;
    }
};

// Global export
if (typeof window !== "undefined") {
    window.StoryEngine = StoryEngine;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = StoryEngine;
}
