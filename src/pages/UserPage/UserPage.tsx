import EditFilled from "@ant-design/icons/lib/icons/EditFilled";
import LeftOutlined from "@ant-design/icons/lib/icons/LeftOutlined";
import Button from "antd/es/button/button";
import Flex from "antd/es/flex";
import Form from "antd/es/form";
import Input from "antd/es/input";
import { usersApi } from "@/api/usersApi";
import { CustomForm } from "@/components/CustomForm/CustomForm";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Card } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { UserInfo } from "@/components/UserInfo/UserInfo";
import { useErrorNotification } from "@/hooks/useAppError";
import type { LoadingStatus } from "@/types/common";
import type { User, UserRequest } from "@/types/users";

export const UserPage = () => {
  const navigate = useNavigate();

  const { id = "" } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<User>();
  const [changedFormValues, setChangedFormValues] = useState<UserRequest>({});

  const [editMode, setEditMode] = useState<boolean>();

  const [appError, setAppError] = useState<string>("");
  const contextHolder = useErrorNotification(appError);

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");
  const isLoading = loadingStatus === "pending";

  const fetchUser = useCallback(async () => {
    setAppError(() => "");
    try {
      setLoadingStatus("pending");
      const user = await usersApi.fetchUser(id);
      setUserData(user);
      setLoadingStatus(() => "succeed");
    } catch (err) {
      setAppError(() => getErrorMessage(err));
      setLoadingStatus(() => "failed");
    }
  }, [id]);

  const handleUpdateUserData = async () => {
    if (Object.keys(changedFormValues).length) {
      try {
        await usersApi.updateUserData(id, changedFormValues);
        setEditMode(false);
        fetchUser();
      } catch (err) {
        setAppError(getErrorMessage(err));
      }
    } else {
      setEditMode(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Flex justify="space-between" style={{ marginBottom: "15px" }}>
        <Button
          icon={<LeftOutlined />}
          onClick={() => {
            navigate("..", { relative: "path" });
          }}
        >
          Назад к пользователям
        </Button>

        {!editMode && (
          <Button
            icon={<EditFilled />}
            onClick={() => {
              setEditMode(true);
            }}
          >
            Редактировать данные
          </Button>
        )}
      </Flex>
      <Card title="Личные данные" variant="borderless" style={{ width: 400 }}>
        {editMode ? (
          <>
            <CustomForm
              callback={handleUpdateUserData}
              id="userForm"
              disabled={isLoading}
              requiredMark={false}
              initialValues={{
                username: userData?.username,
                email: userData?.email,
                phoneNumber: userData?.phoneNumber,
              }}
              onValuesChange={(changedValues, __) => {
                setChangedFormValues({ ...changedFormValues, ...changedValues });
              }}
            >
              <Form.Item
                style={{ marginBottom: "5px" }}
                name="username"
                label="Имя"
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
                <Input size="small" placeholder="Имя" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "5px" }}
                name="email"
                label="Почта"
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
                <Input size="small" placeholder="Почта" />
              </Form.Item>
              <Form.Item
                style={{ marginBottom: "5px" }}
                name="phoneNumber"
                label="Телефон"
                rules={[{ len: 12, message: "Некорректный формат номера телефона" }]}
                getValueFromEvent={(e) => {
                  const numbers = e.target.value.replace(/\D/g, "");
                  return numbers ? `+${numbers}` : "";
                }}
              >
                <Input
                  size="small"
                  placeholder="Телефон"
                  count={{
                    max: 12,
                  }}
                />
              </Form.Item>
            </CustomForm>
            <Flex justify="space-between">
              <Button
                type="link"
                disabled={isLoading}
                onClick={() => {
                  setEditMode(false);
                }}
              >
                Отмена
              </Button>
              <Button type="primary" disabled={isLoading} form="userForm" htmlType="submit">
                Подтвердить
              </Button>
            </Flex>
          </>
        ) : (
          <UserInfo data={userData} />
        )}
      </Card>
      {contextHolder}
    </>
  );
};
