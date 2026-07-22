import { motion } from "framer-motion";
import { FolderKanban, GitBranch, ArrowRight, Trash2, CheckSquare, Pencil } from "lucide-react";
import { timeAgo } from "../../utils/formatDate.js";

const ProjectCard = ({ project, onDelete, onEdit, onClick }) => {
  if (!project) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 hover:border-gray-700 active:border-gray-700 rounded-xl p-4 sm:p-5 cursor-pointer transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-violet-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <FolderKanban size={16} className="text-violet-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-medium text-sm truncate">{project.name}</h3>
            <p className="text-gray-500 text-xs truncate">by {project.createdBy?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {project.taskCount !== undefined && (
            <span className="flex items-center gap-1 text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
              <CheckSquare size={11} />
              {project.taskCount}
            </span>
          )}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(project); }}
              className="
                p-2 sm:p-1.5 rounded-md text-gray-600 hover:text-violet-400 hover:bg-violet-400/10 active:bg-violet-400/10
                opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all
              "
              title="Edit project"
            >
              <Pencil size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
              className="
                p-2 sm:p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 active:bg-red-400/10
                opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all
              "
              title="Delete project"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {project.description && (
        <p className="text-gray-500 text-xs line-clamp-2 mb-3 ml-0 sm:ml-12">{project.description}</p>
      )}

      {project.githubRepo && (
        <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-3 ml-0 sm:ml-12 min-w-0">
          <GitBranch size={11} className="flex-shrink-0" />
          <span className="truncate">{project.githubRepo.replace("https://github.com/", "")}</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mt-3">
        <div className="flex gap-1.5 flex-wrap min-w-0">
          {project.columns?.slice(0, 4).map((col) => (
            <span key={col.id} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500 truncate max-w-[6rem] sm:max-w-none">
              {col.title}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 text-xs flex-shrink-0">
          <span>{timeAgo(project.createdAt)}</span>
          <ArrowRight size={12} className="group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;