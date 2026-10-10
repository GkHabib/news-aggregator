import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "@fontsource-variable/roboto";
import "@/styles/tokens.css";
import "@/styles/global.css";
import { App } from "@/App";
import { ToastProvider } from "@/components/Toast/ToastProvider";
import { PreferencesProvider } from "@/features/preferences/PreferencesProvider";
import { createQueryClient } from "@/queries/queryClient";

const queryClient = createQueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  </StrictMode>,
);
