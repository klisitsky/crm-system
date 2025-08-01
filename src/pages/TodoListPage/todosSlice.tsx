import {
  createEntityAdapter,
  createSlice,
  type EntityState,
  type PayloadAction,
} from "@reduxjs/toolkit/react";
import type { FilterStatus, Todo, TodoId, TodoInfo } from "../../types/todos";

interface DomainModelTodoData {
  todoId: TodoId;
  data: { isDone?: boolean; title?: string };
}

type InitialTodosState = EntityState<Todo, number> & {
  todoInfo?: TodoInfo;
  isUpdateMode: boolean;
  filterStatus: FilterStatus;
};

const usersAdapter = createEntityAdapter<Todo>();
const initialTodosState: InitialTodosState = usersAdapter.getInitialState({
  todoInfo: {
    all: 0,
    inWork: 0,
    completed: 0,
  },
  isUpdateMode: true,
  filterStatus: "all",
});

export const todosSlice = createSlice({
  name: "todos",
  initialState: initialTodosState,
  reducers: {
    storeTodosData(state, action: PayloadAction<Todo[]>) {
      usersAdapter.setAll(state, action.payload);
    },
    storeTodosInfo(state, action: PayloadAction<TodoInfo>) {
      state.todoInfo = action.payload;
    },
    createTodo(state, action: PayloadAction<Todo>) {
      state.entities[action.payload.id] = action.payload;
      state.ids.push(action.payload.id);
    },
    updateTodo(state, action: PayloadAction<DomainModelTodoData>) {
      // проверить как работает без копирования тудухи, если просто прировнять опшинсы
      state.entities[action.payload.todoId] = {
        ...state.entities[action.payload.todoId],
        ...action.payload.data,
      };
    },
    deleteTodo(state, action: PayloadAction<TodoId>) {
      delete state.entities[action.payload];
      state.ids.filter((id) => id !== action.payload);
    },
    toggleUpdateMode(state, action: PayloadAction<boolean>) {
      state.isUpdateMode = action.payload
    },
    updateFilterStatus(state, action: PayloadAction<FilterStatus>) {
      state.filterStatus = action.payload
    }
  },
  selectors: {},
});