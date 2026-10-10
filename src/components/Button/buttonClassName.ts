import type { IconName } from "@/components/Icon/Icon";
import styles from "@/components/Button/Button.module.css";
import { cx } from "@/utils/cx";

export type ButtonVariant = "primary" | "secondary" | "text";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  /** Stretch to fill the remaining row space. */
  block?: boolean;
}

/** Shared by `Button` and router links styled as buttons. */
export function buttonClassName({
  variant = "secondary",
  size = "medium",
  icon,
  block,
}: ButtonStyleProps): string {
  return cx(
    styles.button,
    styles[variant],
    size !== "medium" && styles[size],
    icon && styles.withIcon,
    block && styles.block,
  );
}
