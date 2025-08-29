import { LoadingOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import notification from "antd/es/notification";
import Spin from "antd/es/spin";
import { useEffect } from "react";
import { Outlet } from "react-router";
import "./App.css";
import { appSlice } from "./appSlice";
import { useAppDispatch, useAppSelector } from "./redux";
import { authSlice, checkAuth } from "@/pages/AuthPage/AuthSlice";
import { REFRESH_TOKEN } from "@/components/constants/localStorageValues";

function App() {
  const dispatch = useAppDispatch();
  const [api, contextHolder] = notification.useNotification();

  const appError = useAppSelector(appSlice.selectors.selectError);
  const isPending = useAppSelector(authSlice.selectors.selectIsRefreshTokenStatusPending);

  useEffect(() => {
    if (localStorage.getItem(REFRESH_TOKEN)) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  useEffect(() => {
    if (appError) {
      api["error"]({ message: appError, placement: "bottomLeft" });
    }
  }, [appError, api]);

  return isPending ? (
    <Flex justify="center">
      <Spin size="large" indicator={<LoadingOutlined spin />} />
    </Flex>
  ) : (
    <>
      <Outlet />
      {contextHolder}
    </>
  );
}

export default App;
