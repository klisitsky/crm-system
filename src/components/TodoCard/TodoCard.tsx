import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled";
import EditFilled from "@ant-design/icons/lib/icons/EditFilled";
import SaveFilled from "@ant-design/icons/lib/icons/SaveFilled";
import Card from "antd/es/card/Card";
import Checkbox from "antd/es/checkbox/Checkbox";
import { todosApi } from "@/api/todosApi";
import { MAX_TODOS_SYMBOLS_COUNT, MIN_TODOS_SYMBOLS_COUNT } from "@/components/constants/todos";
import { TodoForm } from "@/components/TodoForm/TodoForm";
import { Button, Flex, Form, Input, Typography } from "antd";
import React, { memo, useCallback, useState } from "react";
import s from "./TodoCard.module.scss";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { Todo } from "@/types/todos";

interface TodoCard {
  todo: Todo;
  isLoading: boolean;
  onUpdate?: () => void;
  updateMode?: (mode: boolean) => void;
}

export const TodoCard: React.FC<TodoCard> = memo(({ todo, isLoading, onUpdate, updateMode }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleUpdateTodoStatus = async () => {
    try {
      await todosApi.updateTodo(todo.id, { isDone: !todo.isDone });
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const handleUpdateTodoTitle = useCallback(
    async (values: Record<"title", string>) => {
      try {
        await todosApi.updateTodo(todo.id, { title: values.title });
        if (updateMode) {
          updateMode(true);
        }
      } catch (err) {
        alert(getErrorMessage(err));
      }
      setIsEdit(false);
    },
    [todo.id, updateMode]
  );

  const handleDeleteTodo = async () => {
    try {
      await todosApi.deleteTodo(todo.id);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const startEdit = () => {
    setIsEdit(true);
    if (updateMode) {
      updateMode(false);
    }
  };

  const endEdit = () => {
    setIsEdit(false);
    if (updateMode) {
      updateMode(true);
    }
  };

  return (
    <Card size="small" style={{ width: "100%" }}>
      <Flex gap="small" align="center" justify="space-between">
        <Checkbox checked={todo.isDone} disabled={isLoading} onChange={handleUpdateTodoStatus} />
        {isEdit ? (
          <TodoForm
            id="editForm"
            initialValues={{ title: todo.title }}
            callback={handleUpdateTodoTitle}
          >
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
                disabled={isLoading}
                variant="underlined"
                size="small"
                style={{ backgroundColor: "transparent" }}
              />
            </Form.Item>
          </TodoForm>
        ) : (
          <Typography.Text
            className={`${todo.isDone ? s.todoIsDone : ""}`}
            style={{ margin: 0, flex: 1 }}
          >
            {todo.title}
          </Typography.Text>
        )}
        {isEdit ? (
          <>
            <Button
              form="editForm"
              type="primary"
              disabled={isLoading}
              size="middle"
              icon={<SaveFilled key="save" />}
              htmlType="submit"
            />
            <Button
              form="editForm"
              color="blue"
              variant="outlined"
              onClick={endEdit}
              disabled={isLoading}
              size="middle"
              htmlType="reset"
              icon={<CloseCircleOutlined key="close" />}
            />
          </>
        ) : (
          <Button
            type="primary"
            onClick={startEdit}
            disabled={isLoading}
            size="middle"
            icon={<EditFilled key="edit" />}
          />
        )}
        <Button
          color="danger"
          variant="solid"
          onClick={handleDeleteTodo}
          disabled={isLoading}
          size="middle"
          icon={<DeleteFilled key="delete" />}
        />
      </Flex>
    </Card>
  );
});
