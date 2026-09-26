"use client";

import { useMediaQuery } from "./use-media-query";

/** Tracks `prefers-reduced-motion: reduce`. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
