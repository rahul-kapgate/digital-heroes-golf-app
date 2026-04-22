import { api, apiRequest } from "@/lib/axios";
import type { Winner } from "@/types";

export const winnersApi = {
  getMy: () => apiRequest<Winner[]>(() => api.get("/winners/me")),
  getById: (id: string) => apiRequest<Winner>(() => api.get(`/winners/${id}`)),

  uploadProof: (id: string, file: File) => {
    const formData = new FormData();
    formData.append("proof", file);
    return apiRequest<Winner>(() =>
      api.post(`/winners/${id}/proof`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },

  // Admin
  listAll: (status?: string) =>
    apiRequest<Winner[]>(() => api.get("/winners", { params: { status } })),
  verify: (id: string, action: "approve" | "reject", adminNotes?: string) =>
    apiRequest<Winner>(() => api.post(`/winners/${id}/verify`, { action, adminNotes })),
  markPaid: (id: string) => apiRequest<Winner>(() => api.post(`/winners/${id}/mark-paid`)),
};