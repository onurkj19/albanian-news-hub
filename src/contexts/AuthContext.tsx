import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { api } from "@/services/api";
import type { User, AuthState } from "@/types";

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "alnn-auth";

function getStoredAuth(): AuthState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.token && parsed.user) {
        return {
          user: parsed.user as User,
          token: parsed.token,
          isAuthenticated: true,
          isLoading: false,
        };
      }
    }
  } catch { /* corrupt data */ }
  return { user: null, token: null, isAuthenticated: false, isLoading: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    ...getStoredAuth(),
    isLoading: true,
  }));

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored.isAuthenticated) {
      api.auth.profile()
        .then((res) => {
          if (res.data) {
            const user = res.data as unknown as User;
            setState({ user, token: stored.token, isAuthenticated: true, isLoading: false });
          } else {
            localStorage.removeItem(STORAGE_KEY);
            setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
          }
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_KEY);
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        });
    } else {
      setState({ ...stored, isLoading: false });
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.data) {
        const { token, user: userData } = res.data;
        const user: User = {
          id: String(userData.id),
          name: userData.name,
          email: userData.email,
          role: userData.role as "admin" | "editor" | "viewer",
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
        setState({ user, token, isAuthenticated: true, isLoading: false });
        return true;
      }
    } catch { /* login failed */ }
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
