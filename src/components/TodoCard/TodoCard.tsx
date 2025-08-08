import { deleteTodo, updateTodo } from "@/api/todosApi";
import { getErrorMessage } from "@/utils/getErrorMessage";
import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled";
import EditFilled from "@ant-design/icons/lib/icons/EditFilled";
import SaveFilled from "@ant-design/icons/lib/icons/SaveFilled";
import { Button, Flex, Typography } from "antd";
import Card from "antd/es/card/Card";
import Checkbox from "antd/es/checkbox/Checkbox";
import React, { memo, useState } from "react";
import { TodoForm } from "../TodoForm/TodoForm";
import s from "./TodoCard.module.scss";
import type { Todo } from "@/types/todos";

interface TodoCard {
  todo: Todo;
  isLoading: boolean;
  onUpdate?: () => void;
  updateMode?: (mode: boolean) => void;
}

export const TodoCard: React.FC<TodoCard> = memo(({ todo, isLoading, onUpdate, updateMode }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleUpdateTodoStatus = () => {
    updateTodo(todo.id, { isDone: !todo.isDone })
      .then(() => {
        if (onUpdate) {
          onUpdate();
        }
      })
      .catch((err) => {
        alert(getErrorMessage(err));
      });
  };

  const handleUpdateTodoTitle = (values: Record<"title", string>) => {
    updateTodo(todo.id, { title: values.title })
      .then(() => {
        if (updateMode) {
          updateMode(true);
        }
      })
      .catch((err) => {
        alert(getErrorMessage(err));
      });
    setIsEdit(false);
  };

  const handleDeleteTodo = () => {
    deleteTodo(todo.id)
      .then(() => {
        if (onUpdate) {
          onUpdate();
        }
      })
      .catch((err) => {
        alert(getErrorMessage(err));
      });
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
            inputProps={{
              disabled: isLoading,
              variant: "underlined",
              size: "small",
              style: { backgroundColor: "transparent" },
            }}
          />
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
