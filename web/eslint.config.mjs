import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig, globalIgnores } from "eslint/config";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const configs = [
  globalIgnores(["src/components/ui/**/*", "Ignore ShadCN components"]),
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "next/typescript",
      "prettier",
      "plugin:@tanstack/eslint-plugin-query/recommended",
      "plugin:prettier/recommended",
    ],
    settings: {
      next: {
        rootDir: "web",
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  }),
];

export default defineConfig(configs);
