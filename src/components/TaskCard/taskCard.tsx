import React from "react";
import type { Task } from "../../api/tasksApi";
import { Flex, Typography } from "antd";
import s from "./taskCard.module.scss";
import { TaskCardMenuButtons } from "./TaskCardMenuButtons/taskCardMenuButtons";
import { useTaskCards } from "./useTaskCards";
import Card from "antd/es/card/Card";
import Checkbox from "antd/es/checkbox/Checkbox";
import { Input } from "antd";

interface TaskCard {
  children: string;
  task: Task;
  isLoading: boolean;
  updateTask: (taskId: number, isDone: boolean, title: string) => void;
  deleteTask: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCard> = ({
  children,
  task,
  isLoading,
  updateTask,
  deleteTask,
}) => {
  const {
    isEdit,
    inputValue,
    errorMessage,
    handleChangeInputValue,
    handleChangeTaskStatus,
    handleEditTaskTitle,
    handleDeleteTask,
    handleChangeTaskTitle,
    handleCancelChangedTitle,
  } = useTaskCards(task, updateTask, deleteTask);

  return (
    <Card size="small" style={{ maxWidth: 350 }}>
      <Flex gap="small" align="center" justify="space-between">
        <Flex gap="small">
          <Checkbox
            checked={task.isDone}
            disabled={isLoading}
            onChange={handleChangeTaskStatus}
          ></Checkbox>
          {isEdit ? (
            <Flex vertical align="start">
              <Input
                disabled={isLoading}
                value={inputValue}
                onChange={handleChangeInputValue}
                status={errorMessage ? 'error' : ''}
                variant="underlined"
                size="small"
              />
              {errorMessage && <Typography.Text type="danger">{errorMessage}</Typography.Text>}
            </Flex>
          ) : (
            <Typography.Text className={`${task.isDone ? s.taskIsDone : ""}`}>
              {children}
            </Typography.Text>
          )}
        </Flex>
        <TaskCardMenuButtons
          isEdit={isEdit}
          isLoading={isLoading}
          handleEditTaskTitle={handleEditTaskTitle}
          handleDeleteTask={handleDeleteTask}
          handleChangeTaskTitle={handleChangeTaskTitle}
          handleCancelChangedTitle={handleCancelChangedTitle}
        />
      </Flex>
    </Card>
  );
};
