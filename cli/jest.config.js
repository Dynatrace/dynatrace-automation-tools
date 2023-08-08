/** @type {import('ts-jest').JestConfigWithTsJest} */
// eslint-disable-next-line no-undef
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
};
