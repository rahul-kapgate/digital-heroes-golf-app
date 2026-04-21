import { api, apiRequest } from "@/lib/axios";
import type { DashboardData } from "@/types";

export const dashboardApi = {
  get: () => apiRequest<DashboardData>(() => api.get("/users/dashboard")),
};