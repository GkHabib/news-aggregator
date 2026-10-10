import type { DatePreset, FeedFilters } from "@/types";
import { Button } from "@/components/Button/Button";
import { StateMessage } from "@/components/StateMessage/StateMessage";
import {
  activeFilterChips,
  clearFilters,
  datePresetLabels,
  type ApplyFilters,
} from "@/features/filters/feedFilters";
import {
  andList,
  findCoverageGap,
  sourceLabel,
  sourceShortLabel,
  type CoverageGap,
} from "@/features/sources/sourceInfo";
import { formatCategory } from "@/utils/format";

interface EmptyResultsProps {
  filters: FeedFilters;
  onApply: ApplyFilters;
}

/** Widening steps offered when a short date range finds nothing. */
const widerDate: Partial<Record<DatePreset, DatePreset>> = { today: "week", week: "month" };

const dateSuffix: Partial<Record<DatePreset, string>> = {
  today: " from today",
  week: " from the past week",
  month: " from the past month",
};

/** Explains an empty result: either a source/category mismatch, or simply no matches. */
export function EmptyResults({ filters, onApply }: EmptyResultsProps) {
  const gap = findCoverageGap(filters.categories, filters.sources);
  return gap ? (
    <CoverageGapMessage gap={gap} filters={filters} onApply={onApply} />
  ) : (
    <NoMatchesMessage filters={filters} onApply={onApply} />
  );
}

function CoverageGapMessage({ gap, filters, onApply }: EmptyResultsProps & { gap: CoverageGap }) {
  const sources = andList(gap.sources.map(sourceLabel));
  const categories = andList(gap.categories.map(formatCategory));
  const verb = gap.sources.length === 1 ? "doesn't" : "don't";
  const onlyCategory = gap.categories.length === 1 ? gap.categories[0] : undefined;

  return (
    <StateMessage
      title={`${sources} ${verb} cover ${categories}`}
      description={`${categories} stories come from ${andList(gap.alternatives.map(sourceLabel))}. Add one of them, or choose another category.`}
      actions={
        <>
          <Button
            variant="primary"
            onClick={() =>
              onApply({ ...filters, sources: [...filters.sources, ...gap.alternatives] })
            }
          >
            Add {andList(gap.alternatives.map(sourceShortLabel))}
          </Button>
          <Button onClick={() => onApply({ ...filters, categories: [] })}>
            {onlyCategory ? `Remove ${formatCategory(onlyCategory)}` : "Clear categories"}
          </Button>
        </>
      }
    />
  );
}

function NoMatchesMessage({ filters, onApply }: EmptyResultsProps) {
  const subject = filters.keyword ? `“${filters.keyword}”` : "these filters";
  const wider = widerDate[filters.date];
  const hasFilters = activeFilterChips(filters).length > 0;

  return (
    <StateMessage
      title={`No stories match ${subject}${dateSuffix[filters.date] ?? ""}`}
      description="Each source searches its own archive, so results vary. Try fewer words or a longer date range."
      actions={
        <>
          {wider && (
            <Button variant="primary" onClick={() => onApply({ ...filters, date: wider })}>
              Search {datePresetLabels[wider].toLowerCase()}
            </Button>
          )}
          <Button onClick={() => onApply(clearFilters(filters, !hasFilters))}>
            {hasFilters ? "Clear filters" : "Clear search"}
          </Button>
        </>
      }
    />
  );
}
