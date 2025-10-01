import React, { memo } from "react";
import { Form } from "antd";
import type { ReactNode } from "react";
import type { RequiredMark } from "antd/lib/form/Form";

interface CustomForm {
  children: ReactNode;
  id: string;
  callback: (values: Record<string, string>) => Promise<void>;
  initialValues?: Record<string, string | undefined>;
  disabled?: boolean;
  requiredMark?: RequiredMark;
  onValuesChange?: (changedValues: Record<string, string | undefined>, allValues: Record<string, string | undefined>) => void;
}

export const CustomForm: React.FC<CustomForm> = memo(
  ({ id, initialValues, callback, children, disabled, requiredMark, onValuesChange }) => {
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
        requiredMark={requiredMark}
        onValuesChange={onValuesChange}
      >
        {children}
      </Form>
    );
  }
);
