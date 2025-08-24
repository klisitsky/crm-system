import { Button, Form, Input } from "antd";
import { Link } from "react-router";
import { useAppDispatch } from "../../app/redux";
import { loginUser } from "../../pages/AuthPage/AuthSlice";
import type { AuthData } from "../../types/auth";

type FormInitialValuesKeys = keyof AuthData;

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  
  const handleLogin = (formValues: Record<FormInitialValuesKeys, string>) => {
    dispatch(loginUser(formValues));
  };

  return (
    <>
      <Form id="loginForm" form={form} validateTrigger="none" onFinish={handleLogin}>
        <Form.Item name="login" label="Логин">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Пароль">
          <Input />
        </Form.Item>
        <Button form="loginForm" htmlType="submit">
          Войти
        </Button>
      </Form>
      <Link to={"?mode=signup"}>Sign Up</Link>
    </>
  );
};
