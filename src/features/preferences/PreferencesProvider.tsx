import { useMemo, useState, type ReactNode } from "react";
import type { FeedPreferences } from "@/types";
import { emptyPreferences } from "@/features/preferences/feedPreferences";
import { PreferencesContext } from "@/features/preferences/preferencesContext";

// ponytail: in-memory for the UI phase; swap useState for a localStorage-backed store when wiring.
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<FeedPreferences>(emptyPreferences);
  const value = useMemo(() => ({ preferences, update: setPreferences }), [preferences]);
  return <PreferencesContext value={value}>{children}</PreferencesContext>;
}
