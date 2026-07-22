import { motion } from "framer-motion";
import { History } from "lucide-react";
import { describeAdminLog } from "../../utils/adminFormatters.js";
import { timeAgo } from "../../utils/formatDate.js";

const AdminLogsFeed = ({ logs = [], isLoading, skeletonRows = 8 }) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(skeletonRows)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl py-16 text-center text-gray-600 text-sm flex flex-col items-center gap-2">
        <History size={22} className="text-gray-700" />
        No admin actions logged yet
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {logs.map((log, i) => (
        <motion.div
          key={log._id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          className="flex items-start gap-3 px-5 py-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden flex-shrink-0 mt-0.5">
            {log.admin?.avatar
              ? <img src={log.admin.avatar} alt={log.admin.name} className="w-full h-full object-cover" />
              : (log.admin?.name?.[0]?.toUpperCase() || "?")
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-300 text-sm">{describeAdminLog(log)}</p>
            <p className="text-gray-600 text-xs mt-0.5">{timeAgo(log.createdAt)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminLogsFeed;