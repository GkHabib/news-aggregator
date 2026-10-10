import styles from "@/components/IconButton/IconButton.module.css";
import { cx } from "@/utils/cx";

export interface IconButtonStyleProps {
  tone?: "default" | "muted";
  size?: "medium" | "small";
}

/** Shared by `IconButton` and router links that look like one. */
export const iconButtonClassName = ({
  tone = "default",
  size = "medium",
}: IconButtonStyleProps = {}) =>
  cx(styles.iconButton, tone === "muted" && styles.muted, size === "small" && styles.small);
