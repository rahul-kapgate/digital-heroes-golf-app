import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import { PublicLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

// Public pages
import { LandingPage } from "@/features/landing/pages/LandingPage";
import { CharitiesPage } from "@/features/charity/pages/CharitiesPage";
import { CharityDetailPage } from "@/features/charity/pages/CharityDetailPage";
import { PricingPage } from "@/features/subscription/pages/PricingPage";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { SignupPage } from "@/features/auth/pages/SignupPage";

// User pages
import { DashboardHome } from "@/features/dashboard/pages/DashboardHome";
import { ScoresPage } from "@/features/scores/pages/ScoresPage";
import { DrawsPage } from "@/features/draws/pages/DrawsPage";
import { WinningsPage } from "@/features/winners/pages/WinningsPage";
import { SubscriptionPage } from "@/features/subscription/pages/SubscriptionPage";

// Admin pages
import { AdminDashboardPage } from "@/features/admin/pages/AdminDashboardPage";
import { AdminUsersPage } from "@/features/admin/pages/AdminUsersPage";
import { AdminDrawsPage } from "@/features/admin/pages/AdminDrawsPage";
import { AdminWinnersPage } from "@/features/admin/pages/AdminWinnersPage";

export const router = createBrowserRouter([
  // Auth pages (no layout)
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },

  // Public routes
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/charities", element: <CharitiesPage /> },
      { path: "/charities/:id", element: <CharityDetailPage /> },
      { path: "/pricing", element: <PricingPage /> },
      { path: "/how-it-works", element: <LandingPage /> }, // scroll target
    ],
  },

  // Authenticated user dashboard
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <DashboardHome /> },
      { path: "/dashboard/scores", element: <ScoresPage /> },
      { path: "/dashboard/draws", element: <DrawsPage /> },
      { path: "/dashboard/winnings", element: <WinningsPage /> },
      { path: "/dashboard/subscription", element: <SubscriptionPage /> },
      { path: "/dashboard/charity", element: <Navigate to="/charities" replace /> },
    ],
  },

  // Admin panel
  {
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/admin", element: <AdminDashboardPage /> },
      { path: "/admin/users", element: <AdminUsersPage /> },
      { path: "/admin/draws", element: <AdminDrawsPage /> },
      { path: "/admin/winners", element: <AdminWinnersPage /> },
      { path: "/admin/charities", element: <CharitiesPage /> },
    ],
  },

  // 404
  { path: "*", element: <Navigate to="/" replace /> },
]);