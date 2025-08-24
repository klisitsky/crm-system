import { Button, Flex, Form, Input } from "antd";
import { memo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux";
import { createTodo, todosSlice } from "../../pages/TodoListPage/todosSlice";

export const AddTodoForm: React.FC = memo(({}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const isFetchTodosPending = useAppSelector(
    todosSlice.selectors.selectIsFetchTodosPending
  );
  const isCreateTodoPending = useAppSelector(
    todosSlice.selectors.selectIsCreateTodoPending
  );
  const disabled = isFetchTodosPending && isCreateTodoPending;

  const handleCreateTodo = useCallback(
    (values: Record<string, string>) => {
      dispatch(createTodo(values.todoValue));
      form.resetFields();
    },
    [form]
  );

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
