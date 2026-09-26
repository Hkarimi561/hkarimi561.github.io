"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sticky site header + mobile disclosure menu, per design/nav.md. Solid
 * `--color-bg` at all times (no blur, no transparency over the hero
 * canvas); a 1px bottom hairline fades in once the page has scrolled past
 * 8px.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // Close the mobile panel on route change. Adjusting state during render
  // (rather than in an effect) is the React-recommended pattern for
  // resetting state in response to a prop/derived value changing.
  const [pathnameAtLastOpenCheck, setPathnameAtLastOpenCheck] = useState(pathname);
  if (pathname !== pathnameAtLastOpenCheck) {
    setPathnameAtLastOpenCheck(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 8);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  // Close the mobile panel when the viewport crosses `md`.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = () => setMenuOpen(false);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Close on Esc, returning focus to the MENU button.
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-bg transition-[border-color] duration-150 ${
        scrolled ? "border-b border-border" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[var(--nav-height)] max-w-[1200px] items-center justify-between px-6 md:px-8">
        <Link
          href="/"
          className="font-display text-body font-semibold text-text-primary"
        >
          Hamid Karimi
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <nav aria-label="Primary">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href, pathname);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`font-mono text-mono-label uppercase tracking-[0.06em] transition-colors lg:text-mono-label-lg ${
                        active
                          ? "text-text-primary underline decoration-accent-strong decoration-1 underline-offset-[6px]"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls={panelId}
            onClick={() => setMenuOpen((open) => !open)}
            className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary transition-colors hover:text-text-primary"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id={panelId}
          className="w-full border-b border-border bg-bg pb-4 duration-150 ease-out motion-safe:animate-[disclosure-in_150ms_ease-out] md:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, pathname);
              return (
                <li
                  key={link.href}
                  className={`relative border-t border-border first:border-t-0 ${
                    active ? "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-accent-strong" : ""
                  }`}
                >
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex min-h-14 items-center px-6 font-display text-h3 text-text-primary`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
