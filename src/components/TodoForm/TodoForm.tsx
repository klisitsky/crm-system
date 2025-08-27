import { Form } from "antd";
import React, { memo } from "react";
import type { ReactNode } from "react";

interface TodoForm {
  children: ReactNode;
  id: string;
  initialValues?: Record<string, string>;
  callback: (values: Record<string, string>) => void;
}

export const TodoForm: React.FC<TodoForm> = memo(({ id, initialValues, callback, children }) => {
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
      {children}
    </Form>
  );
});
