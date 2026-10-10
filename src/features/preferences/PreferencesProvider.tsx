import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { FeedPreferences } from "@/types";
import { PreferencesContext } from "@/features/preferences/preferencesContext";
import {
  loadPreferences,
  parsePreferences,
  preferencesStorageKey,
  savePreferences,
} from "@/features/preferences/preferencesStorage";
import { parseJson } from "@/utils/storage";

/** Preferences persist in localStorage ("Saved on this device") and stay in sync across tabs. */
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<FeedPreferences>(loadPreferences);

  useEffect(() => savePreferences(preferences), [preferences]);

  // Another tab changed them: adopt its version instead of overwriting it later.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== preferencesStorageKey) return;
      setPreferences(parsePreferences(parseJson(event.newValue)));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(() => ({ preferences, update: setPreferences }), [preferences]);
  return <PreferencesContext value={value}>{children}</PreferencesContext>;
}
