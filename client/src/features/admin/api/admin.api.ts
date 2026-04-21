import { api, apiRequest } from "@/lib/axios";
import type { AdminAnalytics, AdminUser } from "@/types";

export const adminApi = {
  getAnalytics: () => apiRequest<AdminAnalytics>(() => api.get("/admin/analytics")),

  listUsers: (params?: { search?: string; role?: string }) =>
    apiRequest<AdminUser[]>(() => api.get("/admin/users", { params })),

  getUser: (id: string) =>
    apiRequest<AdminUser>(() => api.get(`/admin/users/${id}`)),

  updateUser: (id: string, payload: { fullName?: string; role?: "user" | "admin" }) =>
    apiRequest<AdminUser>(() => api.patch(`/admin/users/${id}`, payload)),
};