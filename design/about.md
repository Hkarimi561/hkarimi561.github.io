# About — Design Spec

Inherits `design/home.md` Part A and the shared page shell in
`design/nav.md` §6. It adds no new tokens.

## 1. Intent

A short, plain-spoken page that answers "who is this and what does he
work with?" in under a minute of reading. It is text-first and reads
like a well-kept README, not a résumé dump.

## 2. Layout

**Page header** (per the shell): eyebrow `ABOUT`, then an `h1`. Suggested
copy is "Hi, I'm Hamid." The content owner decides. No intro line is
needed because the bio follows immediately.

Below the header, there are **three blocks** in this order, separated
by 1px `--color-border` hairlines, each with `py-12` (and `lg:py-16`):

1. **Bio.** Two to four short paragraphs: what he builds, how he likes
   to work, and what he's focused on or interested in now. Content
   comes from the content owner. Don't ship lorem ipsum. If the copy
   isn't ready, one real paragraph beats four fake ones.
   - **Photo (optional):** a square portrait at 1:1, `rounded-lg`, with
     a 1px `--color-border` edge, 240px on desktop and 160px on mobile.
     **If there is no real photo, omit the slot entirely.** Don't use a
     silhouette or initials placeholder, for the same reasoning as
     `home-section-2.md` on placeholder content.
2. **Toolbox.** A definition list of 3–5 categories. Each row has a
   `mono-label` category (for example `LANGUAGES`, `FRONTEND`,
   `BACKEND`, `INFRA`, `TOOLS`), then plain terms in `body` with
   `--color-text-secondary`, separated by ` / `. It is text only: no
   logos, no pills and no skill bars or percentages (they are
   meaningless and read as templated). Rows are separated by hairlines
   with `py-4`.
3. **Elsewhere.** A short list of outbound links: GitHub, LinkedIn,
   email and résumé, whichever the content owner provides. Each is a
   row with a `mono-label` name on the left and the handle/URL text on
   the right, ending in `↗`. There is no contact form.

**Desktop (`lg`+):** use the same 4/8 split as the home "What I do"
section, which keeps the site coherent.
- Each block's `mono-label` block title (`BIO` / `TOOLBOX` /
  `ELSEWHERE`, in `--color-accent-strong`) sits in the left 4 columns
  and is not sticky. Content sits in the right 8.
- In the Bio block, the photo (if present) sits in the left column
  under the `BIO` label, and paragraphs take the right column capped at
  **65ch**.
- In Toolbox, the rows run category on the left and terms on the right,
  *inside* the 8-column zone: a fixed ~10rem category gutter with the
  terms beside it.

**Tablet (`md`–`lg`):** a single column. Block titles sit above their
content with `gap-6`. The toolbox keeps its side-by-side category/terms
rows.

**Mobile (`<md`):** a single column. The photo (if present) sits above
the bio paragraphs. Toolbox rows stack with the category above its
terms (`gap-1`). Elsewhere rows stack with the name above the link.

## 3. Tokens used

| Element | Token |
|---|---|
| Block titles, toolbox categories | `mono-label`, `--color-accent-strong` for block titles, `--color-text-secondary` for categories |
| Bio paragraphs | `body` / `lg:body-lg`, `--color-text-primary`, `space-y-5` |
| Toolbox terms | `body`, `--color-text-secondary` |
| Elsewhere links | `body`, `--color-text-primary`. On hover, `--color-accent-strong` with an underline (offset 4px) |
| Dividers | `--color-border`, 1px |
| Photo | `rounded-lg`, 1px `--color-border` |

## 4. Motion notes

None beyond 150ms link color transitions. Per the shell rules, there
are no reveals and no hover effects on non-interactive rows.

## 5. Accessibility notes

- **Headings:** one `<h1>` (the page title). Block titles are `<h2>`,
  styled as `mono-label`. They are real section headings, so they get
  heading semantics even though they look like labels. Each block is a
  `<section aria-labelledby>` pointing at its `<h2>`.
- **Toolbox** is a `<dl>` with a `<dt>` category and a `<dd>` of terms.
  The ` / ` separators are fine for screen readers, which read them as
  "slash". Wrapping them in `aria-hidden` spans is optional.
- **Links:** the accessible name includes the service ("GitHub:
  hkarimi561"). The `↗` is `aria-hidden`. External links open in the
  same tab. If the developer chooses a new tab, add visually hidden
  "(opens in new tab)" text.
- **Photo:** a short, meaningful `alt` ("Portrait of Hamid Karimi").
  Don't use an empty alt, because here it is content.
- **Contrast:** all pairs are already verified in `home.md` and
  `home-section-2.md`. Secondary is used for categories and terms, and
  tertiary is not used anywhere on this page.
- **Measure and reflow:** bio text is capped at 65ch. At 320px width and
  200% zoom, everything reflows to the mobile stack with no horizontal
  scroll. Long URLs in Elsewhere must wrap (`overflow-wrap: anywhere`).
