import { api, apiRequest } from "@/lib/axios";
import type { AuthResponse, User } from "@/types";

export interface SignupPayload {
  email: string;
  password: string;
  fullName: string;
  selectedCharityId: string;
  charityPercentage: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  signup: (payload: SignupPayload) =>
    apiRequest<AuthResponse>(() => api.post("/auth/signup", payload)),

  login: (payload: LoginPayload) =>
    apiRequest<AuthResponse>(() => api.post("/auth/login", payload)),

  logout: () => api.post("/auth/logout"),

  me: () => apiRequest<User>(() => api.get("/auth/me")),
};