# Review: Home / Section 2 ("What I do") against `design/home-section-2.md`

Files reviewed: `components/ui/WhatIDo.tsx`, `app/page.tsx`,
`lib/use-prefers-reduced-motion.ts`, `lib/use-media-query.ts`,
`app/globals.css`, and a spot check of the recede fix in `components/three/`.

## 1. Wiring in `app/page.tsx`: PASS
`<WhatIDo />` sits directly after the hero `<section>` inside the same
`<main>`. It has no `min-h-screen` and no padding hack. The recede fix
from spec 4B is present in both `HeroCanvas.tsx` and `HeroVisual.tsx`: both
map progress over the page's real remaining scroll distance
(`scrollHeight - innerHeight - heroDocTop`).

## 2. Contrast fixes: PASS
- The hero eyebrow, the section eyebrow and the `01`–`03` indices all use
  `text-accent-strong`. In light mode that is `#0B7C6F` on `#FAFAF9`
  (about 5:1), which fixes the AA failure the spec flagged. In dark mode
  it is `#2DD4BF` on `#0A0B0D` (about 10.6:1), which also passes. The spec
  only asked for the swap in light mode. Using the token in both modes
  makes dark-mode labels a touch deeper than the `#5EEAD4` CTA. That is an
  acceptable, consistent simplification, so no change is needed.
- The tech row uses `text-text-secondary`, not tertiary, which matches the
  correction in the spec's a11y section. The item sentence also uses
  secondary. Both pass.

## 3. Layout and tokens: one mismatch
- **MISMATCH: top hairline is full-bleed.** The `border-t border-border`
  sits on the `<section>`, so it runs edge to edge. The spec asks for it
  *inside* the container, at the container's width. **Fix:** move the top
  border onto the inner `max-w-[1200px]` element. If the border would then
  span the padding, wrap the content in a bordered child instead. The line
  must align with the text edges (inside `px-6` / `md:px-8`).
- Everything else matches the spec:
  - 4/8 grid at `lg`, top-aligned and not sticky.
  - Stacked rows with a `w-16` (4rem) index gutter from `md` up.
  - Index stacks above the title with `gap-2` below `md`.
  - Hairlines between items only, via `first:border-t-0`.
  - Item padding is `py-6` / `lg:py-8`.
  - Header `gap-4`, item `gap-3`, and a `gap-12` equivalent between
    header and list at tablet size (`mt-12`).
  - Text is capped at 60ch.
  - Semantics are correct: `<ol>`, an `<h2>` wired to `aria-labelledby`,
    `<h3>` item titles, and `aria-hidden` on the visible indices.
  - No hover states and no CTA.
- Minor, optional: Tailwind preflight sets `list-style: none`, and Safari
  with VoiceOver drops list semantics in that case. Adding `role="list"`
  to the `<ol>` restores them. This does not block shipping.

## 4. Motion: FAIL (reduced-motion path is broken)
- The normal path matches the spec: opacity 0→1, y 16→0, 0.5s,
  `cubic-bezier(0.22,1,0.36,1)`, `once: true`, `amount: 0.15`. The header
  has delay 0, then items come in at +80, +160 and +240ms. Only opacity
  and transform animate.
- **BUG: under reduced motion the content is likely to stay invisible.**
  The cause is a sequence of steps:
  1. `useMediaQuery` returns `false` on the server and during hydration
     (via `getServerSnapshot`).
  2. So the static HTML is rendered with `initial={{opacity:0, y:16}}`.
  3. After hydration the hook flips to `true`. The component then sets
     `initial` to `undefined` and `whileInView` to `undefined`.
  4. `initial` is only read on mount, and nothing now animates the
     element to `visible`. The element stays at opacity 0.
  5. The global CSS backstop only shortens transition and animation
     durations. It cannot override framer's inline styles.

  This breaks the spec's hard requirement in 4E (content renders in its
  final state immediately).

  **Fix:**
  - Always pass `whileInView={visible}`.
  - Under reduced motion, pass a zero-duration transition with no delay
    rather than removing the target.
  - Add a CSS rule for `prefers-reduced-motion: reduce` that forces the
    reveal elements (tag them with a data attribute) to `opacity: 1` and
    `transform: none` with `!important`. This makes the very first paint
    correct before JS hydrates. The result is the final state with no
    fade and no opacity-only substitute.

  Verify with DevTools "Emulate prefers-reduced-motion: reduce" on a
  hard reload of the static export (`next build` output), not just in
  dev mode.

## Overall verdict: NEEDS ANOTHER DEVELOPER PASS (short)
Punch list:
1. Fix the reduced-motion reveal so content is never stuck at opacity 0.
   Keep the `whileInView` target, use a zero-duration transition when
   reduced motion is on, and add the CSS first-paint override.
2. Move the section's top hairline inside the container.
3. (Optional) Add `role="list"` to the `<ol>`.

After items 1 and 2 are fixed, this section can ship. No re-review is
needed beyond a quick check of the reduced-motion behavior.
