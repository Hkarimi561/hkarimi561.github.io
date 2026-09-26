# Review: Nav, /about, /projects, /articles

This review checks the implementation against `design/nav.md`,
`design/about.md`, `design/projects.md` and `design/articles.md`. It is
based on reading the source plus the orchestrator's live-browser notes.

**Overall verdict: one more short developer pass is needed.** The
structure, tokens, semantics and theming are faithful to the specs, and
nothing needs rework. The items below are small, targeted fixes.
Priority 1 (P1) must be fixed before deploy. P2 should be in this pass.
P3 is polish and can slip.

---

## 1. Code-block overflow verdict

**This is not a clipping bug. The content is reachable.**

- `.code-block pre.shiki` has `overflow-x: auto` in `app/globals.css`.
  Shiki emits `class="shiki shiki-themes …"`, so the selector matches.
- The `overflow: hidden` on the `.code-block` wrapper only rounds the
  corners.
- The `<pre>` sits in normal block flow inside the 720px column, so its
  width is constrained and it scrolls internally. Its own
  `overflow-x: auto` wins. It is also keyboard-focusable (`tabindex=0`).

**Why it looks cut off:** macOS, iOS and Android use overlay scrollbars
that stay hidden until you scroll. The block also has a hard right edge
with no cue that more content exists. Scrolling works, but nothing on
screen suggests it. That is an affordance problem, not a reachability
problem, and it still needs fixing.

**Fixes:**

- **P1: scroll affordance.** On `pre.shiki`, add a pure-CSS
  scroll-shadow using `background-attachment: local` plus `scroll`
  layered gradients (the Lea Verou technique). A 24px fade from
  `--color-surface` shows at the right edge only while more content is
  to the right, and at the left edge once scrolled. This needs no JS.
  The current `background-color: var(--color-surface) !important` must
  become this layered `background` shorthand instead of a flat color.
  Also set `scrollbar-width: thin` and
  `scrollbar-color: var(--color-border) transparent`, so platforms that
  do render scrollbars show a quiet one that fits the theme.
- **P1: the focus ring is clipped (real a11y bug).** The focusable
  `<pre>` fills the wrapper. Its 2px outline at `outline-offset: 2px`
  lands outside the pre and gets clipped by the wrapper's
  `overflow: hidden`, so keyboard users get no visible focus. Fix:
  `.code-block pre:focus-visible { outline-offset: -2px; }` (an inset
  ring, still 2px `--color-focus-ring`).

## 2. Wrap vs. no-wrap decision: keep no-wrap

Keep no-wrap for all code, including long URLs. Wrapping only the URL
is not a meaningful option here. In these posts the URL is *inside* a
command (`git clone <url> <path>`), so wrapping the URL wraps the
command, and a visually broken command is exactly the mis-reading risk
we wanted to avoid. The real need ("get this exact command") is served
by the COPY button, which copies `textContent` regardless of layout.
With the scroll-shadow fix above, no-wrap reads correctly. The spec
stands unchanged.

---

## 3. Nav / header: matches intent, minor fixes

Correct:
- solid background with no blur
- 8px hairline logic
- active-link prefix rule with `aria-current`
- the MENU/CLOSE text button
- the disclosure pattern (Esc, route change and `md` crossing all close
  the panel)
- the blocking theme script
- the instant icon swap, with no global transition
- skip link styling and target
- one `<main id="main">` per page
- the hero `100svh - --nav-height` height fix
- `[id]` scroll-margin

Fixes:
- **P2: the MENU button hit target is about 17px tall.** It needs to be
  at least 44×44 on touch (nav.md §5). Give it `min-h-11` plus
  horizontal padding, and pull it back with a negative margin so the
  text stays right-aligned.
- **P2: the desktop link hit area.** Links need vertical padding so the
  hit area fills the 64px bar (nav.md §5). Right now it is text-height
  only.
- **P3: the header is 65px, not 64.** The always-present transparent
  `border-b` adds 1px to `--nav-height`, so the hero overshoots the fold
  by 1px. Use an inset `box-shadow` or an absolutely positioned hairline
  instead of a border, or make the header `box-border` at
  `h-[var(--nav-height)]`.
- **P3: hydration warning in light mode.** Add `suppressHydrationWarning`
  to `<html>`, because the inline script sets `data-theme` before React
  hydrates. The toggle icon also shows the sun for one frame in light
  mode (the server snapshot is "dark"). That is acceptable, and there is
  no fix needed beyond the warning.

