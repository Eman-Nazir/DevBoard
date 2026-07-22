import { motion } from "framer-motion";
import { X } from "lucide-react";
import { PRIORITY_COLORS, COLUMN_COLORS, COLUMN_LABELS } from "../../utils/adminFormatters.js";

const BreakdownBar = ({ label, count, colorClass, totalTasks }) => {
  const pct = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-gray-300 text-xs font-medium capitalize">{label}</span>
        <span className="text-gray-500 text-xs">{count} · {pct}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
    </div>
  );
};

const TaskBreakdownModal = ({ onClose, stats, tasksByPriority, tasksByColumn }) => {
  const totalTasks = stats?.totalTasks || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md p-4 sm:p-6 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white font-semibold text-base">Task Breakdown</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-gray-500 text-xs mb-6">
          {totalTasks} total tasks · {stats?.completionRate || 0}% completion rate
        </p>

        <div className="mb-6">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">By Status</p>
          {tasksByColumn?.length > 0 ? (
            tasksByColumn.map((c) => (
              <BreakdownBar
                key={c._id}
                label={COLUMN_LABELS[c._id] || c._id}
                count={c.count}
                totalTasks={totalTasks}
                colorClass={COLUMN_COLORS[c._id] || "bg-gray-500"}
              />
            ))
          ) : (
            <p className="text-gray-600 text-xs">No task data yet</p>
          )}
        </div>

        <div>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">By Priority</p>
          {tasksByPriority?.length > 0 ? (
            tasksByPriority.map((p) => (
              <BreakdownBar
                key={p._id}
                label={p._id}
                count={p.count}
                totalTasks={totalTasks}
                colorClass={PRIORITY_COLORS[p._id] || "bg-gray-500"}
              />
            ))
          ) : (
            <p className="text-gray-600 text-xs">No task data yet</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TaskBreakdownModal;