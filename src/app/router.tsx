import { createBrowserRouter, redirect } from "react-router";
import App from "./App";
import { PrivateRoute } from "@/components/PrivateRoute/PrivateRoute";
import { AppLayout } from "@/components/Layout/Layout";
import { TodoListPage } from "@/pages/TodoListPage/todolistPage";
import { ProfilePage } from "@/pages/ProfilePage/ProfilePage";
import { AuthPage } from "@/pages/AuthPage/AuthPage";
import { ErrorPage } from "@/pages/ErrorPage/ErrorPage";
import { AUTH_PATH, PROFILE_PATH, TODOS_PATH, USERS_PATH } from "@/components/constants/paths";
import { UsersPage } from "@/pages/UsersPage/UsersPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage/>,
    children: [
      {
        index: true,
        loader: () => redirect(TODOS_PATH),
      },
      {
        path: TODOS_PATH,
        element: (
          <PrivateRoute>
            <AppLayout>
              <TodoListPage />
            </AppLayout>
          </PrivateRoute>
        ),
      },
      {
        path: PROFILE_PATH,
        element: (
          <PrivateRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </PrivateRoute>
        ),
      },
      {
        path: USERS_PATH,
        element: (
          <PrivateRoute>
            <AppLayout>
              <UsersPage />
            </AppLayout>
          </PrivateRoute>
        ),
      },
      {
        path: AUTH_PATH,
        element: <AuthPage />
      },
    ],
  },
]);
