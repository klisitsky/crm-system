import memoize from "memoize";
import type { LoadingStatus } from "@/types/common";
import type { ActionReducerMapBuilder, AsyncThunk } from "@reduxjs/toolkit";
import type { AppDispatch, RootState } from "./redux";
import type { extraArgument } from "./store";

export interface AsyncParticle<T> {
  data: T;
  error: string | null;
  errorCounter: number;
  status: LoadingStatus;
}

export type SliceThunk<Returned, ThunkArg = void> = AsyncThunk<
  Returned,
  ThunkArg,
  {
    state: RootState;
    dispatch: AppDispatch;
    extra: typeof extraArgument;
    rejectValue: string | null;
  }
>;

export interface AsyncDataStatus {
  isFailed: boolean;
  isIdle: boolean;
  isPending: boolean;
  isPendingOrIdle: boolean;
  isSucced: boolean;
  isPendingOrFailed: boolean;
}

export const initAsyncParticle = <T>(data: T): AsyncParticle<T> => ({
  data,
  error: null,
  errorCounter: 0,
  status: "idle",
});

export const addAsyncBuilderCases = <
  SliceState extends AsyncParticle<unknown>,
  Returned,
  ThunkArg = void,
>(
  builder: ActionReducerMapBuilder<SliceState>,
  sliceMethod: SliceThunk<Returned, ThunkArg>
) => {
  builder.addCase(sliceMethod.pending, (state) => {
    state.status = "pending";
  });
  builder.addCase(sliceMethod.fulfilled, (state, action) => {
    state.status = "succeed";
    state.errorCounter = 0;
    state.data = action.payload;
  });
  builder.addCase(sliceMethod.rejected, (state, action) => {
    state.error = action.payload ?? "";
    state.errorCounter = (state.errorCounter ?? 0) + 1;
    state.status = "failed";
  });
};

export const getAsyncDataStatus = memoize(
  (data: AsyncParticle<unknown>): AsyncDataStatus => ({
    isFailed: data?.status === "failed",
    isIdle: data?.status === "idle",
    isPending: data?.status === "pending",
    isPendingOrIdle: data?.status === "pending" || data?.status === "idle",
    isSucced: data?.status === "succeed",
    isPendingOrFailed: data?.status === "succeed" || data?.status === "failed",
  })
);

export const getAsyncRequestData = memoize(
  <T>(
    stateParam: AsyncParticle<T>
  ): {
    data: T | undefined;
    error: string | null | undefined;
    errorCounter: number | undefined;
    status: AsyncDataStatus;
  } => ({
    ...stateParam,
    status: getAsyncDataStatus(stateParam),
  })
);
