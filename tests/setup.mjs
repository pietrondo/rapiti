/**
 * Jest Setup File
 * Configurazione globale per i test
 */

import { jest } from '@jest/globals';

// Mock per canvas
global.document = {
  createElement: jest.fn(() => ({
    getContext: jest.fn(() => ({
      fillRect: jest.fn(),
      fillStyle: '',
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      stroke: jest.fn(),
      strokeRect: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      ellipse: jest.fn(),
      drawImage: jest.fn(),
      roundRect: jest.fn(),
    })),
    width: 0,
    height: 0,
  })),
};

// Mock per window
global.window = {
  addEventListener: jest.fn(),
  requestAnimationFrame: jest.fn(),
  t: jest.fn((key) => `[${key}]`),
};

// Mock per performance
global.performance = {
  mark: jest.fn(),
  measure: jest.fn(),
  now: jest.fn(() => Date.now()),
};

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = String(value);
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  },
};
global.localStorage = localStorageMock;

// Console silenziata in test (opzionale)
// global.console = {
//   log: jest.fn(),
//   error: jest.fn(),
//   warn: jest.fn(),
// };
