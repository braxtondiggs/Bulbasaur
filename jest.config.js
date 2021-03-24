const jestPreset = require("jest-preset-angular/jest-preset");
const { globals } = jestPreset;
const tsjest = globals["ts-jest"];
// set the correct path to the spect ts-config file
// the default for the jest-preset-angular package
// points to an incorrect path:
// <rootDir/src/tsconfig.spec.js
const tsjestOverrides = {
  ...tsjest,
  tsconfig: "<rootDir>/tsconfig.spec.json"
};
const globalOverrides = {
  ...globals,
  "ts-jest": { ...tsjestOverrides },
  gtag: {}
};
// make sure to add in the required preset and
// and setup file entries
module.exports = {
  ...jestPreset,
  globals: { ...globalOverrides },
  preset: "jest-preset-angular",
  setupFilesAfterEnv: ["<rootDir>/src/setupJest.ts"],
  coverageReporters: ["text", "lcov", "cobertura"],
  testPathIgnorePatterns: ["<rootDir>/cypress/", "<rootDir>/functions/"],
  moduleNameMapper: {
    "^lodash-es$": "lodash"
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ]
};
