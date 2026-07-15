import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart2, Kanban } from "lucide-react";
import StatsCards from "../components/analytics/StatsCards.jsx";
import BurndownChart from "../components/analytics/BurndownChart.jsx";
import VelocityChart from "../components/analytics/VelocityChart.jsx";
import { useGetProjectAnalytics } from "../hooks/useAnalytics.js";
import { useGetProject } from "../hooks/useWorkspace.js";

const AnalyticsPage = () => {
  const { workspaceId, projectId } = useParams();
  const { data, isLoading, isError } = useGetProjectAnalytics(workspaceId, projectId);
  const { data: project } = useGetProject(projectId, workspaceId);

  if (isError) {
    return (
      <div className="h-full flex flex-col -m-6">
        <div className="flex-shrink-0 border-b border-gray-800">
          <TabBar workspaceId={workspaceId} projectId={projectId} project={project} />
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <BarChart2 size={32} className="text-gray-700 mb-3 mx-auto" />
            <p className="text-gray-400 font-medium">Failed to load analytics</p>
            <p className="text-gray-600 text-sm mt-1">Try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col -m-6">
      {/* ── Header with tabs ─────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-gray-800">
        <TabBar workspaceId={workspaceId} projectId={projectId} project={project} />
      </div>

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Stats */}
          <StatsCards summary={data?.summary} isLoading={isLoading} />

          {/* Priority breakdown */}
          {!isLoading && data?.tasksByPriority?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <h3 className="text-white font-medium text-sm mb-4">Tasks by priority</h3>
              <div className="flex gap-3 flex-wrap">
                {data.tasksByPriority.map((item) => {
                  const colorMap = {
                    low: "text-green-400 bg-green-400/10 border border-green-400/20",
                    medium: "text-yellow-400 bg-yellow-400/10 border border-yellow-400/20",
                    high: "text-orange-400 bg-orange-400/10 border border-orange-400/20",
                    urgent: "text-red-400 bg-red-400/10 border border-red-400/20",
                  };
                  return (
                    <div key={item._id} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${colorMap[item._id] || "text-gray-400 bg-gray-400/10"}`}>
                      <span className="capitalize">{item._id}</span>
                      <span className="font-bold">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <BurndownChart data={data?.burndownData} isLoading={isLoading} />
            <VelocityChart data={data?.memberVelocity} isLoading={isLoading} />
          </div>

          {/* Column distribution */}
          {!isLoading && data?.tasksByStatus?.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <h3 className="text-white font-medium text-sm mb-4">Tasks by column</h3>
              <div className="space-y-2.5">
                {data.tasksByStatus.sort((a, b) => b.count - a.count).map((item) => {
                  const pct = data.summary.totalTasks > 0
                    ? Math.round((item.count / data.summary.totalTasks) * 100) : 0;
                  return (
                    <div key={item._id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400 capitalize">{item._id.replace("-", " ")}</span>
                        <span className="text-gray-500">{item.count} · {pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="h-full bg-violet-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Shared tab bar component
const TabBar = ({ workspaceId, projectId, project }) => (
  <div>
    <div className="px-6 pt-3 pb-0">
      {project && (
        <h1 className="text-white font-semibold text-base mb-2">{project.name}</h1>
      )}
      <div className="flex items-center gap-1">
        <Link
          to={`/workspace/${workspaceId}/project/${projectId}/kanban`}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-300 transition-colors"
        >
          <Kanban size={14} />
          Kanban
        </Link>
        <Link
          to={`/workspace/${workspaceId}/project/${projectId}/analytics`}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 border-violet-500 text-violet-400 transition-colors"
        >
          <BarChart2 size={14} />
          Analytics
        </Link>
      </div>
    </div>
  </div>
);

export default AnalyticsPage;