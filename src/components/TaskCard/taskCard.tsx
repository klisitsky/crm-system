import React from "react";
import type { Task } from "../../api/tasksApi";
import { Checkbox } from "../ui/Checkbox/checkbox";
import { Input } from "../ui/Input/input";
import { Typography } from "../ui/Typography/typography";
import s from "./taskCard.module.scss";
import { TaskCardMenuButtons } from "./TaskCardMenuButtons/taskCardMenuButtons";
import { useTaskCards } from "./useTaskCards";

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
    <div className={s.container}>
      <div className={s.checkboxTitleContainer}>
        <Checkbox
          checked={task.isDone}
          disabled={isLoading}
          onChange={handleChangeTaskStatus}
          className={s.checkboxTaskStatus}
        />
        {isEdit ? (
          <Input
            disabled={isLoading}
            value={inputValue}
            onChange={handleChangeInputValue}
            errorMessage={errorMessage}
            className={s.input}
          />
        ) : (
          <Typography
            className={`${s.taskValue} ${task.isDone ? s.taskIsDone : ""}`}
          >
            {children}
          </Typography>
        )}
      </div>
      <TaskCardMenuButtons
        isEdit={isEdit}
        isLoading={isLoading}
        handleEditTaskTitle={handleEditTaskTitle}
        handleDeleteTask={handleDeleteTask}
        handleChangeTaskTitle={handleChangeTaskTitle}
        handleCancelChangedTitle={handleCancelChangedTitle}
      />
    </div>
  );
};
