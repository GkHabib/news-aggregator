import { Link } from "react-router";
import styles from "@/features/articles/FeedHeading/FeedHeading.module.css";
import { useBreakpoint } from "@/hooks/useMediaQuery";
import { cx } from "@/utils/cx";
import { summarizeList } from "@/utils/format";

export type FeedMode =
  | { kind: "top" }
  | { kind: "forYou"; basis: readonly string[] }
  | { kind: "results"; keyword: string };

/** The view's single h1: "Top stories", "For you" (with its basis) or "Results for …". */
export function FeedHeading({ mode }: { mode: FeedMode }) {
  const breakpoint = useBreakpoint();

  if (mode.kind === "results") {
    return (
      <div className={cx(styles.heading, styles.results)}>
        <h1 className={styles.title}>
          {mode.keyword ? `Results for “${mode.keyword}”` : "Results"}
          <span className={styles.phoneOnly}> · newest first</span>
        </h1>
        <span className={styles.order}>Newest first</span>
      </div>
    );
  }

  if (mode.kind === "forYou") {
    const basis = summarizeList(mode.basis, breakpoint === "desktop" ? 5 : 3);
    return (
      <div className={styles.heading}>
        <h1 className={styles.title}>For you</h1>
        <p className={styles.subtitle}>
          {basis} · <Link to="/preferences">Edit</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.heading}>
      <h1 className={styles.title}>Top stories</h1>
      <p className={styles.subtitle}>From NewsAPI, The Guardian and The New York Times</p>
    </div>
  );
}
