// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { emptyPreferences } from "@/features/preferences/feedPreferences";
import {
  loadPreferences,
  parsePreferences,
  preferencesStorageKey,
  savePreferences,
} from "@/features/preferences/preferencesStorage";

describe("preferences storage", () => {
  it("round-trips through localStorage", () => {
    const preferences = {
      sources: ["guardian"] as const,
      categories: ["science", "technology"] as const,
      authors: [{ name: "Ruth Klein", origin: "story" as const }],
      personalizePromptDismissed: true,
    };
    savePreferences(preferences);
    expect(loadPreferences()).toEqual(preferences);
  });

  it("falls back to empty preferences for missing or corrupted data", () => {
    expect(loadPreferences()).toEqual(emptyPreferences);
    localStorage.setItem(preferencesStorageKey, "{not json");
    expect(loadPreferences()).toEqual(emptyPreferences);
    expect(parsePreferences(["an", "array"])).toEqual(emptyPreferences);
  });

  it("keeps valid entries and drops invalid or duplicate ones", () => {
    expect(
      parsePreferences({
        sources: ["guardian", "bbc", "guardian"],
        categories: ["science", "cooking"],
        authors: [
          { name: "Ruth Klein", origin: "story" },
          { name: "ruth klein", origin: "name" },
          { name: "  ", origin: "name" },
          { name: "Mira Osei", origin: "telepathy" },
          "Daniel Park",
        ],
        personalizePromptDismissed: "yes",
      }),
    ).toEqual({
      sources: ["guardian"],
      categories: ["science"],
      authors: [{ name: "Ruth Klein", origin: "story" }],
      personalizePromptDismissed: false,
    });
  });
});
