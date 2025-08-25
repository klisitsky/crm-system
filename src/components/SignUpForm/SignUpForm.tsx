import { useAppDispatch, useAppSelector } from "@/app/redux";
import { authSlice, signUpUser } from "@/pages/AuthPage/AuthSlice";
import { Button, Form, Input, Result } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { UserRegistration } from "@/types/auth";

export type UserRegistrationKeys = keyof UserRegistration;

export const SignUpForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const isNewUserCreated = useAppSelector(authSlice.selectors.selectIsNewUserCreated);
  const [timer, setTimer] = useState<number>(5);

  useEffect(() => {
    let intervalId: number;
    if (isNewUserCreated) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      navigate("/auth", { replace: true });
    }

    return () => {
      if (timer === 0) {
        dispatch(authSlice.actions.toggleIsUserNewCreated());
      }
      clearInterval(intervalId);
    };
  }, [timer, isNewUserCreated]);

  const handleSignUpUser = ({
    repeatPassword,
    ...restFormValues
  }: Record<UserRegistrationKeys | "repeatPassword", string>) => {
    dispatch(signUpUser(restFormValues));
  };

  const handleRedirectToLogin = () => {
    navigate("/auth", { replace: true });
  };

  return isNewUserCreated ? (
    <Result
      status="success"
      title="Ваша учетная запись успешно создана"
      subTitle={`Вы автоматически перейдете на страницу логина через ${timer}`}
      extra={[
        <Button type="primary" key="console" onClick={handleRedirectToLogin}>
          Go to Login
        </Button>,
      ]}
    />
  ) : (
    <>
      <Form id="signUpForm" form={form} validateTrigger="none" onFinish={handleSignUpUser}>
        <Form.Item name="username" label="Имя пользователя">
          <Input />
        </Form.Item>
        <Form.Item name="login" label="Логин">
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Пароль">
          <Input />
        </Form.Item>
        <Form.Item name="repeatPassword" label="Повторите пароль">
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Почтовый адрес">
          <Input />
        </Form.Item>
        <Form.Item name="phoneNumber" label="Телефон">
          <Input />
        </Form.Item>
        <Button form="signUpForm" htmlType="submit">
          Зарегистрироваться
        </Button>
      </Form>
      <Link to={"?mode=login"}>Login</Link>
    </>
  );
};
