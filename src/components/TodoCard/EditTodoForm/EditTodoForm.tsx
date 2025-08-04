import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled";
import SaveFilled from "@ant-design/icons/lib/icons/SaveFilled";
import { Button, Flex, Form } from "antd";
import Input from "antd/es/input/Input";
import { useCallback } from "react";
import { useAppDispatch } from "../../../app/redux";
import { todosSlice, updateTodo } from "../../../pages/TodoListPage/todosSlice";
import type { Todo } from "../../../types/todos";
import {
  MAX_SYMBOLS_COUNT,
  MIN_SYMBOLS_COUNT,
} from "../../AddTodoForm/AddTodoForm";

interface EditTodoForm {
  todo: Todo;
  disabled: boolean;
  handleDeleteTodo: () => void;
}

export const EditTodoForm: React.FC<EditTodoForm> = ({
  todo,
  disabled,
  handleDeleteTodo,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleUpdateTodoTitle = useCallback(
    (values: Record<string, string>) => {
      dispatch(updateTodo({ todoId: todo.id, title: values.todoValue }));
      dispatch(todosSlice.actions.toggleUpdatingTodosMode(true));
      form.resetFields();
    },
    [todo, form]
  );

  const handleCloseEditForm = useCallback(() => {
    dispatch(todosSlice.actions.toggleUpdatingTodosMode(true));
    form.resetFields();
  }, [todo.title, form]);

  return (
    <Form
      initialValues={{
        todoValue: todo.title,
      }}
      form={form}
      validateTrigger="none"
      onFinish={handleUpdateTodoTitle}
      style={{ flex: 1 }}
    >
      <Flex gap="small" align="center">
        <Form.Item
          style={{ margin: 0, flex: 1 }}
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
          <Input disabled={disabled} variant="underlined" size="small" />
        </Form.Item>
        <Flex gap="middle" align="center">
          <Form.Item style={{ margin: 0 }}>
            <Button
              type="primary"
              disabled={disabled}
              size="middle"
              icon={<SaveFilled key="save" />}
              htmlType="submit"
            ></Button>
          </Form.Item>
          <Form.Item style={{ margin: 0 }}>
            <Button
              color="blue"
              variant="outlined"
              onClick={handleCloseEditForm}
              disabled={disabled}
              size="middle"
              icon={<CloseCircleOutlined key="close" />}
            ></Button>
          </Form.Item>
          <Form.Item style={{ margin: 0 }}>
            <Button
              color="danger"
              variant="solid"
              onClick={handleDeleteTodo}
              disabled={disabled}
              size="middle"
              icon={<DeleteFilled key="delete" />}
            ></Button>
          </Form.Item>
        </Flex>
      </Flex>
    </Form>
  );
};
