import { Form } from "antd";
import React, { memo } from "react";
import Input from "antd/es/input/Input";
import { MAX_SYMBOLS_COUNT, MIN_SYMBOLS_COUNT } from "../constants/todos";
import type { InputProps } from "antd/es/input/Input";

interface TodoForm {
  id: string;
  initialValues?: Record<string, any>;
  callback: (values: Record<string, string>) => void;
  inputProps?: InputProps;
}

export const TodoForm: React.FC<TodoForm> = memo(({ id, initialValues, callback, inputProps }) => {
  const [form] = Form.useForm();

  const onFinish = (values: Record<"title", string>) => {
    callback(values);
    form.resetFields();
  };

  return (
    <Form
      id={id}
      initialValues={initialValues}
      form={form}
      validateTrigger="none"
      onFinish={onFinish}
      style={{ flex: 1 }}
    >
      <Form.Item
        style={{ margin: 0, flex: 1 }}
        name="title"
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
            min: MIN_SYMBOLS_COUNT,
            message: "Длина менее 2 символов",
          },
          {
            max: MAX_SYMBOLS_COUNT,
            message: "Длина более 64 символов",
          },
        ]}
      >
        <Input {...inputProps} />
      </Form.Item>
    </Form>
  );
});
