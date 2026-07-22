import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, ArrowLeft, LogOut } from "lucide-react";
import {
  useGetPlatformStats,
  useGetAllUsers,
  useGetAllWorkspaces,
  useGetAllProjects,
  useGetAdminLogs,
  useDeleteUser,
} from "../../hooks/useAdmin.js";
import useDebounce from "../../hooks/useDebounce.js";
import useAuthStore from "../../store/authStore.js";
import { useLogout } from "../../hooks/useAuth.js";

import OverviewTab from "../../components/admin/tabs/OverviewTab.jsx";
import UsersTab from "../../components/admin/tabs/UsersTab.jsx";
import WorkspacesTab from "../../components/admin/tabs/WorkspacesTab.jsx";
import ProjectsTab from "../../components/admin/tabs/ProjectsTab.jsx";
import LogsTab from "../../components/admin/tabs/LogsTab.jsx";
import TaskBreakdownModal from "../../components/admin/TaskBreakdownModal.jsx";

//  Page ─
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showTaskBreakdown, setShowTaskBreakdown] = useState(false);
  const { user } = useAuthStore();
  const { mutate: logout, isPending: loggingOut } = useLogout();

  const { data: statsData } = useGetPlatformStats();
  const {
    data: usersData, isLoading: usersLoading,
    page: usersPage, setPage: setUsersPage,
    search, setSearch,
  } = useGetAllUsers();
  const {
    data: wsData, isLoading: wsLoading,
    page: wsPage, setPage: setWsPage,
  } = useGetAllWorkspaces();
  const {
    data: projData, isLoading: projLoading,
    page: projPage, setPage: setProjPage,
  } = useGetAllProjects();
  const {
    data: logsData, isLoading: logsLoading,
    page: logsPage, setPage: setLogsPage,
  } = useGetAdminLogs();
  const { mutate: deleteUser, isPending: deleting } = useDeleteUser();

  // Debounced search value is available if you want to switch the users
  // query to use it directly instead of the raw `search` state.
  useDebounce(search, 400);

  const stats = statsData?.stats;
  const userGrowth = statsData?.userGrowth || [];

  const handleDeleteUser = (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    deleteUser(userId);
  };

  const handleLogout = () => {
    if (!window.confirm("Log out of the admin dashboard?")) return;
    logout();
  };

  // Short labels for narrow screens, full labels for larger ones
  const TABS = [
    { id: "overview", label: "Overview", short: "Overview" },
    {
      id: "users",
      label: `Users${stats ? ` (${stats.totalUsers})` : ""}`,
      short: "Users",
    },
    {
      id: "workspaces",
      label: `Workspaces${stats ? ` (${stats.totalWorkspaces})` : ""}`,
      short: "Spaces",
    },
    {
      id: "projects",
      label: `Projects${stats ? ` (${stats.totalProjects})` : ""}`,
      short: "Projects",
    },
    { id: "logs", label: "Logs", short: "Logs" },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/*  Top navbar  */}
      <nav className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <div className="w-7 h-7 shrink-0 bg-violet-600 rounded-md flex items-center justify-center">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm truncate">
              DevBoard
            </span>
            <span className="hidden xs:inline text-gray-700">/</span>
            <div className="hidden xs:flex items-center gap-1.5 text-violet-400 text-sm font-medium truncate">
              <ShieldCheck size={14} className="shrink-0" />
              <span className="hidden sm:inline">Super Admin</span>
              <span className="sm:hidden">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors shrink-0"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>

            <div
              title={user?.name}
              className="hidden sm:flex w-7 h-7 rounded-full bg-violet-600 items-center justify-center text-white text-xs font-semibold shrink-0"
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Log out"
              className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50 shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/*  Page header ─ */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Platform-wide overview and management
          </p>
        </motion.div>

        {/*  Tabs  */}
        <div className="flex gap-0.5 sm:gap-1 mb-6 sm:mb-8 border-b border-gray-800 overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-violet-500 text-violet-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className="sm:hidden">{tab.short}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/*  Active tab content ─ */}
        <div className="overflow-x-hidden">
          {activeTab === "overview" && (
            <OverviewTab
              stats={stats}
              userGrowth={userGrowth}
              setActiveTab={setActiveTab}
              setShowTaskBreakdown={setShowTaskBreakdown}
            />
          )}

          {activeTab === "users" && (
            <UsersTab
              usersData={usersData}
              usersLoading={usersLoading}
              usersPage={usersPage}
              setUsersPage={setUsersPage}
              search={search}
              setSearch={setSearch}
              handleDeleteUser={handleDeleteUser}
              deleting={deleting}
            />
          )}

          {activeTab === "workspaces" && (
            <WorkspacesTab
              wsData={wsData}
              wsLoading={wsLoading}
              wsPage={wsPage}
              setWsPage={setWsPage}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsTab
              projData={projData}
              projLoading={projLoading}
              projPage={projPage}
              setProjPage={setProjPage}
            />
          )}

          {activeTab === "logs" && (
            <LogsTab
              logsData={logsData}
              logsLoading={logsLoading}
              logsPage={logsPage}
              setLogsPage={setLogsPage}
            />
          )}
        </div>
      </div>

      {/*  Task breakdown modal ─ */}
      <AnimatePresence>
        {showTaskBreakdown && (
          <TaskBreakdownModal
            onClose={() => setShowTaskBreakdown(false)}
            stats={stats}
            tasksByPriority={statsData?.tasksByPriority}
            tasksByColumn={statsData?.tasksByColumn}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;