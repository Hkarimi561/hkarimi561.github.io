"use client";

import { useSyncExternalStore } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export type HeroMotionMode = "loading" | "full" | "low-end" | "reduced";

interface NavigatorWithHints extends Navigator {
  deviceMemory?: number;
  connection?: {
    saveData?: boolean;
    effectiveType?: string;
  };
}

function detectLowEndDevice(): boolean {
  const nav = window.navigator as NavigatorWithHints;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData ?? false;
  const slowConnection = nav.connection?.effectiveType
    ? ["slow-2g", "2g", "3g"].includes(nav.connection.effectiveType)
    : false;

  let hasWebGL2 = false;
  try {
    const canvas = document.createElement("canvas");
    hasWebGL2 = Boolean(canvas.getContext("webgl2"));
  } catch {
    hasWebGL2 = false;
  }

  return !hasWebGL2 || cores < 4 || memory < 4 || saveData || slowConnection;
}

// Device capability doesn't change during a session, so there is nothing to
// subscribe to — this store only exists to give useSyncExternalStore's
// server/client snapshot split, which handles the "unknown until mounted"
// state without a manual effect + setState.
function subscribeNever() {
  return () => {};
}

function getLowEndSnapshot(): boolean {
  return detectLowEndDevice();
}

function getLowEndServerSnapshot(): null {
  return null;
}

/**
 * Decides which hero visual path to render, per design/home.md section 5:
 * - "reduced": prefers-reduced-motion is set — the 3D canvas must never mount.
 * - "low-end": motion is allowed but the device/connection looks weak — show
 *   the static image with a cheap CSS-only hover tilt instead of WebGL.
 * - "full": mount the real @react-three/fiber canvas.
 * - "loading": true value not yet known (server render / first paint) —
 *   callers should render the static fallback in this state to avoid a flash.
 */
export function useHeroMotionMode(): HeroMotionMode {
  const reducedMotion = usePrefersReducedMotion();
  const lowEndChecked = useSyncExternalStore(
    subscribeNever,
    getLowEndSnapshot,
    getLowEndServerSnapshot,
  );

  if (lowEndChecked === null) {
    return "loading";
  }

  if (reducedMotion) return "reduced";
  return lowEndChecked ? "low-end" : "full";
}
