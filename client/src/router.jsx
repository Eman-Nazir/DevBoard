import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./components/layout/AuthLayout.jsx";
import DashboardLayout from "./components/layout/DashboardLayout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import MembersPage from "./pages/MembersPage.jsx";
import KanbanPage from "./pages/KanbanPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import InvitePage from "./pages/InvitePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AdminPage from "./pages/admin/AdminPage.jsx";

const NotFound = () => <NotFoundPage />;

const router = createBrowserRouter([
  // ── Public ───────────────────────────────────────────────────────────────────
  { path: "/", element: <LandingPage /> },
  { path: "/invite/:code", element: <InvitePage /> },

  // ── Auth ─────────────────────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },

  // ── Super Admin (standalone — no DashboardLayout) ─────────────────────────────
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  },

  // ── App (protected + DashboardLayout) ────────────────────────────────────────
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <DashboardPage />, handle: { title: "Dashboard" } },
      { path: "/workspace/:workspaceId", element: <ProjectPage />, handle: { title: "Projects" } },
      { path: "/workspace/:workspaceId/members", element: <MembersPage />, handle: { title: "Members" } },
      { path: "/workspace/:workspaceId/settings", element: <SettingsPage />, handle: { title: "Settings" } },
      {
        path: "/workspace/:workspaceId/project/:projectId/kanban",
        element: <KanbanPage />,
        handle: { title: "Kanban" },
      },
      {
        path: "/workspace/:workspaceId/project/:projectId/analytics",
        element: <AnalyticsPage />,
        handle: { title: "Analytics" },
      },
    ],
  },

  { path: "*", element: <NotFoundPage /> },
]);

export default router;