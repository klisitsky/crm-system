export type FilterStatus = "all" | "completed" | "inWork";

export interface TodoRequest {
  title?: string;
  isDone?: boolean;
}

export interface Todo {
  created: string;
  id: number;
  isDone: boolean;
  title: string;
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
