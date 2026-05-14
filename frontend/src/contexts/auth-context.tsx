import { createContext } from "react";
import type { AuthUser } from "@/lib/api-auth";

export type User = AuthUser;

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
