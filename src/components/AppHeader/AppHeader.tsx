import { logOutUser } from "../../slices/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux";
import { selectAuthRequestData } from "@/selectors.ts/authSelectors";
import { Button, Flex } from "antd";
import { Header } from "antd/es/layout/layout";

export const AppHeader = () => {
  const dispatch = useAppDispatch();

  const { status } = useAppSelector(selectAuthRequestData);

  const handleLogOut = () => {
    dispatch(logOutUser());
  };

  return (
    <Header style={{ padding: "15px", background: "#fff" }}>
      <Flex align="center" justify="end">
        <Button type="primary" onClick={handleLogOut} disabled={status.isPending}>
          Выйти
        </Button>
      </Flex>
    </Header>
  );
};
