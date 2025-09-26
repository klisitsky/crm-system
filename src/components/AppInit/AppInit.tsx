import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import { useAppDispatch, useAppSelector } from "@/redux";
import { selectAuthRequestData } from "@/selectors.ts/authSelectors";
import { useEffect } from "react";
import { REFRESH_TOKEN } from "@/components/constants/localStorageValues";
import { checkAuth } from "@/pages/AuthPage/AuthSlice";
import { Outlet } from "react-router-dom";
import { Flex, notification, Spin } from "antd/lib";

export const AppInit = () => {
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