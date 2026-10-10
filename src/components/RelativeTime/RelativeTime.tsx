import type { IsoDateTime } from "@/types";
import { formatFullDate, formatRelativeTime } from "@/utils/format";

/** "3h ago", with the full date as tooltip and machine-readable datetime. */
export function RelativeTime({ dateTime }: { dateTime: IsoDateTime }) {
  return (
    <time dateTime={dateTime} title={formatFullDate(dateTime)}>
      {formatRelativeTime(dateTime)}
    </time>
  );
}
