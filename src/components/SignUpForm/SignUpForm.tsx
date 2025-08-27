import { useAppDispatch, useAppSelector } from "@/app/redux";
import { authSlice, signUpUser } from "@/pages/AuthPage/AuthSlice";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Form, Input, Result } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { TodoForm } from "@/components/TodoForm/TodoForm";
import Title from "antd/es/typography/Title";
import type { UserRegistration } from "@/types/auth";

export type UserRegistrationKeys = keyof UserRegistration;

export const SignUpForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
  }, [timer, isNewUserCreated, dispatch, navigate]);

  const handleSignUpUser = ({
    confirmPassword,
    ...restFormValues
  }: Record<UserRegistrationKeys | "confirmPassword", string>) => {
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
      <Flex justify="center">
        <Title level={2} style={{margin: "0 0 15px"}}>Регистрация</Title>
      </Flex>
      <TodoForm id="signUpForm" callback={handleSignUpUser}>
        <Form.Item
          name="username"
          label="Имя пользователя"
          layout="vertical"
          tooltip={{
            title: "От 1 до 60 символов рус./лат. алфавита",
            icon: <InfoCircleOutlined />,
          }}
          rules={[
            {
              required: true,
              message: "Поле не может быть пустым",
              transform: (value) => {
                if (value) {
                  return value.trim();
                }
                return value;
              },
            },
            {
              type: "string",
              pattern: /[a-zA-Zа-яА-ЯёЁ]+/u,
              message: "Не может содержать спецсимволы и цифры",
            },
            {
              min: 1,
              message: "Длина поля менее 1 символа",
            },
            {
              max: 60,
              message: "Длина поля более 60 символов",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="login"
          label="Логин"
          layout="vertical"
          tooltip={{ title: "От 2 до 60 символов лат. алфавита", icon: <InfoCircleOutlined /> }}
          rules={[
            {
              required: true,
              message: "Поле не может быть пустым",
              transform: (value) => {
                if (value) {
                  return value.trim();
                }
                return value;
              },
            },
            {
              pattern: /[a-zA-Z]+/u,
              message: "Поле может содержать только символы лат. алфавита",
            },
            {
              pattern: /^[^0-9]*$/,
              message: "Поле не может содержать цифр",
            },
            {
              min: 2,
              message: "Длина поля менее 2 символов",
            },
            {
              max: 60,
              message: "Длина поля более 60 символов",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          layout="vertical"
          hasFeedback
          rules={[
            {
              required: true,
              message: "Поле не может быть пустым",
              transform: (value) => {
                if (value) {
                  return value.trim();
                }
                return value;
              },
            },
            {
              min: 6,
              message: "Длина поля менее 6 символов",
            },
            {
              max: 60,
              message: "Длина поля более 60 символов",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Повторите пароль"
          layout="vertical"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Поле не может быть пустым",
              transform: (value) => {
                if (value) {
                  return value.trim();
                }
                return value;
              },
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Пароли не совпадают"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="email"
          label="Почтовый адрес"
          layout="vertical"
          rules={[
            {
              required: true,
              message: "Поле не может быть пустым",
            },
            {
              type: "email",
              message: "Некорректный email",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phoneNumber"
          label="Телефон"
          layout="vertical"
          rules={[{ len: 12, message: "Некорректный формат номера телефона" }]}
          getValueFromEvent={(e) => {
            const numbers = e.target.value.replace(/\D/g, "");
            return numbers ? `+${numbers}` : "";
          }}
        >
          <Input
            count={{
              max: 12,
            }}
          />
        </Form.Item>
      </TodoForm>
      <Button form="signUpForm" htmlType="submit" type="primary" block>
        Зарегистрироваться
      </Button>
      <Divider />
      <div>
        Уже есть аккаунт? <Link to={"?mode=login"}>Войти</Link>
      </div>
    </>
  );
};
