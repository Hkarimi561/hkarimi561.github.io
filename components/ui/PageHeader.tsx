interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro?: string;
}

/**
 * The shared page-header pattern from design/nav.md §6, used by
 * /about, /projects and /articles: eyebrow, h1, optional intro, with a
 * hairline underneath, inside the standard 1200px container.
 */
export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <div className="mx-auto max-w-[1200px] border-b border-border px-6 pb-12 pt-16 md:px-8 lg:pb-16 lg:pt-24">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-mono-label uppercase tracking-[0.06em] text-accent-strong lg:text-mono-label-lg">
          {eyebrow}
        </p>
        <h1 className="font-display text-h1 font-semibold text-text-primary lg:text-h1-lg">{title}</h1>
        {intro && <p className="max-w-[60ch] text-body text-text-secondary lg:text-body-lg">{intro}</p>}
      </div>
    </div>
  );
}
