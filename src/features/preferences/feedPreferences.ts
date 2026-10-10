import type { Category, FeedPreferences, FollowedAuthor, SourceId } from "@/types";
import { toggle } from "@/features/filters/feedFilters";

export const emptyPreferences: FeedPreferences = {
  sources: [],
  categories: [],
  authors: [],
  personalizePromptDismissed: false,
};

export const hasPreferences = ({ sources, categories, authors }: FeedPreferences): boolean =>
  sources.length + categories.length + authors.length > 0;

const sameName = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: "base" }) === 0;

export const isFollowingAuthor = (preferences: FeedPreferences, name: string): boolean =>
  preferences.authors.some((author) => sameName(author.name, name));

export const toggleSource = (preferences: FeedPreferences, id: SourceId): FeedPreferences => ({
  ...preferences,
  sources: toggle(preferences.sources, id),
});

export const toggleCategory = (
  preferences: FeedPreferences,
  category: Category,
): FeedPreferences => ({
  ...preferences,
  categories: toggle(preferences.categories, category),
});

/** Case-insensitive; following an already-followed author is a no-op. */
export function followAuthor(
  preferences: FeedPreferences,
  name: string,
  origin: FollowedAuthor["origin"],
): FeedPreferences {
  const trimmed = name.trim();
  if (!trimmed || isFollowingAuthor(preferences, trimmed)) return preferences;
  return { ...preferences, authors: [...preferences.authors, { name: trimmed, origin }] };
}

export const unfollowAuthor = (preferences: FeedPreferences, name: string): FeedPreferences => ({
  ...preferences,
  authors: preferences.authors.filter((author) => !sameName(author.name, name)),
});
