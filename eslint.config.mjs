// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import plugin from "eslint-plugin-jest";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    plugin.configs["flat/all"],
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        ignores: [
            "eslint.config.mjs",
            "jest.config.js",
            "node_modules/**/*",
            "dist/**/*",
        ],
    }
);
