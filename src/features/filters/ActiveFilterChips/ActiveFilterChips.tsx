import type { ReactNode } from "react";
import type { FeedFilters } from "@/types";
import { Button } from "@/components/Button/Button";
import { RemovableChip } from "@/components/Chip/RemovableChip";
import { activeFilterChips, clearFilters, type ApplyFilters } from "@/features/filters/feedFilters";
import styles from "@/features/filters/ActiveFilterChips/ActiveFilterChips.module.css";
import { cx } from "@/utils/cx";

interface ActiveFilterChipsProps {
  filters: FeedFilters;
  onApply: ApplyFilters;
  /** "scroll": one swipeable line (phone). "wrap": wrapping rows (tablet, desktop). */
  layout: "scroll" | "wrap";
  showClearAll?: boolean;
  /** Rendered first, e.g. the Filters button on phones. */
  leading?: ReactNode;
}

/** Applied filters; removing one applies immediately with an Undo toast. */
export function ActiveFilterChips({
  filters,
  onApply,
  layout,
  showClearAll = true,
  leading,
}: ActiveFilterChipsProps) {
  const chips = activeFilterChips(filters);
  if (!chips.length && !leading) return null;

  const size = layout === "scroll" ? "medium" : "small";
  return (
    <div className={cx(styles.row, styles[layout])}>
      {leading}
      {chips.map((chip) => (
        <RemovableChip
          key={chip.key}
          size={size}
          label={chip.label}
          onRemove={() => onApply(chip.remove(filters), `Removed ${chip.label}`)}
        />
      ))}
      {showClearAll && chips.length > 1 && (
        <Button
          variant="text"
          size={size === "small" ? "small" : "medium"}
          onClick={() => onApply(clearFilters(filters), "Filters cleared")}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
