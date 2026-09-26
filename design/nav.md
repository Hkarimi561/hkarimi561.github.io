# Site Header / Nav + Shared Page Shell — Design Spec

Inherits everything in `design/home.md` Part A. It adds **one layout
token** (`--nav-height`) and no new colors or type sizes. Sections 1–5
cover the header. Section 6 defines the shared page shell (main
container and page-header pattern) that `about.md`, `projects.md` and
`articles.md` reference, so it is written once here.

## 1. Intent

The header is a quiet, always-available way to move around the site. It
should read like a tool's menu bar, not a marketing header: one line of
text, no decoration, and it disappears into the page until you need it.

## 2. Layout

Rendered once in the root layout, above every page's `<main>`.

**Structure:** `<header>` → container (same as the site: max-width
1200px, `px-6` / `md:px-8`) → one row, `justify-between`,
vertically centered, height **`--nav-height` = 4rem (64px)**.

- **Left, wordmark:** "Hamid Karimi" in the display font, `body` size
  (16px), weight 600, `--color-text-primary`. It links to `/`. Don't
  add a logo mark, icon or accent color. The name is the brand.
- **Right, links + toggle:** Home, Projects, Articles, About in
  `mono-label` style (uppercase, +0.06em tracking, 12px, and 13px at
  `lg`), `gap-8`, followed by the theme toggle with `gap-6` before it.

**Desktop and tablet (`md`+):** everything inline as described above.
The four links fit comfortably at 768px, so no condensing is needed.

**Mobile (`<md`):**
- Row: wordmark on the left. On the right, the theme toggle and then a
  **text button reading `MENU`** (`mono-label`, secondary). It reads
  `CLOSE` when open. Use a text label rather than a hamburger icon
  because it is self-describing and fits the mono-label signature.
- Opening it reveals a **disclosure panel directly below the bar**. It
  is in flow under the sticky header, not a full-screen overlay. The
  panel spans the full width with `--color-bg` background and a 1px
  `--color-border` bottom edge. Links are stacked in the display font
  at `h3` mobile size (20px). Each row is at least 56px tall, with 1px
  hairlines between rows, and the panel has `pb-4`.
- The panel closes when a link is activated, on route change, on
  `Esc` (focus returns to the MENU button), and when the viewport
  crosses `md`.

**Sticky behavior:** the header is `sticky top-0`, above page content
(and above the hero canvas) in z-order.
- **At scroll top:** solid `--color-bg` with no border. It is
  indistinguishable from the page, so over the hero it reads as part of
  the same dark void.
- **After scrolling more than 8px:** a 1px `--color-border` bottom
  hairline appears. The background stays solid `--color-bg`. The
  hairline can fade in over 150ms, and nothing else changes.
- **Solid, not translucent/blurred, on purpose.** A `backdrop-filter`
  blur sitting over the live WebGL hero canvas forces recompositing
  every frame, which is a real perf cost on mobile GPUs, and Part A
  already rules out glassmorphism. Don't hide the header on scroll-down
  either. A calm, predictable header beats saving 64px.

**Over the hero vs. other pages:** there is no special "transparent
hero mode." The hero background is `--color-bg`, the same as every
page, so one treatment works everywhere, in both themes.

