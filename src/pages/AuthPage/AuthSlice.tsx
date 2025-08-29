import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createAppAsyncThunk } from "@/app/redux";
import { REFRESH_TOKEN } from "@/components/constants/localStorageValues";
import { appSlice } from "@/app/appSlice";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { API_URL } from "@/api/instanceApi";
import type { LoadingStatus } from "@/types/common";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthData, Token, UserRegistration } from "@/types/auth";
import { authApi } from "@/api/authApi";

export interface InitialAuthState {
  accessToken: string;
  loginStatus: LoadingStatus;
  signUpStatus: LoadingStatus;
  refreshTokenStatus: LoadingStatus;
  logOutStatus: LoadingStatus;
  userNewCreated: boolean;
  loginError: string;
  signUpError: string;
}

const initialAuthState: InitialAuthState = {
  accessToken: "",
  loginStatus: "idle",
  signUpStatus: "idle",
  refreshTokenStatus: "idle",
  logOutStatus: "idle",
  userNewCreated: false,
  loginError: "",
  signUpError: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setLoginError: (state, action: PayloadAction<string>) => {
      state.loginError = action.payload;
    },
    setSignUpError: (state, action: PayloadAction<string>) => {
      state.signUpError = action.payload;
    },
    toggleIsUserNewCreated: (state) => {
      state.userNewCreated = false;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loginStatus = "pending";
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loginStatus = "succeed";
      state.accessToken = action.payload;
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.loginStatus = "failed";
    });
    builder.addCase(checkAuth.pending, (state) => {
      state.refreshTokenStatus = "pending";
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.refreshTokenStatus = "succeed";
      state.accessToken = action.payload;
    });
    builder.addCase(checkAuth.rejected, (state) => {
      state.refreshTokenStatus = "failed";
    });
    builder.addCase(signUpUser.pending, (state) => {
      state.signUpStatus = "pending";
    });
    builder.addCase(signUpUser.fulfilled, (state) => {
      state.signUpStatus = "succeed";
      state.userNewCreated = true;
    });
    builder.addCase(signUpUser.rejected, (state) => {
      state.signUpStatus = "failed";
    });
    builder.addCase(logOutUser.fulfilled, (state) => {
      state.signUpStatus = "succeed";
      state.accessToken = "";
    });
    builder.addCase(logOutUser.pending, (state) => {
      state.signUpStatus = "pending";
    });
    builder.addCase(logOutUser.rejected, (state) => {
      state.signUpStatus = "failed";
    });
  },
  selectors: {
    selectAccessToken: (state) => state.accessToken,
    selectIsLoginStatusPending: (state) => state.loginStatus === "pending",
    selectIsSignUpStatusPending: (state) => state.signUpStatus === "pending",
    selectIsRefreshTokenStatusPending: (state) => state.refreshTokenStatus === "pending",
    selectIsLogOutStatusPending: (state) => state.logOutStatus === "pending",
    selectIsNewUserCreated: (state) => state.userNewCreated,
    selectLoginError: (state) => state.loginError,
    selectSignUpError: (state) => state.signUpError,
  },
});

export const loginUser = createAppAsyncThunk(
  "auth/login",
  async (arg: AuthData, { extra, dispatch, rejectWithValue }) => {
    try {
      dispatch(authSlice.actions.setLoginError(""));
      const res = await extra.authApi.login(arg);
      localStorage.setItem(REFRESH_TOKEN, res.refreshToken);

      return res.accessToken;
    } catch (err) {
      dispatch(authSlice.actions.setLoginError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);

export const signUpUser = createAppAsyncThunk(
  "auth/signup",
  async (arg: UserRegistration, { extra, dispatch, rejectWithValue }) => {
    try {
      dispatch(authSlice.actions.setSignUpError(""));
      const res = await extra.authApi.signUp(arg);
      return res;
    } catch (err) {
      dispatch(authSlice.actions.setSignUpError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);

export const checkAuth = createAppAsyncThunk(
  "auth/refresh",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(appSlice.actions.setError(""));
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      const res = await axios.post<Token>(`${API_URL}/auth/refresh`, { refreshToken });
      localStorage.setItem(REFRESH_TOKEN, res.data.refreshToken);

      return res.data.accessToken;
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);

export const logOutUser = createAppAsyncThunk(
  "auth/logout",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(appSlice.actions.setError(""));
      await authApi.logout();
      localStorage.removeItem(REFRESH_TOKEN);
    } catch (err) {
      dispatch(appSlice.actions.setError(getErrorMessage(err)));
      return rejectWithValue(null);
    }
  }
);
