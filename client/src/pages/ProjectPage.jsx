import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plus, FolderKanban, GitBranch, ArrowRight,
  Trash2, Archive, ArchiveRestore, ChevronDown,
} from "lucide-react";
import {
  useGetProjects,
  useDeleteProject,
  useGetWorkspace,
  useGetArchivedProjects,
  useUnarchiveProject,
} from "../hooks/useWorkspace.js";
import useUIStore from "../store/uiStore.js";
import { timeAgo } from "../utils/formatDate.js";

const ProjectCard = ({ project, workspaceId, onDelete, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onClick={onClick}
    className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 cursor-pointer transition-all group"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-violet-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <FolderKanban size={16} className="text-violet-400" />
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-medium text-sm truncate">{project.name}</h3>
          <p className="text-gray-500 text-xs">by {project.createdBy?.name}</p>
        </div>
      </div>
      {onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
          className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>

    {project.description && (
      <p className="text-gray-500 text-xs line-clamp-2 mb-3 ml-12">{project.description}</p>
    )}

    {project.githubRepo && (
      <div className="flex items-center gap-1.5 text-gray-600 text-xs mb-3 ml-12">
        <GitBranch size={11} />
        <span className="truncate">{project.githubRepo.replace("https://github.com/", "")}</span>
      </div>
    )}

    <div className="flex items-center justify-between mt-3">
      <div className="flex gap-1.5 flex-wrap">
        {project.columns?.slice(0, 4).map((col) => (
          <span key={col.id} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">
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

const ProjectPage = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { openModal } = useUIStore();
  const [archivedOpen, setArchivedOpen] = useState(false);

  const { data: wsData } = useGetWorkspace(workspaceId);
  const { data: projects = [], isLoading } = useGetProjects(workspaceId);
  const { data: archivedProjects = [], isLoading: loadingArchived } = useGetArchivedProjects(workspaceId);
  const { mutate: deleteProject } = useDeleteProject(workspaceId);
  const { mutate: unarchive, isPending: unarchiving } = useUnarchiveProject(workspaceId);

  const handleDelete = (id) => {
    if (window.confirm("Delete this project? This cannot be undone.")) {
      deleteProject({ id, workspaceId });
    }
  };

  const handleUnarchive = (e, id) => {
    e.stopPropagation();
    unarchive(id);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">
            {wsData?.workspace?.name || "Workspace"}
          </h1>
          <p className="text-gray-400 text-sm">
            {projects.length} active project{projects.length !== 1 ? "s" : ""}
            {archivedProjects.length > 0 && ` · ${archivedProjects.length} archived`}
          </p>
        </div>
        <button
          onClick={() => openModal("createProject")}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus size={15} /> New Project
        </button>
      </motion.div>

      {/* Active projects */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            <FolderKanban size={28} className="text-gray-600" />
          </div>
          <h2 className="text-white font-medium text-lg mb-2">No active projects</h2>
          <p className="text-gray-500 text-sm mb-6">Create your first project to start tracking work.</p>
          <button
            onClick={() => openModal("createProject")}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            <Plus size={15} /> Create project
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              workspaceId={workspaceId}
              onDelete={handleDelete}
              onClick={() => navigate(`/workspace/${workspaceId}/project/${project._id}/kanban`)}
            />
          ))}
        </div>
      )}

      {/* Archived projects section */}
      {archivedProjects.length > 0 && (
        <div className="mt-10">
          <button
            onClick={() => setArchivedOpen(!archivedOpen)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors mb-4"
          >
            <Archive size={14} />
            Archived projects ({archivedProjects.length})
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${archivedOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {archivedOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {archivedProjects.map((project, i) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-gray-900/50 border border-gray-800 border-dashed rounded-xl p-5 opacity-70 hover:opacity-100 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gray-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FolderKanban size={16} className="text-gray-500" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-gray-300 font-medium text-sm truncate">{project.name}</h3>
                            <p className="text-gray-600 text-xs">Archived · {timeAgo(project.updatedAt)}</p>
                          </div>
                        </div>

                        {/* Restore button */}
                        <button
                          onClick={(e) => handleUnarchive(e, project._id)}
                          disabled={unarchiving}
                          title="Restore project"
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-500 hover:text-green-400 hover:bg-green-400/10 border border-gray-800 hover:border-green-400/20 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <ArchiveRestore size={13} />
                          Restore
                        </button>
                      </div>

                      {project.description && (
                        <p className="text-gray-600 text-xs line-clamp-2 mb-2 ml-12">
                          {project.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;