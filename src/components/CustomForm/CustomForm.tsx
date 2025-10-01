import React, { memo } from "react";
import { Form } from "antd";
import type { ReactNode } from "react";

interface CustomForm {
  children: ReactNode;
  id: string;
  callback: (values: Record<string, string>) => Promise<void>;
  initialValues?: Record<string, string>;
  disabled?: boolean;
}

export const CustomForm: React.FC<CustomForm> = memo(
  ({ id, initialValues, callback, children, disabled }) => {
    const [form] = Form.useForm();

    const onFinish = (values: Record<"title", string>) => {
      callback(values).then(() => {
        form.resetFields();
      });
    };

    return (
      <Form
        id={id}
        initialValues={initialValues}
        form={form}
        validateTrigger="none"
        onFinish={onFinish}
        style={{ flex: 1 }}
        disabled={disabled}
      >
        {children}
      </Form>
    );
  }
);
