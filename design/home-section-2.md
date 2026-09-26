# Home / Section 2 — "What I do" Capability Strip — Design Spec

Inherits everything in `design/home.md` Part A (colors, type scale,
spacing, radii, breakpoints). This spec adds **no new tokens**.

## Why this option (and not the others)

Three options were considered:

- **Featured-work teaser (2–3 project cards).** Rejected for now.
  `/projects` doesn't exist yet, so the cards would either link to 404s
  or need invented placeholder projects. Placeholder projects on a live
  portfolio look worse than no projects. Revisit once real project
  content exists. At that point this section can be swapped or a third
  section added (the orchestrator's call, not something this spec adds).
- **About teaser.** Rejected. It would mostly repeat the hero ("Software
  Engineer, Hamid Karimi") and would compete with the future `/about`
  page.
- **Capability strip (chosen).** It expands the hero's one line ("I
  build fast, reliable full-stack products — from backend systems to the
  pixels people touch") into three concrete claims. It needs no dead
  links and no fake content, and its quiet, list-like shape suits the
  minimal/technical direction.

---

## 1. Intent

This is where the scroll cue lands. As the 3D object recedes, the page
settles into a calm, text-first answer to "what does he actually do?"
It should read as the hero's second sentence continuing, not as a new
chapter.

## 2. Layout

Structure (a single `<section>` directly after the hero, inside the
same `<main>`):

1. **Section header:** a `mono-label` eyebrow (`WHAT I DO`), then an
   `h2`. Suggested copy: "Full-stack, end to end." The content owner can
   replace it; keep it to 6 words or fewer.
2. **Capability list:** exactly **three** items, each made of:
   - A `mono-label` index in accent: `01`, `02`, `03`. This is the
     technical signature and stands in for icons (no icons, no
     illustrations).
   - An `h3` title.
   - One `body`-scale sentence in secondary text, 25 words at most.
   - Optional: one row of 3–4 plain `mono-label` tech terms in tertiary
     text, separated by ` / ` (for example `NODE / POSTGRES / REDIS`).
     This is text only, not pills or badges. Drop the row entirely if
     the content owner has nothing concrete to put there.

   Suggested placeholder copy, which mirrors the hero line:
   - `01` **Backend systems.** APIs, data models, and services built
     to stay fast and predictable under real load.
   - `02` **Product interfaces.** Accessible, responsive front-ends
     where the details people touch feel right.
   - `03` **Reliability & performance.** Observability, testing, and
     profiling so things keep working after launch.

No CTA is needed in this section. The hero already has "View projects"
and "Read articles", and repeating them here would be noise. No cards,
no background fills and no hover states on the items, because they are
not interactive.

**Container and rhythm:** use the standard container (max-width
1200px, `px-6` / `md:px-8`) and the standard section rhythm (`py-16`
mobile, `py-32` at `lg`). Separate the section from the hero with one
full-container-width 1px `--color-border` hairline at the section's top
edge, inside the container rather than full-bleed. That hairline is the
only divider.

**Desktop (`lg`+):**
- The header takes the left 4 of 12 columns and the list takes the
  right 8, top-aligned. The header stays put, is **not sticky**, and
  scrolls normally.
- Inside the 8 columns, the three items sit **stacked vertically**,
  not in 3 columns. Each item is a row: the index sits in a narrow
  fixed-width gutter on the left (about 4rem), with title, sentence and
  tech row to its right.
- A 1px `--color-border` hairline goes between items (not above the
  first or below the last). Use `py-8` vertical padding per item.
- Why stacked rows instead of three columns: rows read like a spec
  sheet or changelog, which suits the tone better. They also keep line
  lengths comfortable (about 55–65 ch) without narrow columns
  hyphenating.

**Tablet (`md`–`lg`):** a single column. The header sits above the
list with a `gap-12` between them. Items keep the index-gutter row
layout.

**Mobile (`<md`):** a single column. The index moves **above** the
title (stacked, `gap-2`) instead of sitting in a side gutter, so the
text gets the full width. Keep the hairlines between items and use
`py-6` per item.

**Minimum height and scroll length (important, see section 4):** don't
force `min-h-screen` on this section, because padding it with empty
space to fake length undermines the calm, dense-with-purpose read. Let
content set its height. The motion notes explain how to make the
recede complete anyway.

## 3. Tokens used (all existing)

| Element | Token |
|---|---|
| Section background | `--color-bg` (same as hero, so the join is seamless) |
| Top divider and item dividers | `--color-border`, 1px |
| Eyebrow `WHAT I DO` | `mono-label`, `--color-accent` (matches hero eyebrow) |
| Section heading | `h2`, `--color-text-primary`, display font |
| Item index `01`–`03` | `mono-label`, `--color-accent` |
| Item title | `h3`, `--color-text-primary`, display font |
| Item sentence | `body`, `--color-text-secondary`, max-width ~60ch |
| Tech-term row | `mono-label`, `--color-text-tertiary` (see a11y note) |
| Header block internal gap | `gap-4` |
| Item internal gap (title → sentence → tech row) | `gap-3` |

## 4. Motion notes

### A. How the section enters

This should be one soft reveal that continues the hero's recede
instead of starting a new effect.

- The header block and each of the three items fade in with a small
  upward travel: opacity 0 → 1, `translateY` 16px → 0. Use 500ms with
  an ease-out curve (`cubic-bezier(0.22, 1, 0.36, 1)`), the same family
  as the object's lerped settle.
- Trigger each element once, when it is about 15% inside the viewport
  (framer-motion `whileInView`, `once: true`). **Never reverse on
  scroll-up.** Content that un-reveals feels unstable.
- Stagger: the header first, then items at +80ms each. Because each
  item triggers on its own view entry, on tall viewports the stagger
  happens naturally. Don't chain a long cascade.
- Animate only `opacity` and `transform`. Don't animate the hairlines
  (no line-drawing effect), the text color or the layout.
- The feeling to aim for: as the object dims to 0.4 and shrinks, the
  text rises to full strength. Focus visibly hands off from object to
  words. The two motions share the same scroll window, so they read as
  one gesture.

### B. Making the hero's recede actually reach its end state (developer must handle)

Currently `HeroCanvas.tsx` maps recede progress 0 → 1 over **one full
hero-height** of scroll. With this section added, the maximum
scrollable distance is `scrollHeight − innerHeight`, which is roughly
this section's height. On a 1080px-tall desktop, that is likely around
700–800px, so the recede would stop at about 65–75% and never reach
scale 0.85 / opacity 0.4.

Spec'd behavior: the recede should complete by the time the page is
fully scrolled. Map progress over `min(heroHeight, maxScrollableDistance)`
instead of `heroHeight` alone. Apply the same fix to the low-end static
fallback path in `HeroVisual.tsx` (framer `useScroll` offsets). Don't
pad this section with empty height to fix it; padding is the wrong
lever.

### C. Scroll affordance

No change is needed. It already fades by 10% of viewport scroll, and
now it has a real destination. Optionally make it a real in-page link
to this section's `id` (for example `#what-i-do`) so it can be clicked
as well as read. If it becomes a link, it needs the standard focus
ring and an accessible name like "Scroll to What I do".

### D. What must NOT animate

- No parallax on the text.
- No hover effects on the (non-interactive) items.
- No counters or typing effects on the `01`/`02`/`03` indices.
- No second 3D element and no canvas in this section. The one-3D-moment
  rule from Part A holds.

### E. Reduced motion

Under `prefers-reduced-motion: reduce`, content renders in its final
state immediately: no fade and no translate. Don't substitute an
opacity-only fade. The existing global CSS duration collapse is a
backstop; gate the framer variants explicitly as well (for example
with `useReducedMotion` → `initial={false}`).

**Performance:** there is no measurable risk here. It is static text
with four one-shot compositor-only transitions, and it adds nothing to
the WebGL budget.

## 5. Accessibility notes

- **Headings:** the section heading is an `<h2>` (the page's first) and
  item titles are `<h3>`. The eyebrow and the `01`–`03` indices are
  `<p>`/`<span>`, not headings. Label the section with
  `aria-labelledby` pointing at its `<h2>`.
- **List semantics:** mark the three items up as an `<ol>` (the
  numbering is meaningful order in the visual design). Because the
  visible `01`–`03` duplicate the list numbering, hide either the
  native markers or the visible indices from assistive tech
  (`aria-hidden="true"` on the visible index spans is simplest) so
  screen readers don't announce "1, 01".
- **Contrast** (same pairs already verified in `home.md`, plus one new
  pair):
  - Primary text on bg: about 17.9:1 dark, about 17.5:1 light. Passes.
  - Secondary text on bg: about 8.4:1 dark, about 6.6:1 light. Passes
    AA for body text.
  - Accent `mono-label` on bg: `#5EEAD4` on `#0A0B0D` is about 13:1 in
    dark, which passes. `#0F9C8B` on `#FAFAF9` is about 3.3:1 in light,
    which **fails AA for 12–13px text**. The hero eyebrow has the same
    latent issue. In light mode, use `--color-accent-strong`
    (`#0B7C6F`, about 5:1) for small accent labels. Apply this to both
    the hero eyebrow and this section's eyebrow and indices.
  - **Tertiary tech row:** `#5C636F` on `#0A0B0D` is about 3.3:1 in
    dark, and `#8A8E96` on `#FAFAF9` is about 3.2:1 in light. **Both
    fail AA for small text.** The tertiary token was defined for
    disabled/placeholder use, so render the tech row in
    `--color-text-secondary` instead and keep the hierarchy through
    size and the mono face. This is a correction to the token table
    above: the tech row uses **secondary**, not tertiary.
- **Focus order:** hero H1 → hero CTAs → (scroll-affordance link, if
  made interactive) → this section, which has no focusable elements. No
  tab stops are added.
- **Reading measure:** keep item sentences at 60ch or less. On desktop
  the 8-column zone is wide, so cap the text width explicitly.
- **Reduced motion:** hard requirement, as described in 4E.
- **Zoom/reflow:** at 200% zoom and at a 320px width, items must reflow
  to the mobile stacked-index layout with no horizontal scroll. The tech
  row wraps naturally.
