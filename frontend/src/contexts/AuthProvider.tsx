import React, { useCallback, useEffect, useState } from "react";
import { getCurrentUserRequest, loginRequest } from "@/lib/api-auth";
import { AuthContext, AuthContextType, User } from "./auth-context";

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

type JwtPayload = {
  exp?: number;
};

const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  const payload = decodeJwt(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const persistSession = useCallback((nextToken: string, nextUser: User) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (!storedToken) {
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      if (isTokenExpired(storedToken)) {
        logout();
        if (mounted) {
          setLoading(false);
        }
        return;
      }

      setToken(storedToken);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser) as User);
        } catch {
          localStorage.removeItem(USER_KEY);
        }
      }

      try {
        const currentUser = await getCurrentUserRequest();

        if (mounted) {
          setUser(currentUser);
          localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        }
      } catch (error) {
        console.error("Failed to restore auth session:", error);
        if (mounted) {
          logout();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      mounted = false;
    };
  }, [logout]);

  const login = async (username: string, password: string) => {
    const data = await loginRequest(username, password);

    persistSession(data.token, {
      _id: data._id,
      username: data.username,
      role: data.role,
    });
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: Boolean(token),
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
