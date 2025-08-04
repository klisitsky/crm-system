import { combineSlices, configureStore } from "@reduxjs/toolkit/react";
import { todosApi } from "../api/todosApi";
import { todosSlice } from "../pages/TodoListPage/todosSlice";
import { appSlice } from "./appSlice";

export const extraArgument = {
  todosApi
};

const rootReducer = combineSlices({
  [todosSlice.name]: todosSlice.reducer,
  [appSlice.name]: appSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument } }),
});