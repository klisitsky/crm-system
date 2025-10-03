import LoadingOutlined from "@ant-design/icons/lib/icons/LoadingOutlined";
import { useAppDispatch, useAppSelector } from "@/redux";
import { selectAuthRequestData } from "@/selectors.ts/authSelectors";
import { useEffect } from "react";
import { REFRESH_TOKEN } from "@/components/constants/localStorageValues";
import { checkAuth } from "@/pages/AuthPage/AuthSlice";
import { Outlet } from "react-router-dom";
import { Flex, notification, Spin } from "antd/lib";
import { fetchProfile } from "@/pages/ProfilePage/profileSlice";
import { selectProfileRequestData } from "@/selectors.ts/profileSelectors";

export const AppInit = () => {
  const dispatch = useAppDispatch();
  const [api, contextHolder] = notification.useNotification();
  
  const { error: authError, status: authStatus } = useAppSelector(selectAuthRequestData);
  const { error: profileError, status: profileStatus } = useAppSelector(selectProfileRequestData);

  const isLoading = authStatus.isPending || profileStatus.isPending;

  useEffect(() => {
    if (localStorage.getItem(REFRESH_TOKEN)) {
      dispatch(checkAuth());
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProfile());
  }, []);

  useEffect(() => {
    if (authError || profileError) {
      api["error"]({ message: authError || profileError, placement: "bottomLeft" });
    }
  }, [authError, profileError, api]);

  return (
    <>
      {isLoading && (
        <Flex justify="center">
          <Spin size="large" indicator={<LoadingOutlined spin />} />
        </Flex>
      )}
      <Outlet />
      {contextHolder}
    </>
  );
};
