import { Card, Flex } from "antd/lib";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <Flex justify="center" align="center" style={{ height: "100vh" }}>
      <Card style={{ minWidth: "400px" }}>
        <Outlet />
      </Card>
    </Flex>
  );
};
