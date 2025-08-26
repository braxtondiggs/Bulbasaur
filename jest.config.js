const jestPreset = require("jest-preset-angular/jest-preset");
const { defaults } = jestPreset;

// Modern Jest configuration for Angular 15+
module.exports = {
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/setupJest.ts"],
  globalSetup: "jest-preset-angular/global-setup",

  // Module resolution
  modulePaths: ["<rootDir>"],
  moduleNameMapper: {
    "^lodash-es$": "lodash",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@environments/(.*)$": "<rootDir>/src/environments/$1",
    "^@shared/(.*)$": "<rootDir>/src/app/shared/$1",
  },

  // Test configuration
  testPathIgnorePatterns: [
    "<rootDir>/cypress/",
    "<rootDir>/functions/",
    "<rootDir>/node_modules/",
  ],
  testMatch: ["<rootDir>/src/**/*.spec.ts", "<rootDir>/src/**/*.test.ts"],

  // Coverage configuration
  collectCoverageFrom: [
    "src/app/**/*.ts",
    "!src/app/**/*.spec.ts",
    "!src/app/**/*.test.ts",
    "!src/app/**/*.mock.ts",
    "!src/app/**/index.ts",
    "!src/main.ts",
    "!src/polyfills.ts",
  ],
  coverageReporters: ["text", "lcov", "cobertura", "html"],
  coverageDirectory: "<rootDir>/coverage",
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Performance and debugging
  maxWorkers: 1,
  verbose: true,
  bail: false,
  errorOnDeprecated: true,

  // Watch plugins for better development experience
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],

  // Transform configuration
  transform: {
    "^.+\\.(ts|js|html)$": "jest-preset-angular",
  },

  // File extensions
  moduleFileExtensions: ["ts", "html", "js", "json", "mjs"],

  // Resolver for complex module resolution
  resolver: "<rootDir>/src/jest.resolver.js",
};
