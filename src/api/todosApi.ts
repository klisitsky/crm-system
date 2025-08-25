import { instance } from "./instanceApi";
import type { FilterStatus, MetaResponse, Todo, TodoInfo, TodoRequest } from "@/types/todos";

export const todosApi = {
  fetchTodos: async (filterStatus?: FilterStatus) => {
    return instance
      .get<
        MetaResponse<Todo, TodoInfo>
      >("/todos", { params: { filter: `${filterStatus ?? "all"}` } })
      .then((res) => res.data);
  },
  createTodo: async (title: string) => {
    const requestBody: TodoRequest = {
      isDone: false,
      title,
    };
    return instance.post<Todo>("/todos", requestBody).then((res) => res);
  },
  updateTodo: async (id: number, todoRequestBody: TodoRequest) => {
    return instance.put<Todo>(`/todos/${id}`, todoRequestBody).then((res) => res.data);
  },
  deleteTodo: async (id: number) => {
    return instance.delete<Todo>(`/todos/${id}`).then((res) => res.data);
  },
};
