import { combineSlices, configureStore, type Reducer } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";

const rootReducer = combineSlices({
  todos: {} as Reducer,
})

export const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<typeof store>();