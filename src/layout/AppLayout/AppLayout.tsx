import { useMemo, useState } from "react";
import { Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router";
import type { FeedFilters } from "@/types";
import { useToast } from "@/components/Toast/toastContext";
import { activeFilterChips, type ApplyFilters } from "@/features/filters/feedFilters";
import { parseFeedFilters, serializeFeedFilters } from "@/features/filters/filterSearchParams";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { AppHeader } from "@/layout/AppHeader/AppHeader";
import type { FeedLayoutContext } from "@/layout/feedLayoutContext";

/**
 * Header + page. Applied filters live in the URL of the feed (`/?q=…`), so
 * results are shareable and every change is a history entry Back can undo.
 */
export function AppLayout() {
  const breakpoint = useBreakpoint();
  const { pathname, search: locationSearch } = useLocation();
  const navigate = useNavigate();
  const showToast = useToast();

  // Memoized on the query string so `filters` keeps its identity between renders.
  const filters = useMemo(
    () => parseFeedFilters(new URLSearchParams(locationSearch)),
    [locationSearch],
  );
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [phoneSearchOpen, setPhoneSearchOpen] = useState(false);

  /** Shows the feed for `next`; filters only apply on the feed, so this always goes to "/". */
  const showFeed = (next: FeedFilters) => {
    const search = serializeFeedFilters(next).toString();
    const target = search ? `?${search}` : "";
    if (pathname === "/" && target === locationSearch) return;
    navigate({ pathname: "/", search: target });
  };

  const applyFilters: ApplyFilters = (next, undoMessage) => {
    const previous = filters;
    showFeed(next);
    if (undoMessage) {
      showToast({
        message: undoMessage,
        action: { label: "Undo", onAction: () => showFeed(previous) },
      });
    }
  };

  const search = (keyword: string) => applyFilters({ ...filters, keyword });

  /** Back from search on phones clears the keyword; applied filters stay (as chips). */
  const exitPhoneSearch = () => {
    setPhoneSearchOpen(false);
    showFeed({ ...filters, keyword: "" });
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
