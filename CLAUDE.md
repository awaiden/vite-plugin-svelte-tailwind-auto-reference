# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vite plugin that automatically injects `@reference` directives into Svelte component style blocks to enable Tailwind's `@apply` directive. The plugin solves the problem where Svelte's scoped styles don't have access to Tailwind utilities without manual imports.

**Key behavior**: The plugin intercepts Svelte style blocks during Vite's transform phase, detects `@apply` usage, and prepends the necessary `@reference` directive to the CSS file(s) containing Tailwind utilities.

## Architecture

**Entry points:**
- `lib/main.ts` - The plugin source code (exported as library)
- `src/main.ts` - Demo application that uses the plugin

**Build configuration:**
- The plugin is built as an ES module library via `vite build`
- Output: `dist/counter.js` (exported through `package.json`)
- Types are declared in `index.d.ts` at the root

**Plugin flow:**
1. `configResolved` hook: Initializes the file filter using Vite's `createFilter` with include/exclude patterns
2. `transform` hook (enforce: "pre"): Intercepts files matching the filter (default: `/\.svelte\?.*svelte&type=style/`)
3. Checks if code contains `@apply` and isn't skipped by the `skip` callback
4. Inserts `@reference` directive(s) either at the top or after the last `@use` statement
5. Resolves the CSS file path relative to project root using `node:path`

**Key plugin configuration:**
- `cssFile`: Path(s) to Tailwind CSS file or a function returning them (default: `"tailwindcss"`)
- `include`: Files to transform (default: Svelte style blocks)
- `exclude`: Files to skip
- `skip`: Custom function to skip transformation based on code/id

## Development Commands

```bash
# Start dev server with hot module replacement
npm run dev

# Build the library (compiles TypeScript then builds with Vite)
npm run build
```

## Important Notes

- The plugin uses `enforce: "pre"` to run before other transforms
- Reference paths are resolved using `resolve(root, file)` from the Vite config root
- The plugin preserves existing `@use` statements by inserting references after them
- Transform returns `null` if file doesn't match filter or doesn't contain `@apply`
- The `cssFile` parameter can be a string, array, or async function for dynamic resolution
