import { useId } from "react";
import { Link } from "react-router";
import type { Article } from "@/types";
import { Button } from "@/components/Button/Button";
import { buttonClassName } from "@/components/Button/buttonClassName";
import { StateMessage } from "@/components/StateMessage/StateMessage";
import { ArticleCard } from "@/features/articles/ArticleCard/ArticleCard";
import { LoadMoreTrigger } from "@/features/articles/ArticleFeed/LoadMoreTrigger";
import { SkeletonCard } from "@/features/articles/SkeletonCard/SkeletonCard";
import styles from "@/features/articles/ArticleFeed/ArticleFeed.module.css";

interface ArticleFeedProps {
  articles: readonly Article[];
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  loadMoreFailed: boolean;
  /** Requests the next page: on scroll (infinite feed) and from the retry button. */
  onLoadMore: () => void;
}

const scrollToTop = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
};

/** The story list with its loading, load-more and end-of-feed footers. */
export function ArticleFeed({
  articles,
  isLoading,
  isFetchingMore,
  hasMore,
  loadMoreFailed,
  onLoadMore,
}: ArticleFeedProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} aria-busy={isLoading || isFetchingMore}>
      <h2 id={headingId} className="visually-hidden">
        Stories
      </h2>
      {isLoading && (
        <p className="visually-hidden" role="status">
          Loading stories
        </p>
      )}

      <ul className={styles.grid}>
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <li key={index}>
                <SkeletonCard />
              </li>
            ))
          : articles.map((article) => (
              <li key={article.id}>
                <ArticleCard article={article} />
              </li>
            ))}
        {isFetchingMore &&
          Array.from({ length: 2 }, (_, index) => (
            <li key={`more-${index}`}>
              <SkeletonCard />
            </li>
          ))}
      </ul>

      {!isLoading && hasMore && !isFetchingMore && !loadMoreFailed && (
        <LoadMoreTrigger onLoadMore={onLoadMore} />
      )}

      <div aria-live="polite">
        {isFetchingMore && <p className={styles.status}>Loading more stories…</p>}
        {loadMoreFailed && (
          <p className={styles.loadMoreError}>
            Couldn’t load more.
            <Button variant="text" onClick={onLoadMore}>
              Try again
            </Button>
          </p>
        )}
      </div>

      {!isLoading && !hasMore && articles.length > 0 && (
        <div className={styles.end}>
          <StateMessage
            framed={false}
            icon="check"
            title="You're all caught up"
            description="That's every story for your feed right now."
            actions={
              <>
                <Button onClick={scrollToTop}>Back to top</Button>
                <Link to="/preferences" className={buttonClassName({ variant: "text" })}>
                  Broaden your feed
                </Link>
              </>
            }
          />
        </div>
      )}
    </section>
  );
}
