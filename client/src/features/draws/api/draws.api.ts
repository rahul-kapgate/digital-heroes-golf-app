import { api, apiRequest } from "@/lib/axios";
import type { Draw } from "@/types";

export const drawsApi = {
  getLatest: () => apiRequest<Draw | null>(() => api.get("/draws/latest")),
  getById: (id: string) => apiRequest<Draw>(() => api.get(`/draws/${id}`)),

  // Admin
  listAll: (status?: string) =>
    apiRequest<Draw[]>(() => api.get("/draws", { params: { status } })),
  run: (payload: { drawMonth: string; drawType: "random" | "algorithmic"; simulateOnly: boolean }) =>
    apiRequest<any>(() => api.post("/draws/run", payload)),
  publish: (id: string) => apiRequest<Draw>(() => api.post(`/draws/${id}/publish`)),
  delete: (id: string) => api.delete(`/draws/${id}`),
};