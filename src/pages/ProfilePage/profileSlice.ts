import { appSlice } from "@/app/appSlice";
import { createAppAsyncThunk } from "@/app/redux";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { createSlice } from "@reduxjs/toolkit";
import type { LoadingStatus } from "@/types/common";
import type { Profile } from "@/types/profile";

export interface InitialProfileState {
  data: Profile;
  fetchProfileStatus: LoadingStatus;
}

export const initialProfileState: InitialProfileState = {
  data: { id: 0, username: "", email: "", date: "", isBlocked: false, roles: [], phoneNumber: "" },
  fetchProfileStatus: "idle",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialProfileState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state) => {
      state.fetchProfileStatus = "pending";
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.data = action.payload;
      state.fetchProfileStatus = "succeed";
    });
    builder.addCase(fetchProfile.rejected, (state) => {
      state.fetchProfileStatus = "failed";
    });
  },
  selectors: {
    selectProfileData: (state) => state.data,
  },
});

export const fetchProfile = createAppAsyncThunk(
  "profile/fetchProfile",
  async (_, { extra, dispatch, rejectWithValue }) => {
    try {
      dispatch(appSlice.actions.setError(""));
      const res = await extra.profileApi.fetchProfile();
      return res;
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);
