import { motion } from "framer-motion";
import {
  Users, Building2, FolderKanban, CheckSquare, TrendingUp,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import AdminStatCard from "../AdminStatCard.jsx";

const OverviewTab = ({ stats, userGrowth, setActiveTab, setShowTaskBreakdown }) => (
  <div className="space-y-8">
    {/* Stats grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminStatCard icon={Users} label="Total Users" value={stats?.totalUsers} sub={`+${stats?.newUsersThisWeek || 0} this week`} color="text-blue-400 bg-blue-400/10" delay={0} onClick={() => setActiveTab("users")} />
      <AdminStatCard icon={Building2} label="Total Workspaces" value={stats?.totalWorkspaces} sub={`${stats?.activeWorkspaces || 0} active this month`} color="text-violet-400 bg-violet-400/10" delay={0.06} onClick={() => setActiveTab("workspaces")} />
      <AdminStatCard icon={FolderKanban} label="Total Projects" value={stats?.totalProjects} color="text-amber-400 bg-amber-400/10" delay={0.12} onClick={() => setActiveTab("projects")} />
      <AdminStatCard icon={CheckSquare} label="Tasks Completed" value={stats?.completedTasks} sub={`${stats?.completionRate || 0}% completion rate`} color="text-green-400 bg-green-400/10" delay={0.18} onClick={() => setShowTaskBreakdown(true)} />
    </div>

    {/* Second stats row */}
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <AdminStatCard icon={TrendingUp} label="Total Tasks" value={stats?.totalTasks} color="text-teal-400 bg-teal-400/10" delay={0.22} onClick={() => setShowTaskBreakdown(true)} />
      <AdminStatCard icon={Users} label="New Users (30d)" value={stats?.newUsersThisMonth} color="text-pink-400 bg-pink-400/10" delay={0.26} onClick={() => setActiveTab("users")} />
      <AdminStatCard icon={Building2} label="New Workspaces (30d)" value={stats?.activeWorkspaces} color="text-orange-400 bg-orange-400/10" delay={0.3} onClick={() => setActiveTab("workspaces")} />
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
);

export default OverviewTab;