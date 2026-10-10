import { categories, type FeedPreferences, type FollowedAuthor } from "@/types";
import { emptyPreferences, followAuthor } from "@/features/preferences/feedPreferences";
import { sourceIds } from "@/features/sources/sourceInfo";
import { isOneOf, isRecord, validList } from "@/utils/guards";
import { readJson, writeJson } from "@/utils/storage";

/** Versioned so a future shape change can't be misread as the current one. */
export const preferencesStorageKey = "news-aggregator:preferences:v1";

const isOrigin = isOneOf<FollowedAuthor["origin"]>(["story", "name"]);

const isFollowedAuthor = (value: unknown): value is FollowedAuthor =>
  isRecord(value) &&
  typeof value.name === "string" &&
  value.name.trim() !== "" &&
  isOrigin(value.origin);

/**
 * Stored data is untrusted (older versions, manual edits, other tabs):
 * keep what is valid, drop the rest, never throw.
 */
export function parsePreferences(value: unknown): FeedPreferences {
  if (!isRecord(value)) return emptyPreferences;
  const authors = validList(value.authors, isFollowedAuthor).reduce(
    (preferences, author) => followAuthor(preferences, author.name, author.origin), // dedupes
    emptyPreferences,
  ).authors;
  return {
    sources: validList(value.sources, isOneOf(sourceIds)),
    categories: validList(value.categories, isOneOf(categories)),
    authors,
    personalizePromptDismissed: value.personalizePromptDismissed === true,
  };
}

export const loadPreferences = (): FeedPreferences =>
  parsePreferences(readJson("local", preferencesStorageKey));

export const savePreferences = (preferences: FeedPreferences): void =>
  writeJson("local", preferencesStorageKey, preferences);
