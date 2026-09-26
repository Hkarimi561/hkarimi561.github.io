import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { renderMarkdown } from "./markdown";

const PROJECTS_DIR = path.join(process.cwd(), "content/projects");

interface ProjectFrontmatter {
  title: string;
  slug?: string;
  year: number;
  type: string;
  summary: string;
  tags?: string[];
  stack?: string[];
  role?: string;
  status?: string;
  repo?: string;
  demo?: string;
  cover?: string;
  order?: number;
  featured?: boolean;
}

export interface Project {
  title: string;
  slug: string;
  year: number;
  type: string;
  summary: string;
  tags: string[];
  stack: string[];
  role?: string;
  status?: string;
  repo?: string;
  demo?: string;
  cover?: string;
  order?: number;
  featured: boolean;
  contentHtml: string;
}

function readProjectFiles(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR).filter((file) => file.endsWith(".md"));
}

/**
 * Reads, parses, and orders every project in content/projects: featured
 * first, then by `order` ascending, then newest year first — per
 * design/projects.md §A.2.
 */
export async function getAllProjects(): Promise<Project[]> {
  const files = readProjectFiles();

  const projects = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(PROJECTS_DIR, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const frontmatter = data as ProjectFrontmatter;
      const slug = frontmatter.slug ?? file.replace(/\.md$/, "");
      const contentHtml = await renderMarkdown(content);

      return {
        title: frontmatter.title,
        slug,
        year: frontmatter.year,
        type: frontmatter.type,
        summary: frontmatter.summary,
        tags: frontmatter.tags ?? [],
        stack: frontmatter.stack ?? [],
        role: frontmatter.role,
        status: frontmatter.status,
        repo: frontmatter.repo,
        demo: frontmatter.demo,
        cover: frontmatter.cover,
        order: frontmatter.order,
        featured: frontmatter.featured ?? false,
        contentHtml,
      } satisfies Project;
    }),
  );

  return projects.sort((a, b) => {
    const featuredDiff = Number(b.featured) - Number(a.featured);
    if (featuredDiff !== 0) return featuredDiff;
    const orderDiff = (a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY);
    if (orderDiff !== 0) return orderDiff;
    return (b.year ?? 0) - (a.year ?? 0);
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getAllProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}
