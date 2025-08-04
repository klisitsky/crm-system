import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled";
import EditFilled from "@ant-design/icons/lib/icons/EditFilled";
import { Button, Flex, Typography } from "antd";
import Card from "antd/es/card/Card";
import Checkbox from "antd/es/checkbox/Checkbox";
import React, { memo, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/redux";
import {
  deleteTodo,
  todosSlice,
  updateTodo,
} from "../../pages/TodoListPage/todosSlice";
import type { Todo } from "../../types/todos";
import { EditTodoForm } from "./EditTodoForm/EditTodoForm";
import s from "./TodoCard.module.scss";

interface TodoCard {
  children: string;
  todo: Todo;
}

export const TodoCard: React.FC<TodoCard> = memo(({ children, todo }) => {
  const dispatch = useAppDispatch();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const isFetchTodosPending = useAppSelector(
    todosSlice.selectors.selectIsFetchTodosPending
  );
  const isDeleteTodoPending = useAppSelector(
    todosSlice.selectors.selectIsDeleteTodoPending
  );
  const isCreateTodoPending = useAppSelector(
    todosSlice.selectors.selectIsCreateTodoPending
  );
  const disabled =
    isFetchTodosPending && isDeleteTodoPending && isCreateTodoPending;

  const handleUpdateTodoStatus = useCallback(() => {
    dispatch(updateTodo({ todoId: todo.id, isDone: !todo.isDone }));
  }, [todo]);

  const handleOpenEditForm = useCallback(() => {
    setIsEdit((prev) => !prev);
    dispatch(todosSlice.actions.toggleUpdatingTodosMode(false));
  }, []);

  const handleDeleteTodo = useCallback(() => {
    dispatch(deleteTodo(todo.id));
  }, [todo.id]);

  return (
    <Card size="small" style={{ width: "100%" }}>
      <Flex gap="small" justify="space-between">
        <Checkbox
          checked={todo.isDone}
          disabled={disabled}
          onChange={handleUpdateTodoStatus}
        ></Checkbox>
        {isEdit ? (
          <EditTodoForm
            todo={todo}
            disabled={disabled}
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
                disabled={disabled}
                size="middle"
                icon={<EditFilled key="edit" />}
              ></Button>
              <Button
                color="danger"
                variant="solid"
                onClick={handleDeleteTodo}
                disabled={disabled}
                size="middle"
                icon={<DeleteFilled key="delete" />}
              ></Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Card>
  );
});
