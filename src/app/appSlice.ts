import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface InitialAppState {
  error: string;
}

const initialAppState: InitialAppState = {
  error: "",
};

export const appSlice = createSlice({
  name: "app",
  initialState: initialAppState,
  reducers: {
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
  selectors: {
    selectError: (state) => state.error,
  },
});
