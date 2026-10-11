import { Navigate, type RouteObject } from "react-router";
import { AppLayout } from "@/layout/AppLayout/AppLayout";
import { FeedPage } from "@/pages/FeedPage/FeedPage";
import { PreferencesPage } from "@/pages/PreferencesPage/PreferencesPage";

/** Route table, shared by the browser router and the test memory router. */
export const routes: RouteObject[] = [
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <FeedPage /> },
      { path: "preferences", element: <PreferencesPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
];
