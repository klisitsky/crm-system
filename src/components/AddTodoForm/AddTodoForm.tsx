import { createTodo } from "@/api/todosApi";
import { TodoForm } from "@/components/TodoForm/TodoForm";
import { Button, Flex } from "antd";
import { memo } from "react";

interface AddTodoForm {
  isLoading: boolean;
  onUpdate?: () => void;
}

export const AddTodoForm: React.FC<AddTodoForm> = memo(({ isLoading, onUpdate }) => {
  const handleCreateTodo = (values: Record<"title", string>) => {
    createTodo(values.title);
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <Flex gap="large" justify="center">
      <TodoForm
        id="addForm"
        callback={handleCreateTodo}
        inputProps={{
          placeholder: "Todo To Be Done...",
          disabled: isLoading,
          variant: "underlined",
          size: "middle",
          style: { backgroundColor: "transparent" },
        }}
      />
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
