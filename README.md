# vite-plugin-svelte-tailwind-auto-reference

A Vite plugin that automatically adds `@reference` directives to Svelte component style blocks, enabling Tailwind CSS `@apply` directive support in scoped styles.

## Problem

When using Tailwind's `@apply` directive in Svelte component style blocks, you typically need to manually add `@reference` directives to import your Tailwind CSS file:

```svelte
<style>
  @reference "./path/to/tailwind.css";
  
  .my-class {
    @apply flex items-center;
  }
</style>
```

This is repetitive and easy to forget.

## Solution

This plugin automatically injects the necessary `@reference` directive when it detects `@apply` usage in your Svelte component styles.

## Installation

```bash
npm install -D vite-plugin-svelte-tailwind-auto-reference
```

## Usage

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindAutoReference from 'vite-plugin-svelte-tailwind-auto-reference'

export default defineConfig({
  plugins: [
    svelte(),
    tailwindAutoReference()
  ]
})
```

Now you can use `@apply` in your Svelte components without manually adding `@reference` directives:

```svelte
<style>
  .my-class {
    @apply flex items-center justify-center;
  }
</style>
```

The plugin will automatically inject:

```svelte
<style>
  @reference "tailwindcss";
  
  .my-class {
    @apply flex items-center justify-center;
  }
</style>
```

## Configuration

### Basic Options

```typescript
tailwindAutoReference(cssFile, options)
```

#### `cssFile` (optional)

Type: `string | string[] | (code?: string, id?: string) => string | string[] | Promise<string | string[]>`  
Default: `"tailwindcss"`

The path(s) to your Tailwind CSS file, or a function that returns the path(s).

**Examples:**

```typescript
// String path
tailwindAutoReference('./src/styles/tailwind.css')

// Multiple paths
tailwindAutoReference(['./src/styles/tailwind.css', './src/styles/custom.css'])

// Dynamic function
tailwindAutoReference((code, id) => {
  return id.includes('admin') ? './admin-tailwind.css' : './tailwind.css'
})

// Async function
tailwindAutoReference(async (code, id) => {
  const config = await loadConfig()
  return config.cssPath
})
```

#### `options` (optional)

Type: `object`

- **`include`** (optional)  
  Type: `FilterPattern` (string | RegExp | Array<string | RegExp>)  
  Default: `[/\.svelte\?.*svelte&type=style/]`  
  Patterns to match files for transformation.

- **`exclude`** (optional)  
  Type: `FilterPattern`  
  Default: `[]`  
  Patterns to exclude from transformation.

- **`skip`** (optional)  
  Type: `(code?: string, id?: string) => boolean`  
  Default: `() => false`  
  Custom function to skip transformation based on file content or path.

### Advanced Examples

```typescript
// Custom include/exclude patterns
tailwindAutoReference('./src/styles/tailwind.css', {
  include: [/\.svelte$/, /\.vue$/],
  exclude: [/node_modules/]
})

// Skip specific files
tailwindAutoReference('./src/styles/tailwind.css', {
  skip: (code, id) => {
    // Skip if file already has @reference
    return code?.includes('@reference') ?? false
  }
})
```

## How It Works

1. The plugin runs in Vite's `pre` enforce phase
2. It intercepts Svelte style blocks (files matching `/\.svelte\?.*svelte&type=style/`)
3. When it detects `@apply` usage, it injects the `@reference` directive
4. If `@use` statements exist, the `@reference` is placed after the last `@use`
5. Otherwise, it's placed at the beginning of the style block

## Requirements

- Vite 5.x, 6.x, 7.x, or 8.x
- Svelte (when using with Svelte components)

## Credits

This plugin is inspired by [vite-plugin-vue-tailwind-auto-reference](https://github.com/M1CK431/vite-plugin-vue-tailwind-auto-reference) by M1CK431. The original project provides the same functionality for Vue components.

## License

MIT

## Contributing

Issues and pull requests are welcome at [https://github.com/awaiden/vite-plugin-svelte-tailwind-auto-reference](https://github.com/awaiden/vite-plugin-svelte-tailwind-auto-reference)
