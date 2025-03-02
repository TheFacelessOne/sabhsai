/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    setupFiles: ["test/test-utils.ts"],
    testPathIgnorePatterns: ["test-utils.ts"],
};
