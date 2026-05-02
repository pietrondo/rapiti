/**
 * Jest Configuration
 */

export default {
  testEnvironment: 'jsdom',

  // Supporto per ES6 + TypeScript
  transform: {
    '^.+\\.m?tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          target: 'ES2020',
          moduleResolution: 'bundler',
          rootDir: '.',
        },
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],

  // Module name mapper per alias e risoluzione .js → .ts
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // File patterns
  testMatch: [
    '**/tests/**/*.test.mjs',
    '**/tests/**/*.test.ts',
    '**/__tests__/**/*.test.mjs',
    '**/__tests__/**/*.test.ts',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'mjs', 'js', 'jsx', 'json'],

  // Collect coverage from
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.mjs',
    '!src/**/*.test.ts',
    '!src/**/*.test.mjs',
  ],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.mjs'],

  moduleNameMapper: {
    '^pixi.js$': '<rootDir>/tests/mocks/pixi.js',
  },

  // Verbose output
  verbose: true,
};
