import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { getAllArticles } from "@/lib/articles";
import { formatDate } from "@/lib/format-date";

export const metadata: Metadata = {
  title: "Writing — Hamid Karimi",
  description: "A changelog of what I've learned building software, newest first.",
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        eyebrow="ARTICLES"
        title="Writing"
        intro="A changelog of what I've learned building software, newest first."
      />

      <div className="mx-auto max-w-[1200px] px-6 pb-24 md:px-8 lg:pb-32">
        {articles.length === 0 ? (
          <p className="pt-12 text-body text-text-secondary">Nothing published yet.</p>
        ) : (
          <ol className="flex flex-col pt-4">
            {articles.map((article) => {
              const meta =
                article.tags.length > 0
                  ? `${article.readingTimeText} · ${article.tags.join(" / ")}`
                  : article.readingTimeText;

              return (
                <li key={article.slug} className="border-t border-border py-8 first:border-t-0">
                  <article className="relative -mx-4 flex flex-col gap-2 rounded-lg px-4 has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-focus-ring lg:grid lg:grid-cols-12 lg:gap-3">
                    <p className="lg:col-span-3">
                      <time
                        dateTime={article.date}
                        className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary"
                      >
                        {formatDate(article.date)}
                      </time>
                    </p>
                    <div className="flex flex-col gap-2 lg:col-span-9">
                      <h2 className="font-display text-h3 font-medium text-text-primary lg:text-h3-lg">
                        <Link
                          href={`/articles/${article.slug}`}
                          className="outline-none transition-colors after:absolute after:inset-0 hover:text-accent-strong"
                        >
                          {article.title}
                        </Link>
                      </h2>
                      <p className="max-w-[60ch] text-body text-text-secondary">{article.excerpt}</p>
                      <p className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary">
                        {meta}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </main>
  );
}
