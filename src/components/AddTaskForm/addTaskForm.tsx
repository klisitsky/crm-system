import { Button, Flex, Form, Input } from "antd";
import { useCallback } from "react";

interface AddTaskForm {
  addNewTask: (newTitle: string) => Promise<void>;
  isLoading: boolean;
}

export const MIN_SYMBOLS_COUNT = 2;
export const MAX_SYMBOLS_COUNT = 64;

export const AddTaskForm: React.FC<AddTaskForm> = ({
  addNewTask,
  isLoading,
}) => {
  const [form] = Form.useForm();

  const handleAddTask = useCallback(() => {
    form.validateFields().then((res) => {
      addNewTask(res.taskValue);
      form.resetFields();
    });
  }, [form]);

  return (
      <Form form={form} validateTrigger="none">
        <Flex gap="large" justify="center">
          <Form.Item
            style={{ margin: 0 }}
            name="taskValue"
            rules={[
              {
                required: true,
                message: "Поле не может быть пустым",
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
              placeholder="Task To Be Done..."
              disabled={isLoading}
              variant="underlined"
              size="middle"
            style={{ backgroundColor: "transparent" }}
            />
          </Form.Item>
          <Form.Item style={{ margin: 0 }}>
            <Button
              type="primary"
              onClick={handleAddTask}
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
};
