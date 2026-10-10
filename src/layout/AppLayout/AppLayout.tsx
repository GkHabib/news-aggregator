import { useState } from "react";
import { Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router";
import type { FeedFilters } from "@/types";
import { useToast } from "@/components/Toast/toastContext";
import {
  activeFilterChips,
  emptyFeedFilters,
  type ApplyFilters,
} from "@/features/filters/feedFilters";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { AppHeader } from "@/layout/AppHeader/AppHeader";
import type { FeedLayoutContext } from "@/layout/feedLayoutContext";

/** Header + page. Owns the applied filters so the header search works from any page. */
export function AppLayout() {
  const breakpoint = useBreakpoint();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const showToast = useToast();

  // ponytail: in-memory for the UI phase; moves to URL search params when wired.
  const [filters, setFilters] = useState<FeedFilters>(emptyFeedFilters);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [phoneSearchOpen, setPhoneSearchOpen] = useState(false);

  const applyFilters: ApplyFilters = (next, undoMessage) => {
    const previous = filters;
    setFilters(next);
    if (undoMessage) {
      showToast({
        message: undoMessage,
        action: { label: "Undo", onAction: () => setFilters(previous) },
      });
    }
  };

  const search = (keyword: string) => {
    applyFilters({ ...filters, keyword });
    if (pathname !== "/") navigate("/");
  };

  /** Back from search on phones clears the keyword; applied filters stay (as chips). */
  const exitPhoneSearch = () => {
    setPhoneSearchOpen(false);
    setFilters((current) => ({ ...current, keyword: "" }));
  };

  const phoneSearchMode = phoneSearchOpen || Boolean(filters.keyword);
  const context: FeedLayoutContext = {
    filters,
    applyFilters,
    filterSheetOpen,
    setFilterSheetOpen,
  };

  return (
    <>
      <AppHeader
        breakpoint={breakpoint}
        isPreferencesPage={pathname === "/preferences"}
        keyword={filters.keyword}
        onSearch={search}
        phoneSearchMode={phoneSearchMode}
        onOpenPhoneSearch={() => setPhoneSearchOpen(true)}
        onExitPhoneSearch={exitPhoneSearch}
        activeFilterCount={activeFilterChips(filters).length}
        onOpenFilters={() => setFilterSheetOpen(true)}
      />
      <Outlet context={context} />
      <ScrollRestoration />
    </>
  );
}
