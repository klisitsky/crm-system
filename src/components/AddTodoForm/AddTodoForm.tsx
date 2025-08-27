import { useAppDispatch, useAppSelector } from "@/app/redux";
import { TodoForm } from "@/components/TodoForm/TodoForm";
import { createTodo, todosSlice } from "@/pages/TodoListPage/todosSlice";
import { Button, Flex, Form, Input } from "antd";
import { memo, useCallback } from "react";
import { MAX_TODOS_SYMBOLS_COUNT, MIN_TODOS_SYMBOLS_COUNT } from "@/components/constants/todos";

export const AddTodoForm: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const isFetchTodosPending = useAppSelector(todosSlice.selectors.selectIsFetchTodosPending);
  const isCreateTodoPending = useAppSelector(todosSlice.selectors.selectIsCreateTodoPending);
  const isPending = isFetchTodosPending && isCreateTodoPending;

  const handleCreateTodo = useCallback((values: Record<string, string>) => {
    dispatch(createTodo(values.title));
  }, [dispatch]);

  return (
    <Flex gap="large" justify="center">
      <TodoForm
        id="addForm"
        callback={handleCreateTodo}
      ><Form.Item
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
        disabled={isPending}
        variant="underlined"
        size="small"
        style={{ backgroundColor: "transparent" }}
      />
    </Form.Item></TodoForm>
      <Button
        form="addForm"
        type="primary"
        disabled={isPending}
        style={{ width: "100px" }}
        htmlType="submit"
      >
        Add
      </Button>
    </Flex>
  );
});
