# Home / Hero — Implementation Review

Reviewed against `design/home.md` (Parts A & B). Files read: `app/page.tsx`,
`app/layout.tsx`, `app/globals.css`, `components/three/HeroCanvas.tsx`,
`components/three/HeroVisual.tsx`, `components/three/IcosahedronMesh.tsx`,
`components/ui/ScrollAffordance.tsx`, `public/hero-fallback.svg`,
`lib/use-hero-motion-mode.ts`.

---

## 1. Verdicts on the five flagged ambiguities

**1. Type scale tablet behavior — needs correction (minor).**
The chosen fallback (H1 stays at mobile `display` size through `md`, jumps to
desktop `display` at `lg`; other tokens stay mobile-sized through `md`, jump
at `lg`) is a reasonable *default* and I won't ask for a full third tier
everywhere. But the H1 specifically is a problem: at `md` the H1 is still
rendered with `text-h1` (2rem/32px, the *mobile fallback* scale per spec
section 2), not `display` at its mobile size (2.5rem). Re-reading
`app/page.tsx` line 19: `text-h1 ... md:text-display ... lg:text-display-lg`
— so it does switch to `display`-mobile at `md`, which is actually correct
and matches what I'd want (display scale never below `md`, since tablet is
already the "two-zone-stacked" layout, not truly mobile). No fix needed on
re-reading — mark this as **matches intent**, not needing an explicit
tablet-only size. The other tokens (body, mono-label) staying flat from
mobile through tablet and only stepping up at `lg` is fine; those differences
are visually minor (1rem→1.125rem, 12px→13px) and not worth a third tier.

**2. Scroll affordance hidden below `lg` — matches intent.**
Hiding it entirely on tablet/mobile is correct. It was only specified for
the desktop split layout; on stacked tablet/mobile layouts there's no
"bottom-left of the hero" anchor point that makes sense once the 3D canvas
sits inline in the flow rather than as a full-height right-hand zone, and
mobile in particular already de-prioritizes the 3D moment (canvas is last,
after the CTA) — a scroll hint pointing at content the user is about to
scroll past anyway isn't needed there. Confirmed, no spec update required.

