import CloseCircleOutlined from "@ant-design/icons/lib/icons/CloseCircleOutlined";
import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled";
import EditFilled from "@ant-design/icons/lib/icons/EditFilled";
import SaveFilled from "@ant-design/icons/lib/icons/SaveFilled";
import { Button, Flex, Typography } from "antd";
import Card from "antd/es/card/Card";
import Checkbox from "antd/es/checkbox/Checkbox";
import React, { memo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { deleteTodo, todosSlice, updateTodo } from "@/pages/TodoListPage/todosSlice";
import { TodoForm } from "@/components/TodoForm/TodoForm";
import s from "./TodoCard.module.scss";
import type { Todo } from "@/types/todos";

interface TodoCard {
  todo: Todo;
}

export const TodoCard: React.FC<TodoCard> = memo(({ todo }) => {
  const dispatch = useAppDispatch();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const isFetchTodosPending = useAppSelector(todosSlice.selectors.selectIsFetchTodosPending);
  const isDeleteTodoPending = useAppSelector(todosSlice.selectors.selectIsDeleteTodoPending);
  const isCreateTodoPending = useAppSelector(todosSlice.selectors.selectIsCreateTodoPending);
  const disabled = isFetchTodosPending || isDeleteTodoPending || isCreateTodoPending;
  
  const handleUpdateTodoStatus = () => {
    dispatch(updateTodo({ todoId: todo.id, isDone: !todo.isDone }));
  };

  const handleUpdateTodoTitle = (values: Record<"title", string>) => {
    dispatch(updateTodo({ todoId: todo.id, title: values.title }));
  };

  const handleDeleteTodo = () => {
    dispatch(deleteTodo(todo.id));
  };

  const startEdit = () => {
      setIsEdit(true);
      dispatch(todosSlice.actions.toggleUpdatingTodosMode(false))
  };

  const endEdit = () => {
      setIsEdit(false);
      dispatch(todosSlice.actions.toggleUpdatingTodosMode(true))
  };

  return (
    <Card size="small" style={{ width: "100%" }}>
      <Flex gap="small" align="center" justify="space-between">
        <Checkbox checked={todo.isDone} disabled={disabled} onChange={handleUpdateTodoStatus} />
        {isEdit ? (
          <TodoForm
            id="editForm"
            initialValues={{ title: todo.title }}
            callback={handleUpdateTodoTitle}
            inputProps={{
              disabled,
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
              disabled={disabled}
              size="middle"
              icon={<SaveFilled key="save" />}
              htmlType="submit"
            />
            <Button
              form="editForm"
              color="blue"
              variant="outlined"
              onClick={endEdit}
              disabled={disabled}
              size="middle"
              htmlType="reset"
              icon={<CloseCircleOutlined key="close" />}
            />
          </>
        ) : (
          <Button
            type="primary"
            onClick={startEdit}
            disabled={disabled}
            size="middle"
            icon={<EditFilled key="edit" />}
          />
        )}
        <Button
          color="danger"
          variant="solid"
          onClick={handleDeleteTodo}
          disabled={disabled}
          size="middle"
          icon={<DeleteFilled key="delete" />}
        />
      </Flex>
    </Card>
  );
});
