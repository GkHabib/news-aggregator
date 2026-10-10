import { useOutletContext } from "react-router";
import type { FeedFilters } from "@/types";
import type { ApplyFilters } from "@/features/filters/feedFilters";

/** State the layout owns and shares with its pages (filters move to the URL when wired). */
export interface FeedLayoutContext {
  filters: FeedFilters;
  applyFilters: ApplyFilters;
  filterSheetOpen: boolean;
  setFilterSheetOpen: (open: boolean) => void;
}

export const useFeedLayout = () => useOutletContext<FeedLayoutContext>();
