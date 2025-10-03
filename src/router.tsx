import { AppInit } from "@/components/AppInit/AppInit";
import { AppProtectedRoutes } from "@/components/AppProtectedRoutes/AppProtectedRoutes";
import { AuthLayout } from "@/components/AuthLayout/AuthLayout";
import {
  AUTH_PATH,
  LOGIN_PATH,
  PROFILE_PATH,
  REG_PATH,
  TODOS_PATH,
  USERS_PATH,
} from "@/components/constants/paths";
import { AppLayout } from "./components/AppLayout/AppLayout";
import { AuthRoutes } from "@/pages/AuthPage/AuthPage";
import { ErrorPage } from "@/pages/ErrorPage/ErrorPage";
import { ProfilePage } from "@/pages/ProfilePage/ProfilePage";
import { TodoListPage } from "@/pages/TodoListPage/todolistPage";
import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "@/pages/LoginPage/LoginPage";
import { SignUpPage } from "@/pages/SignupPage/SignupPage";
import { UsersPage } from "@/pages/UsersPage/UsersPage";
import { UserPage } from "@/pages/UserPage/UserPage";
import { UserRightsProtectedRoutes } from "./components/UserRightsProtectedRoutes/UserRightsProtectedRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppInit />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to={TODOS_PATH} replace />,
      },
      {
        element: <AppProtectedRoutes />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: TODOS_PATH,
                element: <TodoListPage />,
              },
              {
                path: PROFILE_PATH,
                element: <ProfilePage />,
              },
              {
                element: <UserRightsProtectedRoutes />,
                children: [
                  {
                    path: USERS_PATH,
                    element: <UsersPage />,
                  },
                  {
                    path: `${USERS_PATH}/:id`,
                    element: <UserPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: AUTH_PATH,
        element: <AuthRoutes />,
        children: [
          {
            index: true,
            element: <Navigate to={LOGIN_PATH} replace />,
          },
          {
            element: <AuthLayout />,
            children: [
              {
                path: LOGIN_PATH,
                element: <LoginPage />,
              },
              {
                path: REG_PATH,
                element: <SignUpPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
