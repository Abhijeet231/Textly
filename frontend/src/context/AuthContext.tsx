import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import {
  login as loginService,
  logout as logoutService,
} from "../services/auth.service";

import { getMe } from "../services/user.service";
import { toast } from "react-toastify";
import type { AuthUser, LoginCredentials } from "../types/auth";

// ── Types ──────────────────────────────────────────────────────
type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextType {
  user: AuthUser | null;
  status: AuthStatus;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// ── Context ────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ───────────────────────────────────────────────────
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Check existing session on mount
  const checkAuth = useCallback(async () => {
    try {
      setStatus("loading");
      const res = await getMe();
      setUser(res.data.data);
      setStatus("authenticated");
    } catch {
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const res = await loginService(credentials);

      // narrowing the tyep
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      setUser(res.data.user); // matches your backend response shape
      setStatus("authenticated");
    } catch (error: unknown) {
      toast.error("Login Error");
      throw error; // let the form handle it if needed
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await logoutService();
    } finally {
      // always clear local state even if API call fails
      setUser(null);
      setStatus("unauthenticated");
      toast.success("Logged out successfully.");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthContextProvider");
  }
  return context;
};