**3. Inter Tight instead of self-hosted Geist — matches intent.**
Spec explicitly named this as an acceptable fallback ("Inter Tight as a
fallback choice... Load via next/font/google (Inter Tight) or self-hosted
Geist"). Using it via `next/font/google` is exactly the documented path.
No correction needed.

**4. Placeholder SVG fallback — acceptable for this stage, flagged for follow-up.**
The swap logic, aspect ratio, and layout slot are implemented correctly and
match section 5 of the spec. The actual asset is not what the spec asked for
(a pre-rendered PNG/WebP still of the *real* mesh at its resting camera
angle, ~1200×1200, <200KB) — it's a hand-drawn placeholder gradient
polygon illustration, not a render of the actual icosahedron geometry/
material/lighting used in `IcosahedronMesh.tsx`. This is fine as a
development placeholder but must not ship as final: the resting rotation in
`IcosahedronMesh.tsx` is `x: 0.3, y: 0.4` radians with the real teal
`meshStandardMaterial` + the three-light rig from `HeroCanvas.tsx` — the
eventual static image should be a real render captured at that exact pose so
the fallback and the live scene read as the same object. **Action item for
before ship, not a developer-pass blocker now.**

**5. Desktop full-bleed via calc() padding — matches intent.**
This achieves the spec's intent correctly: text respects the 1200px
container measure while the 3D zone extends to the true viewport edge past
it. The `lg:[padding-left:max(2rem,calc((100vw-1200px)/2+2rem))]` approach is
a legitimate way to get "container-aligned text, full-bleed visual" without
nested-container gymnastics. One small note, not a blocker: on viewports
narrower than 1200px+padding (e.g. 1024–1200px, the low end of `lg`), the
`max(2rem, ...)` clamps to a flat 2rem left padding with no equivalent
clamp tying the *right* edge of the text column to anything — at exactly
`lg` (1024px) the text zone is simply 45% of viewport width starting 2rem
from the edge, which is fine and expected; flagging only so the developer
confirms this was intentional (it appears to be, given the comment in the
file) rather than an oversight.

---

## 2. Additional mismatches found in this pass

**A. Light-theme CTA contrast bug — needs correction (accessibility, real bug).**
Spec section 6 explicitly warns: white/light text on the light-theme accent
(`#0F9C8B`) is ~3.4:1, not sufficient, and instructs the developer *not* to
reuse the dark-mode CTA styling — use `--color-text-primary` (dark text) on
the accent fill in light mode instead. The implementation in `app/page.tsx`
uses a single class, `text-bg`, for the CTA label in all themes:

```
className="... bg-accent px-6 py-3 text-body font-medium text-bg ..."
```

`text-bg` resolves to `var(--color-bg)`, which is theme-dependent: dark mode
`--color-bg` is `#0A0B0D` (dark-on-teal, correct, ~14.6:1 as spec states) —
but light mode `--color-bg` is `#FAFAF9` (near-white), giving near-white text
on `#0F9C8B`, i.e. exactly the ~3.4:1 failure the spec called out and told
the developer to avoid. **Fix:** the CTA text color should not track
`--color-bg`; it should be a fixed choice per theme — e.g. add a dedicated
token (`--color-on-accent`) that resolves to `--color-bg`-equivalent in dark
mode but to `--color-text-primary` in light mode, or simply hardcode
`text-[#0A0B0D]` for dark and override to `text-text-primary` under
`[data-theme="light"]`. This doesn't visibly break anything yet because no
theme toggle is wired up in this pass (site is dark-only for now per what's
implemented), but it will silently ship a contrast failure the moment light
mode is turned on, so it should be fixed now while the CTA markup is fresh
rather than rediscovered later.

**B. Everything else checked — matches spec.**
- Colors: all hex values in `globals.css` match Part A exactly, both dark and
  `[data-theme="light"]` blocks, including the accent-soft/success/warning/
  danger tokens that aren't yet used in the hero but are correctly seeded for
  later pages.
- Focus states: global `:focus-visible` rule uses `--color-focus-ring` at
  2px / offset 2px exactly as specified, applies to the CTA and secondary
  link (both real `<a>` elements via `next/link`, descriptive text — "View
  projects" / "Read articles" — not "click here").
- Canvas is non-focusable/decorative: `tabIndex={-1}` + `aria-hidden="true"`
  on the wrapper div in `HeroVisual.tsx`, matches section 6 exactly. Static
  image fallback also gets `alt=""` + `aria-hidden="true"`, correct since
  it's purely decorative and the surrounding copy already states who the
  person is.
- Reduced motion: canvas genuinely never mounts under
  `prefers-reduced-motion: reduce` (`useHeroMotionMode` returns `"reduced"`
  before any WebGL import runs, and `HeroCanvas` is loaded via
  `next/dynamic(..., { ssr: false })` so it's not even in the bundle path
  taken). Global CSS also collapses all animation/transition durations under
  the media query as a defence-in-depth measure — reasonable belt-and-braces,
  not required by spec but doesn't conflict with it.
- Motion values in `IcosahedronMesh.tsx`: mouse tilt max ±12° via
  `MAX_TILT_RADIANS`, scroll-driven extra rotation ~38° (within the 30–45°
  band), autorotate at 1 revolution per 50s (within the 40–60s band), scale
  recede to 0.85 and opacity to 0.4 on scroll — all match spec numbers
  exactly. Rotation and scale/opacity changes are lerped every frame
  (`LERP_FACTOR` / `FADE_LERP_FACTOR`), not snapped, matching the "slow,
  weighted object" intent. Camera is static (`position: [0, 0, 5]`, `fov: 37`,
  within the 35–40° band), no orbit controls exposed — correct.
- Single mesh, single material, single draw call, no ground plane, no
  shadow-casting, no postprocessing — matches the spec's stated preference
  to start with the lighter single-icosahedron alternative rather than the
  multi-panel version, and the performance callout is respected.
- Lighting rig: ambient + hemisphere (fill-from-nothing-goes-black),
  warm-neutral directional key from upper-left (`position: [-4, 4, 3]`,
  `color: "#fff3e0"`), dim accent-teal point light from behind
  (`position: [1.5, -0.5, -3]`), matches the "moody but legible" lighting
  description point for point.
- Mobile/tablet layout order and aspect ratios: mobile is `aspect-square`
  capped at `max-h-[50vh]`, tablet steps to `aspect-[4/3]` capped at
  `max-h-[60vh]`, canvas is last in DOM order below `lg` (after the CTA) —
  matches section 2's mobile/tablet layout exactly, including the "canvas
  must not block the CTA" rationale.
- Heading structure: single `<h1>` in the hero, eyebrow is a `<p>` not a
  misused heading tag — correct.
- Reading measure: supporting sentence constrained to `max-w-[36ch]`, within
  the ~45–60 character band spec asked for.

---

## 3. Overall verdict

**Needs one small developer pass before this ships**, not a full re-do. The
implementation is faithful to the spec in almost every particular — layout,
motion values, accessibility wiring, and fallback architecture all read as
careful, deliberate translations of `design/home.md` rather than guesses.

Punch list, in priority order:

1. **Fix the light-theme CTA text-color bug (item A above).** This is a
   genuine accessibility regression the spec explicitly pre-empted; fix
   before any light-mode toggle ships, even though light mode isn't wired up
   yet in this pass.
2. **Track the placeholder fallback SVG as a follow-up task** (item 4) — swap
   in a real pre-rendered still of the actual `IcosahedronMesh` at its
   resting pose before this goes live; not blocking for continued
   development.
3. No other correction needed — items 1, 2, 3, 5 from the ambiguity list are
   confirmed as matching intent, and the broader pass turned up nothing else
   worth flagging.
