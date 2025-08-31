import { appSlice } from "@/app/appSlice";
import { createAppAsyncThunk } from "@/app/redux";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { isEqualTwoArrays } from "@/utils/isEqualTwoArrays";
import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import type { EntityState } from "@reduxjs/toolkit";
import type { User, UserFilters, UserRolesRequest } from "@/types/users";
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
  updateUserIsBlockedStatus: LoadingStatus;
  updateUserRightsStatus: LoadingStatus;
};

const usersAdapter = createEntityAdapter<User>();
const initialUsersState: InitialUsersState = usersAdapter.getInitialState({
  meta: {
    totalAmount: 0,
    sortBy: "",
    sortOrder: "asc",
  },
  fetchUsersStatus: "idle",
  updateUserIsBlockedStatus: "idle",
  updateUserRightsStatus: "idle",
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
    builder.addCase(updateUserIsBlockedStatus.pending, (state) => {
      state.updateUserIsBlockedStatus = "pending";
    });
    builder.addCase(updateUserIsBlockedStatus.fulfilled, (state) => {
      state.updateUserIsBlockedStatus = "succeed";
    });
    builder.addCase(updateUserIsBlockedStatus.rejected, (state) => {
      state.updateUserIsBlockedStatus = "failed";
    });
    builder.addCase(updateUserRights.pending, (state) => {
      state.updateUserIsBlockedStatus = "pending";
    });
    builder.addCase(updateUserRights.fulfilled, (state) => {
      state.updateUserIsBlockedStatus = "succeed";
    });
    builder.addCase(updateUserRights.rejected, (state) => {
      state.updateUserIsBlockedStatus = "failed";
    });
    
  },
  selectors: {
    selectUsersDataWithKey: createSelector(
      [(state: InitialUsersState) => state.entities, (state: InitialUsersState) => state.ids],
      (entities, ids) => ids.map((id) => ({ ...entities[id], key: id }))
    ),
    selectIsFetchUsersPending: (state) => state.fetchUsersStatus === "pending",
    updateUserIsBlockedStatusPending: (state) => state.updateUserIsBlockedStatus === "pending",
    updateUserRightsPending: (state) => state.updateUserRightsStatus === "pending",
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

export const updateUserData = createAppAsyncThunk(
  "users/updateUserData",
  async (arg: DomainModelUser, { extra, getState, dispatch, rejectWithValue }) => {
    try {
      dispatch(appSlice.actions.setError(""));
      const currentUser = getState().users.entities[arg.userId];

      await extra.usersApi.updateUserData(arg.userId, {
        username: arg.username ?? currentUser.username,
        email: arg.email ?? currentUser.email,
        phoneNumber: arg.phoneNumber ?? currentUser.phoneNumber,
      });
      await dispatch(fetchUsers({}));
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);

export const deleteUser = createAppAsyncThunk(
  "users/deleteUser",
  async (userId: number, { extra, dispatch, rejectWithValue }) => {
    try {
      dispatch(appSlice.actions.setError(""));
      await extra.usersApi.deleteUser(userId);
      await dispatch(fetchUsers({}));
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);

export const updateUserIsBlockedStatus = createAppAsyncThunk(
  "users/updateIsBlockedStatus",
  async (
    { id, isBlocked }: { id: number; isBlocked: boolean },
    { extra, dispatch, rejectWithValue }
  ) => {
    try {
      dispatch(appSlice.actions.setError(""));
      const res = isBlocked
        ? await extra.usersApi.blockUser(id)
        : await extra.usersApi.unblockUser(id);
      await dispatch(fetchUsers({}));

      return res.isBlocked;
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);

export const updateUserRights = createAppAsyncThunk(
  "users/updateUserRights",
  async (arg: { id: number; params: UserRolesRequest }, { extra, dispatch, rejectWithValue }) => {
    try {
      dispatch(appSlice.actions.setError(""));
      const res = await extra.usersApi.updateUserRights(arg.id, arg.params);
      await dispatch(fetchUsers({}));

      return res.roles;
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);
