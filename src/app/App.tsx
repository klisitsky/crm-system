import notification from "antd/es/notification";
import Spin from "antd/es/spin";
import { REFRESH_TOKEN } from "@/components/constants/localStorageValues";
import { checkAuth } from "@/pages/AuthPage/AuthSlice";
import { LoadingOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/redux";
import "./App.css";
import { selectAuthRequestData } from "@/store/selectors.ts/authSelectors";

function App() {
  const dispatch = useAppDispatch();

  const [api, contextHolder] = notification.useNotification();
  const { error, status } = useAppSelector(selectAuthRequestData);

  useEffect(() => {
    if (localStorage.getItem(REFRESH_TOKEN)) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      api["error"]({ message: error, placement: "bottomLeft" });
    }
  }, [error, api]);

  return status.isPending ? (
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
