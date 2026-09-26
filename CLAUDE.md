# Portfolio Rebuild — Project Brief & Agent Team

## Goal
Rebuild `hkarimi561.github.io` (currently a Jekyll/GitHub Pages site with
`_posts`, `_layouts`, `_includes`) into a modern, 3D-interactive portfolio
built with **Next.js + TypeScript + Tailwind CSS**, still deployed on
GitHub Pages at the same `username.github.io` root domain.

Assumption (state if wrong): articles stay markdown files inside this same
repo (a `content/articles/` folder, replacing `_posts/`), not a separate
repo. If you actually want a *separate* content repo, tell the developer
agent — it changes the fetch strategy (git submodule / build-time fetch
from GitHub API vs. local files).

## Tech stack
- **Framework:** Next.js (App Router), TypeScript, static export
  (`output: "export"` in `next.config`) so it still deploys as static files
  to GitHub Pages — no server needed, no basePath since this is a user
  page (`hkarimi561.github.io`), not a project page.
- **Styling:** Tailwind CSS (latest), CSS-first config, dark mode by
  default with a light toggle.
- **3D / motion:** `@react-three/fiber` + `@react-three/drei` + `three`
  for interactive 3D scenes; `framer-motion` for 2D transitions/scroll
  reveals. 3D canvases are client-only (`dynamic(..., { ssr: false })`),
  respect `prefers-reduced-motion`, and always have a static-image
  fallback for low-end devices.
- **Content/articles:** `gray-matter` to parse frontmatter, `remark` /
  `rehype` (or `next-mdx-remote`) to render body markdown, `reading-time`
  for estimated read time. Articles live as `.md` files with frontmatter
  (`title`, `date`, `excerpt`, `tags`, `slug`), statically generated with
  `generateStaticParams`, and listed newest-first by `date`.
- **Deploy:** GitHub Actions workflow builds the static export and
  publishes it (GitHub Pages "Actions" source, or `peaceiris/actions-gh-pages`
  to the serving branch).

## Directory structure (target)
```
app/
  page.tsx                 # home / 3D hero
  about/page.tsx
  projects/page.tsx
  projects/[slug]/page.tsx
  articles/page.tsx        # list, sorted by date desc
  articles/[slug]/page.tsx # single article, rendered markdown
components/
  three/                   # r3f scenes, canvases, 3D primitives
  ui/                       # buttons, cards, nav, etc.
content/
  articles/*.md             # frontmatter + markdown body
  projects/*.md (optional)
lib/
  articles.ts               # read + parse + sort content/articles
  mdx.ts / markdown.ts
public/
next.config.ts
tailwind.config.ts (or CSS-based config if Tailwind v4)
.github/workflows/deploy.yml
```

## Agent team
This project uses exactly **two** subagents. No dedicated test/QA agent
is defined on purpose — the developer agent is responsible for its own
sanity checks (typecheck, lint, build) as part of finishing any task.

| Agent | File | Model | Responsibility |
|---|---|---|---|
| `designer` | `.claude/agents/designer.md` | `opus` | Visual direction, layout, typography, color, motion timing, 3D scene concepts, accessibility & responsive behavior specs. Produces written design specs; does not write app code. |
| `developer` | `.claude/agents/developer.md` | `sonnet` | Implements the Next.js/Tailwind/r3f code, the articles pipeline, and the GitHub Pages deploy config, following the designer's specs. |

### Workflow
1. For any new page/section/feature, invoke **designer** first to produce
   a short spec (layout, tokens, motion/3D notes) as a markdown file
   under `design/` (e.g. `design/hero.md`).
2. Invoke **developer** to implement exactly that spec.
3. Invoke **designer** again to review the result (paste a screenshot or
   describe the rendered output) and note any visual corrections.
4. Developer applies corrections. Repeat only as needed — keep the loop
   short, don't over-iterate on early scaffolding.

You (the main session) act as the orchestrator: break the work into
tasks, dispatch to the right subagent, and keep this file updated if
the stack or structure decisions change.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
