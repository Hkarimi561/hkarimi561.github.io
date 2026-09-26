# Home / Hero — Design Spec

This file has two parts: **Part A** is the project-wide visual system
(colors, type, spacing, layout language) that every later spec
(`/about`, `/projects`, `/articles`) inherits without repeating.
**Part B** is the implementation-ready spec for the home/hero section
itself.

---

## Part A — Visual Direction (project-wide)

### Point of view

**Minimal / technical, with one deliberate moment of depth.** The site
reads as a calm, dark, engineering-grade surface — closer to a
well-made CLI tool or a hardware product page than a colorful
"creative portfolio." Almost everything on screen is quiet: flat
surfaces, restrained color, monospace accents for labels/meta text,
generous negative space. The 3D element is the one place the site
allows itself to feel impressive — a single focused scene, not
ambient decoration scattered across every section. This contrast
(quiet UI + one confident 3D centerpiece) is the whole personality.
Avoid: gradients-as-decoration, glassmorphism piled on glassmorphism,
particle confetti, more than one animated 3D thing on screen at once.

### Color system

Dark is default. Light is a genuine alternative, not an afterthought —
same hue relationships, inverted lightness. Tokens are expressed as
CSS custom properties consumed via a Tailwind v4 `@theme` block, so
utility classes like `bg-surface` / `text-primary` / `text-accent`
exist directly.

```css
/* app/globals.css (or wherever the CSS-first Tailwind config lives) */

:root {
  /* Dark (default) */
  --color-bg:            #0A0B0D; /* page background */
  --color-surface:       #131519; /* cards, panels, nav */
  --color-surface-raised:#1B1E24; /* hovered/raised surface */
  --color-border:        #262A31; /* hairlines, dividers */

  --color-text-primary:   #F2F3F5; /* headings, body */
  --color-text-secondary: #9AA1AC; /* meta, captions, muted body */
  --color-text-tertiary:  #5C636F; /* disabled, placeholders */

  --color-accent:         #5EEAD4; /* teal — primary brand/interactive */
  --color-accent-strong:  #2DD4BF; /* hover/active state of accent */
  --color-accent-soft:    #163832; /* accent tint for subtle bg fills */

  --color-success: #4ADE80;
  --color-warning: #FBBF24;
  --color-danger:  #F87171;

  --color-focus-ring: #5EEAD4; /* same as accent, used at full opacity */
}

[data-theme="light"] {
  --color-bg:            #FAFAF9;
  --color-surface:       #FFFFFF;
  --color-surface-raised:#F1F1EF;
  --color-border:        #E3E3E0;

  --color-text-primary:   #14161A;
  --color-text-secondary: #52565D;
  --color-text-tertiary:  #8A8E96;

  --color-accent:         #0F9C8B; /* darkened teal for AA contrast on white */
  --color-accent-strong:  #0B7C6F;
  --color-accent-soft:    #E3F7F4;

  --color-success: #16A34A;
  --color-warning: #B45309;
  --color-danger:  #DC2626;

  --color-focus-ring: #0F9C8B;
}

@theme {
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  --color-surface-raised: var(--color-surface-raised);
  --color-border: var(--color-border);
  --color-text-primary: var(--color-text-primary);
  --color-text-secondary: var(--color-text-secondary);
  --color-text-tertiary: var(--color-text-tertiary);
  --color-accent: var(--color-accent);
  --color-accent-strong: var(--color-accent-strong);
  --color-accent-soft: var(--color-accent-soft);
  --color-success: var(--color-success);
  --color-warning: var(--color-warning);
  --color-danger: var(--color-danger);
}
```

Notes for the developer:
- Theme switch toggles `data-theme="light"` / removes it on `<html>`;
  default (no attribute) is dark. Respect `prefers-color-scheme` only
  as the *initial* guess before any stored user preference exists.
- Accent teal is deliberately desaturated-cool rather than a startup
  purple/blue — keeps the "technical" read and doesn't compete with
  the 3D scene's own lighting.

### Type scale

- **Display / headings:** [`Geist`](https://vercel.com/font) (or
  `Inter Tight` as a fallback choice) — a clean grotesk with a slightly
  technical edge. Load via `next/font/google` (Inter Tight) or
  self-hosted Geist.
