import DeleteFilled from "@ant-design/icons/lib/icons/DeleteFilled";
import EditFilled from "@ant-design/icons/lib/icons/EditFilled";
import { Button, Flex, Typography } from "antd";
import Card from "antd/es/card/Card";
import Checkbox from "antd/es/checkbox/Checkbox";
import React from "react";
import type { Task } from "../../api/tasksApi";
import s from "./taskCard.module.scss";
import { useTaskCards } from "./useTaskCards";
import { EditTaskForm } from "./EditTaskForm/editTaskForm";

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
    toggleIsEdit,
    handleChangeTaskStatus,
    handleEditTaskTitle,
    handleDeleteTask,
  } = useTaskCards(task, updateTask, deleteTask);

  return (
    <Card size="small" style={{ minWidth: 330 }}>
      <Flex gap="small" justify="space-between">
        <Checkbox
          checked={task.isDone}
          disabled={isLoading}
          onChange={handleChangeTaskStatus}
        ></Checkbox>
        {isEdit ? (
          <EditTaskForm
            task={task}
            isLoading={isLoading}
            toggleIsEdit={toggleIsEdit}
            updateTask={updateTask}
            handleDeleteTask={handleDeleteTask}
          />
        ) : (
          <Flex
            align="center"
            gap="small"
            justify="space-between"
            style={{ width: "100%" }}
          >
            <Typography.Text className={`${task.isDone ? s.taskIsDone : ""}`}>
              {children}
            </Typography.Text>
            <Flex gap="small">
              <Button
                type="primary"
                onClick={handleEditTaskTitle}
                disabled={isLoading}
                size="small"
                icon={<EditFilled key="edit" />}
              ></Button>
              <Button
                color="danger"
                variant="solid"
                onClick={handleDeleteTask}
                disabled={isLoading}
                size="small"
                icon={<DeleteFilled key="delete" />}
              ></Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Card>
  );
};
