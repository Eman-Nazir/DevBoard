import { motion } from "framer-motion";
import {
  Users, Building2, FolderKanban,
  CheckSquare, Activity, TrendingUp,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend, BarChart, Bar,
} from "recharts";
import { format, parseISO } from "date-fns";
import AdminStatCard from "../../components/admin/AdminStatCard.jsx";
import { useGetPlatformStats } from "../../hooks/useAdmin.js";

const PRIORITY_COLORS = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#f97316",
  urgent: "#ef4444",
};

const AdminOverviewPage = () => {
  const { data: statsData, isLoading } = useGetPlatformStats();
  const stats = statsData?.stats;
  const userGrowth = statsData?.userGrowth || [];
  const tasksByPriority = statsData?.tasksByPriority || [];
  const topWorkspaces = statsData?.topWorkspaces || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl font-bold text-white mb-1">Platform Overview</h1>
        <p className="text-gray-500 text-sm">Real-time statistics across all users and workspaces</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <AdminStatCard icon={Users} label="Total Users" value={stats?.totalUsers} sub={`+${stats?.newUsersThisWeek || 0} this week`} color="text-blue-400 bg-blue-400/10" delay={0} />
        <AdminStatCard icon={Building2} label="Workspaces" value={stats?.totalWorkspaces} sub={`${stats?.activeWorkspaces || 0} this month`} color="text-violet-400 bg-violet-400/10" delay={0.05} />
        <AdminStatCard icon={FolderKanban} label="Projects" value={stats?.totalProjects} color="text-amber-400 bg-amber-400/10" delay={0.1} />
        <AdminStatCard icon={CheckSquare} label="Tasks Done" value={stats?.completedTasks} sub={`${stats?.completionRate || 0}% rate`} color="text-green-400 bg-green-400/10" delay={0.15} />
        <AdminStatCard icon={Activity} label="Total Tasks" value={stats?.totalTasks} color="text-teal-400 bg-teal-400/10" delay={0.2} />
        <AdminStatCard icon={TrendingUp} label="New (30d)" value={stats?.newUsersThisMonth} color="text-pink-400 bg-pink-400/10" delay={0.25} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* User growth chart */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-white font-medium text-sm mb-1">User Registrations</h3>
          <p className="text-gray-500 text-xs mb-5">Last 14 days</p>
          {userGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={userGrowth.map((d) => ({
                date: format(parseISO(d._id), "MMM d"),
                users: d.count,
              }))}>
                <defs>
                  <linearGradient id="ug" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", fontSize: "12px" }} labelStyle={{ color: "#9ca3af" }} />
                <Area type="monotone" dataKey="users" name="New users" stroke="#7c3aed" strokeWidth={2} fill="url(#ug)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-700 text-sm">No registration data yet</div>
          )}
        </motion.div>

        {/* Tasks by priority pie */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-white font-medium text-sm mb-1">Tasks by Priority</h3>
          <p className="text-gray-500 text-xs mb-5">Platform-wide</p>
          {tasksByPriority.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={tasksByPriority} dataKey="count" nameKey="_id" cx="50%" cy="45%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {tasksByPriority.map((entry) => (
                    <Cell key={entry._id} fill={PRIORITY_COLORS[entry._id] || "#6b7280"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", fontSize: "12px" }} />
                <Legend formatter={(v) => <span style={{ color: "#9ca3af", fontSize: "11px" }} className="capitalize">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-52 flex items-center justify-center text-gray-700 text-sm">No task data yet</div>
          )}
        </motion.div>
      </div>

      {/* Top workspaces by activity */}
      {topWorkspaces.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-6"
        >
          <h3 className="text-white font-medium text-sm mb-1">Most Active Workspaces</h3>
          <p className="text-gray-500 text-xs mb-5">By total task count</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={topWorkspaces} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", fontSize: "12px" }} />
              <Bar dataKey="taskCount" name="Tasks" fill="#7c3aed" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
};

export default AdminOverviewPage;