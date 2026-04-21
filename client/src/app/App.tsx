import { RouterProvider } from "react-router-dom";
import { Providers } from "./providers";
import { router } from "./router";
import { AuthBootstrap } from "./AuthBootstrap";

export function App() {
  return (
    <Providers>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
    </Providers>
  );
}