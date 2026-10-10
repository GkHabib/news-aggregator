import type { FeedFilters } from "@/types";
import { Button } from "@/components/Button/Button";
import { Sheet } from "@/components/Sheet/Sheet";
import { clearFilters, countChanges, type ApplyFilters } from "@/features/filters/feedFilters";
import { FilterFields } from "@/features/filters/FilterFields/FilterFields";
import { useFilterDraft } from "@/features/filters/useFilterDraft";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  applied: FeedFilters;
  onApply: ApplyFilters;
}

/** Phone bottom sheet / tablet side sheet. Reset only edits the draft; nothing applies until "Show results". */
export function FilterSheet({ open, onClose, applied, onApply }: FilterSheetProps) {
  const [draft, setDraft] = useFilterDraft(applied, open);

  const showResults = () => {
    if (countChanges(draft, applied) > 0) onApply({ ...draft, keyword: applied.keyword });
    onClose();
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Filters"
      footer={
        <>
          <Button size="large" onClick={() => setDraft(clearFilters(draft))}>
            Reset
          </Button>
          <Button size="large" variant="primary" block onClick={showResults}>
            Show results
          </Button>
        </>
      }
    >
      <FilterFields draft={draft} onChange={setDraft} variant="sheet" />
    </Sheet>
  );
}
