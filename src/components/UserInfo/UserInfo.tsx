import { Typography } from "antd/lib";
import type { Profile } from "@/types/profile";
import type { FC } from "react";

const { Text } = Typography;

interface UserCardInfo {
  data: Profile | undefined;
}

export const UserInfo: FC<UserCardInfo> = ({ data }) => {
  return (
    <>
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
    </>
  );
};
