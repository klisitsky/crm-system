import { useCallback, useEffect, useState } from "react";
import { TasksApi } from "../../api/tasksApi";
import type { TasksData } from "../../api/tasksApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export type LoadingStatus = "idle" | "pending" | "succeed" | "failed";
export type FilterStatus = "all" | "completed" | "inWork";

export const useTodolistPage = () => {
  const initialState: TasksData = {
    data: [],
    info: {
      all: null,
      inWork: null,
      completed: null,
    },
    meta: { totalAmount: null },
  };
  const [tasksData, setTasksData] = useState<TasksData>(initialState);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("idle");
  const [appError, setAppError] = useState<string>("");
  const [filterStatus, setfilterStatus] = useState<FilterStatus>("all");

  const isLoading = loadingStatus === "pending";
  
  const fetchTasksByFilter = useCallback(
    async (filterStatus?: FilterStatus) => {
      setLoadingStatus(() => "pending");
      setAppError(() => "");
      try {
        const tasksData = await TasksApi.fetchTasks({ filterStatus });
        setTasksData(() => tasksData);
        setLoadingStatus(() => "succeed");
        setfilterStatus(filterStatus ?? "all");
      } catch (err) {
        setAppError(() => getErrorMessage(err));
        setLoadingStatus(() => "failed");
      }
    },
    []
  );

  const addNewTask = useCallback(
    async (newTitle: string) => {
      setLoadingStatus(() => "pending");
      setAppError(() => "");
      try {
        await TasksApi.createTask(newTitle);
        const tasksData = await TasksApi.fetchTasks({ filterStatus });
        setTasksData(() => tasksData);
        setLoadingStatus(() => "succeed");
      } catch (err) {
        setAppError(() => getErrorMessage(err));
        setLoadingStatus(() => "failed");
      }
    },
    [filterStatus]
  );

  const updateTask = useCallback(
    async (taskId: number, isDone: boolean, title: string) => {
      setLoadingStatus(() => "pending");
      setAppError(() => "");
      try {
        await TasksApi.updateTask(taskId, isDone, title);
        const tasksData = await TasksApi.fetchTasks({ filterStatus });
        setTasksData(() => tasksData);
        setLoadingStatus(() => "succeed");
      } catch (err) {
        setAppError(() => getErrorMessage(err));
        setLoadingStatus(() => "failed");
      }
    },
    [filterStatus]
  );

  const deleteTask = useCallback(
    async (taskId: number) => {
      setLoadingStatus(() => "pending");
      setAppError(() => "");
      try {
        await TasksApi.deleteTask(taskId);
        const tasksData = await TasksApi.fetchTasks({ filterStatus });
        setTasksData(() => tasksData);
        setLoadingStatus(() => "succeed");
      } catch (err) {
        setAppError(() => getErrorMessage(err));
        setLoadingStatus(() => "failed");
      }
    },
    [filterStatus]
  );

  useEffect(() => {
    fetchTasksByFilter();
  }, [fetchTasksByFilter]);

  return {
    isLoading,
    filterStatus,
    tasksData,
    appError,
    fetchTasksByFilter,
    addNewTask,
    updateTask,
    deleteTask,
  };
};
