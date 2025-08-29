// Jest configuration for Angular 16+ with jest-preset-angular v13
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setupJest.ts'],

  // Module resolution
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@features/(.*)$': '<rootDir>/src/app/features/$1',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1'
  },

  // Test configuration
  testPathIgnorePatterns: ['<rootDir>/functions/', '<rootDir>/node_modules/', 'src/app/shared/testing/'],
  testMatch: ['<rootDir>/src/**/*.spec.ts', '<rootDir>/src/**/*.test.ts'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.test.ts',
    '!src/app/**/*.mock.ts',
    '!src/app/**/index.ts',
    '!src/app/shared/testing/**/*.ts',
    '!src/main.ts',
    '!src/polyfills.ts'
  ],
  coverageReporters: ['text', 'lcov', 'cobertura', 'html'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },

  // Performance and debugging
  maxWorkers: 1,
  verbose: true,
  bail: false,
  errorOnDeprecated: true,

  // Watch plugins for better development experience
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],

  // Transform configuration - let jest-preset-angular handle this
  // transform: {
  //   "^.+\\.(ts|js|html)$": "jest-preset-angular",
  // },

  // File extensions
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],

  // Resolver for complex module resolution
  resolver: '<rootDir>/src/jest.resolver.cjs'
};
