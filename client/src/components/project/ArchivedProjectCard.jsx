import { motion } from "framer-motion";
import { FolderKanban, ArchiveRestore } from "lucide-react";
import { timeAgo } from "../../utils/formatDate.js";

const ArchivedProjectCard = ({ project, delay, onRestore, restoring }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-gray-900/50 border border-gray-800 border-dashed rounded-xl p-4 sm:p-5 opacity-70 hover:opacity-100 active:opacity-100 transition-all group"
  >
    <div className="flex items-start justify-between gap-2 mb-3">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
          <FolderKanban size={16} className="text-gray-500" />
        </div>
        <div className="min-w-0">
          <h3 className="text-gray-300 font-medium text-sm truncate">{project.name}</h3>
          <p className="text-gray-600 text-xs truncate">Archived · {timeAgo(project.updatedAt)}</p>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onRestore(project._id); }}
        disabled={restoring}
        title="Restore project"
        className="
          flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-500
          hover:text-green-400 hover:bg-green-400/10 active:bg-green-400/10
          border border-gray-800 hover:border-green-400/20
          opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all flex-shrink-0
        "
      >
        <ArchiveRestore size={13} />
        <span>Restore</span>
      </button>
    </div>

    {project.description && (
      <p className="text-gray-600 text-xs line-clamp-2 mb-2 ml-0 sm:ml-12">
        {project.description}
      </p>
    )}
  </motion.div>
);

export default ArchivedProjectCard;