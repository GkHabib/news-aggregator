import { Icon } from "@/components/Icon/Icon";
import styles from "@/components/Checkbox/Checkbox.module.css";
import { cx } from "@/utils/cx";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Secondary line, e.g. a coverage hint. */
  note?: string;
  noteTone?: "muted" | "warn";
  /** "compact": 40px rows (sidebar). "divided": 52px rows with a rule (sheets). */
  layout?: "default" | "compact" | "divided";
}

/** Native checkbox (keyboard, forms, a11y) with the spec's custom box. */
export function Checkbox({
  label,
  checked,
  onChange,
  note,
  noteTone = "muted",
  layout = "default",
}: CheckboxProps) {
  return (
    <label className={cx(styles.option, layout !== "default" && styles[layout])}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.box} aria-hidden="true">
        {checked && <Icon name="check" size={14} strokeWidth={3} />}
      </span>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {note && (
          <span className={cx(styles.note, noteTone === "warn" && styles.warn)}>{note}</span>
        )}
      </span>
    </label>
  );
}
