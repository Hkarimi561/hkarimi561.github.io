"use client";

import { useTheme } from "@/lib/use-theme";

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="3.25" />
      <path d="M8 0.75V2.5M8 13.5V15.25M15.25 8H13.5M2.5 8H0.75M13.06 2.94l-1.24 1.24M4.18 11.82l-1.24 1.24M13.06 13.06l-1.24-1.24M4.18 4.18L2.94 2.94" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7Z" />
    </svg>
  );
}

/**
 * 40x40 (44x44 on mobile) icon button that swaps `data-theme` on
 * `<html>` instantly — no spin/morph, no global color transition — per
 * design/nav.md §4 and §5.
 */
export function ThemeToggle() {
  const theme = useTheme();

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // Storage may be unavailable (private browsing, disabled cookies) —
      // the toggle still works for the current session.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border text-text-secondary transition-colors hover:bg-surface-raised hover:text-text-primary md:h-10 md:w-10"
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