**Knock-on layout fixes (developer must handle):**
- The hero is currently `min-h-screen`. With a 64px header in flow,
  the page would overshoot the fold. Change the hero's minimum height
  to viewport height minus `--nav-height` (use `svh` so mobile browser
  chrome doesn't cause jumps).
- Any in-page anchor target (the `#what-i-do` scroll affordance,
  article heading ids) needs `scroll-margin-top` = `--nav-height` +
  1rem so the sticky header doesn't cover it.

## 3. Tokens used

| Element | Token |
|---|---|
| Header background | `--color-bg` |
| Scrolled bottom hairline, mobile panel dividers | `--color-border`, 1px |
| Wordmark | display font, 16px / 600, `--color-text-primary` |
| Link (resting) | `mono-label`, `--color-text-secondary` |
| Link (hover) | `--color-text-primary`, 150ms color transition |
| Link (active) | `--color-text-primary` plus a 1px `--color-accent-strong` underline, 6px offset |
| Mobile active row | `--color-text-primary` plus a 2px `--color-accent-strong` bar on the row's left edge |
| Theme toggle | 40×40px (44×44 on mobile) icon button, `rounded-lg`, 1px `--color-border`, 16px line icon (sun/moon, 1.5px stroke) in `--color-text-secondary`. Hover: `--color-surface-raised` background, icon `--color-text-primary` |
| New layout token | `--nav-height: 4rem` |

**Active-link rule:** Home matches `/` exactly. The other links match
by prefix, so `/projects/foo` highlights Projects and `/articles/bar`
highlights Articles.

## 4. Motion notes

- The only motion is 150ms color transitions on hover, the hairline
  fade-in on scroll, and the mobile panel opening (opacity 0 → 1 plus
  `translateY` −8px → 0, 150ms, ease-out). The panel closes instantly.
- The theme toggle swaps its icon instantly. No spin or morph. **Don't
  put a global color transition on theme change** (for example
  `transition: all` on `*`). It animates every element on the page and
  looks sluggish.
- **No theme flash:** set `data-theme` from localStorage (or from
  `prefers-color-scheme` if nothing is stored) in a blocking inline
  script before first paint. A flash of dark before light, or the
  reverse, on a static export is the most likely visible bug here.
- Under reduced motion, the panel appears instantly and the hairline
  appears instantly. The existing global duration collapse covers
  this, but gate the framer variant too if framer is used for it.
- Flag for the hero: switching to light mode must also re-tone the 3D
  scene and the static fallback image, which currently assume a dark
  background. That is outside this spec, but the toggle makes it
  reachable.

## 5. Accessibility notes

- **Skip link:** the first focusable element in `<body>`, labelled "Skip
  to content". It is visually hidden until focused. On focus it appears
  top-left (16px inset) above the header, with `--color-accent` fill,
  `--color-on-accent` text, `rounded-lg` and `px-4 py-2`. Its target is
  `<main id="main" tabIndex={-1}>`. Each page must render **exactly one**
  `<main id="main">`. Home currently renders its own `<main>`, so either
  keep that per-page or move it into the layout, but not both.
- **Landmarks:** `<header>` contains `<nav aria-label="Primary">`, and
  the links are a `<ul>`. The active link gets `aria-current="page"`,
  and the styling hooks off that attribute so visuals and semantics
  can't drift apart.
- **Mobile menu:** use the disclosure pattern, not a modal dialog. The
  button has `aria-expanded` and `aria-controls` pointing at the panel.
  There is no focus trap and no scroll lock (the panel is short and
  in-flow). Its accessible name comes from its visible text.
- **Theme toggle:** a real `<button>` whose `aria-label` describes the
  action ("Switch to light theme" / "Switch to dark theme"). The icon is
  `aria-hidden`.
- **Focus order:** desktop is skip link → wordmark → Home → Projects →
  Articles → About → theme toggle → main. Mobile is skip link →
  wordmark → theme toggle → MENU → (panel links when open) → main.
- **Focus ring:** the global 2px `--color-focus-ring` with 2px offset.
  Make sure the header's `overflow` doesn't clip the ring.
- **Contrast:** secondary link text is about 8.4:1 (dark) and about 6.6:1
  (light). The active underline uses `accent-strong` (about 11:1 dark,
  about 5:1 light), which is well above the 3:1 non-text minimum.
- **Hit targets:** at least 44×44px on touch (mobile rows are 56px).
  Desktop links get vertical padding so their hit area fills the 64px
  bar height.

## 6. Shared page shell (used by /about, /projects, /articles)

- **Container:** the standard 1200px container with `px-6` / `md:px-8`.
- **Page header pattern:** a `mono-label` eyebrow in
  `--color-accent-strong`, then an `h1` (`h1` scale, and `h1-lg` at
  `lg`), then an optional one- or two-sentence intro in `body` /
  `body-lg` with `--color-text-secondary`, max 60ch. Internal gap is
  `gap-4`. Padding is `pt-16 pb-12` on mobile and `lg:pt-24 lg:pb-16`.
  A 1px `--color-border` hairline sits under the header, inside the
  container.
- **Page bottom padding:** `pb-24` on mobile, `lg:pb-32`.
- **Small accent text rule (all pages):** any accent-colored text at
  `mono-label` or `small` size uses `--color-accent-strong`, never
  `--color-accent`. This fixes the light-mode AA failure noted in
  `home-section-2.md`, and the home page already does it.
- **Entrance motion:** none. Inner pages render in their final state,
  with no scroll reveals, no page-transition animation and no header
  fade. The scroll-reveal is the home page's gesture, tied to the hero
  recede. On pages people revisit to read or scan, it only delays
  content (and LCP).
- **Brief gap (not designed here):** there is no site footer (social
  links, email, copyright). If one is wanted, it needs its own spec.
