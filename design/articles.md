# Articles (list + detail) — Design Spec

Inherits `design/home.md` Part A and the shared page shell in
`design/nav.md` §6. §B.2 defines the **prose system**, which
`/projects/[slug]` also uses. It adds no new color or type tokens.

---

## A. `/articles` — list

### 1. Intent

This reads like a changelog of what he's learned: dense and scannable,
dated, and newest first. Titles carry the page, and everything else is
quiet metadata.

### 2. Layout

**Page header** (per the shell): eyebrow `ARTICLES`, then an `h1`
("Writing"), then a one-line intro.

**List:** rows, not cards. This deliberately echoes the stacked-row
pattern of "What I do". Rows are sorted by `date` descending, with a 1px
`--color-border` hairline between them (none above the first), `py-8`
per row, and `pt-4` below the header hairline.

**Row anatomy:**
- **Date:** `mono-label`, `--color-text-secondary`, formatted as
  `MAR 16, 2023` (the uppercase comes from the label style). It is
  rendered as `<time dateTime="2023-03-16">`.
- **Title:** `h3` / `lg:h3-lg`, display font, `--color-text-primary`.
  This is the link.
- **Excerpt:** `body`, `--color-text-secondary`, max 60ch. Use the
  frontmatter `excerpt`, and if it is missing, the first ~160 characters
  of body text with markdown stripped.
- **Meta line:** `mono-label`, `--color-text-secondary`: `4 MIN READ`,
  then ` · `, then the tags separated by ` / ` (for example
  `4 MIN READ · ZSH / SHELL`). Tags are text only and not links. (Gap:
  there are no tag-filter pages in the brief, so the tags must not look
  clickable.)

**Desktop (`lg`+):** the date sits in a left gutter of 3 of 12 columns,
top-aligned with the title. Title, excerpt and meta sit in the right 9
columns, with `gap-3`.
**Below `lg`:** a single column in this order: date, title, excerpt,
meta, with `gap-2`.

**Empty state:** "Nothing published yet." in `--color-text-secondary`.

### 3. Interaction

- The whole row is clickable through a stretched title link (the same
  technique as the project cards).
- **Hover (`hover: hover` only):** the title color changes to
  `--color-accent-strong`, over 150ms. The row gets no background
  change, no arrow and no movement.
- **Focus-visible:** the focus ring goes around the whole row. Give the
  row `-mx-4 px-4` (with `rounded-lg`) so the ring has breathing room
  without shifting the text alignment.
- No scroll reveal (per the shell rules).

### 4. Accessibility

- Rows are a `<ol>` (the order is meaningful) of `<li>` wrapping an
  `<article>`. Titles are `<h2>`. The accessible name of the link is
  the title only.
- Contrast: every text color here is primary or secondary, and both
  already pass in both themes (see `home.md`). Tertiary is not used.

---

## B. `/articles/[slug]` — detail

### 1. Intent

A comfortable, distraction-free reading column for technical writing.
Code is a first-class citizen: easy to read, easy to copy, and never
breaking the layout.

### 2. Layout and prose system

**Column:** a single centered column, `max-w-[720px]` (about 68ch at
18px). It is centered, not a 4/8 split, because long-form reading beats
system consistency here. There are no sidebars, TOC or progress bar
(none are in the brief).

**Header** (`pt-12`, `lg:pt-16`, `pb-10`, hairline below):
1. `← ALL ARTICLES` back link in `mono-label`, secondary (hover:
   primary), with `mb-10`.
2. A meta line in `mono-label` `--color-text-secondary`:
   `MAR 16, 2023 · 4 MIN READ`.
3. An `h1` / `lg:h1-lg` title, with `mt-4`.
4. Optional: the excerpt as a lede in `body-lg` `--color-text-secondary`
   with `mt-4`, and the tags row in `mono-label` secondary with `mt-6`.

**Prose (the body, `pt-10`)**. All vertical spacing is in `em` so it
scales with the body size.

| Element | Treatment |
|---|---|
| Paragraph | `body` (16px) / `lg:body-lg` (18px), **line-height 1.7** for long-form, `--color-text-primary`, `margin-block: 1.25em` |
| `h2` | `h2` / `lg:h2-lg`, display font, `mt-[2.5em] mb-[0.75em]` |
| `h3` | `h3` / `lg:h3-lg`, display font, `mt-[2em] mb-[0.5em]` |
| `h4` | `body-lg`, weight 600, display font, `mt-[1.75em] mb-[0.5em]` |
| Links | `--color-accent-strong`, **underlined at rest** (1px, offset 3px). Hover: `--color-text-primary`. In running text, links must not rely on color alone, which is why this differs from the hero's resting-no-underline link |
| Lists | `pl-6`, `li` spacing `0.5em`, markers in `--color-text-secondary`. Ordered-list numbers use the mono font |
| Blockquote | 2px `--color-accent-strong` left border, `pl-5`, `--color-text-secondary`, no italics |
| Inline code | mono font at `0.875em`, `--color-surface-raised` background, 1px `--color-border`, `px-1.5 py-0.5`, 4px radius, `--color-text-primary`. Never wraps mid-token in headings. In body it may wrap if needed (`overflow-wrap: anywhere`) so it can't cause horizontal scroll |
| `hr` | 1px `--color-border`, `my-[3em]` |
| Images | `max-w-full`, `rounded-lg`, 1px border. `figcaption` in `small` `--color-text-secondary`, `mt-2` |
| Tables | full width, `small` text, `mono-label` header row in secondary, hairline row dividers. Wrap in a horizontally scrollable container |

