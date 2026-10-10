import type { SourceError, SourceId } from "@/types";
import { Notice } from "@/components/Notice/Notice";
import { sourceIds, sourceLabel } from "@/features/sources/sourceInfo";

interface SourceNoticesProps {
  /** Every failing source, so the "N of 3" count stays right after dismissals. */
  errors: readonly SourceError[];
  dismissed: ReadonlySet<SourceId>;
  onDismiss: (sourceId: SourceId) => void;
}

function noticeText(error: SourceError, failedCount: number): string {
  const label = sourceLabel(error.sourceId);
  if (error.status === 429) {
    return `${label} has reached its daily limit. Its stories will be back tomorrow.`;
  }
  const working = sourceIds.length - failedCount;
  return `${label} is unavailable right now. Showing results from ${working} of ${sourceIds.length} sources.`;
}

/** One dismissible notice per failing source; sits above the list, never over it. */
export function SourceNotices({ errors, dismissed, onDismiss }: SourceNoticesProps) {
  return errors
    .filter((error) => !dismissed.has(error.sourceId))
    .map((error) => (
      <Notice key={error.sourceId} onDismiss={() => onDismiss(error.sourceId)}>
        {noticeText(error, errors.length)}
      </Notice>
    ));
}
