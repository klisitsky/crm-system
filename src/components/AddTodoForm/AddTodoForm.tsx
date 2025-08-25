import { useAppDispatch, useAppSelector } from "@/app/redux";
import { TodoForm } from "@/components/TodoForm/TodoForm";
import { createTodo, todosSlice } from "@/pages/TodoListPage/todosSlice";
import { Button, Flex } from "antd";
import { memo, useCallback } from "react";

export const AddTodoForm: React.FC = memo(({}) => {
  const dispatch = useAppDispatch();
  const isFetchTodosPending = useAppSelector(todosSlice.selectors.selectIsFetchTodosPending);
  const isCreateTodoPending = useAppSelector(todosSlice.selectors.selectIsCreateTodoPending);
  const disabled = isFetchTodosPending && isCreateTodoPending;

  const handleCreateTodo = useCallback((values: Record<string, string>) => {
    dispatch(createTodo(values.title));
  }, []);

  return (
    <Flex gap="large" justify="center">
      <TodoForm
        id="addForm"
        callback={handleCreateTodo}
        inputProps={{
          placeholder: "Todo To Be Done...",
          disabled,
          variant: "underlined",
          size: "middle",
          style: { backgroundColor: "transparent" },
        }}
      />
      <Button
        form="addForm"
        type="primary"
        disabled={disabled}
        style={{ width: "100px" }}
        htmlType="submit"
      >
        Add
      </Button>
    </Flex>
  );
});
