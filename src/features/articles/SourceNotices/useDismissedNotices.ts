import { useEffect, useState } from "react";
import type { SourceId } from "@/types";
import { sourceIds } from "@/features/sources/sourceInfo";
import { isOneOf, validList } from "@/utils/guards";
import { readJson, writeJson } from "@/utils/storage";

const storageKey = "news-aggregator:dismissed-notices";

const load = (): ReadonlySet<SourceId> =>
  new Set(validList(readJson("session", storageKey), isOneOf(sourceIds)));

/** Dismissing a failure notice hides it for the rest of the session (sessionStorage). */
export function useDismissedNotices() {
  const [dismissed, setDismissed] = useState(load);

  useEffect(() => writeJson("session", storageKey, [...dismissed]), [dismissed]);

  const dismiss = (sourceId: SourceId) => setDismissed((current) => new Set(current).add(sourceId));

  return [dismissed, dismiss] as const;
}
