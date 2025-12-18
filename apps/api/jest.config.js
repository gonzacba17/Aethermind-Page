/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          isolatedModules: true,
        },
      },
    ],
  },
  testMatch: [
    '**/tests/unit/**/*.test.ts',
    '**/tests/unit/**/*.spec.ts',
    '**/tests/integration/**/*.test.ts',
    '**/src/**/__tests__/**/*.test.ts',
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 10000,
  rootDir: '.',
  coverageThreshold: {
    global: {
      lines: 60,
      statements: 60,
      functions: 60,
      branches: 50,
    },
  },
};