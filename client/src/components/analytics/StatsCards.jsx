import { motion } from "framer-motion";
import { CheckCircle, ListTodo, AlertTriangle, TrendingUp } from "lucide-react";

const CARDS = [
  {
    key: "totalTasks",
    label: "Total tasks",
    icon: ListTodo,
    colorClass: "text-blue-400 bg-blue-400/10",
  },
  {
    key: "doneTasks",
    label: "Completed",
    icon: CheckCircle,
    colorClass: "text-green-400 bg-green-400/10",
  },
  {
    key: "overdueTasks",
    label: "Overdue",
    icon: AlertTriangle,
    colorClass: "text-red-400 bg-red-400/10",
  },
  {
    key: "completionRate",
    label: "Completion rate",
    icon: TrendingUp,
    suffix: "%",
    colorClass: "text-violet-400 bg-violet-400/10",
  },
];

const StatsCards = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-800/50 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, icon: Icon, colorClass, suffix = "" }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-500 text-xs font-medium">{label}</p>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorClass}`}>
              <Icon size={14} />
            </div>
          </div>
          <p className="text-white text-2xl font-semibold">
            {summary?.[key] ?? 0}{suffix}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;