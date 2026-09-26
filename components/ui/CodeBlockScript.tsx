"use client";

import { useEffect } from "react";

/**
 * The only client code on the article/project detail pages, per
 * design/articles.md §B.2. Wires up the Copy buttons that the markdown
 * pipeline (lib/rehype-code-blocks.ts) already rendered as static markup,
 * so the page itself stays a server component.
 */
export function CodeBlockScript() {
  useEffect(() => {
    const liveRegion = document.createElement("div");
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.className = "sr-only";
    document.body.appendChild(liveRegion);

    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLButtonElement>("[data-copy-button]").forEach((button) => {
      const wrapper = button.closest("[data-code-block]");
      const pre = wrapper?.querySelector("pre");
      if (!pre) return;

      let resetTimer: number | undefined;

      const handleClick = () => {
        const text = pre.textContent ?? "";
        navigator.clipboard
          .writeText(text)
          .then(() => {
            button.textContent = "COPIED";
            liveRegion.textContent = "Copied";
            window.clearTimeout(resetTimer);
            resetTimer = window.setTimeout(() => {
              button.textContent = "COPY";
            }, 2000);
          })
          .catch(() => {
            // Clipboard API unavailable or permission denied — the code
            // remains selectable/copyable by hand.
          });
      };

      button.addEventListener("click", handleClick);
      cleanups.push(() => {
        button.removeEventListener("click", handleClick);
        window.clearTimeout(resetTimer);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      liveRegion.remove();
    };
  }, []);

  return null;
}
