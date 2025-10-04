import Card from "antd/es/card";
import { UserInfo } from "@/components/UserInfo/UserInfo";
import { useErrorNotification } from "@/hooks/useAppError";
import { fetchProfile } from "../../slices/profileSlice";
import { useAppDispatch, useAppSelector } from "@/redux";
import { selectProfileRequestData } from "@/selectors.ts/profileSelectors";
import { useEffect } from "react";

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { data: profileData, error } = useAppSelector(selectProfileRequestData);

  const contextHolder = useErrorNotification(error);
  
  useEffect(() => {
    dispatch(fetchProfile());
  }, []);

  return (
    <>
      <Card title="Личные данные" variant="borderless" style={{ width: 400 }}>
        <UserInfo data={profileData} />
      </Card>
      {contextHolder}
    </>
  );
};
