import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/roboto";
import "@/styles/tokens.css";
import "@/styles/global.css";
import { App } from "@/App";
import { AppProviders } from "@/AppProviders";
import { createQueryClient } from "@/queries/queryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders queryClient={createQueryClient()}>
      <App />
    </AppProviders>
  </StrictMode>,
);
