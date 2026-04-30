/**
 * Tests for Puzzle Validation Module
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { gameState, resetGameState } from '../src/config.mjs';

// Setup globals before importing modules
global.gameState = gameState;

global.cluesMap = {
  registro_1861: { id: 'registro_1861', name: 'Registro 1861' },
  mappa_campi: { id: 'mappa_campi', name: 'Mappa Campi' },
  tracce_circolari: { id: 'tracce_circolari', name: 'Tracce Circolari' },
};

global.StoryManager = {
  onPuzzleSolved: jest.fn(),
};

// Shared mock elements
const mockElements = {
  'radio-knob': { style: { left: '0%' } },
  'radio-fill': { style: { width: '0%' } },
  'radio-value': { textContent: '' },
  'radio-status': { textContent: '', className: '' },
  'radio-message': { textContent: '', className: '' },
  'registry-result': { textContent: '', style: { color: '' } },
  'registry-confirm': { disabled: false },
  'deduction-clues': { innerHTML: '', appendChild: jest.fn() },
  'deduction-confirm': { disabled: true },
  'deduction-overlay': { classList: { add: jest.fn(), remove: jest.fn() } },
};

// Mock document
global.document = {
  getElementById: jest.fn((id) => {
    return mockElements[id] || { textContent: '', className: '', style: {} };
  }),
  querySelectorAll: jest.fn(() => []),
  createElement: jest.fn(() => ({
    className: '',
    textContent: '',
    draggable: false,
    setAttribute: jest.fn(),
    addEventListener: jest.fn(),
  })),
};

// Import puzzle functions
import { canOpenDeduction } from '../src/game/deduction.mjs';

describe('Puzzle Validation', () => {
  beforeEach(() => {
    resetGameState();
    global.gameState = gameState;
    jest.clearAllMocks();
  });

  describe('Deduction Puzzle', () => {
    it('should return false when no clues found', () => {
      expect(canOpenDeduction()).toBe(false);
    });

    it('should return false with only 1 clue', () => {
      gameState.cluesFound.push('registro_1861');
      expect(canOpenDeduction()).toBe(false);
    });

    it('should return false with only 2 clues', () => {
      gameState.cluesFound.push('registro_1861');
      gameState.cluesFound.push('mappa_campi');
      expect(canOpenDeduction()).toBe(false);
    });

    it('should return true with all 3 required clues', () => {
      gameState.cluesFound.push('registro_1861');
      gameState.cluesFound.push('mappa_campi');
      gameState.cluesFound.push('tracce_circolari');
      expect(canOpenDeduction()).toBe(true);
    });

    it('should return false when puzzle already solved', () => {
      gameState.cluesFound.push('registro_1861');
      gameState.cluesFound.push('mappa_campi');
      gameState.cluesFound.push('tracce_circolari');
      gameState.puzzleSolved = true;
      expect(canOpenDeduction()).toBe(false);
    });

    it('should accept clues in any order', () => {
      gameState.cluesFound.push('tracce_circolari');
      gameState.cluesFound.push('registro_1861');
      gameState.cluesFound.push('mappa_campi');
      expect(canOpenDeduction()).toBe(true);
    });
  });
});
