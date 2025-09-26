import axios from "axios";
import { authApi } from "@/api/authApi";
import { API_URL } from "@/api/instanceApi";
import { REFRESH_TOKEN } from "@/components/constants/localStorageValues";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../redux";
import { addAsyncBuilderCases, getAsyncDataStatus, initAsyncParticle } from "../../utils";
import type { AsyncParticle, SliceThunk } from "../../utils";
import type { AuthData, Token, UserRegistration } from "@/types/auth";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface InitialStateData {
  isAuthorization: boolean;
  accessToken: string;
  isNewUserCreated: boolean;
  loginError: string;
  signUpError: string;
}

const initialStateData: InitialStateData = {
  isAuthorization: false,
  accessToken: "",
  isNewUserCreated: false,
  loginError: "",
  signUpError: "",
};

const initialAuthState = initAsyncParticle<InitialStateData>(initialStateData);

export const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setLoginError: (state, action: PayloadAction<string>) => {
      state.data.loginError = action.payload;
    },
    setSignUpError: (state, action: PayloadAction<string>) => {
      state.data.signUpError = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    toggleIsUserNewCreated: (state) => {
      state.data.isNewUserCreated = false;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.data.accessToken = action.payload;
    },
    setIsAuthorizationFalse: (state) => {
      state.data.isAuthorization = false;
    },
  },
  extraReducers: (builder) => {
    addAsyncBuilderCases<AsyncParticle<InitialStateData>, InitialStateData, AuthData>(
      builder,
      loginUser
    );
    addAsyncBuilderCases<AsyncParticle<InitialStateData>, InitialStateData>(builder, checkAuth);
    addAsyncBuilderCases<AsyncParticle<InitialStateData>, InitialStateData, UserRegistration>(
      builder,
      signUpUser
    );
    addAsyncBuilderCases<AsyncParticle<InitialStateData>, InitialStateData>(builder, logOutUser);
  },
});

export const authAsyncDataStatus = getAsyncDataStatus(initialAuthState);

export const loginUser: SliceThunk<InitialStateData, AuthData> = createAppAsyncThunk<
  InitialStateData,
  AuthData
>("auth/login", async (arg, { extra, dispatch, rejectWithValue, getState }) => {
  try {
    dispatch(authSlice.actions.setLoginError(""));

    const authStateData = getState().auth.data;
    const res = await extra.authApi.login(arg);
    localStorage.setItem(REFRESH_TOKEN, res.refreshToken);

    return { ...authStateData, accessToken: res.accessToken, isAuthorization: true };
  } catch (err) {
    dispatch(authSlice.actions.setLoginError(getErrorMessage(err)));
    return rejectWithValue(null);
  }
});

export const signUpUser: SliceThunk<InitialStateData, UserRegistration> = createAppAsyncThunk<
  InitialStateData,
  UserRegistration
>("auth/signup", async (arg, { extra, dispatch, rejectWithValue, getState }) => {
  try {
    dispatch(authSlice.actions.setSignUpError(""));
    const authStateData = getState().auth.data;
    await extra.authApi.signUp(arg);

    return { ...authStateData, isNewUserCreated: true };
  } catch (err) {
    dispatch(authSlice.actions.setSignUpError(getErrorMessage(err)));
    return rejectWithValue(null);
  }
});

export const checkAuth: SliceThunk<InitialStateData> = createAppAsyncThunk<InitialStateData>(
  "auth/refresh",
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(authSlice.actions.setError(""));
      const authStateData = getState().auth.data;
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      const res = await axios.post<Token>(`${API_URL}/auth/refresh`, { refreshToken });
      localStorage.setItem(REFRESH_TOKEN, res.data.refreshToken);

      return { ...authStateData, accessToken: res.data.accessToken, isAuthorization: true };
    } catch (err) {
      dispatch(authSlice.actions.setAccessToken(""));
      dispatch(authSlice.actions.setIsAuthorizationFalse());
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

export const logOutUser: SliceThunk<InitialStateData> = createAppAsyncThunk<InitialStateData>(
  "auth/logout",
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      dispatch(authSlice.actions.setError(""));
      const authStateData = getState().auth.data;

      await authApi.logout();
      localStorage.removeItem(REFRESH_TOKEN);

      return { ...authStateData, accessToken: "", isAuthorization: false };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);
