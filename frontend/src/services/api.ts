import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { refresh } from "./auth.service";

// Extend the config type once, cleanly
interface RetryableRequest extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

let isRefreshing = false;

// REQUEST INTERCEPTOR TO ADD ACCESS TOKEN
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});


// RESPONSE INTERCEPTOR FOR TOKEN REFRESH
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {

        const originalRequest = error.config as RetryableRequest | undefined;

        // Guard against missing config
        if (!originalRequest) return Promise.reject(error);

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const token = localStorage.getItem("refreshToken");
                if (!token) throw new Error("No refresh token");

                const res = await refresh(token);

                // Narrow the union — only proceed if newAccessToken exists
                if (!("newAccessToken" in res.data)) {
                    throw new Error("Refresh failed");
                }

                const newAccessToken = res.data.newAccessToken;

                localStorage.setItem("accessToken", newAccessToken);

                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/auth/login";
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;