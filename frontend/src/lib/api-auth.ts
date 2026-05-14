import axios from "axios";
import { api } from "@/lib/axios";

export type UserRole = "admin" | "manager" | "waiter" | "kitchen";

export type AuthUser = {
  _id: string;
  username: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginResponse = {
  _id: string;
  username: string;
  role: UserRole;
  token: string;
};

export async function loginRequest(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/auth/login", {
      username,
      password,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Login failed";
      throw new Error(message);
    }

    throw new Error("Unexpected error during login");
  }
}

export async function getCurrentUserRequest(): Promise<AuthUser> {
  try {
    const response = await api.get<AuthUser>("/auth/me");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Failed to load current user";
      throw new Error(message);
    }

    throw new Error("Unexpected error while loading current user");
  }
}
