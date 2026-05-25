# Publishing Guide

This document explains how to publish `vite-plugin-svelte-tailwind-auto-reference` to npm.

## Prerequisites

1. Create an npm account at [https://www.npmjs.com/signup](https://www.npmjs.com/signup) if you don't have one
2. Generate an npm access token:
   - Go to [https://www.npmjs.com/settings/~/tokens](https://www.npmjs.com/settings/~/tokens)
   - Click "Generate New Token" → "Classic Token"
   - Select "Automation" type (for CI/CD)
   - Copy the token
3. Add the npm token to GitHub secrets:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click "Add secret"

## Pre-publish Checklist

- [x] package.json configured with correct metadata
- [x] README.md created with usage instructions
- [x] LICENSE file added (MIT)
- [x] TypeScript types in index.d.ts
- [x] Build configuration optimized
- [x] .npmignore configured to exclude dev files
- [x] Repository pushed to GitHub

## Publishing Steps

### 1. Initialize Git Repository (if not done)

```bash
git init
git add .
git commit -m "Initial commit: Vite plugin for Svelte Tailwind auto-reference"
```

### 2. Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `vite-plugin-svelte-tailwind-auto-reference`
3. Make it public
4. Don't initialize with README (you already have one)

### 3. Push to GitHub

```bash
git remote add origin https://github.com/awaiden/vite-plugin-svelte-tailwind-auto-reference.git
git branch -M main
git push -u origin main
```

### 4. Test the Package Locally

Before publishing, test that everything works:

```bash
# Build the package
npm run build

# Test in another project
npm link
cd /path/to/test-project
npm link vite-plugin-svelte-tailwind-auto-reference
```

### 5. Publish to npm (Automated via GitHub Actions)

The repository includes a GitHub Actions workflow that automatically publishes to npm when you create a git tag:

```bash
# Create and push a tag (this triggers the publish workflow)
git tag v1.0.0
git push origin v1.0.0
```

The workflow will:

1. Run linting checks
2. Build the package
3. Publish to npm with provenance

### 6. Manual Publishing (Alternative)

If you prefer to publish manually:

```bash
# Make sure you're logged in
npm login

# Publish (this will run prepublishOnly script automatically)
npm publish
```

### 7. Verify Publication

After publishing, verify it appears on npm:

- https://www.npmjs.com/package/vite-plugin-svelte-tailwind-auto-reference

## Updating the Package

When you need to release a new version:

1. Make your changes and commit them
2. Update the version using npm (this updates package.json and creates a git tag):

   ```bash
   npm version patch  # for bug fixes (1.0.x)
   npm version minor  # for new features (1.x.0)
   npm version major  # for breaking changes (x.0.0)
   ```

3. Push changes and tags (this triggers the GitHub Actions workflow):
   ```bash
   git push && git push --tags
   ```

The GitHub Actions workflow will automatically publish the new version to npm.

Alternatively, you can manually create a tag:

```bash
git tag v1.0.1
git push origin v1.0.1
```

## Package Contents

The published package will include:

- `dist/plugin.js` - The compiled plugin
- `index.d.ts` - TypeScript type definitions
- `lib/` - Source code
- `README.md` - Documentation
- `LICENSE` - MIT license

## Notes

run

- The `prepublishOnly` script automatically runs the build before publishing
- Development files (src/, vite.config.ts, etc.) are excluded via .npmignore
- The package requires Vite as a peer dependency (not bundled)
