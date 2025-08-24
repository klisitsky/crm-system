import "@ant-design/v5-patch-for-react-19";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "../styles/index.scss";
import "./index.css";
import { router } from "./router";
import { Provider } from "react-redux";
import { store } from "./store";

const root = document.getElementById("root");

createRoot(root!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
