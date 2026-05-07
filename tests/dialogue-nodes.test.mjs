"use strict";

/**
 * Tests for Dialogue Nodes integrity and cross-reference validation.
 *
 * Covers:
 *   - src/data/dialogueNodes.mjs       (dialogueNodes object: all node definitions)
 *   - src/story/storyDialogues.mjs     (storyDialogueTriggers: references nodes by name)
 */

import { beforeAll, describe, expect, it } from '@jest/globals';

var dialogueNodes;
var storyDialogueTriggers;

/* ── Setup before importing modules that set window globals ── */

beforeAll(async function () {
  var dn = await import('../src/data/dialogueNodes.mjs');
  dialogueNodes = dn.default || window.dialogueNodes;
  await import('../src/story/storyDialogues.mjs');
  storyDialogueTriggers = window.storyDialogueTriggers;
});

/* ═══════════════════════════════════════════════════════════════
   REQUIRED NPC BASE NODES
   ═══════════════════════════════════════════════════════════════ */

var REQUIRED_BASE_NODES = [
  'valli_s0',
  'neri_s0',
  'ruggeri_s0',
  'teresa_s0',
  'anselmo_s0',
  'osvaldo_s0',
  'gino_s0',
  'don_pietro_s0',
];

/* ── State progression nodes ── */

var REQUIRED_PROGRESSION_NODES = [
  'valli_s1',
  'valli_s2',
  'neri_s1',
  'neri_s2',
  'ruggeri_s1',
  'ruggeri_s2',
  'anselmo_s1',
  'teresa_s1',
  'teresa_s2',
  'teresa_s2_memory',
];

/* ═══════════════════════════════════════════════════════════════
   TESTS
   ═══════════════════════════════════════════════════════════════ */

describe('dialogue nodes integrity', function () {

  /* ── Node count ── */

  it('should have at least 70 nodes', function () {
    expect(Object.keys(dialogueNodes).length).toBeGreaterThanOrEqual(70);
  });

  /* ── Required base NPC nodes exist ── */

  it('should have all required NPC base nodes (s0)', function () {
    REQUIRED_BASE_NODES.forEach(function (id) {
      expect(dialogueNodes).toHaveProperty(id);
    });
  });

  /* ── Required progression nodes exist ── */

  it('should have all required state progression nodes', function () {
    REQUIRED_PROGRESSION_NODES.forEach(function (id) {
      expect(dialogueNodes).toHaveProperty(id);
    });
  });

  /* ── Every node has a non-empty text property ── */

  it('every node should have a non-empty text property', function () {
    Object.keys(dialogueNodes).forEach(function (key) {
      expect(dialogueNodes[key]).toHaveProperty('text');
      expect(typeof dialogueNodes[key].text).toBe('string');
      expect(dialogueNodes[key].text.length).toBeGreaterThan(0);
    });
  });

  /* ── Choices have required fields (text and next) ── */

  it('every choice should have required fields text and next', function () {
    Object.keys(dialogueNodes).forEach(function (key) {
      var node = dialogueNodes[key];
      if (node.choices) {
        expect(Array.isArray(node.choices)).toBe(true);
        node.choices.forEach(function (choice, idx) {
          expect(choice).toHaveProperty('text');
          expect(typeof choice.text).toBe('string');
          expect(choice.text.length).toBeGreaterThan(0);
          expect(choice).toHaveProperty('next');
          expect(typeof choice.next).toBe('string');
          expect(choice.next.length).toBeGreaterThan(0);
        });
      }
    });
  });

  /* ── Every "next" choice target exists as a dialogue node key ── */

  it('every next target in choices should exist as a dialogue node', function () {
    var broken = [];
    Object.keys(dialogueNodes).forEach(function (key) {
      var node = dialogueNodes[key];
      if (node.choices) {
        node.choices.forEach(function (choice) {
          if (!dialogueNodes[choice.next]) {
            broken.push(key + ' -> ' + choice.next);
          }
        });
      }
    });
    if (broken.length > 0) {
      throw new Error(
        'Broken choice next targets: ' + broken.join(', ')
      );
    }
  });

  /* ── Every node referenced by storyDialogueTriggers exists ── */

  it('every node referenced by storyDialogueTriggers should exist in dialogueNodes', function () {
    var referenced = new Set();
    Object.keys(storyDialogueTriggers).forEach(function (npcId) {
      var npcTrigger = storyDialogueTriggers[npcId];
      if (npcTrigger.states) {
        npcTrigger.states.forEach(function (state) {
          if (state.node) {
            referenced.add(state.node);
          }
        });
      }
      if (npcTrigger.defaultNode) {
        referenced.add(npcTrigger.defaultNode);
      }
    });

    var missing = [];
    referenced.forEach(function (nodeId) {
      if (!dialogueNodes[nodeId]) {
        missing.push(nodeId);
      }
    });
    if (missing.length > 0) {
      throw new Error(
        'Story dialogue triggers reference non-existent nodes: ' + missing.join(', ')
      );
    }
  });
});
