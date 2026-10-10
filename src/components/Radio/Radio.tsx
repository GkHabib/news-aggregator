import styles from "@/components/Radio/Radio.module.css";

interface RadioProps {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
}

/** Native radio (arrow-key navigation within its group) with the spec's ring. */
export function Radio({ name, label, checked, onSelect }: RadioProps) {
  return (
    <label className={styles.option}>
      <input
        type="radio"
        name={name}
        className={styles.input}
        checked={checked}
        onChange={onSelect}
      />
      <span className={styles.ring} aria-hidden="true" />
      {label}
    </label>
  );
}
