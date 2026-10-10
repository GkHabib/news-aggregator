import styles from "@/features/articles/SkeletonCard/SkeletonCard.module.css";
import { cx } from "@/utils/cx";

/** Decorative; the surrounding region announces loading. */
export function SkeletonCard() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.lines}>
        <div className={cx(styles.bar, styles.tag)} />
        <div className={styles.bar} />
        <div className={cx(styles.bar, styles.short)} />
        <div className={cx(styles.bar, styles.meta)} />
      </div>
      <div className={styles.image} />
    </div>
  );
}
