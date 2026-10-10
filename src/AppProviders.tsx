import type { ReactNode } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { ToastProvider } from "@/components/Toast/ToastProvider";
import { PreferencesProvider } from "@/features/preferences/PreferencesProvider";

interface AppProvidersProps {
  queryClient: QueryClient;
  children: ReactNode;
}

/** App-wide context, shared by main.tsx and the test renderer. */
export function AppProviders({ queryClient, children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <ToastProvider>{children}</ToastProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  );
}
