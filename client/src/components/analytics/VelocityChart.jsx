import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95", "#3b0764"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-white font-medium">{payload[0]?.payload?.name}</p>
      <p className="text-violet-400 mt-0.5">
        {payload[0]?.value} task{payload[0]?.value !== 1 ? "s" : ""} completed
      </p>
    </div>
  );
};

const VelocityChart = ({ data = [], isLoading }) => {
  const formatted = data.map((d) => ({
    ...d,
    shortName: d.name?.split(" ")[0] || "Unknown",
  }));

  if (isLoading) {
    return <div className="h-64 bg-gray-800/50 rounded-xl animate-pulse" />;
  }

  if (data.length === 0) {
    return (
      <div className="h-64 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-center">
        <p className="text-gray-600 text-sm">No completed tasks yet</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5"
    >
      <h3 className="text-white font-medium text-sm mb-4">
        Member velocity — tasks completed
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={formatted} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="shortName"
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={{ stroke: "#1f2937" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#1f2937" }} />
          <Bar dataKey="completedTasks" radius={[4, 4, 0, 0]}>
            {formatted.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default VelocityChart;