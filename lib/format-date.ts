/**
 * Formats a `YYYY-MM-DD` date string in UTC, per design/articles.md §B.2
 * ("format dates in UTC at build time" — parsing as local time on the
 * build runner is an off-by-one risk). Frontmatter dates must be quoted
 * strings (not bare YAML dates) so gray-matter doesn't parse them into a
 * JS Date first.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  return formatted.toUpperCase();
}
