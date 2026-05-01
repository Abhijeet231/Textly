import api from "./api";

// Get LoggedIn User
export const getMe = () => {
    return api.get("/api/v1/users/me")
}