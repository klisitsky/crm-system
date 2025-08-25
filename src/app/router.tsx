import { createBrowserRouter, redirect } from "react-router";
import App from "./App";
import { PrivateRoute } from "@/components/PrivateRoute/PrivateRoute";
import { AppLayout } from "@/components/Layout/Layout";
import { TodoListPage } from "@/pages/TodoListPage/todolistPage";
import { ProfilePage } from "@/pages/ProfilePage/ProfilePage";
import { AuthPage } from "@/pages/AuthPage/AuthPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        loader: () => redirect("/todos"),
      },
      {
        path: "todos",
        element: (
          <PrivateRoute>
            <AppLayout>
              <TodoListPage />
            </AppLayout>
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </PrivateRoute>
        ),
      },
      {
        path: "auth",
        element: <AuthPage />,
        loader: ({ request }) => {
          const url = new URL(request.url);

          if (!url.searchParams.get("mode")) {
            return redirect("?mode=login");
          }
        },
      },
    ],
  },
]);
