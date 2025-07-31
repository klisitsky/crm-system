import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import { type Task } from "../../api/tasksApi";
import { getInputErrorMessage } from "../../utils/getInputErrorMessage";

export const useTaskCards = (
  task: Task,
  updateTask: (taskId: number, isDone: boolean, title: string) => void,
  deleteTask: (taskId: number) => void
) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(task.title);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChangeInputValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setErrorMessage("");
      setInputValue(e.currentTarget.value);
    },
    []
  );

  const handleChangeTaskStatus = useCallback(() => {
    updateTask(task.id, !task.isDone, task.title);
  }, [task]);

  const handleEditTaskTitle = useCallback(() => {
    setIsEdit((prev) => !prev);
  }, []);

  const handleDeleteTask = useCallback(() => {
    deleteTask(task.id);
  }, [task.id]);

  const handleChangeTaskTitle = useCallback(() => {
    const errorMessageValue = getInputErrorMessage(inputValue);

    if (!errorMessageValue) {
      updateTask(task.id, task.isDone, inputValue);
      setIsEdit((prev) => !prev);
      setErrorMessage("");
    } else {
      setErrorMessage(errorMessageValue);
    }
  }, [inputValue, task]);

  const handleCancelChangedTitle = useCallback(() => {
    setIsEdit((prev) => !prev);
    setInputValue(task.title);
    setErrorMessage("");
  }, [task.title]);

  return {
    isEdit,
    inputValue,
    errorMessage,
    handleChangeInputValue,
    handleChangeTaskStatus,
    handleEditTaskTitle,
    handleDeleteTask,
    handleChangeTaskTitle,
    handleCancelChangedTitle,
  };
};
