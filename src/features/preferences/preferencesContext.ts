import { createContext, useContext } from "react";
import type { FeedPreferences } from "@/types";
import { emptyPreferences } from "@/features/preferences/feedPreferences";

export interface PreferencesContextValue {
  preferences: FeedPreferences;
  /** Applies a pure update from `feedPreferences.ts`. */
  update: (change: (current: FeedPreferences) => FeedPreferences) => void;
}

export const PreferencesContext = createContext<PreferencesContextValue>({
  preferences: emptyPreferences,
  update: () => {},
});

export const usePreferences = () => useContext(PreferencesContext);
