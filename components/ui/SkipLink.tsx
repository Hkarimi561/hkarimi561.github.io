/**
 * The first focusable element in <body>, per design/nav.md §5. Visually
 * hidden until focused, then it appears above the header.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-body focus:font-medium focus:text-on-accent"
    >
      Skip to content
    </a>
  );
}
