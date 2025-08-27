import { useAppDispatch } from "@/app/redux";
import { loginUser } from "@/pages/AuthPage/AuthSlice";
import { Button, Divider, Flex, Form, Input } from "antd";
import { Link } from "react-router";
import { TodoForm } from "@/components/TodoForm/TodoForm";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import type { AuthData } from "@/types/auth";

type FormInitialValuesKeys = keyof AuthData;

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const handleLogin = (formValues: Record<FormInitialValuesKeys, string>) => {
    dispatch(loginUser(formValues));
  };

  return (
    <>
      <Flex justify="center">
        <Title level={2} style={{ margin: "0 0 15px" }}>
          Вход
        </Title>
      </Flex>
      <TodoForm id="loginForm" callback={handleLogin}>
        <Form.Item name="login" label="Логин" layout="vertical">
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" label="Пароль" layout="vertical">
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
      </TodoForm>
      <Button form="loginForm" htmlType="submit" type="primary" block>
        Войти
      </Button>
      <Divider />
      <div>
        Еще нет аккаунта? <Link to={"?mode=signup"}>Зарегистрироваться</Link>
      </div>
    </>
  );
};
