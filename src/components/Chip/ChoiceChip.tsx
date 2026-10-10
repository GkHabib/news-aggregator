import type { ReactNode } from "react";
import { Icon } from "@/components/Icon/Icon";
import styles from "@/components/Chip/Chip.module.css";
import { cx } from "@/utils/cx";

interface ChoiceChipProps {
  selected: boolean;
  onToggle: () => void;
  children: ReactNode;
  size?: "medium" | "small";
}

/** Multi-select toggle chip (aria-pressed). For single choice use `RadioChip`. */
export function ChoiceChip({ selected, onToggle, children, size = "medium" }: ChoiceChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(styles.chip, styles.choice, size === "small" && styles.small)}
      onClick={onToggle}
    >
      {selected && <Icon name="check" size={16} strokeWidth={2.5} />}
      {children}
    </button>
  );
}