**Code blocks** (the existing content is mostly `shell` fences):
- **Container:** `--color-surface` background, 1px `--color-border`,
  `rounded-lg`, `my-[1.75em]`.
- **Header strip:** 36px tall with a hairline below. On the left, the
  language in `mono-label` `--color-text-secondary` (`SHELL`; map
  `shell`/`sh`/`bash`/`zsh` to `SHELL`, and hide the strip's label if
  there is no language). On the right, a **Copy** button: `mono-label`
  text reading `COPY`, which changes to `COPIED` for 2s. It is
  secondary, and primary on hover. A text label, not just an icon.
  This matters because these posts are literally "paste these
  commands."
- **Code:** JetBrains Mono at **14px (0.875rem) on every breakpoint**
  (don't scale it with body), line-height 1.6, padding `px-5 py-4`.
  **No wrapping:** `overflow-x: auto` with horizontal scroll, because
  wrapped shell commands are easy to mis-copy. The existing posts have
  long `git clone …` lines, so this will happen. Tab size is 2. No line
  numbers (they get in the way of copying shell commands).
- **Mobile (`<md`):** the block bleeds to the viewport edges (`-mx-6`,
  no side borders, no radius), giving long commands about 48px more
  width.
- **Syntax highlighting:** at **build time with Shiki** (via a rehype
  plugin such as `@shikijs/rehype` or `rehype-pretty-code`), with zero
  client-side highlighter JS. Use **dual themes**, `github-dark-default`
  for dark and `github-light-default` for light, emitted as CSS
  variables and switched by `[data-theme="light"]`. **Override the
  theme background** to `--color-surface` so blocks match the system.
  Both themes' token colors, including comments, are around 4.5:1 or
  better on our surfaces. Spot-check comment color in light mode, and
  if it fails, darken it.
- **Copy button JS** is the only client code on this page. Keep it a
  tiny client component, and don't turn the whole article into a client
  component for it.

**Footer:** a hairline, then `← ALL ARTICLES` with `py-12`. No
prev/next and no comments (not in the brief).

**Breakpoints:** besides the code-bleed rule and the type steps at `lg`,
the column just fills the container below 720px.

### 3. Motion

None, apart from 150ms link and button color transitions and the
instant `COPY` → `COPIED` label swap. Nothing animates in the reading
column.

### 4. Accessibility

- **Headings:** the frontmatter `title` is the page's only `<h1>`. The
  body renderer must **shift or strip a leading markdown H1/H2 that
  duplicates the title** (see the migration notes). Headings get ids
  (`rehype-slug`) with `scroll-margin-top` per `nav.md`.
- **Scrollable code blocks:** the `<pre>` gets `tabIndex=0`,
  `role="region"` and `aria-label="Code: shell"`, so keyboard users can
  scroll it (axe `scrollable-region-focusable`). It gets the normal
  focus ring.
- **Copy button:** a real `<button>` with `aria-label="Copy code"`. On
  success, announce "Copied" through an `aria-live="polite"` region.
- **Measure:** 68ch maximum for prose. Code blocks may use the same
  column width, not wider.
- **Contrast:** body text is primary on bg (about 17.9:1 / 17.5:1).
  Links use accent-strong on bg (about 11:1 dark, about 5:1 light).
  Inline code is primary on surface-raised (well above AA).
- **Reflow:** at 320px and 200% zoom there is no page-level horizontal
  scroll. Only code blocks and tables scroll, inside their own
  containers.
- **Dates:** format dates **in UTC** at build time. A `2023-03-16` date
  parsed as local time can render as Mar 15 on the build runner, which
  is a real off-by-one risk.

### 5. Content-migration notes (flag for orchestrator/developer)

- Both existing `_posts` files have **no frontmatter**. `title`,
  `date`, `excerpt`, `tags` and `slug` must be added (the date is
  recoverable from the filename).
- `how-to-make-zsh-beutiful.md`: the body opens with `## How to Make
  Your Zsh…`, which duplicates the title. Remove that line and use it as
  the frontmatter title. The filename typo ("beutiful") will become the
  slug unless `slug` is set explicitly. Decide whether to keep the old
  URL for link continuity.
- `this-is-a-test.md` is a test stub ("Hello Guys"). It is recommended
  **not** to migrate it. That is the user's call, not design's.
