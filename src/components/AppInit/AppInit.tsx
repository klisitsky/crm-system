import { REFRESH_TOKEN } from "@/components/constants/localStorageValues";
import { checkAuth } from "../../slices/AuthSlice";
import { fetchProfile } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "@/redux";
import { selectAuthRequestData } from "@/selectors.ts/authSelectors";
import { selectProfileRequestData } from "@/selectors.ts/profileSelectors";
import { notification } from "antd/lib";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export const AppInit = () => {
  const dispatch = useAppDispatch();
  const [api, contextHolder] = notification.useNotification();

  const {
    data: authData,
    error: authError,
  } = useAppSelector(selectAuthRequestData);
  const { error: profileError } = useAppSelector(selectProfileRequestData);


  useEffect(() => {
    if (localStorage.getItem(REFRESH_TOKEN)) {
      dispatch(checkAuth());
    }
  }, []);


  useEffect(() => {
    if (authData?.isAuthorization) {
      dispatch(fetchProfile());
    }
  }, [authData?.isAuthorization]);

  useEffect(() => {
    if (authError || profileError) {
      api["error"]({ message: authError || profileError, placement: "bottomLeft" });
    }
  }, [authError, profileError, api]);

  return (
    <>
      <Outlet />
      {contextHolder}
    </>
  );
};