- **Body:** `Inter` — highly legible at small sizes, pairs cleanly
  with the display face.
- **Meta / labels / code:** `JetBrains Mono` or `IBM Plex Mono` — used
  for nav labels, dates, tags, section eyebrows, and any literal code.
  This monospace-for-meta habit is a recurring signature across all
  pages, not just home.

Scale (mobile size → desktop size, all `rem`, 1rem = 16px):

| Token      | Mobile | Desktop | Weight | Line-height | Use |
|---|---|---|---|---|---|
| `display`  | 2.5rem (40px) | 5rem (80px) | 600 | 1.05 | Hero H1 only |
| `h1`       | 2rem (32px) | 3rem (48px) | 600 | 1.1 | Page titles |
| `h2`       | 1.5rem (24px) | 2rem (32px) | 600 | 1.2 | Section headings |
| `h3`       | 1.25rem (20px) | 1.5rem (24px) | 500 | 1.3 | Card titles |
| `body`     | 1rem (16px) | 1.125rem (18px) | 400 | 1.6 | Paragraphs |
| `small`    | 0.875rem (14px) | 0.875rem (14px) | 400 | 1.5 | Captions, secondary text |
| `mono-label` | 0.75rem (12px) | 0.8125rem (13px) | 500, uppercase, tracking +0.06em | 1.4 | Eyebrows, nav, tags, dates |

### Spacing scale & layout language

- Base unit: **4px**. Use Tailwind's default spacing scale (which is
  already 4px-based) rather than inventing a custom one — 1, 2, 3, 4,
  6, 8, 12, 16, 24, 32 (×4px) cover nearly everything needed.
- Section vertical rhythm: mobile sections use `py-16` (64px),
  desktop sections use `py-32` (128px). Generous vertical whitespace
  is part of the "calm" read.
- Container: max-width `1200px` (`max-w-6xl`-ish), horizontal padding
  `px-6` mobile / `px-8` desktop. Content never touches viewport edges.
- Grid: 12-column conceptual grid on desktop, single column on mobile.
  No CSS grid gimmicks — mostly flex/stack layouts with intentional
  gaps (`gap-6`–`gap-12`).
