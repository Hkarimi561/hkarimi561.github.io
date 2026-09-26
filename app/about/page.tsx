import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About — Hamid Karimi",
  description: "Software engineer — what I build, how I work, and where to find me.",
};

const TOOLBOX: { category: string; terms: string[] }[] = [
  { category: "LANGUAGES", terms: ["TypeScript", "JavaScript", "Python", "SQL"] },
  { category: "FRONTEND", terms: ["React", "Next.js", "Tailwind CSS", "React Three Fiber"] },
  { category: "BACKEND", terms: ["Node.js", "PostgreSQL", "Redis"] },
  { category: "INFRA", terms: ["Docker", "GitHub Actions", "AWS"] },
];

const ELSEWHERE: { name: string; href: string; handle: string }[] = [
  { name: "GitHub", href: "https://github.com/hkarimi561", handle: "hkarimi561" },
  { name: "Email", href: "mailto:hkarimi561@gmail.com", handle: "hkarimi561@gmail.com" },
];

export default function AboutPage() {
  return (
    <main id="main" tabIndex={-1}>
      <PageHeader eyebrow="ABOUT" title="Hi, I'm Hamid." />

      <div className="mx-auto max-w-[1200px] px-6 pb-24 md:px-8 lg:pb-32">
        {/* Bio */}
        <section
          aria-labelledby="bio-heading"
          className="border-b border-border py-12 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-16"
        >
          <h2
            id="bio-heading"
            className="font-mono text-mono-label uppercase tracking-[0.06em] text-accent-strong lg:col-span-4"
          >
            Bio
          </h2>
          <div className="mt-6 max-w-[65ch] space-y-5 text-body text-text-primary lg:col-span-8 lg:mt-0 lg:text-body-lg">
            <p>
              I&apos;m a software engineer who likes building full-stack products end to
              end — backend systems, APIs and data models on one side, and the
              interfaces people actually touch on the other. I care most about the
              parts that are easy to skip: the loading state, the error message, the
              query that still holds up under real traffic.
            </p>
            <p>
              I like working close to the problem: small iterations, honest
              estimates, and code that&apos;s easy for the next person (often future
              me) to read. Right now I&apos;m spending a lot of time on 3D-on-the-web
              and on writing about the small, practical tooling fixes that make a
              development setup nicer to live in day to day.
            </p>
          </div>
        </section>

        {/* Toolbox */}
        <section
          aria-labelledby="toolbox-heading"
          className="border-b border-border py-12 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-16"
        >
          <h2
            id="toolbox-heading"
            className="font-mono text-mono-label uppercase tracking-[0.06em] text-accent-strong lg:col-span-4"
          >
            Toolbox
          </h2>
          <dl className="mt-6 flex flex-col lg:col-span-8 lg:mt-0">
            {TOOLBOX.map((row) => (
              <div
                key={row.category}
                className="flex flex-col gap-1 border-t border-border py-4 first:border-t-0 md:flex-row md:items-baseline md:gap-6"
              >
                <dt className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary md:w-[10rem] md:shrink-0">
                  {row.category}
                </dt>
                <dd className="text-body text-text-secondary">{row.terms.join(" / ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Elsewhere */}
        <section aria-labelledby="elsewhere-heading" className="py-12 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-16">
          <h2
            id="elsewhere-heading"
            className="font-mono text-mono-label uppercase tracking-[0.06em] text-accent-strong lg:col-span-4"
          >
            Elsewhere
          </h2>
          <ul className="mt-6 flex flex-col lg:col-span-8 lg:mt-0">
            {ELSEWHERE.map((link) => (
              <li key={link.name} className="border-t border-border py-4 first:border-t-0">
                <a
                  href={link.href}
                  className="group flex flex-col gap-1 text-body text-text-primary transition-colors hover:text-accent-strong md:flex-row md:items-baseline md:justify-between"
                >
                  <span className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary">
                    {link.name}
                    <span className="sr-only">: </span>
                  </span>
                  <span className="[overflow-wrap:anywhere] group-hover:underline group-hover:underline-offset-4">
                    {link.handle} <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
