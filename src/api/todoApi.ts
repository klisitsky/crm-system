import type {
  FilterStatus,
  MetaResponse,
  Todo,
  TodoInfo,
  TodoRequest,
} from "../types/todos";
import { instance } from "./instanceApi";

export const fetchTodos = async (filterStatus?: FilterStatus) => {
  return instance
    .get<
      MetaResponse<Todo, TodoInfo>
    >("/todos", { params: { filter: `${filterStatus ?? "all"}` } })
    .then((res) => res.data);
};

export const createTodo = async (title: string) => {
  const requestBody: TodoRequest = {
    isDone: false,
    title,
  };
  return instance.post<Todo>("/todos", requestBody).then((res) => res);
};

export const updateTodo = async (id: number, isDone: boolean, title: string) => {
  const requestBody: TodoRequest = {
    isDone,
    title,
  };
  return instance
    .put<Todo>(`/todos/${id}`, requestBody)
    .then((res) => res.data);
};

export const deleteTodo = async (id: number) => {
  return instance.delete<Todo>(`/todos/${id}`).then((res) => res.data);
};
