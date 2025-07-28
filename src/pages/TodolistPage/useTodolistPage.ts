import { useCallback, useEffect, useState } from "react";
import { TasksApi } from "../../api/tasksApi";
import type { TasksData } from "../../api/tasksApi";

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
  
  const fetchTasks = async () => {
    const tasksData = await TasksApi.fetchTasks();
    setTasksData(() => tasksData);
    setLoadingStatus(() => "succeed");
  };

  const addNewTask = useCallback(async (newTitle: string) => {
    setLoadingStatus(() => "pending");
    setAppError(() => "");
    try {
      await TasksApi.createTask(newTitle);
      await fetchTasks();
    } catch (err) {
      if (err instanceof Error) setAppError(err.message);
      setLoadingStatus(() => "failed");
    }
  }, []);

  const filterTasksByStatus = useCallback(
    async (filterStatus: FilterStatus) => {
      setLoadingStatus(() => "pending");
      setAppError(() => "");
      try {
        const filteredTasksData = await TasksApi.fetchTasks({ filterStatus });
        setTasksData(() => filteredTasksData);
        setfilterStatus(filterStatus);
        setLoadingStatus(() => "succeed");
      } catch (err) {
        if (err instanceof Error) setAppError(err.message);
        setLoadingStatus(() => "failed");
      }
    },
    []
  );

  const updateTask = useCallback(
    async (taskId: number, isDone: boolean, title: string) => {
      setLoadingStatus(() => "pending");
      setAppError(() => "");
      try {
        await TasksApi.updateTask(taskId, isDone, title);
        await fetchTasks();
      } catch (err) {
        if (err instanceof Error) setAppError(err.message);
        setLoadingStatus(() => "failed");
      }
    },
    []
  );

  const deleteTask = useCallback(async (taskId: number) => {
    setLoadingStatus(() => "pending");
    setAppError(() => "");
    try {
      await TasksApi.deleteTask(taskId);
      await fetchTasks();
    } catch (err) {
      if (err instanceof Error) setAppError(err.message);
      setLoadingStatus(() => "failed");
    }
  }, []);

  useEffect(() => {
    setLoadingStatus(() => "pending");
    setAppError(() => "");
    (async () => {
      try {
        await fetchTasks();
      } catch (err) {
        if (err instanceof Error) setAppError(err.message);
        setLoadingStatus(() => "failed");
      }
    })();
  }, []);

  return {
    isLoading,
    filterStatus,
    tasksData,
    appError,
    filterTasksByStatus,
    addNewTask,
    updateTask,
    deleteTask,
  };
};