## 4. Shared page header (PageHeader): one mismatch

- **P2: hairline width.** `border-b` sits on the padded container, so
  the rule extends 24px or 32px past the content edge on each side. The
  section hairlines on /about are content-width, and the two visibly
  disagree. Move the border onto the inner `flex` div (spec: "hairline
  … inside the container").
- Everything else matches: eyebrow in accent-strong, h1 steps, 60ch
  intro, and padding.

## 5. /about: matches intent

The 4/8 split, `<section aria-labelledby>` with h2 labels, the `<dl>`
toolbox, the tablet side-by-side / mobile stack behavior, the omitted
photo slot, and `overflow-wrap: anywhere` on links are all correct.
- **P3:** the Elsewhere link's accessible name may compute as
  "GitHubhkarimi561", because there is no separator between the spans.
  Add a visually hidden ": " after the name.
- **P3:** the hover underline also covers the mono name label. Limit the
  underline to the handle span.
- Content: LinkedIn and résumé are absent. That's the owner's call, not
  a defect.

## 6. /projects list: layout matches, content blocks ship

- **P1: the placeholder projects must not ship.** `project-one`, `-two`
  and `-three` are placeholders, and projects.md §A.2 says to render
  the empty state instead of placeholder cards. Before deploy, either
  add real projects or remove these files. The empty state is already
  implemented correctly.
- **P3: the arrow still shifts under reduced motion.** Only the duration
  collapses today. Use `motion-safe:group-hover:translate-x-1`.
- Correct: the 2-column grid, card anatomy, dot-grid placeholder cover,
  stretched title link, `has-[a:focus-visible]` card ring, and `hover:`
  (which Tailwind v4 already gates on `hover: hover`).

## 7. /projects/[slug]: mostly matches

- **P1: Copy buttons are dead on project pages.** `CodeBlockScript` is
  mounted only on article pages, but project bodies use the same
  pipeline and markup. Mount it on the project detail page too.
- **P3: secondary button label.** The visible label should be
  `Source ↗` per spec, with the accessible name "Source code on GitHub"
  (via `aria-label`). The label is currently long and visible.
- **P3:** the spec sheet omits the `LINKS` row. That's acceptable
  because the action row covers it, so no change is needed.
- Correct: the spec sheet moves above the body below `lg` and sits in
  the right 4 columns at `lg`, focus order matches, the cover is
  omitted when absent, and `on-accent` is used for button text.

## 8. /articles list: matches intent

The `<ol>` rows, UTC date formatting, the lg 3/9 gutter, stretched
link, accent-strong title hover, the `-mx-4 px-4` focus ring and the
meta line all match. No fixes.

## 9. /articles/[slug]: matches, apart from the code-block items in §1

The 720px column, header order, prose scale, underlined links, dual
Shiki themes switched by `data-theme`, the COPY/COPIED swap with a live
region, and the mobile bleed are all correct.
- **P3: inline code inside headings can wrap mid-token.** For example,
  `.zshrc` in an h3. Scope `overflow-wrap: anywhere` to body inline
  code, and set `normal` inside `h2`–`h4`.
- **P3 (content): the heading levels skip.** The body opens at `###`,
  which goes h1 → h3. Promote the step headings to `##`, or group them
  under an h2, so the outline starts at h2 (articles.md §B.4).

## 10. Theme toggle and dark/light across pages

Tokens switch correctly on every page, Shiki colors follow
`data-theme`, there is no global color transition, and the stored or
system preference is honored before paint. This passes, apart from the
P3 hydration note in §3.

---

## Prioritized punch list

1. **P1:** code-block scroll-shadow and thin themed scrollbar (§1).
2. **P1:** inset focus ring on the focusable `<pre>` (§1).
3. **P1:** remove placeholder projects, or replace them with real ones
   (§6).
4. **P1:** mount `CodeBlockScript` on `/projects/[slug]` (§7).
5. **P2:** MENU button 44px hit target, and desktop link hit area (§3).
6. **P2:** PageHeader hairline aligned to content width (§4).
7. **P3:** 1px header height, `suppressHydrationWarning`, reduced-motion
   arrow, `Source ↗` label, Elsewhere accessible name and underline,
   heading inline-code wrap, zsh heading levels.
