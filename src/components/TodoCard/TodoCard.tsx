import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled";
import EditFilled from "@ant-design/icons/lib/icons/EditFilled";
import { Button, Flex, Typography } from "antd";
import Card from "antd/es/card/Card";
import Checkbox from "antd/es/checkbox/Checkbox";
import React, { memo, useCallback, useState } from "react";
import { EditTodoForm } from "./EditTodoForm/EditTodoForm";
import { deleteTodo, updateTodo } from "../../api/todoApi";
import { getErrorMessage } from "../../utils/getErrorMessage";
import s from "./todoCard.module.scss";
import type { Todo } from "../../types/todos";

interface TodoCard {
  children: string;
  todo: Todo;
  isLoading: boolean;
  onUpdate?: () => void;
  updateMode?: (mode: boolean) => void;
}

export const TodoCard: React.FC<TodoCard> = memo(
  ({ children, todo, isLoading, onUpdate, updateMode }) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const handleUpdateTodoStatus = useCallback(() => {
      updateTodo(todo.id, !todo.isDone, todo.title)
        .then(() => {
          onUpdate?.();
        })
        .catch((err) => {
          alert(getErrorMessage(err));
        });
    }, [todo, onUpdate]);

    const handleOpenEditForm = useCallback(() => {
      setIsEdit((prev) => !prev);
      updateMode?.(false);
    }, [updateMode]);

    const handleDeleteTodo = useCallback(() => {
      deleteTodo(todo.id)
        .then(() => {
          onUpdate?.();
        })
        .catch((err) => {
          alert(getErrorMessage(err));
        });
    }, [todo.id, onUpdate]);

    return (
      <Card size="small" style={{ width: "100%" }}>
        <Flex gap="small" justify="space-between">
          <Checkbox
            checked={todo.isDone}
            disabled={isLoading}
            onChange={handleUpdateTodoStatus}
          ></Checkbox>
          {isEdit ? (
            <EditTodoForm
              todo={todo}
              isLoading={isLoading}
              updateMode={updateMode}
              handleDeleteTodo={handleDeleteTodo}
            />
          ) : (
            <Flex
              align="center"
              gap="small"
              justify="space-between"
              style={{ width: "100%" }}
            >
              <Typography.Text className={`${todo.isDone ? s.todoIsDone : ""}`}>
                {children}
              </Typography.Text>
              <Flex gap="middle">
                <Button
                  type="primary"
                  onClick={handleOpenEditForm}
                  disabled={isLoading}
                  size="middle"
                  icon={<EditFilled key="edit" />}
                ></Button>
                <Button
                  color="danger"
                  variant="solid"
                  onClick={handleDeleteTodo}
                  disabled={isLoading}
                  size="middle"
                  icon={<DeleteFilled key="delete" />}
                ></Button>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Card>
    );
  }
);
