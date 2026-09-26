import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlockScript } from "@/components/ui/CodeBlockScript";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import { formatDate } from "@/lib/format-date";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Hamid Karimi`,
    description: article.excerpt,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <main id="main" tabIndex={-1}>
      <div className="mx-auto max-w-[720px] px-6 pb-24 md:px-8 lg:pb-32">
        <header className="border-b border-border pb-10 pt-12 lg:pt-16">
          <p className="mb-10">
            <Link
              href="/articles"
              className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary transition-colors hover:text-text-primary"
            >
              <span aria-hidden="true">← </span>All articles
            </Link>
          </p>
          <p className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary">
            <time dateTime={article.date}>{formatDate(article.date)}</time> · {article.readingTimeText}
          </p>
          <h1 className="mt-4 font-display text-h1 font-semibold text-text-primary lg:text-h1-lg">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-4 text-body-lg text-text-secondary">{article.excerpt}</p>
          )}
          {article.tags.length > 0 && (
            <p className="mt-6 font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary">
              {article.tags.join(" / ")}
            </p>
          )}
        </header>

        <div className="prose-article pt-10" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />

        <div className="mt-12 border-t border-border pt-12">
          <Link
            href="/articles"
            className="font-mono text-mono-label uppercase tracking-[0.06em] text-text-secondary transition-colors hover:text-text-primary"
          >
            <span aria-hidden="true">← </span>All articles
          </Link>
        </div>
      </div>
      <CodeBlockScript />
    </main>
  );
}
