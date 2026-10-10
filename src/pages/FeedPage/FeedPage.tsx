import { Link } from "react-router";
import type { FeedPreferences } from "@/types";
import { buttonClassName } from "@/components/Button/buttonClassName";
import { StateMessage } from "@/components/StateMessage/StateMessage";
import { ArticleFeed } from "@/features/articles/ArticleFeed/ArticleFeed";
import { buildFeedQuery } from "@/features/articles/feedQuery";
import { FeedError } from "@/features/articles/FeedError/FeedError";
import { FeedHeading, type FeedMode } from "@/features/articles/FeedHeading/FeedHeading";
import { PersonalizePrompt } from "@/features/articles/PersonalizePrompt/PersonalizePrompt";
import { SourceNotices } from "@/features/articles/SourceNotices/SourceNotices";
import { useDismissedNotices } from "@/features/articles/SourceNotices/useDismissedNotices";
import { ActiveFilterChips } from "@/features/filters/ActiveFilterChips/ActiveFilterChips";
import { EmptyResults } from "@/features/filters/EmptyResults/EmptyResults";
import { isFiltering } from "@/features/filters/feedFilters";
import { FilterSheet } from "@/features/filters/FilterSheet/FilterSheet";
import { FilterSidebar } from "@/features/filters/FilterSidebar/FilterSidebar";
import { hasPreferences } from "@/features/preferences/feedPreferences";
import { usePreferences } from "@/features/preferences/preferencesContext";
import { sourceLabel } from "@/features/sources/sourceInfo";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { useFeedLayout } from "@/layout/feedLayoutContext";
import { useArticles } from "@/queries/useArticles";
import styles from "@/pages/FeedPage/FeedPage.module.css";
import { formatCategory } from "@/utils/format";

/** What "For you" is built from, in display order. */
const preferenceBasis = (preferences: FeedPreferences) => [
  ...preferences.categories.map(formatCategory),
  ...preferences.authors.map((author) => author.name),
  ...preferences.sources.map(sourceLabel),
];

/** The feed and its "Results" mode: search is a mode of the feed, not a separate page. */
export function FeedPage() {
  const { filters, applyFilters, filterSheetOpen, setFilterSheetOpen } = useFeedLayout();
  const { preferences, update } = usePreferences();
  const breakpoint = useBreakpoint();
  const feed = useArticles(buildFeedQuery(filters, preferences));
  const articles = feed.data?.articles ?? [];
  const errors = feed.data?.errors ?? [];
  const [dismissedNotices, dismissNotice] = useDismissedNotices();

  const results = isFiltering(filters);
  const mode: FeedMode = results
    ? { kind: "results", keyword: filters.keyword }
    : hasPreferences(preferences)
      ? { kind: "forYou", basis: preferenceBasis(preferences) }
      : { kind: "top" };

  const isEmpty = feed.status === "success" && articles.length === 0;

  return (
    <>
      <title>{results ? "Results · News Aggregator" : "News Aggregator"}</title>

      <div className={styles.page}>
        {breakpoint === "desktop" && <FilterSidebar applied={filters} onApply={applyFilters} />}

        <main className={styles.main}>
          <FeedHeading mode={mode} />

          {mode.kind === "top" && !preferences.personalizePromptDismissed && (
            <PersonalizePrompt
              onDismiss={() =>
                update((current) => ({ ...current, personalizePromptDismissed: true }))
              }
            />
          )}

          <SourceNotices errors={errors} dismissed={dismissedNotices} onDismiss={dismissNotice} />

          <ActiveFilterChips
            layout={breakpoint === "phone" ? "scroll" : "wrap"}
            filters={filters}
            onApply={applyFilters}
            // Desktop clears from the sidebar.
            showClearAll={breakpoint !== "desktop"}
          />

          {feed.status === "error" ? (
            <FeedError onRetry={() => feed.refetch()} />
          ) : isEmpty ? (
            results ? (
              <EmptyResults filters={filters} onApply={applyFilters} />
            ) : (
              <StateMessage
                title="Nothing in your feed yet"
                description="None of the latest stories match your sources, topics or writers. Follow a few more to see stories here."
                actions={
                  <Link to="/preferences" className={buttonClassName({ variant: "primary" })}>
                    Edit your feed
                  </Link>
                }
              />
            )
          ) : (
            <ArticleFeed
              articles={articles}
              isLoading={feed.status === "pending"}
              isFetchingMore={feed.isFetchingNextPage}
              hasMore={feed.hasNextPage}
              loadMoreFailed={feed.isFetchNextPageError}
              onLoadMore={() => feed.fetchNextPage()}
            />
          )}
        </main>
      </div>

      {breakpoint !== "desktop" && (
        <FilterSheet
          open={filterSheetOpen}
          onClose={() => setFilterSheetOpen(false)}
          applied={filters}
          onApply={applyFilters}
        />
      )}
    </>
  );
}
