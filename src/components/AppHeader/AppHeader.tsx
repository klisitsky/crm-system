import { useAppDispatch, useAppSelector } from "@/app/redux";
import { authSlice, logOutUser } from "@/pages/AuthPage/AuthSlice";
import { Button, Flex } from "antd";
import { Header } from "antd/es/layout/layout";

export const AppHeader = () => {
  const dispatch = useAppDispatch();
  const isPending = useAppSelector(authSlice.selectors.selectIsLogOutStatusPending);
  const handleLogOut = () => {
    dispatch(logOutUser());
  };

  return (
    <Header style={{ padding: "15px", background: "#fff" }}>
      <Flex align="center" justify="end">
        <Button type="primary" onClick={handleLogOut} disabled={isPending}>
          Выйти
        </Button>
      </Flex>
    </Header>
  );
};
