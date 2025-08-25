import { combineSlices, configureStore } from "@reduxjs/toolkit/react";
import { appSlice } from "./appSlice";
import { todosApi } from "@/api/todosApi";
import { authApi } from "@/api/authApi";
import { todosSlice } from "@/pages/TodoListPage/todosSlice";
import { authSlice } from "@/pages/AuthPage/AuthSlice";
import { setupAxiosInterceptors } from "@/api/instanceApi";


export const extraArgument = {
  todosApi,
  authApi,
};

const rootReducer = combineSlices({
  [todosSlice.name]: todosSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [appSlice.name]: appSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument } })
});

setupAxiosInterceptors(store.dispatch, store.getState);