import type { FilterStatus } from "../features/Todolist/useTodolist";
import { instance } from "./instanceApi";

export class TasksApi {
  static fetchTasks(options?: FetchTasksOptions) {
    return instance
      .get<ResponseFetchTasks>(`todos?filter=${options?.filterStatus ?? "all"}`)
      .then((res) => res.data)
  }

  static createTask(title: string) {
    return instance
      .post<ResponceCreateTask>("todos", {
        isDone: false,
        title,
      })
      .then((res) => res.data)
  }

  static updateTask(id: number, isDone: boolean, title: string) {
    return instance
      .put<ResponceChangeTask>(`todos/${id}`, {
        isDone,
        title,
      })
      .then((res) => res.data)
  }

  static deleteTask(id: number) {
    return instance
      .delete<string>(`todos/${id}`)
      .then((res) => res.data)
  }
}

//types

interface FetchTasksOptions {
  filterStatus?: FilterStatus;
}

export interface Task {
  created: string;
  id: number;
  isDone: boolean;
  title: string;
}

export interface TasksInfoAmount {
  all: number | null;
  completed: number | null;
  inWork: number | null;
}

interface ResponseFetchTasks {
  data: Task[];
  info: TasksInfoAmount;
  meta: {
    totalAmount: number | null;
  };
}
export type TasksData = ResponseFetchTasks;
type ResponceCreateTask = Task;
type ResponceChangeTask = Pick<Task, "isDone" | "title">;
