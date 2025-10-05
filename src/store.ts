import { combineSlices, configureStore } from "@reduxjs/toolkit/react";
import { authApi } from "@/api/authApi";
import { authSlice } from "./slices/AuthSlice";
import { setupAxiosInterceptors } from "@/api/instanceApi";
import { profileApi } from "@/api/profileApi";
import { profileSlice } from "./slices/profileSlice";
import { usersApi } from "@/api/usersApi";

export const extraArgument = {
  authApi,
  profileApi,
  usersApi
};

const rootReducer = combineSlices({
  [authSlice.name]: authSlice.reducer,
  [profileSlice.name]: profileSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument } })
});

setupAxiosInterceptors(store.dispatch, store.getState);