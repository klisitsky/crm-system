import { useAppDispatch, useAppSelector } from "@/redux";
import { Card, notification, Typography } from "antd";
import { useEffect } from "react";
import { fetchProfile } from "@/pages/ProfilePage/profileSlice";
import { selectProfileRequestData } from "@/selectors.ts/profileSelectors";

const { Text } = Typography;

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { data, error } = useAppSelector(selectProfileRequestData);

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
      <Card title="Личные данные" variant="borderless" style={{ width: 300 }}>
        <p>
          <Text strong>Имя: </Text>
          <Text>{data?.username}</Text>
        </p>
        <p>
          <Text strong>Почта: </Text>
          <Text>{data?.email}</Text>
        </p>
        <p>
          <Text strong>Телефон: </Text>
          <Text>{data?.phoneNumber}</Text>
        </p>
      </Card>
      {contextHolder}
    </>
  );
};
