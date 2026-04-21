import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi, type SignupPayload, type LoginPayload } from "../api/auth.api";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

export function useSignup() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Account created successfully! 🎉");
      navigate("/dashboard");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || "Signup failed");
    },
  });
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success(`Welcome back, ${data.user.full_name}!`);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(err.response?.data?.message || "Invalid credentials");
    },
  });
}

export function useMe() {
  const { isAuthenticated, setUser } = useAuthStore();

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const user = await authApi.me();
      setUser(user);
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}