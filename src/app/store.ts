import { combineSlices, configureStore } from "@reduxjs/toolkit/react";
import { appSlice } from "./appSlice";
import { authApi } from "@/api/authApi";
import { authSlice } from "@/pages/AuthPage/AuthSlice";
import { setupAxiosInterceptors } from "@/api/instanceApi";
import { profileApi } from "@/api/profileApi";
import { profileSlice } from "@/pages/ProfilePage/profileSlice";
import { usersApi } from "@/api/usersApi";
import { usersSlice } from "@/pages/UsersPage/usersSlice";


export const extraArgument = {
  authApi,
  profileApi,
  usersApi
};

const rootReducer = combineSlices({
  [appSlice.name]: appSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [profileSlice.name]: profileSlice.reducer,
  [usersSlice.name]: usersSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: { extraArgument } })
});

setupAxiosInterceptors(store.dispatch, store.getState);