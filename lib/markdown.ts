import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import rehypeShikiFromPackage from "@shikijs/rehype";
import {
  rehypeCaptureCodeLang,
  rehypeWrapCodeBlocks,
  rehypeWrapTables,
} from "./rehype-code-blocks";

// @shikijs/rehype ships as an ESM default export; re-typed here so the
// unified `.use()` chain below sees a plain plugin function.
const rehypeShiki = rehypeShikiFromPackage as unknown as typeof rehypeShikiFromPackage;

/**
 * Renders markdown body text to HTML for both articles and project detail
 * pages, per design/articles.md §B.2 (the shared "prose system"):
 * - `rehype-slug` gives headings ids (picked up by the global
 *   `scroll-margin-top` rule in globals.css).
 * - Syntax highlighting happens at build time via Shiki, dual dark/light
 *   themes emitted as CSS variables (`defaultColor: false`), switched by
 *   `[data-theme="light"]` in globals.css.
 * - Code blocks get wrapped in the header-strip + Copy-button markup; the
 *   button itself is wired up client-side by CodeBlockScript.
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  // Shared, per-call queue: rehypeCaptureCodeLang records each code
  // block's language (in document order) before Shiki replaces the
  // `<pre>` nodes; rehypeWrapCodeBlocks consumes it afterwards. See
  // lib/rehype-code-blocks.ts for why this can't just be a node property.
  const langQueue: (string | undefined)[] = [];

  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeCaptureCodeLang, langQueue)
    .use(rehypeShiki, {
      themes: {
        light: "github-light-default",
        dark: "github-dark-default",
      },
      defaultColor: false,
    })
    .use(rehypeWrapCodeBlocks, langQueue)
    .use(rehypeWrapTables)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
