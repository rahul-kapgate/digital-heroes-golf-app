import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { queryClient } from "@/lib/queryClient";

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          style: { borderRadius: "0.75rem" },
        }}
      />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}