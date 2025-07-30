import type { FilterStatus, MetaResponse, Todo, TodoInfo, TodoRequest } from "../types/todos";
import { instance } from "./instanceApi";

export const fetchTodos = (filterStatus?: FilterStatus) => {
    return instance
      .get<MetaResponse<Todo, TodoInfo>>(`/todos?filter=${filterStatus ?? "all"}`)
      .then((res) => res.data)
  }

export const createTodo = (title: string) => {
    const requestBody: TodoRequest = {
      isDone: false,
      title,
    }
    return instance
      .post<Todo>("/todos", requestBody)
      .then((res) => res)
  }

export const updateTodo = (id: number, isDone: boolean, title: string) => {
    const requestBody: TodoRequest = {
      isDone,
      title,
    }
    return instance
      .put<Todo>(`/todos/${id}`, requestBody)
      .then((res) => res.data)
  }

export const deleteTodo = (id: number) => {
    return instance
      .delete<Todo>(`/todos/${id}`)
      .then((res) => res.data)
  }

