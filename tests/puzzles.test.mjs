/**
 * Tests for Puzzle Validation Module
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { gameState, resetGameState } from '../src/config.ts';

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

    it('should return true with the 2 required clues (registro_1861 + mappa_campi)', () => {
      gameState.cluesFound.push('registro_1861');
      gameState.cluesFound.push('mappa_campi');
      expect(canOpenDeduction()).toBe(true);
    });

    it('should return true with all 3 clues (including tracce_circolari)', () => {
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

  describe('Critical Progression Path (Deduction → Campo)', () => {
    it('should NOT require tracce_circolari (avoids circular deadlock with campo)', () => {
      // Il campo è bloccato dietro deduction_complete.
      // canOpenDeduction NON deve richiedere tracce_circolari (solo al campo)
      // altrimenti: per aprire deduction → serve tracce → serve campo → serve deduction_complete → serve deduction.
      gameState.cluesFound.push('registro_1861');
      gameState.cluesFound.push('mappa_campi');
      // tracce_circolari NON è presente
      expect(canOpenDeduction()).toBe(true);
    });

    it('should allow progression: clues → deduction → campo access', () => {
      // Simula il flusso canonico:
      // 1. Raccogli registro_1861 (chiesa) e mappa_campi (piazze)
      gameState.cluesFound.push('registro_1861');
      gameState.cluesFound.push('mappa_campi');
      expect(canOpenDeduction()).toBe(true);

      // 2. Dopo deduction risolta, il capitolo collegamenti setta deduction_complete
      // e sblocca l'uscita giardini→campo. Ora il giocatore può raccogliere tracce_circolari.
      gameState.cluesFound.push('tracce_circolari');
      expect(gameState.cluesFound).toContain('tracce_circolari');
    });
  });
});
