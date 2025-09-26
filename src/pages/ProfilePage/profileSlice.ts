import { addAsyncBuilderCases, getAsyncDataStatus, initAsyncParticle } from "../../utils";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../redux";
import type { AsyncParticle, SliceThunk } from "../../utils";
import type { Profile } from "@/types/profile";
import type { PayloadAction } from "@reduxjs/toolkit";

export const initialStateData: Profile = {
  id: 0,
  username: "",
  email: "",
  date: "",
  isBlocked: false,
  roles: [],
  phoneNumber: "",
};

export const initialProfileState = initAsyncParticle<Profile>(initialStateData);

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialProfileState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    addAsyncBuilderCases<AsyncParticle<Profile>, Profile>(builder, fetchProfile);
  }
});

export const profileAsyncDataStatus = getAsyncDataStatus(initialProfileState);

export const fetchProfile: SliceThunk<Profile> = createAppAsyncThunk<Profile>(
  "profile/fetchProfile",
  async (_, { extra, dispatch, rejectWithValue }) => {
    try {
      dispatch(profileSlice.actions.setError(""));
      const res = await extra.profileApi.fetchProfile();
      return res;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);
