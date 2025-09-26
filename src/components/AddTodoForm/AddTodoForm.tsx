import { todosApi } from "@/api/todosApi";
import { MAX_TODOS_SYMBOLS_COUNT, MIN_TODOS_SYMBOLS_COUNT } from "@/components/constants/todos";
import { CustomForm } from "@/components/CustomForm/CustomForm";
import { Button, Flex, Form, Input } from "antd";
import { memo } from "react";

interface AddTodoForm {
  isLoading: boolean;
  onUpdate?: () => void;
}

export const AddTodoForm: React.FC<AddTodoForm> = memo(({ isLoading, onUpdate }) => {
  const handleCreateTodo = async (values: Record<string, string>) => {
    await todosApi.createTodo(values.title);
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <Flex gap="large" justify="center">
      <CustomForm id="addForm" callback={handleCreateTodo}>
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
              min: MIN_TODOS_SYMBOLS_COUNT,
              message: "Длина менее 2 символов",
            },
            {
              max: MAX_TODOS_SYMBOLS_COUNT,
              message: "Длина более 64 символов",
            },
          ]}
        >
          <Input
            placeholder="Todo To Be Done..."
            disabled={isLoading}
            variant="underlined"
            size="small"
            style={{ backgroundColor: "transparent" }}
          />
        </Form.Item>
      </CustomForm>
      <Button
        form="addForm"
        type="primary"
        disabled={isLoading}
        style={{ width: "100px" }}
        htmlType="submit"
      >
        Add
      </Button>
    </Flex>
  );
});
