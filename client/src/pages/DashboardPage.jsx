import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, FolderKanban, ArrowRight } from "lucide-react";
import { useGetMyWorkspaces } from "../hooks/useWorkspace.js";
import useAuthStore from "../store/authStore.js";
import useUIStore from "../store/uiStore.js";
import { timeAgo } from "../utils/formatDate.js";

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { openModal } = useUIStore();
  const navigate = useNavigate();
  const { data: workspaces = [], isLoading } = useGetMyWorkspaces();

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-semibold text-white mb-1">Good to see you, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-gray-400 text-sm">Here are all your workspaces.</p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-36 bg-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : workspaces.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            <FolderKanban size={28} className="text-gray-600" />
          </div>
          <h2 className="text-white font-medium text-lg mb-2">No workspaces yet</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">Create your first workspace to start managing projects with your team.</p>
          <button onClick={() => openModal("createWorkspace")} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
            <Plus size={15} /> Create workspace
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws, i) => (
            <motion.div
              key={ws._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/workspace/${ws._id}`)}
              className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg hover:shadow-black/20 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-violet-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-violet-400 font-semibold text-sm">{ws.name[0].toUpperCase()}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${ws.role === "admin" ? "bg-violet-400/10 text-violet-400" : ws.role === "member" ? "bg-blue-400/10 text-blue-400" : "bg-gray-400/10 text-gray-400"}`}>
                  {ws.role}
                </span>
              </div>
              <h3 className="text-white font-medium text-sm mb-1 truncate">{ws.name}</h3>
              {ws.description && <p className="text-gray-500 text-xs line-clamp-2 mb-3">{ws.description}</p>}
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs">{timeAgo(ws.createdAt)}</span>
                <ArrowRight size={14} className="text-gray-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </motion.div>
          ))}
          <motion.button
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: workspaces.length * 0.05 }}
            onClick={() => openModal("createWorkspace")}
            className="bg-gray-900 border border-dashed border-gray-700 hover:border-violet-500/50 rounded-xl p-5 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-violet-400 min-h-[144px]"
          >
            <Plus size={20} />
            <span className="text-sm font-medium">New workspace</span>
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;