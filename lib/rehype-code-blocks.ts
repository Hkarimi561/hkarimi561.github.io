import type { Element, Root } from "hast";
import { visit } from "unist-util-visit";

const SHELL_ALIASES = new Set(["shell", "sh", "bash", "zsh"]);

function displayLabel(lang: string | undefined): string | null {
  if (!lang) return null;
  const normalized = lang.toLowerCase();
  if (SHELL_ALIASES.has(normalized)) return "SHELL";
  return normalized.toUpperCase();
}

/**
 * Runs after remark-rehype (which sets a `language-<lang>` class on the
 * `<code>` inside a fenced code block) and before Shiki. Shiki's rehype
 * transform replaces each `<pre>` node outright (not just its
 * properties), so a property set here wouldn't survive — instead this
 * records each block's language, in document order, into a shared queue
 * that `rehypeWrapCodeBlocks` consumes after Shiki has run.
 */
export function rehypeCaptureCodeLang(queue: (string | undefined)[]) {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "pre") return;
      const codeNode = node.children.find(
        (child): child is Element => child.type === "element" && child.tagName === "code",
      );
      if (!codeNode) {
        queue.push(undefined);
        return;
      }

      const className = codeNode.properties?.className;
      const classList = Array.isArray(className) ? className : [];
      const langClass = classList.find(
        (entry): entry is string => typeof entry === "string" && entry.startsWith("language-"),
      );
      queue.push(langClass ? langClass.replace("language-", "") : undefined);
    });
  };
}

/**
 * Wraps every `<pre>` (post-Shiki) in the container + header-strip markup
 * from design/articles.md §B.2: a language label (hidden if there is no
 * language) and a Copy button. The button is inert markup here — a tiny
 * client component (components/ui/CodeBlockScript.tsx) wires up the click
 * handler and clipboard write after hydration, so the article/project page
 * itself stays a server component.
 */
export function rehypeWrapCodeBlocks(queue: (string | undefined)[]) {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "pre" || !parent || index === undefined) return;

      const lang = queue.shift();
      const label = displayLabel(lang);

      node.properties = {
        ...node.properties,
        tabIndex: 0,
        role: "region",
        ariaLabel: label ? `Code: ${label}` : "Code",
      };

      const headerChildren: Element[] = [];
      if (label) {
        headerChildren.push({
          type: "element",
          tagName: "span",
          properties: { className: ["code-block__lang"] },
          children: [{ type: "text", value: label }],
        });
      }
      headerChildren.push({
        type: "element",
        tagName: "button",
        properties: {
          type: "button",
          className: ["code-block__copy"],
          dataCopyButton: "",
          ariaLabel: "Copy code",
        },
        children: [{ type: "text", value: "COPY" }],
      });

      const header: Element = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block__header"] },
        children: headerChildren,
      };

      const wrapper: Element = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block"], dataCodeBlock: "" },
        children: [header, node],
      };

      parent.children[index] = wrapper;
    });
  };
}

/** Wraps `<table>` elements in a horizontally-scrollable container. */
export function rehypeWrapTables() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "table" || !parent || index === undefined) return;
      const wrapper: Element = {
        type: "element",
        tagName: "div",
        properties: { className: ["table-wrapper"] },
        children: [node],
      };
      parent.children[index] = wrapper;
    });
  };
}
