import { api, apiRequest } from "@/lib/axios";
import type { Subscription, PlanType } from "@/types";

export const subscriptionApi = {
  getMy: () => apiRequest<Subscription | null>(() => api.get("/subscriptions/me")),

  createCheckout: (planType: PlanType) =>
    apiRequest<{ url: string; sessionId: string }>(() =>
      api.post("/subscriptions/checkout", { planType })
    ),

  cancel: () => apiRequest<{ message: string }>(() => api.post("/subscriptions/cancel")),
};