import api from "./api";

// Get LoggedIn User
export const getMe = () => {
    return api.get("/api/v1/users/me")
}

// Get online users
export const getOnlineUsers = (
    page: number = 1,
    limit: number = 6
) => {
    return api.get("/api/v1/users/online", {
        params: {
            page,
            limit,
        },
    });
};

// Get all users
export const getAllUsers = (
    page: number = 1,
    limit: number = 10
) => {
    return api.get("/api/v1/users", {
        params: {
            page,
            limit,
        },
    });
};

// Get user by ID
export const getUserById = (id: string) => {
    return api.get(`/api/v1/users/${id}`);
};