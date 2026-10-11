import type { ReactNode } from "react";
import { QueryClient } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, MemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppProviders } from "@/AppProviders";
import { routes } from "@/routes";
import { setViewportWidth } from "@/test/viewport";

/** No retries in tests: a failure should show up immediately. */
const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

/** Renders a component with the app's providers (preferences, toasts, router links). */
export function renderWithProviders(ui: ReactNode) {
  const user = userEvent.setup();
  const result = render(
    <AppProviders queryClient={createTestQueryClient()}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AppProviders>,
  );
  return { user, ...result };
}

/**
 * Renders the whole app at `path` and a viewport `width`, on the mock news
 * providers (ENABLE_MOCK_DATA is set for tests).
 */
export function renderApp(path = "/", { width = 375 }: { width?: number } = {}) {
  setViewportWidth(width);
  const user = userEvent.setup();
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const result = render(
    <AppProviders queryClient={createTestQueryClient()}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { user, router, ...result };
}
