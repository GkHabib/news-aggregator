import { createContext, useContext } from "react";

export interface ToastOptions {
  message: string;
  action?: { label: string; onAction: () => void };
}

export const ToastContext = createContext<(toast: ToastOptions) => void>(() => {});

/** Shows a toast; a new one replaces the current. */
export const useToast = () => useContext(ToastContext);
