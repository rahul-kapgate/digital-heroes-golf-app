import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi } from "../api/subscription.api";
import { toast } from "sonner";
import { AxiosError } from "axios";
import type { PlanType } from "@/types";

export function useMySubscription() {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: subscriptionApi.getMy,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (planType: PlanType) => subscriptionApi.createCheckout(planType),
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || "Checkout failed");
    },
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.cancel,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subscription"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Subscription cancelled at period end");
    },
    onError: () => toast.error("Failed to cancel subscription"),
  });
}