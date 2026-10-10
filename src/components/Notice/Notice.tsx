import type { ReactNode } from "react";
import { Icon } from "@/components/Icon/Icon";
import { IconButton } from "@/components/IconButton/IconButton";
import styles from "@/components/Notice/Notice.module.css";

interface NoticeProps {
  children: ReactNode;
  onDismiss: () => void;
}

/** Non-blocking warning that sits above content, e.g. a provider being unavailable. */
export function Notice({ children, onDismiss }: NoticeProps) {
  return (
    <div role="status" className={styles.notice}>
      <span className={styles.icon}>
        <Icon name="info" />
      </span>
      <span>{children}</span>
      <IconButton icon="x" label="Dismiss notice" className={styles.dismiss} onClick={onDismiss} />
    </div>
  );
}
