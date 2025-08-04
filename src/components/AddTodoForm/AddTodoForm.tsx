import { Button, Flex, Form, Input } from "antd";
import { memo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux";
import { createTodo, todosSlice } from "../../pages/TodoListPage/todosSlice";

export const MIN_SYMBOLS_COUNT = 2;
export const MAX_SYMBOLS_COUNT = 64;

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
            disabled={disabled}
            variant="underlined"
            size="middle"
            style={{ backgroundColor: "transparent" }}
          />
        </Form.Item>
        <Form.Item style={{ margin: 0 }}>
          <Button
            type="primary"
            disabled={disabled}
            style={{ width: "100px" }}
            htmlType="submit"
          >
            Add
          </Button>
        </Form.Item>
      </Flex>
    </Form>
  );
});
