import { Icon } from "@/components/Icon/Icon";
import styles from "@/components/Chip/Chip.module.css";
import { cx } from "@/utils/cx";

interface RemovableChipProps {
  label: string;
  onRemove: () => void;
  size?: "medium" | "small";
}

export function RemovableChip({ label, onRemove, size = "medium" }: RemovableChipProps) {
  return (
    <button
      type="button"
      aria-label={`Remove filter: ${label}`}
      className={cx(styles.chip, styles.removable, size === "small" && styles.small)}
      onClick={onRemove}
    >
      {label}
      <Icon name="x" size={16} />
    </button>
  );
}
