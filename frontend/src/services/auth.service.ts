import api from "./api";
import type {
    RegisterCredentials,
    LoginCredentials,
    AuthResponse,
    RefreshResponse,
    AuthErrorResponse,
} from "../types/auth";
import type { AxiosResponse } from "axios";

// Register — FormData lives here so multer receives the file correctly
export const register = (
    credentials: RegisterCredentials
): Promise<AxiosResponse<AuthResponse>> => {
    const formData = new FormData();
    formData.append("name", credentials.name);
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);

    if (credentials.avatar) {
        formData.append("avatar", credentials.avatar);
    }

    return api.post<AuthResponse>("/api/v1/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// Login
export const login = (
    credentials: LoginCredentials
): Promise<AxiosResponse<AuthResponse>> => {
    return api.post<AuthResponse>("/api/v1/auth/login", credentials);
};

// Logout
export const logout = (): Promise<AxiosResponse<AuthErrorResponse>> => {
    return api.post("/api/v1/auth/logout");
};

// Refresh
export const refresh = (
    token: string
): Promise<AxiosResponse<RefreshResponse>> => {
    return api.post<RefreshResponse>(
        "/api/v1/auth/refresh",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
};