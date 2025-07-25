import { useCallback, useEffect, useState } from "react";
import { TasksApi } from "../../api/tasksApi";
import type { Task, TasksData } from "../../api/tasksApi";
import { notification } from "antd";

export type LoadingStatus = "idle" | "pending" | "succeed" | "failed";
export type FilterStatus = "all" | "completed" | "inWork";

export const useTodolist = () => {
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
  const [api, contextHolder] = notification.useNotification();

  if (appError) api["error"]({ message: appError, placement: "bottomLeft" });
  const isLoading = loadingStatus === "pending";

  const addNewTask = useCallback((newTitle: string) => {
    setLoadingStatus(() => "pending");
    setAppError("");
    TasksApi.createTask(newTitle).then(() => {
      TasksApi.getTasks().then((res) => {
        setTasksData(() => res);
        setLoadingStatus(() => "succeed");
      });
    });
  }, []);

  const filterTasksByStatus = useCallback((filterStatus: FilterStatus) => {
    setLoadingStatus(() => "pending");
    setAppError("");
    TasksApi.getTasks()
      .then((res) => {
        const filterStatuses: Record<string, Task[]> = {
          completed: res.data.filter((task) => task.isDone),
          inWork: res.data.filter((task) => !task.isDone),
        };
        setTasksData(() => ({
          ...res,
          data: filterStatuses[filterStatus] ?? res.data,
        }));
        setLoadingStatus(() => "succeed");
        setfilterStatus(filterStatus);
      })
      .catch((err) => {
        setAppError(err.message);
        setLoadingStatus(() => "failed");
      });
  }, [tasksData]);

  const updateTask = useCallback(
    (taskId: number, isDone: boolean, title: string) => {
      setLoadingStatus(() => "pending");
      setAppError("");
      TasksApi.updateTask(taskId, isDone, title)
        .then(() => {
          TasksApi.getTasks().then((res) => {
            setTasksData(() => res);
            setLoadingStatus(() => "succeed");
          });
        })
        .catch((err) => {
          setAppError(err.message);
          setLoadingStatus(() => "failed");
        });
    },
    []
  );

  const deleteTask = useCallback((taskId: number) => {
    setLoadingStatus(() => "pending");
    setAppError("");
    TasksApi.deleteTask(taskId)
      .then(() => {
        TasksApi.getTasks().then((res) => {
          setTasksData(() => res);
          setLoadingStatus(() => "succeed");
        });
      })
      .catch((err) => {
        setAppError(err.message);
        setLoadingStatus(() => "failed");
      });
  }, []);

  useEffect(() => {
    setLoadingStatus(() => "pending");
    setAppError("");
    TasksApi.getTasks()
      .then((res) => {
        setLoadingStatus(() => "succeed");
        setTasksData(() => res);
      })
      .catch((err) => {
        setAppError(err.message);
        setLoadingStatus(() => "failed");
      });
  }, []);

  return {
    isLoading,
    filterStatus,
    tasksData,
    appError,
    contextHolder,
    filterTasksByStatus,
    addNewTask,
    updateTask,
    deleteTask,
  };
};
