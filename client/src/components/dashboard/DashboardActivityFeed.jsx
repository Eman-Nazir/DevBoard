import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { History } from "lucide-react";
import axiosInstance from "../../api/axiosInstance.js";
import { timeAgo } from "../../utils/formatDate.js";
import { getDotColor, describeActivity } from "../../utils/activityFormatters.js";

const DashboardActivityFeed = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/activity?limit=15");
      return res.data.data;
    },
    staleTime: 30 * 1000,
  });

  const logs = data?.logs || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
    >
      <div className="px-4 sm:px-5 py-4 border-b border-gray-800">
        <h2 className="text-white font-medium text-sm">Recent activity</h2>
        <p className="text-gray-500 text-xs mt-0.5">Across all your workspaces</p>
      </div>

      <div className="p-4 sm:p-5">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History size={22} className="text-gray-700 mb-2" />
            <p className="text-gray-600 text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log._id} className="flex items-start gap-3">
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${getDotColor(log.action)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm break-words">
                    {describeActivity(log)}
                    {log.workspace?.name && (
                      <span className="text-gray-600"> · {log.workspace.name}</span>
                    )}
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">{timeAgo(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DashboardActivityFeed;