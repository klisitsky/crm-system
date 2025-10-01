import { UserInfo } from "@/components/UserInfo/UserInfo";
import { fetchProfile } from "@/pages/ProfilePage/profileSlice";
import { useAppDispatch, useAppSelector } from "@/redux";
import { selectProfileRequestData } from "@/selectors.ts/profileSelectors";
import { notification } from "antd";
import { useEffect } from "react";


export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { data: profileData, error } = useAppSelector(selectProfileRequestData);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      api["error"]({ message: error, placement: "bottomLeft" });
    }
  }, [error, api]);

  return (
    <>
      <UserInfo data={profileData}/>
      {contextHolder}
    </>
  );
};
