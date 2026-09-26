"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

/**
 * Tracks the current theme by observing `data-theme` on `<html>`, which
 * ThemeToggle (and the blocking inline script in app/layout.tsx) set
 * directly. Used by components — like the hero 3D scene — whose colors
 * need to react to a theme switch that happens outside their own tree.
 */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
