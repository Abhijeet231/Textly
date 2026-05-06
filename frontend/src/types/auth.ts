// ── Credentials ──────────────────────────────────────────────

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    avatar?: File; // optional file upload (multipart)
}

export interface LoginCredentials {
    email: string;
    password: string;
}

// ── Shared shapes ─────────────────────────────────────────────

export interface Avatar {
    url: string;
    public_id: string;
}

export interface AuthUser {
    _id: string;
    name: string;
    email: string;
    avatar?: Avatar | Record<string, never>; // {} when no avatar uploaded
    isOnline: boolean;
    lastSeen?: string ;   // add
    createdAt?: string;
}

// ── Responses ─────────────────────────────────────────────────

export interface AuthSuccessResponse {
    success: true;
    message: string;
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

export interface RefreshSuccessResponse {
    success: true;
    message: string;
    newAccessToken: string;       // matches your controller key exactly
}

export interface AuthErrorResponse {
    success: false;
    message: string;
}

// Unions — use these as the actual return types
export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;
export type RefreshResponse = RefreshSuccessResponse | AuthErrorResponse;