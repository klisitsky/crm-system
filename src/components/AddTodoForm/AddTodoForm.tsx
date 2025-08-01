import { Button, Flex, Form, Input } from "antd";
import { memo, useCallback } from "react";
import { createTodo } from "../../api/todoApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface AddTodoForm {
  isLoading: boolean;
  onUpdate?: () => void;
}

export const MIN_SYMBOLS_COUNT = 2;
export const MAX_SYMBOLS_COUNT = 64;

export const AddTodoForm: React.FC<AddTodoForm> = memo(
  ({ isLoading, onUpdate }) => {
    const [form] = Form.useForm();

    const handleCreateTodo = useCallback(() => {
      form.validateFields().then((res) => {
        createTodo(res.todoValue)
          .then(() => {
            onUpdate?.();
            form.resetFields();
          })
          .catch((err) => {
            alert(getErrorMessage(err));
          });
      });
    }, [form, onUpdate]);

    return (
      <Form form={form} validateTrigger="none" onFinish={handleCreateTodo}>
        <Flex gap="large" justify="center">
          <Form.Item
            style={{ margin: 0 }}
            name="todoValue"
            rules={[
              {
                required: true,
                message: "Поле не может быть пустым",
                transform: (value) => value.trim(),
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
            <Input
              placeholder="Todo To Be Done..."
              disabled={isLoading}
              variant="underlined"
              size="middle"
              style={{ backgroundColor: "transparent" }}
            />
          </Form.Item>
          <Form.Item style={{ margin: 0 }}>
            <Button
              type="primary"
              disabled={isLoading}
              style={{ width: "100px" }}
              htmlType="submit"
            >
              Add
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    );
  }
);
