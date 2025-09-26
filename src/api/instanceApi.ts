import { REFRESH_TOKEN } from "@/components/constants/localStorageValues";
import { authSlice } from "@/pages/AuthPage/AuthSlice";
import axios, { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { AppDispatch, RootState } from "../redux";
import type { Token } from "@/types/auth";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
}

export const API_URL = "https://easydev.club/api/v1";

export const instance = axios.create({
  baseURL: API_URL,
});

export const setupAxiosInterceptors = (dispatch: AppDispatch, getState: () => RootState) => {
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    config.headers.Authorization = `Bearer ${getState().auth.data.accessToken}`;
    return config;
  });

  instance.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (error: AxiosError) => {
      const originalRequest: CustomInternalAxiosRequestConfig | undefined = error.config;
      if (error.status === 401 && originalRequest && !originalRequest._isRetry) {
        originalRequest._isRetry = true;
        try {
          const refreshToken = localStorage.getItem(REFRESH_TOKEN);
          const res = await axios.post<Token>(`${API_URL}/auth/refresh`, { refreshToken });

          localStorage.setItem(REFRESH_TOKEN, res.data.refreshToken);
          dispatch(authSlice.actions.setAccessToken(res.data.accessToken));

          return instance.request(originalRequest);
        } catch (err) {
          localStorage.removeItem(REFRESH_TOKEN);
        }
      }
      localStorage.removeItem(REFRESH_TOKEN);
      throw error;
    }
  );
};
