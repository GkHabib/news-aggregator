import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import { AppLayout } from "@/layout/AppLayout/AppLayout";
import { FeedPage } from "@/pages/FeedPage/FeedPage";
import { PreferencesPage } from "@/pages/PreferencesPage/PreferencesPage";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: "preferences", element: <PreferencesPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
