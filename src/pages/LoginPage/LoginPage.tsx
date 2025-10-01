import Title from "antd/es/typography/Title";
import { REG_PATH } from "@/components/constants/paths";
import { CustomForm } from "@/components/CustomForm/CustomForm";
import { loginUser } from "@/pages/AuthPage/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/redux";
import { selectAuthRequestData } from "@/selectors.ts/authSelectors";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Divider, Flex, Form, Input } from "antd";
import { Link } from "react-router";
import type { AuthData } from "@/types/auth";

type FormInitialValuesKeys = keyof AuthData;

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector(selectAuthRequestData);

  const handleLogin = async (formValues: Record<FormInitialValuesKeys, string>) => {
    await dispatch(loginUser(formValues)).unwrap();
  };

  return (
    <>
      <Flex justify="center">
        <Title level={2} style={{ margin: "0 0 15px" }}>
          Вход
        </Title>
      </Flex>
      {error && <Alert message={error} type="error" style={{ marginBottom: "15px" }} />}
      <CustomForm id="loginForm" callback={handleLogin} disabled={status.isPending}>
        <Form.Item name="login" label="Логин" layout="vertical">
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" label="Пароль" layout="vertical">
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
      </CustomForm>
      <Button form="loginForm" htmlType="submit" type="primary" disabled={status.isPending} block>
        Войти
      </Button>
      <Divider />
      <div>
        Еще нет аккаунта? <Link to={`../${REG_PATH}`}>Зарегистрироваться</Link>
      </div>
    </>
  );
};
