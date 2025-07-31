import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled";
import SaveFilled from "@ant-design/icons/lib/icons/SaveFilled";
import { Button, Flex, Form } from "antd";
import Input from "antd/es/input/Input";
import { useCallback } from "react";
import { updateTodo } from "../../../api/todoApi";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import {
  MAX_SYMBOLS_COUNT,
  MIN_SYMBOLS_COUNT,
} from "../../AddTodoForm/AddTodoForm";
import type { Todo } from "../../../types/todos";

interface EditTodoForm {
  todo: Todo;
  isLoading: boolean;
  handleDeleteTodo: () => void;
  updateMode?: (mode: boolean) => void;
}

export const EditTodoForm: React.FC<EditTodoForm> = ({
  todo,
  isLoading,
  handleDeleteTodo,
  updateMode,
}) => {
  const [form] = Form.useForm();

  const handleUpdateTodoTitle = useCallback(() => {
    form.validateFields().then((res) => {
      updateTodo(todo.id, todo.isDone, res.todoValue)
        .then(() => {
          updateMode?.(true);
        })
        .catch((err) => {
          alert(getErrorMessage(err));
        });
      form.resetFields();
    });
  }, [todo, form, updateMode]);

  const handleCloseEditForm = useCallback(() => {
    updateMode?.(true);
    form.setFieldValue("todoValue", todo.title);
  }, [todo.title, form, updateMode]);

  return (
    <Form
      initialValues={{
        todoValue: todo.title,
      }}
      form={form}
      validateTrigger="none"
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
          <Input disabled={isLoading} variant="underlined" size="small" />
        </Form.Item>
        <Flex gap="middle" align="center">
          <Form.Item style={{ margin: 0 }}>
            <Button
              type="primary"
              onClick={handleUpdateTodoTitle}
              disabled={isLoading}
              size="middle"
              icon={<SaveFilled key="save" />}
            ></Button>
          </Form.Item>
          <Form.Item style={{ margin: 0 }}>
            <Button
              color="blue"
              variant="outlined"
              onClick={handleCloseEditForm}
              disabled={isLoading}
              size="middle"
              icon={<CloseCircleOutlined key="close" />}
            ></Button>
          </Form.Item>
          <Form.Item style={{ margin: 0 }}>
            <Button
              color="danger"
              variant="solid"
              onClick={handleDeleteTodo}
              disabled={isLoading}
              size="middle"
              icon={<DeleteFilled key="delete" />}
            ></Button>
          </Form.Item>
        </Flex>
      </Flex>
    </Form>
  );
};
