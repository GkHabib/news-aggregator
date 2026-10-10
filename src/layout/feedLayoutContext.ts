import { useOutletContext } from "react-router";
import type { FeedFilters } from "@/types";
import type { ApplyFilters } from "@/features/filters/feedFilters";

/** State the layout owns and shares with its pages (filters move to the URL when wired). */
export interface FeedLayoutContext {
  filters: FeedFilters;
  applyFilters: ApplyFilters;
  filterSheetOpen: boolean;
  setFilterSheetOpen: (open: boolean) => void;
  /** Phone only: the header shows the search field instead of the title. */
  phoneSearchMode: boolean;
}

export const useFeedLayout = () => useOutletContext<FeedLayoutContext>();
