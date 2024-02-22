/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions:["ts", "js", "json"],
  roots: ["<rootDir>/src"],
  testMatch:["**/test/**/*.ts", "*.test.ts"]
};