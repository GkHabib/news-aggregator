import { useEffect, useId, useRef, type ReactNode } from "react";
import { IconButton } from "@/components/IconButton/IconButton";
import styles from "@/components/Sheet/Sheet.module.css";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Modal sheet on the native <dialog>: focus trap, Esc, inert background and
 * focus return to the trigger come from the platform.
 */
export function Sheet({ open, onClose, title, children, footer }: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className={styles.sheet}
      onClose={onClose}
      // A click on the dialog element itself (not its content) is a click on the backdrop.
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className={styles.inner}>
        <div className={styles.handle} aria-hidden="true" />
        <div className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <IconButton icon="x" label={`Close ${title.toLowerCase()}`} onClick={onClose} />
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </dialog>
  );
}
