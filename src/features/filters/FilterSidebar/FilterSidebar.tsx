import { useId } from "react";
import type { FeedFilters } from "@/types";
import { Button } from "@/components/Button/Button";
import {
  activeFilterChips,
  clearFilters,
  countChanges,
  type ApplyFilters,
} from "@/features/filters/feedFilters";
import { FilterFields } from "@/features/filters/FilterFields/FilterFields";
import { useFilterDraft } from "@/features/filters/useFilterDraft";
import styles from "@/features/filters/FilterSidebar/FilterSidebar.module.css";

interface FilterSidebarProps {
  applied: FeedFilters;
  onApply: ApplyFilters;
}

/** Desktop filter column. Changes are drafts until Apply; Undo discards them. */
export function FilterSidebar({ applied, onApply }: FilterSidebarProps) {
  const [draft, setDraft] = useFilterDraft(applied);
  const titleId = useId();
  const changes = countChanges(draft, applied);
  const hasActiveFilters = activeFilterChips(applied).length > 0;

  return (
    <aside aria-labelledby={titleId} className={styles.sidebar}>
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="text"
            size="small"
            onClick={() => onApply(clearFilters(applied), "Filters cleared")}
          >
            Clear all
          </Button>
        )}
      </div>

      <FilterFields draft={draft} onChange={setDraft} variant="sidebar" />

      {changes > 0 && (
        <p className={styles.pending} role="status">
          {changes === 1 ? "1 change" : `${changes} changes`} not applied
        </p>
      )}
      <div className={styles.actions}>
        {changes > 0 && <Button onClick={() => setDraft(applied)}>Undo</Button>}
        <Button
          variant="primary"
          block
          disabled={changes === 0}
          onClick={() => onApply({ ...draft, keyword: applied.keyword })}
        >
          Apply
        </Button>
      </div>
    </aside>
  );
}
