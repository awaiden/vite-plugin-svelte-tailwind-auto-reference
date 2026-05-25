// @ts-check

import js from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig, includeIgnoreFile } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  perfectionist.configs["recommended-natural"],
);
