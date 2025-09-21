import Title from "antd/es/typography/Title";
import { TodoForm } from "@/components/TodoForm/TodoForm";
import { loginUser } from "@/pages/AuthPage/AuthSlice";
import { selectAuthRequestData } from "@/store/selectors.ts/authSelectors";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Divider, Flex, Form, Input } from "antd";
import { useCallback } from "react";
import { Link } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/redux";
import type { AuthData } from "@/types/auth";

type FormInitialValuesKeys = keyof AuthData;

export const LoginForm = () => {
  const dispatch = useAppDispatch();

  const { error, status } = useAppSelector(selectAuthRequestData);

  const handleLogin = useCallback(
    async (formValues: Record<FormInitialValuesKeys, string>) => {
      await dispatch(loginUser(formValues)).unwrap();
    },
    [dispatch]
  );

  return (
    <>
      <Flex justify="center">
        <Title level={2} style={{ margin: "0 0 15px" }}>
          Вход
        </Title>
      </Flex>
      {error && <Alert message={error} type="error" style={{ marginBottom: "15px" }} />}
      <TodoForm id="loginForm" callback={handleLogin} disabled={status.isPending}>
        <Form.Item name="login" label="Логин" layout="vertical">
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" label="Пароль" layout="vertical">
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
      </TodoForm>
      <Button form="loginForm" htmlType="submit" type="primary" disabled={status.isPending} block>
        Войти
      </Button>
      <Divider />
      <div>
        Еще нет аккаунта? <Link to={"?mode=signup"}>Зарегистрироваться</Link>
      </div>
    </>
  );
};
