import { useCallback, useState } from "react";
import { type Task } from "../../api/tasksApi";

export const useTaskCards = (
  task: Task,
  updateTask: (taskId: number, isDone: boolean, title: string) => void,
  deleteTask: (taskId: number) => void
) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const toggleIsEdit = () => {
    setIsEdit(prev => !prev)
  }
  const handleChangeTaskStatus = useCallback(() => {
    updateTask(task.id, !task.isDone, task.title);
  }, [task]);

  const handleEditTaskTitle = useCallback(() => {
    setIsEdit((prev) => !prev);
  }, []);

  const handleDeleteTask = useCallback(() => {
    deleteTask(task.id);
  }, [task.id]);

  return {
    isEdit,
    toggleIsEdit,
    handleChangeTaskStatus,
    handleEditTaskTitle,
    handleDeleteTask
  };
};