- Breakpoints: follow Tailwind defaults — `sm` 640px, `md` 768px,
  `lg` 1024px, `xl` 1280px. Design mobile-first; treat `lg` as the
  "desktop layout kicks in" threshold for multi-column compositions
  (the hero's split layout switches at `lg`).
- Radii: small and consistent — `rounded-lg` (8px) for cards/buttons,
  `rounded-full` only for pills/avatars. No large "friendly" rounding;
  it undercuts the technical tone.
- Shadows: avoid soft drop shadows almost entirely (they read as
  generic SaaS). Use a 1px `--color-border` hairline instead of
  shadow for separation; reserve a very subtle shadow only for
  anything that must visually float above the 3D canvas (e.g. a
  sticky nav on scroll).

---

## Part B — Home / Hero Section Spec

### 1. Intent

Land the visitor in a quiet, dark workspace and let one physical,
tangible 3D object — not abstract particles — do the work of showing
"this person builds real things and cares how they feel," while the
copy does the work of saying who he is and what to do next.

### 2. Layout

**Desktop (`lg` and up), viewport-height hero (`min-h-screen` or close to it):**
- Two-zone split, roughly 45/55.
  - Left zone (text, vertically centered): mono-label eyebrow
    (e.g. "SOFTWARE ENGINEER"), `display`-scale H1 (name or a short
    positioning line — content owner's call, not design's), one
    `body`-scale supporting sentence (max ~60 characters per line),
    a primary CTA button ("View projects") + a secondary text link
    ("Read articles") side by side.
  - Right zone: the 3D canvas, full-bleed to the section's right edge
    (canvas can extend to viewport edge even though text respects the
    container — this asymmetry is intentional, it's what makes the
    3D feel like it has room to exist rather than being boxed in).
- A small scroll-affordance (mono-label "SCROLL" + thin animated line
  or chevron) anchored bottom-left of the hero, fades out once the
  user scrolls past ~10% of viewport height.

**Tablet (`md`–`lg`):**
- Same two zones but stacked: text block on top (centered, narrower
  measure), 3D canvas below at a fixed aspect ratio (e.g. 4:3),
  height-capped so it doesn't dominate the fold. Canvas no longer
  full-bleed — contained within the page padding to avoid feeling
  cramped at this width.

**Mobile (`<md`):**
- Single column. Order: eyebrow → H1 (drop to `h1` scale, not
  `display`, to avoid awkward wrapping) → supporting sentence → CTA
  (full-width button) → secondary link → 3D canvas last, at a fixed
  square-ish aspect ratio (1:1 or 4:5), height-capped (~50vh max).
  Putting the canvas after the CTA on mobile is deliberate: the
  primary action must not require scrolling past a 3D scene to reach
  it on a small, possibly slow device.

### 3. Tokens used

- Background: `--color-bg`.
- Text: `--color-text-primary` (H1, body), `--color-text-secondary`
  (supporting sentence), `--color-accent` (eyebrow label + CTA
  background/text as appropriate).
- Primary CTA: solid fill `--color-accent`, text in `--color-bg`
  (dark-on-teal for contrast), hover → `--color-accent-strong`.
- Secondary link: `--color-text-secondary`, hover → `--color-text-primary`,
  underline offset on hover only (not resting state, to keep it quiet).
- Type: `display` for H1 (desktop), `h1` (mobile fallback), `body` for
  supporting sentence, `mono-label` for eyebrow and scroll affordance.
- Spacing: section uses the standard `py-16`/`py-32` rhythm; text
  block internal stack uses `gap-6`.

### 4. 3D scene concept

**What it shows:** a single abstract geometric object that reads as
"engineered," not organic — e.g. a low-poly icosahedron or a small
cluster of 3–5 rounded-edge boxes/cards arranged like floating panels
(a nod to "building things"), rendered with a matte/glass material in
the accent teal and neutral greys, sitting on nothing (no ground
plane) against the page's own background color so it feels like it's
floating in the same void as the page, not in a separate "3D box."

**Interaction:**
- **Mouse (desktop):** the object gently rotates to track cursor
  position within the canvas bounds (parallax-style tilt, max ~12°
  on each axis), using `drei`'s `useFrame` + lerped rotation — not an
  instant snap. No cursor-following required; it should feel like a
  slow, weighted object, not a toy.
- **Scroll:** as the user scrolls from the hero into the next section,
  the object slowly rotates further (an additional ~30–45° over the
  scroll distance of the hero) and fades/scales down slightly (to
  ~0.85 scale, opacity to ~0.4) so it recedes rather than abruptly
  disappearing. Drive this off scroll progress (e.g. via a simple
  scroll-listener or `framer-motion`'s `useScroll`), not physics.
- **Touch (mobile/tablet):** no drag-to-rotate gesture (avoid
  fighting the page's own scroll gesture). Instead, a slow constant
  autorotation (very slow, ~1 revolution per 40–60s) so the object
  still feels alive without requiring interaction.
- **Camera:** static position, fixed FOV (~35–40°, a longer lens
  reads more "product photography" than a wide fisheye look).
  No orbit controls exposed to the user — camera never moves, only
  the object does. This keeps the scene predictable and cheap.
- **Lighting mood:** one soft key light from upper-left (slightly
  warm-neutral, not colored), one dim rim/fill light from the accent
  teal behind the object to catch its edges, plus low ambient/hemisphere
  light so nothing goes fully black. Overall mood: moody but legible,
  like a product shot in a dim studio — not flat-lit, not neon.

**Performance risk callout:** if the object is realized as 3–5
separate floating panels with individual shadows/reflections, draw
calls and shadow-map cost can add up on low-end mobile GPUs,
especially combined with post-processing (bloom, etc.) which this
spec explicitly does **not** ask for — no bloom/DOF/postprocessing
passes on this scene. Lighter alternative if the multi-panel version
proves costly in practice: collapse to a single icosahedron/dodecahedron
mesh with a subtly faceted material (achieves a similar "engineered
crystal" feel with one draw call, one geometry, no shadow-casting
needed since it doesn't touch a ground plane). Prefer starting with
the single-mesh version and only moving to the multi-panel version if
performance headroom allows — cheaper to earn complexity than to claw
it back later.

### 5. Reduced-motion / fallback behavior

When `prefers-reduced-motion: reduce` is set, or the app's own
low-end-device check fails (e.g. no WebGL2, `navigator.hardwareConcurrency`
below a threshold, or a save-data/connection hint), **do not mount
the `@react-three/fiber` canvas at all.** Replace it with:

- A pre-rendered **static image** of the same object (a single PNG/WebP
  export of the 3D scene from the exact "resting" camera angle and
  lighting described above, roughly 1200×1200px, optimized to well
  under 200KB), placed in the same layout slot at the same aspect
  ratio, so the page layout does not shift between the two code paths.
- The image gets a very subtle CSS-only effect in place of the 3D
  motion: a slow `background-position`-free static state (no
  animation at all under `prefers-reduced-motion`) — just the still
  image. Do not substitute a CSS `@keyframes` spin/float as a
  "lighter" replacement; that still violates reduced-motion intent.
- Under the low-end-device path (motion is *not* explicitly reduced,
  just the device is weak), the same static image may use one small
  CSS transition only: a subtle hover/tilt via `transform` on mouse
  move (a cheap 2D CSS parallax, no WebGL), giving desktop low-end
  users a whisper of interactivity without a 3D context.
- The scroll-fade behavior (recede on scroll) is fine to keep as a
  plain CSS/`framer-motion` opacity+scale transition on the static
  image in both fallback cases, since that's a simple compositor-only
  animation, not something reduced-motion users need protected from
  by convention it's still worth gating: skip even that transition
  under `prefers-reduced-motion` and just show the image at a fixed
  opacity/scale.

### 6. Accessibility notes

- **Contrast:**
  - Dark theme: `--color-text-primary` (#F2F3F5) on `--color-bg`
    (#0A0B0D) ≈ 17.9:1 — far exceeds AA/AAA for any text size.
  - Dark theme: `--color-text-secondary` (#9AA1AC) on `--color-bg`
    ≈ 8.4:1 — passes AA/AAA for body text.
  - Dark theme: CTA text `--color-bg` (#0A0B0D) on `--color-accent`
    (#5EEAD4) ≈ 14.6:1 — passes comfortably.
  - Light theme: `--color-text-primary` (#14161A) on `--color-bg`
    (#FAFAF9) ≈ 17.5:1.
  - Light theme: `--color-text-secondary` (#52565D) on `--color-bg`
    (#FAFAF9) ≈ 6.6:1 — passes AA for body text (needs ≥4.5:1).
  - Light theme accent was deliberately darkened to `#0F9C8B` (rather
    than reusing the dark-mode `#5EEAD4`, which would fail on white)
    — white text on `#0F9C8B` ≈ 3.4:1, which is **not** sufficient for
    small text; for the light-theme CTA, use dark text
    (`--color-text-primary`) on the accent fill instead, or reduce the
    accent role there to borders/text-only (underline links, outlined
    button) rather than a filled button. Flagging this explicitly so
    the developer doesn't reuse the dark-mode CTA styling as-is in
    light mode.
- **Focus states:** every interactive element (CTA, secondary link,
  theme toggle, nav) gets a visible `--color-focus-ring` outline
  (2px, offset 2px), never `outline: none` without a replacement.
  The 3D canvas itself is not focusable/tabbable (`tabIndex={-1}` on
  its wrapper, `aria-hidden="true"` since it's decorative) — the
  static-image fallback likewise gets `aria-hidden="true"` /
  `alt=""` if purely decorative, or a short `alt` only if it conveys
  content the surrounding text doesn't already state.
- **Reduced motion:** covered fully in section 5 above; treat it as
  a hard requirement, not a nice-to-have — the canvas must not mount
  at all under `prefers-reduced-motion: reduce`.
- **Heading structure:** the hero H1 is the page's single `<h1>`.
  The eyebrow label is not a heading (a `<p>` or `<span>` styled with
  `mono-label`, not an `<h6>` misused for styling). Subsequent page
  sections start at `<h2>`. Ensure the CTA is a real `<a>`/`<button>`
  with descriptive text ("View projects," not "Click here").
- **Reading measure:** the supporting sentence under the H1 should
  wrap at a comfortable measure (~45–60 characters per line) — on
  desktop this may require a `max-w` constraint on that paragraph
  independent of the text block's other elements.
