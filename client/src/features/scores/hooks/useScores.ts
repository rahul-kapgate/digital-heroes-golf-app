import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { scoresApi, type CreateScorePayload } from "../api/scores.api";
import { toast } from "sonner";
import { AxiosError } from "axios";

const KEY = ["scores"];

export function useScores() {
  return useQuery({ queryKey: KEY, queryFn: scoresApi.list });
}

export function useCreateScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateScorePayload) => scoresApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Score added!");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || "Failed to add score");
    },
  });
}

export function useUpdateScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, score }: { id: string; score: number }) => scoresApi.update(id, score),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Score updated");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update");
    },
  });
}

export function useDeleteScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => scoresApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Score deleted");
    },
    onError: () => toast.error("Failed to delete score"),
  });
}