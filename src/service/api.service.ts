import axios from "axios";
import config from "@/config";
import { clearAccessToken, clearSession, clearUser, getAccessToken } from "@/utils/auth.utils";
import router from "@/router";

const BASE_URL = config.apiURL!;

const API = axios.create({
  baseURL: `${BASE_URL}/api/v1/`,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    // Cek endpoint login dan refresh dengan tepat
    const isAuthEndpoint = originalRequest?.url?.startsWith("/api/v1/auth/login") ||
                           originalRequest?.url?.startsWith("/api/v1/auth/refresh");

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
        clearAccessToken(); // hapus accessToken dari localStorage
        clearUser(); // hapus user dari localStorage
        clearSession()
        router.push("/auth/login"); // redirect login
    }

    return Promise.reject(err);
  }
);

export default API;