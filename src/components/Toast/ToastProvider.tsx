import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ToastContext, type ToastOptions } from "@/components/Toast/toastContext";
import styles from "@/components/Toast/ToastProvider.module.css";

const visibleMs = 5000;

interface ActiveToast extends ToastOptions {
  id: number;
}

/** One toast at a time; hides after 5s unless hovered or focused. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ActiveToast | null>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!toast || paused) return;
    const timer = setTimeout(() => setToast(null), visibleMs);
    return () => clearTimeout(timer);
  }, [toast, paused]);

  const show = useCallback((options: ToastOptions) => {
    setPaused(false);
    setToast({ ...options, id: Date.now() });
  }, []);

  return (
    <ToastContext value={show}>
      {children}
      {/* The live region stays mounted so screen readers announce each new toast. */}
      <div className={styles.region} role="status" aria-live="polite">
        {toast && (
          <div
            key={toast.id}
            className={styles.toast}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <span className={styles.message}>{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                className={styles.action}
                onClick={() => {
                  toast.action?.onAction();
                  setToast(null);
                }}
              >
                {toast.action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </ToastContext>
  );
}
