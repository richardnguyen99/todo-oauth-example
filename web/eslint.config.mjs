import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const configs = [
  // ...compat.extends("next/core-web-vitals"),
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
    settings: {
      next: {
        rootDir: "web",
      },
    },
  }),
  ...compat.extends("plugin:@tanstack/eslint-plugin-query/recommended"),
  ...compat.extends("prettier"),
  ...compat.plugins("@tanstack/query"),
];

export default configs;
