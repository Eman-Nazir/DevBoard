import { motion } from "framer-motion";

const AdminStatCard = ({ icon: Icon, label, value, sub, color, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-gray-900 border border-gray-800 rounded-xl p-5"
  >
    <div className="flex items-center justify-between mb-3">
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={15} />
      </div>
    </div>
    <p className="text-white text-3xl font-bold mb-1">{value ?? "—"}</p>
    {sub && <p className="text-gray-600 text-xs">{sub}</p>}
  </motion.div>
);

export default AdminStatCard;