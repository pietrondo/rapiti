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
    '^pixi.js$': '<rootDir>/tests/mocks/pixi.js',
  },

  // File patterns
  verbose: true,
};
