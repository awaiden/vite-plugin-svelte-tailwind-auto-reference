import { resolve } from "node:path";
import {
  createFilter,
  type FilterPattern,
  type Plugin,
  type ResolvedConfig,
} from "vite";

/**
 * A callback that determines which "@reference" should be added by the tailwindAutoReference plugin.
 * Returns the path to the Tailwind CSS file or an array of them.
 */
type CssFileFn = (
  code?: string,
  id?: string,
) => Promise<string | string[]> | string | string[];

/**
 * An options object for the tailwindAutoReference plugin.
 */
interface PluginOption {
  /** A list of picomatch patterns that match files to be excluded from transformation */
  exclude?: FilterPattern;
  /** A list of picomatch patterns that match files to be transformed */
  include?: FilterPattern;
  /** A function that determines whether a file should be skipped */
  skip: SkipFn;
}

/**
 * A callback that determines whether a file should be skipped by the tailwindAutoReference plugin.
 * Returns true if the file should be skipped, false otherwise.
 */
type SkipFn = (code?: string, id?: string) => boolean;

const defaultOpts: PluginOption = {
  exclude: [],
  include: [/\.svelte\?.*svelte&type=style/],
  skip: () => false,
};

const resolveFn = (fn: unknown, ...args: unknown[]) =>
  Promise.resolve(fn instanceof Function ? fn(args) : fn);

/**
 * A Vite plugin that automatically adds "@reference" directives to Svelte component style blocks.
 *
 * @param cssFile - The path to the Tailwind CSS file or an array of them or a sync or async function that returns it or them.
 * @param opts - An options object for configuring the plugin behavior.
 */
const tailwindAutoReference = (
  cssFile: CssFileFn | string | string[] = "tailwindcss",
  opts = defaultOpts,
): Plugin => {
  const { exclude, include, skip } = { ...defaultOpts, ...opts };
  let fileFilter: (id: string | unknown) => boolean, root: string;

  const getReferenceStr = (reference: string | string[]) =>
    (Array.isArray(reference) ? reference : [reference]).reduce(
      (acc, file) => `${acc}\n@reference "${resolve(root, file)}";`,
      "",
    );

  return {
    configResolved: (config: ResolvedConfig) => {
      root = config.root;
      fileFilter = createFilter(include, exclude, { resolve: root });
    },
    enforce: "pre",
    name: "tailwind-auto-reference",
    transform: async (code: string, id: string) => {
      if (!fileFilter(id)) return null;
      if (!code.includes("@apply ") || skip(code, id)) return null;

      const lastUseMatch = [...code.matchAll(/^\s*@use.*\n/gm)].at(-1);
      if (!lastUseMatch)
        return {
          code: `${getReferenceStr(await resolveFn(cssFile, code, id))}\n${code}`,
          map: null,
        };

      const before = code.substring(0, lastUseMatch.index);
      const after = code.substring(lastUseMatch.index + lastUseMatch[0].length);

      return {
        code: `${before}${getReferenceStr(await resolveFn(cssFile, code, id))}\n${after}`,
        map: null,
      };
    },
  };
};

export default tailwindAutoReference;
