import { useState } from "react";
import type { FeedFilters } from "@/types";

/**
 * Panel changes are drafts until Apply. The draft resets to the applied filters
 * when they change elsewhere (a chip removed) and whenever the panel opens.
 */
export function useFilterDraft(applied: FeedFilters, open = true) {
  const [draft, setDraft] = useState(applied);
  const [synced, setSynced] = useState({ applied, open });

  if (synced.applied !== applied || synced.open !== open) {
    setSynced({ applied, open });
    if (open) setDraft(applied);
  }

  return [draft, setDraft] as const;
}
