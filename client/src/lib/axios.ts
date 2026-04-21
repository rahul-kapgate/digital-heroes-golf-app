import axios, { AxiosError } from "axios";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: env.API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ==========================================
// REQUEST INTERCEPTOR — attach JWT
// ==========================================
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// RESPONSE INTERCEPTOR — handle errors globally
// ==========================================
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; details?: unknown }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // 401 → logout
    if (status === 401) {
      useAuthStore.getState().logout();
      // Don't toast on /me or public routes
      if (!error.config?.url?.includes("/auth/me")) {
        toast.error("Session expired. Please login again.");
      }
    }

    // 403
    if (status === 403) {
      toast.error(message || "You don't have permission to do this");
    }

    // 5xx
    if (status && status >= 500) {
      toast.error("Something went wrong on our end. Please try again.");
    }

    return Promise.reject(error);
  }
);

// Type-safe wrapper to extract .data.data
export async function apiRequest<T>(
  request: () => Promise<{ data: { data: T } }>
): Promise<T> {
  const response = await request();
  return response.data.data;
}