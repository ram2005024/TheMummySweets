import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { authStore } from "../store/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

let is_refreshing = false;
let refresh: Promise<string>;

export const publicAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = authStore.getState().access;
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original_request = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || original_request._retry) {
      return Promise.reject(error);
    }
    original_request._retry = true; // this request has already tried refresh once

    if (!is_refreshing) {
      is_refreshing = true;
      refresh = api
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        )
        .then((res) => {
          const new_token: string = res.data?.data?.access;
          authStore.getState().setAccess(new_token);
          return new_token;
        })
        .catch((refreshError) => {
          // refresh already tried and failed — logout and send to login
          authStore.getState().clear();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          throw refreshError;
        })
        .finally(() => (is_refreshing = false));
    }

    try {
      const newToken = await refresh;
      if (newToken && original_request.headers) {
        original_request.headers.Authorization = `Bearer ${newToken}`;
      }
      return api(original_request);
    } catch (err) {
      return Promise.reject(err);
    }
  },
);

export default api;

export const serverapi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

serverapi.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const responseData = error.response?.data as
      | { message?: string }
      | undefined;
    const message = responseData?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);
