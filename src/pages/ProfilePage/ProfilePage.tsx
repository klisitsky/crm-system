import { useAppDispatch, useAppSelector } from "@/app/redux";
import { Card, Typography } from "antd";
import { useEffect } from "react";
import { fetchProfile, profileSlice } from "./profileSlice";

const { Text } = Typography;

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { username, email, phoneNumber } = useAppSelector(profileSlice.selectors.selectProfileData);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  return (
    <Card title="Личные данные" variant="borderless" style={{ width: 300 }}>
      <p>
        <Text strong>Имя: </Text>
        <Text>{username}</Text>
      </p>
      <p>
        <Text strong>Почта: </Text>
        <Text>{email}</Text>
      </p>
      <p>
        <Text strong>Телефон: </Text>
        <Text>{phoneNumber}</Text>
      </p>
    </Card>
  );
};
