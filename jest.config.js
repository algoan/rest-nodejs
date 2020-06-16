module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 0,
    },
  },
  collectCoverageFrom: ['src/**/*.{js,ts}', '!**/node_modules/**', '!src/lib/index.ts'],
};
