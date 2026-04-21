import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { authApi } from "@/features/auth/api/auth.api";

// Validates token on app start — logs out if invalid
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setUser, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    authApi.me()
      .then((user) => setUser(user))
      .catch(() => logout());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}