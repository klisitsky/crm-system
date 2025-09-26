import { AppInit } from "@/components/AppInit/AppInit";
import { AppProtectedRoutes } from "@/components/AppProtectedRoutes/AppProtectedRoutes";
import { AuthLayout } from "@/components/AuthLayout/AuthLayout";
import {
  AUTH_PATH,
  LOGIN_PATH,
  PROFILE_PATH,
  REG_PATH,
  TODOS_PATH,
} from "@/components/constants/paths";
import { AppLayout } from "./components/AppLayout/AppLayout";
import { AuthRoutes } from "@/pages/AuthPage/AuthPage";
import { ErrorPage } from "@/pages/ErrorPage/ErrorPage";
import { ProfilePage } from "@/pages/ProfilePage/ProfilePage";
import { TodoListPage } from "@/pages/TodoListPage/todolistPage";
import { createBrowserRouter, Navigate } from "react-router";
import { LoginPage } from "@/pages/LoginPage/LoginPage";
import { SignUpPage } from "@/pages/SignupPage/SignupPage";

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
