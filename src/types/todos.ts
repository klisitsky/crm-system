export type FilterStatus = "all" | "completed" | "inWork";
export type TodoId = number;

export interface TodoRequest {
  title?: string;
  isDone?: boolean;
}

export interface Todo {
  id: TodoId;
  title: string;
  isDone: boolean;
  created: string;
}

export interface TodoInfo {
  all: number;
  completed: number;
  inWork: number;
}

export interface MetaResponse<T, N> {
  data: T[];
  info?: N;
  meta: {
    totalAmount: number;
  };
}
