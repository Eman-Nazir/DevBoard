import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, Building2, FolderKanban, CheckSquare,
  TrendingUp, Search, Trash2, ArrowLeft,
  LayoutDashboard, ShieldCheck, UserX,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import {
  useGetPlatformStats,
  useGetAllUsers,
  useGetAllWorkspaces,
  useDeleteUser,
} from "../../hooks/useAdmin.js";
import useDebounce from "../../hooks/useDebounce.js";
import { timeAgo } from "../../utils/formatDate.js";

// ── Stat card ──────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-gray-900 border border-gray-800 rounded-xl p-5"
  >
    <div className="flex items-center justify-between mb-4">
      <p className="text-gray-500 text-xs font-medium">{label}</p>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={15} />
      </div>
    </div>
    <p className="text-white text-3xl font-bold mb-1">{value ?? "—"}</p>
    {sub && <p className="text-gray-600 text-xs">{sub}</p>}
  </motion.div>
);

// ── Section header ─────────────────────────────────────────────────────────────
const SectionHeader = ({ title, count }) => (
  <div className="flex items-center gap-3 mb-4">
    <h2 className="text-white font-semibold text-base">{title}</h2>
    {count !== undefined && (
      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
        {count}
      </span>
    )}
  </div>
);

// ── Page ───────────────────────────────────────────────────────────────────────
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: statsData, isLoading: statsLoading } = useGetPlatformStats();
  const {
    data: usersData, isLoading: usersLoading,
    page: usersPage, setPage: setUsersPage,
    search, setSearch,
  } = useGetAllUsers();
  const {
    data: wsData, isLoading: wsLoading,
    page: wsPage, setPage: setWsPage,
  } = useGetAllWorkspaces();
  const { mutate: deleteUser, isPending: deleting } = useDeleteUser();

  const debouncedSearch = useDebounce(search, 400);

  const stats = statsData?.stats;
  const userGrowth = statsData?.userGrowth || [];

  const handleDeleteUser = (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    deleteUser(userId);
  };

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "users", label: `Users${stats ? ` (${stats.totalUsers})` : ""}` },
    { id: "workspaces", label: `Workspaces${stats ? ` (${stats.totalWorkspaces})` : ""}` },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* ── Top navbar ──────────────────────────────────────────────────────── */}
      <nav className="border-b border-gray-800 bg-gray-950 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-violet-600 rounded-md flex items-center justify-center">
              <LayoutDashboard size={14} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm">DevBoard</span>
            <span className="text-gray-700">/</span>
            <div className="flex items-center gap-1.5 text-violet-400 text-sm font-medium">
              <ShieldCheck size={14} />
              Super Admin
            </div>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ── Page header ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">Platform-wide overview and management</p>
        </motion.div>

        {/* ── Tabs ──────────────────────────────────────────────────────────── */}
        <div className="flex gap-1 mb-8 border-b border-gray-800">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-violet-500 text-violet-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview tab ──────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Users" value={stats?.totalUsers} sub={`+${stats?.newUsersThisWeek || 0} this week`} color="text-blue-400 bg-blue-400/10" delay={0} />
              <StatCard icon={Building2} label="Total Workspaces" value={stats?.totalWorkspaces} sub={`${stats?.activeWorkspaces || 0} active this month`} color="text-violet-400 bg-violet-400/10" delay={0.06} />
              <StatCard icon={FolderKanban} label="Total Projects" value={stats?.totalProjects} color="text-amber-400 bg-amber-400/10" delay={0.12} />
              <StatCard icon={CheckSquare} label="Tasks Completed" value={stats?.completedTasks} sub={`${stats?.completionRate || 0}% completion rate`} color="text-green-400 bg-green-400/10" delay={0.18} />
            </div>

            {/* Second stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon={TrendingUp} label="Total Tasks" value={stats?.totalTasks} color="text-teal-400 bg-teal-400/10" delay={0.22} />
              <StatCard icon={Users} label="New Users (30d)" value={stats?.newUsersThisMonth} color="text-pink-400 bg-pink-400/10" delay={0.26} />
              <StatCard icon={Building2} label="New Workspaces (30d)" value={stats?.activeWorkspaces} color="text-orange-400 bg-orange-400/10" delay={0.3} />
            </div>

            {/* User growth chart */}
            {userGrowth.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6"
              >
                <h3 className="text-white font-medium text-sm mb-6">
                  User registrations — last 14 days
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={userGrowth.map((d) => ({
                    date: format(parseISO(d._id), "MMM d"),
                    users: d.count,
                  }))}>
                    <defs>
                      <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", fontSize: "12px" }}
                      labelStyle={{ color: "#9ca3af" }}
                      itemStyle={{ color: "#7c3aed" }}
                    />
                    <Area type="monotone" dataKey="users" name="New users" stroke="#7c3aed" strokeWidth={2} fill="url(#userGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        )}

        {/* ── Users tab ─────────────────────────────────────────────────────── */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <SectionHeader title="All Users" count={usersData?.pagination?.totalCount} />
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setUsersPage(1); }}
                  placeholder="Search by name or email..."
                  className="bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500 w-72 transition"
                />
              </div>
            </div>

            {usersLoading ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-4">User</div>
                    <div className="col-span-3">Email</div>
                    <div className="col-span-2 text-center">Workspaces</div>
                    <div className="col-span-2">Joined</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>

                  {/* Table rows */}
                  {usersData?.users?.map((user, i) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-800 last:border-0 items-center hover:bg-gray-800/30 transition-colors"
                    >
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden flex-shrink-0">
                          {user.avatar
                            ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            : user.name?.[0]?.toUpperCase()
                          }
                        </div>
                        <span className="text-white text-sm font-medium truncate">{user.name}</span>
                      </div>
                      <div className="col-span-3 text-gray-400 text-sm truncate">{user.email}</div>
                      <div className="col-span-2 text-center">
                        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
                          {user.workspaceCount}
                        </span>
                      </div>
                      <div className="col-span-2 text-gray-500 text-xs">{timeAgo(user.createdAt)}</div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          disabled={deleting}
                          className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          title="Delete user"
                        >
                          <UserX size={14} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {usersData?.users?.length === 0 && (
                    <div className="py-12 text-center text-gray-600 text-sm">
                      No users found
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {usersData?.pagination?.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-gray-500 text-xs">
                      Page {usersPage} of {usersData.pagination.totalPages} · {usersData.pagination.totalCount} users
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                        disabled={usersPage === 1}
                        className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 rounded-lg transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setUsersPage((p) => p + 1)}
                        disabled={!usersData?.pagination?.hasMore}
                        className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 rounded-lg transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Workspaces tab ────────────────────────────────────────────────── */}
        {activeTab === "workspaces" && (
          <div>
            <SectionHeader title="All Workspaces" count={wsData?.pagination?.totalCount} />

            {wsLoading ? (
              <div className="space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-800/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-800 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-4">Workspace</div>
                    <div className="col-span-3">Owner</div>
                    <div className="col-span-2 text-center">Members</div>
                    <div className="col-span-2 text-center">Projects</div>
                    <div className="col-span-1">Created</div>
                  </div>

                  {wsData?.workspaces?.map((ws, i) => (
                    <motion.div
                      key={ws._id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-800 last:border-0 items-center hover:bg-gray-800/30 transition-colors"
                    >
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400 text-sm font-bold flex-shrink-0">
                          {ws.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">{ws.name}</p>
                          {ws.description && (
                            <p className="text-gray-600 text-xs truncate">{ws.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {ws.owner?.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-gray-400 text-sm truncate">{ws.owner?.name}</span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-xs bg-blue-400/10 text-blue-400 px-2 py-1 rounded-full">
                          {ws.memberCount}
                        </span>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-xs bg-violet-400/10 text-violet-400 px-2 py-1 rounded-full">
                          {ws.projectCount}
                        </span>
                      </div>
                      <div className="col-span-1 text-gray-500 text-xs">{timeAgo(ws.createdAt)}</div>
                    </motion.div>
                  ))}

                  {wsData?.workspaces?.length === 0 && (
                    <div className="py-12 text-center text-gray-600 text-sm">
                      No workspaces found
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {wsData?.pagination?.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-gray-500 text-xs">
                      Page {wsPage} of {wsData.pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setWsPage((p) => Math.max(1, p - 1))}
                        disabled={wsPage === 1}
                        className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 rounded-lg transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setWsPage((p) => p + 1)}
                        disabled={!wsData?.pagination?.hasMore}
                        className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 rounded-lg transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;