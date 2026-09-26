import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Hamid Karimi",
  description: "Selected work — what it is and what it's built with.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="PROJECTS"
        title="Selected work"
        intro="A short list of things I've built, what they're made of, and where to see them."
      />

      <div className="mx-auto max-w-[1200px] px-6 pb-24 md:px-8 lg:pb-32">
        {projects.length === 0 ? (
          <p className="pt-12 text-body text-text-secondary">
            Projects are being written up — in the meantime, see the{" "}
            <Link
              href="/articles"
              className="text-accent-strong underline underline-offset-4 hover:text-text-primary"
            >
              articles
            </Link>
            .
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 lg:gap-8">
            {projects.map((project) => (
              <li key={project.slug}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-text-tertiary hover:bg-surface-raised has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus-ring">
                  <div
                    className="relative aspect-[16/10] w-full border-b border-border bg-surface-raised"
                    aria-hidden="true"
                  >
                    {project.cover ? (
                      <Image src={project.cover} alt="" fill className="object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-[length:16px_16px]">
                        <span className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary">
                          /{project.slug}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <p className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary">
                      {project.year} · {project.type.toUpperCase()}
                    </p>
                    <h2 className="font-display text-h3 font-medium text-text-primary lg:text-h3-lg">
                      <Link href={`/projects/${project.slug}`} className="outline-none after:absolute after:inset-0">
                        {project.title}
                      </Link>
                    </h2>
                    <p className="text-body text-text-secondary">{project.summary}</p>
                    {project.tags.length > 0 && (
                      <p className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary">
                        {project.tags.slice(0, 4).join(" / ")}
                      </p>
                    )}
                    <p
                      aria-hidden="true"
                      className="flex items-center gap-1 pt-2 font-mono text-mono-label uppercase tracking-[0.06em] text-accent-strong"
                    >
                      VIEW PROJECT
                      <span className="inline-block transition-transform duration-150 ease-out group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
