import { api, apiRequest } from "@/lib/axios";
import type { Score } from "@/types";

export interface CreateScorePayload {
  score: number;
  playDate: string;
}

export const scoresApi = {
  list: () => apiRequest<Score[]>(() => api.get("/scores")),
  create: (payload: CreateScorePayload) =>
    apiRequest<Score>(() => api.post("/scores", payload)),
  update: (id: string, score: number) =>
    apiRequest<Score>(() => api.patch(`/scores/${id}`, { score })),
  delete: (id: string) => api.delete(`/scores/${id}`),
};