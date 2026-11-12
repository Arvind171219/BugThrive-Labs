import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { ApiError, apiRequest, setUnauthorizedHandler } from "@/lib/api";
import type { AuthResponse, AuthUser, LoginInput, RegisterInput } from "./types";

const STORAGE_KEY = "bugthrive-labs:auth";

type Status = "loading" | "authenticated" | "anonymous";

interface Session {
  token: string;
  user: AuthUser;
}

interface AuthContextValue {
  status: Status;
  user: AuthUser | null;
  token: string | null;
  login: (input: LoginInput) => Promise<AuthUser>;
  register: (input: RegisterInput) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Reads the `exp` claim (seconds) from a JWT without verifying it — the server does that. */
function tokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function isExpired(token: string) {
  const exp = tokenExpiry(token);
  return exp !== null && exp <= Date.now();
}

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Session;
    return session.token && !isExpired(session.token) ? session : null;
  } catch {
    return null;
  }
}

function saveSession(session: Session | null) {
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage unavailable — session lasts for this tab only.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(loadSession);
  const [status, setStatus] = useState<Status>(() => (loadSession() ? "loading" : "anonymous"));

  const applySession = useCallback((next: Session | null) => {
    saveSession(next);
    setSession(next);
    setStatus(next ? "authenticated" : "anonymous");
  }, []);

  const logout = useCallback(() => applySession(null), [applySession]);

  // Any authenticated request that returns 401 ends the session.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // On startup, confirm the stored token is still valid and refresh the user profile.
  useEffect(() => {
    const stored = loadSession();
    if (!stored) return;
    const controller = new AbortController();
    apiRequest<AuthUser>("/api/v1/auth/me", { token: stored.token, signal: controller.signal })
      .then((user) => applySession({ token: stored.token, user }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Server unreachable: keep the stored session; protected API calls will re-validate it.
        if (err instanceof ApiError && err.status === 0) applySession(stored);
        else applySession(null);
      });
    return () => controller.abort();
  }, [applySession]);

  // Sign out automatically when the token expires.
  useEffect(() => {
    if (!session) return;
    const exp = tokenExpiry(session.token);
    if (exp === null) return;
    const timer = window.setTimeout(logout, Math.min(Math.max(exp - Date.now(), 0), 2 ** 31 - 1));
    return () => window.clearTimeout(timer);
  }, [session, logout]);

  const login = useCallback(
    async (input: LoginInput) => {
      const res = await apiRequest<AuthResponse>("/api/v1/auth/login", { method: "POST", body: input });
      applySession({ token: res.accessToken, user: res.user });
      return res.user;
    },
    [applySession],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const res = await apiRequest<AuthResponse>("/api/v1/auth/register", { method: "POST", body: input });
      applySession({ token: res.accessToken, user: res.user });
      return res.user;
    },
    [applySession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ status, user: session?.user ?? null, token: session?.token ?? null, login, register, logout }),
    [status, session, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
