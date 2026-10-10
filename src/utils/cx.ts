/** Joins class names, skipping falsy ones: `cx(styles.a, isOn && styles.on)`. */
export const cx = (...classNames: readonly (string | false | null | undefined)[]): string =>
  classNames.filter(Boolean).join(" ");
