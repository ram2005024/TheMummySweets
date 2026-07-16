import axios from "axios";
import { get_access_token } from "./token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = get_access_token();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
