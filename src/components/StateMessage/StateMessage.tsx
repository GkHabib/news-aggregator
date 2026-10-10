import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon/Icon";
import styles from "@/components/StateMessage/StateMessage.module.css";
import { cx } from "@/utils/cx";

interface StateMessageProps {
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  icon?: IconName;
  tone?: "accent" | "warn";
  /** Card background and border (empty and error states); plain for end-of-feed. */
  framed?: boolean;
  role?: "alert" | "status";
}

/** Shared layout for empty, error and end-of-feed states. */
export function StateMessage({
  title,
  description,
  actions,
  icon,
  tone = "accent",
  framed = true,
  role,
}: StateMessageProps) {
  return (
    <section role={role} className={cx(styles.message, framed && styles.framed)}>
      {icon && (
        <span className={cx(styles.badge, tone === "warn" && styles.warn)} aria-hidden="true">
          <Icon name={icon} />
        </span>
      )}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
      {actions && <div className={styles.actions}>{actions}</div>}
    </section>
  );
}
