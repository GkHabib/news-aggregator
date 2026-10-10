import { categories, type Category, type SourceId } from "@/types";
import { newsSources } from "@/services/news";
import { formatCategory } from "@/utils/format";

/** Display-only extras; `Record` makes adding a source without them a type error. */
const display: Record<SourceId, { shortLabel: string; tagline?: string }> = {
  newsApi: { shortLabel: "NewsAPI", tagline: "Many outlets" },
  guardian: { shortLabel: "The Guardian" },
  nyTimes: { shortLabel: "NYT" },
};

export const sourceIds = Object.keys(newsSources) as SourceId[];

export const sourceLabel = (id: SourceId) => newsSources[id].label;
export const sourceShortLabel = (id: SourceId) => display[id].shortLabel;

const covers = (id: SourceId, category: Category) => newsSources[id].categories.includes(category);

/** "Politics or World" */
const orList = (items: readonly string[]) =>
  items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} or ${items.at(-1)}`;

/** "A and B" */
export const andList = (items: readonly string[]) =>
  items.length <= 1 ? (items[0] ?? "") : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

export interface CoverageNote {
  text: string;
  tone: "muted" | "warn";
}

/**
 * Hint shown next to a source in the filter panel. Warns as soon as a selected
 * category can't come from this source; otherwise lists what it never covers.
 * "General" is left out: it is a catch-all, not a topic people look for.
 */
export function sourceCoverageNote(
  id: SourceId,
  selectedCategories: readonly Category[],
): CoverageNote | undefined {
  const conflicts = selectedCategories.filter((category) => !covers(id, category));
  if (conflicts.length) {
    return { text: `Doesn’t cover ${orList(conflicts.map(formatCategory))}`, tone: "warn" };
  }

  const missing = categories
    .filter((category) => category !== "general" && !covers(id, category))
    .map(formatCategory);
  const parts = [display[id].tagline, missing.length ? `no ${orList(missing)}` : undefined].filter(
    (part) => part !== undefined,
  );
  if (!parts.length) return undefined;
  const text = parts.join(" · ");
  return { text: text.charAt(0).toUpperCase() + text.slice(1), tone: "muted" };
}

export interface CoverageGap {
  /** Selected sources that can't serve any selected category. */
  sources: readonly SourceId[];
  categories: readonly Category[];
  /** Unselected sources that do cover at least one selected category. */
  alternatives: readonly SourceId[];
}

/** Non-null when the selected sources can't serve any of the selected categories. */
export function findCoverageGap(
  categories: readonly Category[],
  sources: readonly SourceId[],
): CoverageGap | null {
  if (!categories.length || !sources.length) return null;
  const servesAny = (id: SourceId) => categories.some((category) => covers(id, category));
  if (sources.some(servesAny)) return null;
  return {
    sources,
    categories,
    alternatives: sourceIds.filter((id) => !sources.includes(id) && servesAny(id)),
  };
}
