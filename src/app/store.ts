import { combineSlices, configureStore } from "@reduxjs/toolkit/react";
import { appSlice } from "./appSlice";
import { todosApi } from "@/api/todosApi";
import { authApi } from "@/api/authApi";
import { todosSlice } from "@/pages/TodoListPage/todosSlice";
import { authSlice } from "@/pages/AuthPage/AuthSlice";
import { setupAxiosInterceptors } from "@/api/instanceApi";
import { profileApi } from "@/api/profileApi";
import { profileSlice } from "@/pages/ProfilePage/profileSlice";


export const extraArgument = {
  todosApi,
  authApi,
  profileApi,
};

const rootReducer = combineSlices({
  [appSlice.name]: appSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [profileSlice.name]: profileSlice.reducer,
  [todosSlice.name]: todosSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument } })
});

setupAxiosInterceptors(store.dispatch, store.getState);