import type { Author } from "@/types";

const bylinePrefix = /^by\s+/i;
const authorSeparator = /\s*,\s*|\s+and\s+|\s*&\s*/i;
const url = /^https?:\/\//i;

/**
 * Splits a free-text byline into authors.
 * "By Daniel Park and Ruth Klein" -> [{ name: "Daniel Park" }, { name: "Ruth Klein" }]
 */
export function parseAuthors(byline: string | null | undefined): Author[] {
  if (!byline) return [];
  const names = byline
    .replace(bylinePrefix, "")
    .split(authorSeparator)
    .map((name) => name.trim())
    .filter((name) => name && !url.test(name));
  return [...new Set(names)].map((name) => ({ name }));
}

// ponytail: tag stripping only; switch to DOMParser if entity-encoded text shows up.
export const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "").trim();

/** Empty strings from providers become undefined. */
export const optionalText = (value: string | null | undefined) => value?.trim() || undefined;
