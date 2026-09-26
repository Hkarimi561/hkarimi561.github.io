import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlockScript } from "@/components/ui/CodeBlockScript";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Hamid Karimi`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const specSheet = (
    [
      { term: "ROLE", value: project.role },
      { term: "YEAR", value: String(project.year) },
      { term: "STACK", value: project.stack.length > 0 ? project.stack.join(" / ") : undefined },
      { term: "STATUS", value: project.status },
    ] as { term: string; value: string | undefined }[]
  ).filter((row): row is { term: string; value: string } => Boolean(row.value));

  const primaryHref = project.demo ?? project.repo;
  const primaryLabel = project.demo ? "Live demo" : project.repo ? "Source code on GitHub" : null;
  const secondaryHref = project.demo && project.repo ? project.repo : undefined;

  return (
    <main id="main" tabIndex={-1}>
      <div className="mx-auto max-w-[1200px] px-6 pb-24 md:px-8 lg:pb-32">
        <p className="pt-12 lg:pt-16">
          <Link
            href="/projects"
            className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary transition-colors hover:text-text-primary"
          >
            <span aria-hidden="true">← </span>All projects
          </Link>
        </p>

        <header className="mt-8 flex flex-col gap-4">
          <p className="font-mono text-mono-label uppercase tracking-[0.06em] text-accent-strong">
            {project.year} · {project.type.toUpperCase()}
          </p>
          <h1 className="font-display text-h1 font-semibold text-text-primary lg:text-h1-lg">{project.title}</h1>
          <p className="max-w-[60ch] text-body-lg text-text-secondary">{project.summary}</p>

          {(primaryHref || secondaryHref) && (
            <div className="flex flex-wrap gap-4 pt-2">
              {primaryHref && primaryLabel && (
                <a
                  href={primaryHref}
                  className="inline-flex items-center gap-1 rounded-lg bg-accent px-5 py-2.5 text-body font-medium text-on-accent transition-colors hover:bg-accent-strong"
                >
                  {primaryLabel} <span aria-hidden="true">↗</span>
                </a>
              )}
              {secondaryHref && (
                <a
                  href={secondaryHref}
                  aria-label="Source code on GitHub"
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-5 py-2.5 text-body font-medium text-text-primary transition-colors hover:bg-surface-raised"
                >
                  Source <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          )}
        </header>

        {project.cover && (
          <div className="relative mt-12 aspect-video w-full overflow-hidden rounded-lg border border-border">
            <Image src={project.cover} alt="" fill className="object-cover" />
          </div>
        )}

        <div className="mt-12 border-t border-border pt-12 lg:mt-16 lg:grid lg:grid-cols-12 lg:gap-12 lg:pt-16">
          {specSheet.length > 0 && (
            <aside aria-labelledby="project-details-heading" className="order-1 mb-12 lg:order-2 lg:col-span-4 lg:mb-0">
              <h2 id="project-details-heading" className="sr-only">
                Project details
              </h2>
              <dl className="flex flex-col">
                {specSheet.map((row) => (
                  <div key={row.term} className="flex flex-col gap-1 border-t border-border py-3 first:border-t-0">
                    <dt className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary">
                      {row.term}
                    </dt>
                    <dd className="text-small text-text-primary">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
          <div
            className="prose-article order-2 max-w-[68ch] lg:order-1 lg:col-span-8"
            dangerouslySetInnerHTML={{ __html: project.contentHtml }}
          />
        </div>

        <div className="mt-12 border-t border-border pt-12">
          <Link
            href="/projects"
            className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary transition-colors hover:text-text-primary"
          >
            <span aria-hidden="true">← </span>All projects
          </Link>
        </div>
      </div>
      <CodeBlockScript />
    </main>
  );
}
