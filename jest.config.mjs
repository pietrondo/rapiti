/**
 * Jest Configuration
 */

export default {
  testEnvironment: 'jsdom',
  
  // Supporto per ES6 modules
  transform: {},
  
  // Module name mapper per alias
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@effects/(.*)$': '<rootDir>/src/effects/$1',
    '^@areas/(.*)$': '<rootDir>/src/areas/$1',
    '^@render/(.*)$': '<rootDir>/src/render/$1',
    '^@engine/(.*)$': '<rootDir>/src/engine/$1',
    '^@story/(.*)$': '<rootDir>/src/story/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@game/(.*)$': '<rootDir>/src/game/$1',
  },
  
  // File patterns
  testMatch: [
    '**/tests/**/*.test.mjs',
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.test.mjs',
    '**/__tests__/**/*.test.js',
  ],
  
  // Collect coverage from
  collectCoverageFrom: [
    'src/**/*.mjs',
    'src/**/*.js',
    '!src/**/*.test.mjs',
    '!src/**/*.test.js',
  ],
  
  // Coverage directory
  coverageDirectory: 'coverage',
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.mjs'],
  
  // Verbose output
  verbose: true,
};
