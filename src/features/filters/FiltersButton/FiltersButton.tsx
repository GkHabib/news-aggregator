import { Button } from "@/components/Button/Button";
import styles from "@/features/filters/FiltersButton/FiltersButton.module.css";
import { cx } from "@/utils/cx";

interface FiltersButtonProps {
  activeCount: number;
  onClick: () => void;
}

/** Opens the filter sheet; shows how many filters are applied. */
export function FiltersButton({ activeCount, onClick }: FiltersButtonProps) {
  return (
    <Button
      icon="sliders"
      className={cx(styles.button, activeCount > 0 && styles.active)}
      aria-haspopup="dialog"
      onClick={onClick}
    >
      Filters
      {activeCount > 0 && (
        <span className={styles.count}>
          {activeCount}
          <span className="visually-hidden"> active</span>
        </span>
      )}
    </Button>
  );
}
