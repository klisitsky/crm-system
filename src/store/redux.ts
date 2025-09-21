import { createAsyncThunk } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { extraArgument, store } from "@/store/store";
import type { ThunkAction, UnknownAction } from "@reduxjs/toolkit";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<R = void> = ThunkAction<R, RootState, typeof extraArgument, UnknownAction>;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<typeof store>();
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  extra: typeof extraArgument;
  rejectValue: string | null;
}>();
