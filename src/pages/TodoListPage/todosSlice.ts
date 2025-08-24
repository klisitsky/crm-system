import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit/react";
import { createAppAsyncThunk } from "../../app/redux";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { appSlice } from "../../app/appSlice";
import type { LoadingStatus } from "../../types/common";
import type { FilterStatus, Todo, TodoId, TodoInfo } from "../../types/todos";
import type { EntityState, PayloadAction } from "@reduxjs/toolkit/react";

interface DomainModelTodoData {
  todoId: TodoId;
  isDone?: boolean;
  title?: string;
}

type InitialTodosState = EntityState<Todo, number> & {
  todoInfo: TodoInfo;
  isUpdatingTodosMode: boolean;
  filterStatus: FilterStatus;
  fetchTodosStatus: LoadingStatus;
  createTodoStatus: LoadingStatus;
  updateTodoStatus: LoadingStatus;
  deleteTodoStatus: LoadingStatus;
};

const todosAdapter = createEntityAdapter<Todo>();
const initialTodosState: InitialTodosState = todosAdapter.getInitialState({
  todoInfo: {
    all: 0,
    inWork: 0,
    completed: 0,
  },
  isUpdatingTodosMode: true,
  filterStatus: "all",
  fetchTodosStatus: "idle",
  createTodoStatus: "idle",
  updateTodoStatus: "idle",
  deleteTodoStatus: "idle",
  error: "",
});

export const todosSlice = createSlice({
  name: "todos",
  initialState: initialTodosState,
  reducers: {
    toggleUpdatingTodosMode(state, action: PayloadAction<boolean>) {
      state.isUpdatingTodosMode = action.payload;
    },
    updateFilterStatus(state, action: PayloadAction<FilterStatus>) {
      state.filterStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state) => {
      state.fetchTodosStatus = "pending";
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      todosAdapter.setAll(state, action.payload.data);
      state.todoInfo = action.payload.info ?? {
        all: 0,
        inWork: 0,
        completed: 0,
      };
      state.fetchTodosStatus = "succeed";
    });
    builder.addCase(fetchTodos.rejected, (state) => {
      state.fetchTodosStatus = "failed";
    });
    builder.addCase(createTodo.pending, (state) => {
      state.createTodoStatus = "pending";
    });
    builder.addCase(createTodo.fulfilled, (state) => {
      state.createTodoStatus = "succeed";
    });
    builder.addCase(createTodo.rejected, (state) => {
      state.createTodoStatus = "failed";
    });
    builder.addCase(updateTodo.pending, (state) => {
      state.updateTodoStatus = "pending";
    });
    builder.addCase(updateTodo.fulfilled, (state) => {
      state.updateTodoStatus = "succeed";
    });
    builder.addCase(updateTodo.rejected, (state) => {
      state.updateTodoStatus = "failed";
    });
    builder.addCase(deleteTodo.pending, (state) => {
      state.deleteTodoStatus = "pending";
    });
    builder.addCase(deleteTodo.fulfilled, (state) => {
      state.deleteTodoStatus = "succeed";
    });
    builder.addCase(deleteTodo.rejected, (state) => {
      state.deleteTodoStatus = "failed";
    });
  },
  selectors: {
    selectTodosData: createSelector(
      [(state: InitialTodosState) => state.entities, (state: InitialTodosState) => state.ids],
      (entities, ids) => ids.map((id) => entities[id])
    ),
    selectTodosInfo: (state) => state.todoInfo,
    selectFilterStatus: (state) => state.filterStatus,
    selectUpdatingTodosMode: (state) => state.isUpdatingTodosMode,
    selectIsFetchTodosPending: (state) => state.fetchTodosStatus === "pending",
    selectIsCreateTodoPending: (state) => state.createTodoStatus === "pending",
    selectIsUpdateTodoPending: (state) => state.updateTodoStatus === "pending",
    selectIsDeleteTodoPending: (state) => state.deleteTodoStatus === "pending",
  },
});

export const fetchTodos = createAppAsyncThunk(
  "todos/fetchTodos",
  async (
    arg: { filterStatus?: FilterStatus } = {},
    { extra, getState, dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(appSlice.actions.setError(""));
      return await extra.todosApi.fetchTodos(arg.filterStatus ?? getState().todos.filterStatus);
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);

export const createTodo = createAppAsyncThunk(
  "todos/createTodo",
  async (title: string, { dispatch, extra, rejectWithValue }) => {
    try {
      dispatch(appSlice.actions.setError(""));
      await extra.todosApi.createTodo(title);
      await dispatch(fetchTodos({}));
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);

export const updateTodo = createAppAsyncThunk(
  "todos/updateTodo",
  async (arg: DomainModelTodoData, { extra, getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(appSlice.actions.setError(""));
      const currentTodo = getState().todos.entities[arg.todoId];

      await extra.todosApi.updateTodo(
        arg.todoId,
        arg.isDone ?? currentTodo.isDone,
        arg.title ?? currentTodo.title
      );
      await dispatch(fetchTodos({}));
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);

export const deleteTodo = createAppAsyncThunk(
  "todos/deleteTodo",
  async (todoId: number, { extra, rejectWithValue, dispatch }) => {
    try {
      dispatch(appSlice.actions.setError(""));
      await extra.todosApi.deleteTodo(todoId);
      await dispatch(fetchTodos({}));
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);
