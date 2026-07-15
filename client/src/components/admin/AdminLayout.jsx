import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard, Users, Building2,
  FolderKanban, ArrowLeft, ShieldCheck,
  BarChart2, Settings,
} from "lucide-react";
import { cn } from "../../utils/cn.js";
import useAuthStore from "../../store/authStore.js";

const NAV_ITEMS = [
  { to: "/admin", label: "Overview", icon: BarChart2, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/workspaces", label: "Workspaces", icon: Building2 },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
];

const AdminLayout = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-56 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="px-4 h-14 flex items-center gap-2.5 border-b border-gray-800">
          <div className="w-7 h-7 bg-violet-600 rounded-md flex items-center justify-center flex-shrink-0">
            <LayoutDashboard size={14} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">DevBoard</p>
            <p className="text-violet-400 text-xs flex items-center gap-1 mt-0.5">
              <ShieldCheck size={10} /> Super Admin
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-violet-600/20 text-violet-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )
              }
            >
              <Icon size={15} className="flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + back link */}
        <div className="border-t border-gray-800 p-3 space-y-2">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.name}</p>
              <p className="text-gray-600 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Back to App
          </Link>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-6 flex-shrink-0">
          <h1 className="text-white font-medium text-sm">Admin Panel</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;