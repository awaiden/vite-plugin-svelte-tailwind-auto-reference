import type { FilterPattern, Plugin } from 'vite';

/**
 * A callback that determines which "@reference" should be added by the tailwindAutoReference plugin.
 */
export type CssFileFn = (
  code?: string,
  id?: string
) => Promise<string | string[]> | string | string[];

/**
 * An options object for the tailwindAutoReference plugin.
 */
export interface PluginOption {
  /** A list of picomatch patterns that match files to be excluded from transformation */
  exclude?: FilterPattern;
  /** A list of picomatch patterns that match files to be transformed */
  include?: FilterPattern;
  /** A function that determines whether a file should be skipped */
  skip?: SkipFn;
}

/**
 * A callback that determines whether a file should be skipped by the tailwindAutoReference plugin.
 */
export type SkipFn = (code?: string, id?: string) => boolean;

/**
 * A Vite plugin that automatically adds "@reference" directives to Svelte component style blocks.
 *
 * @param cssFile - The path to the Tailwind CSS file or an array of them or a sync or async function that returns it or them
 * @param opts - An options object
 * @returns The plugin configuration object for Vite
 */
export default function tailwindAutoReference(
  cssFile?: CssFileFn | string | string[],
  opts?: PluginOption
): Plugin;
