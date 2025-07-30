import "@ant-design/v5-patch-for-react-19";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import "./index.css";
import "./styles/index.scss";
import { TodolistPage } from "./pages/TodolistPage/todolistPage.tsx";
import App from "./App.tsx";
import { ProfilePage } from "./pages/ProfilePage/ProfilePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        loader: () => redirect("/tasks"),
      },
      {
        path: "tasks",
        element: <TodolistPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

const root = document.getElementById("root");

createRoot(root!).render(<RouterProvider router={router} />);
