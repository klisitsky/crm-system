import { appSlice } from "@/app/appSlice";
import { createAppAsyncThunk } from "@/app/redux";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { isEqualTwoArrays } from "@/utils/isEqualTwoArrays";
import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";
import type { User, UserFilters } from "@/types/users";
import type { LoadingStatus } from "@/types/common";

export interface DomainModelUser {
  userId: number;
  username?: string;
  email?: string;
  phoneNumber?: string;
}

export type InitialUsersState = EntityState<User, number> & {
  meta: {
    totalAmount: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
  fetchUsersStatus: LoadingStatus;
};

const usersAdapter = createEntityAdapter<User>();
const initialUsersState: InitialUsersState = usersAdapter.getInitialState({
  meta: {
    totalAmount: 0,
    sortBy: "",
    sortOrder: "asc",
  },
  fetchUsersStatus: "idle",
});

export const usersSlice = createSlice({
  name: "users",
  initialState: initialUsersState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.fetchUsersStatus = "pending";
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      if (
        !isEqualTwoArrays(
          state.ids.map((id) => state.entities[id]),
          action.payload.data
        )
      ) {
        usersAdapter.setAll(state, action.payload.data);
      }
      state.fetchUsersStatus = "succeed";
    });
    builder.addCase(fetchUsers.rejected, (state) => {
      state.fetchUsersStatus = "failed";
    });
  },
  selectors: {
    selectUsersDataWithKey: createSelector(
      [(state: InitialUsersState) => state.entities, (state: InitialUsersState) => state.ids],
      (entities, ids) => ids.map((id) => ({ ...entities[id], key: id }))
    ),
    selectIsFetchUsersPending: (state) => state.fetchUsersStatus === "pending",
  },
});

export const fetchUsers = createAppAsyncThunk(
  "todos/fetchTodos",
  async (arg: UserFilters = {}, { extra, dispatch, rejectWithValue }) => {
    try {
      dispatch(appSlice.actions.setError(""));
      return await extra.usersApi.fetchUsers(arg);
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);
