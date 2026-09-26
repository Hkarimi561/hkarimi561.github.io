# Projects (list + detail) — Design Spec

Inherits `design/home.md` Part A and the shared page shell in
`design/nav.md` §6. The detail page's body typography reuses the
**prose system in `design/articles.md` §B.2**. It adds no new tokens.
It is flat, with no 3D: the one-3D-moment rule holds.

---

## A. `/projects` — list

### 1. Intent

A calm, scannable index of real work. Each card makes one clear claim
(what it is and what it's built with) and invites one action (open it).

### 2. Layout

**Page header** (per the shell): eyebrow `PROJECTS`, then an `h1`
("Selected work" or the owner's choice), then a one-line intro.

**Grid:** 1 column below `md`, **2 columns from `md` up**, with `gap-6`
(and `lg:gap-8`) and `pt-12`. Use two columns rather than three at `lg`
because a portfolio will likely have a handful of projects, and two
wide cards read more considered than a sparse 3-up grid. Order comes
from a `featured`/`order` field, then newest first.

**Card anatomy** (top to bottom):
1. **Cover:** 16:10, full card width, with a 1px `--color-border`
   bottom edge. It uses a real screenshot (WebP, ≤1200px wide,
   `loading="lazy"` below the fold).
   **Placeholder** when there is no cover: `--color-surface-raised`
   fill with a faint dot grid (1px dots in `--color-border`, 16px
   pitch), and the project slug centered in `mono-label`
   `--color-text-secondary` (for example `/realtime-dashboard`). It is
   generated, not a fake screenshot, and marked decorative.
2. **Body** (`p-6`, `gap-3`):
   - A meta line in `mono-label` `--color-text-secondary`: year · type
     (for example `2025 · OPEN SOURCE`).
   - The title, `h3` / `lg:h3-lg`, `--color-text-primary`.
   - A description in `small`/`body` with `--color-text-secondary`.
     Keep it to **≤140 characters in content** rather than clamping
     with CSS, so truncation never hides meaning.
   - A tags row in `mono-label` `--color-text-secondary`, with terms
     separated by ` / ` and a maximum of 4. It is text only, not pills,
     matching `home-section-2.md`.
   - A footer affordance in `mono-label` `--color-accent-strong`:
     `VIEW PROJECT →`, with `pt-2`.

The whole card is clickable, and it links to `/projects/[slug]` only.
Repo and demo links live on the detail page, so there are no nested
interactive elements inside a card.

**Empty state** (no projects yet): the page header plus one line in
`--color-text-secondary`: "Projects are being written up — in the
meantime, see the articles." with a link to `/articles`. Don't render
placeholder cards.

### 3. Tokens

| Element | Token |
|---|---|
| Card | `--color-surface` background, 1px `--color-border`, `rounded-lg`, `overflow-hidden`, no shadow |
| Card hover | background `--color-surface-raised`. The border strengthens to `--color-text-tertiary` (non-text use, so contrast rules don't apply) |
| Placeholder cover | `--color-surface-raised` with a `--color-border` dot grid |
| Meta, tags | `mono-label`, `--color-text-secondary` |
| Title | `h3`, display font, `--color-text-primary` |
| Description | `--color-text-secondary` |
| CTA affordance | `mono-label`, `--color-accent-strong` |

### 4. Interaction / motion

- **Hover (pointer devices only, `@media (hover: hover)`):** the
  background and border change as in the table, and the `→` in the
  footer shifts 4px right. That is 150ms, ease-out, and nothing more.
  **No** image zoom, lift/translate, shadow or tilt. The card should
  feel like a precise control, not a floating tile.
- **No scroll reveal and no stagger** (per the shell rules).
- Reduced motion: the arrow does not shift. The color changes are fine
  and stay instant through the global collapse.

### 5. Accessibility

- **Headings:** the page `<h1>`, then card titles as `<h2>`. They are
  the next level on this page even though they are styled `h3`.
- **Markup:** the grid is a `<ul>` of `<li>` wrapping an `<article>`.
  The card link is the **title's `<a>`**, stretched to cover the card
  with a pseudo-element. That keeps the accessible name concise (the
  title), rather than wrapping the whole card in an `<a>`, which makes
  screen readers read every line. `VIEW PROJECT →` is `aria-hidden`
  because it duplicates the link.
- **Focus:** when the title link is `:focus-visible`, draw the 2px
  focus ring around the **whole card** (via `:focus-within` on the
  card, keyed to focus-visible), using the card's own `rounded-lg`.
  Don't also ring the title text.
- **Images:** real screenshots get a short descriptive `alt`. The
  placeholder is `aria-hidden`.
- **Contrast:** secondary on surface is `#9AA1AC` on `#131519`, about
  7.4:1 (dark), and `#52565D` on `#FFFFFF`, about 7:1 (light).
  Accent-strong on surface passes in both themes (about 10:1 dark and
  about 5.2:1 light).

---

## B. `/projects/[slug]` — detail

### 1. Intent

A plain case-study template: what it is, what it's built with, where
to see it, and then the story. It is scannable in 10 seconds and
readable in 5 minutes.

### 2. Layout

1. **Back link:** `← ALL PROJECTS` in `mono-label`,
   `--color-text-secondary` (hover: primary), `pt-12` / `lg:pt-16`
   above the header.
2. **Header:** a meta eyebrow (`2025 · OPEN SOURCE`, accent-strong),
   then an `h1` title, then a one-sentence lede in `body-lg` with
   `--color-text-secondary` (max 60ch).
   - **Action row** (`gap-4`, `pt-2`): a primary button `Live demo ↗`
     styled like the hero CTA (accent fill, `--color-on-accent` text),
     and a secondary outlined button `Source ↗` (1px `--color-border`,
     `--color-text-primary` text, hover background
     `--color-surface-raised`), both `rounded-lg px-5 py-2.5`. **Only
     render a button if its URL exists.** If only one exists, it becomes
     the primary button.
3. **Cover** (optional): full container width, 16:9, `rounded-lg`, 1px
   border, `mt-12`. If there is no cover, omit it. Don't use the dot-grid
   placeholder here.
4. **Content zone** (`pt-12`, `lg:pt-16`), hairline above:
   - **Desktop (`lg`+):** an 8/4 split. The left 8 columns hold the body
     prose, capped at 68ch. The right 4 columns hold a **spec sheet**:
     a `<dl>` of `ROLE`, `YEAR`, `STACK`, `STATUS` and `LINKS`, with
     `mono-label` terms (secondary) and `small` values (primary). Rows
     are separated by hairlines with `py-3`. It is **not sticky**,
     consistent with "What I do".
   - **Below `lg`:** the spec sheet moves **above** the body in a
     single column, so the facts come first on small screens.
5. **Footer:** a hairline, then `← ALL PROJECTS` again, with `py-12`.

**Content fields the design assumes** (the developer finalizes these in
frontmatter): `title`, `slug`, `year`, `type`, `summary` (card
description and lede), `tags` (card), `stack` (spec sheet), `role`,
`status`, `repo`, `demo`, `cover`, `order`/`featured`.

### 3. Tokens

These are the same as the list page plus the prose system in
`articles.md`. The spec sheet uses `mono-label` terms in
`--color-text-secondary` and `small` values in `--color-text-primary`.

### 4. Motion

Buttons use 150ms color transitions. Nothing else animates.

### 5. Accessibility

- One `<h1>`. The prose body starts at `<h2>`. The spec sheet is a
  `<dl>` with a visually hidden `<h2>`, "Project details".
- The back link reads "All projects" to screen readers (the `←` is
  `aria-hidden`).
- External links: the `↗` is `aria-hidden`. The accessible names are
  "Live demo" and "Source code on GitHub". They open in the same tab,
  or add "(opens in new tab)" text if a new tab is chosen.
- Light theme: the primary button uses `--color-on-accent` (dark text
  on teal, about 5.3:1). Never use white text on the teal.
- Focus order: back link → demo → source → spec-sheet links → body
  links → footer back link. On mobile this matches the visual order
  because the spec sheet comes first there.
