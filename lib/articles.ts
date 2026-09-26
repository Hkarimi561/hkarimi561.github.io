import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { renderMarkdown } from "./markdown";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

interface ArticleFrontmatter {
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  slug?: string;
}

export interface Article {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  slug: string;
  readingTimeText: string;
  contentHtml: string;
}

function readArticleFiles(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs.readdirSync(ARTICLES_DIR).filter((file) => file.endsWith(".md"));
}

function readingTimeLabel(text: string): string {
  const { minutes } = readingTime(text);
  const rounded = Math.max(1, Math.round(minutes));
  return `${rounded} MIN READ`;
}

/** Reads, parses, and sorts every article in content/articles, newest first. */
export async function getAllArticles(): Promise<Article[]> {
  const files = readArticleFiles();

  const articles = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(ARTICLES_DIR, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const frontmatter = data as ArticleFrontmatter;
      const slug = frontmatter.slug ?? file.replace(/\.md$/, "");
      const contentHtml = await renderMarkdown(content);

      return {
        title: frontmatter.title,
        date: frontmatter.date,
        excerpt: frontmatter.excerpt,
        tags: frontmatter.tags ?? [],
        slug,
        readingTimeText: readingTimeLabel(content),
        contentHtml,
      } satisfies Article;
    }),
  );

  return articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}
