import { Icon } from "@/components/Icon/Icon";
import styles from "@/components/Chip/Chip.module.css";
import { cx } from "@/utils/cx";

interface RadioChipProps {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
}

/** A native radio styled as a choice chip: arrow keys and grouping come from the browser. */
export function RadioChip({ name, label, checked, onSelect }: RadioChipProps) {
  return (
    <label className={cx(styles.chip, styles.choice, styles.radio)}>
      <input
        type="radio"
        name={name}
        className={styles.radioInput}
        checked={checked}
        onChange={onSelect}
      />
      {checked && <Icon name="check" size={16} strokeWidth={2.5} />}
      {label}
    </label>
  );
}
