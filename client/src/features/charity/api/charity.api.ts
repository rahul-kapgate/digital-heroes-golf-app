import { api, apiRequest } from "@/lib/axios";
import type { Charity } from "@/types";

export const charityApi = {
  list: (params?: { search?: string; featured?: boolean }) =>
    apiRequest<Charity[]>(() =>
      api.get("/charities", {
        params: { search: params?.search, featured: params?.featured ? "true" : undefined },
      })
    ),

  getById: (id: string) => apiRequest<Charity>(() => api.get(`/charities/${id}`)),
};