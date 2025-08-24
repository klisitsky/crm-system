import { createBrowserRouter, redirect } from "react-router";
import { AuthPage } from "../pages/AuthPage/AuthPage.tsx";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage.tsx";
import { TodoListPage } from "../pages/TodoListPage/todolistPage.tsx";
import App from "./App.tsx";
import { AppLayout } from "../components/Layout/Layout.tsx";
import { PrivateRoute } from "../components/PrivateRoute/PrivateRoute.tsx";

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
