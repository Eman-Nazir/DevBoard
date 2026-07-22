import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, FolderKanban } from "lucide-react";
import {
  useGetProjects,
  useDeleteProject,
  useGetWorkspace,
  useGetArchivedProjects,
  useUnarchiveProject,
} from "../hooks/useWorkspace.js";
import useUIStore from "../store/uiStore.js";
import ProjectCard from "../components/project/ProjectCard.jsx";
import ArchivedProjectsSection from "../components/project/ArchivedProjectsSection.jsx";
import EditProjectModal from "../components/project/EditProjectModal.jsx";

const ProjectPage = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { openModal } = useUIStore();
  const [editingProject, setEditingProject] = useState(null);

  const { data: wsData } = useGetWorkspace(workspaceId);
  const { data: projects = [], isLoading } = useGetProjects(workspaceId);
  const { data: archivedProjects = [] } = useGetArchivedProjects(workspaceId);
  const { mutate: deleteProject } = useDeleteProject(workspaceId);
  const { mutate: unarchive, isPending: unarchiving } = useUnarchiveProject(workspaceId);

  const handleDelete = (id) => {
    if (window.confirm("Delete this project? This cannot be undone.")) {
      deleteProject({ id, workspaceId });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8"
      >
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-white mb-1 truncate">
            {wsData?.workspace?.name || "Workspace"}
          </h1>
          <p className="text-gray-400 text-sm">
            {projects.length} active project{projects.length !== 1 ? "s" : ""}
            {archivedProjects.length > 0 && ` · ${archivedProjects.length} archived`}
          </p>
        </div>
        <button
          onClick={() => openModal("createProject")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-500 text-white font-medium px-4 py-2.5 sm:py-2 rounded-lg text-sm transition-colors flex-shrink-0"
        >
          <Plus size={15} /> New Project
        </button>
      </motion.div>

      {/* Active projects */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
            <FolderKanban size={26} className="text-gray-600 sm:hidden" />
            <FolderKanban size={28} className="text-gray-600 hidden sm:block" />
          </div>
          <h2 className="text-white font-medium text-lg mb-2">No active projects</h2>
          <p className="text-gray-500 text-sm mb-6">Create your first project to start tracking work.</p>
          <button
            onClick={() => openModal("createProject")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            <Plus size={15} /> Create project
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDelete}
              onEdit={setEditingProject}
              onClick={() => navigate(`/workspace/${workspaceId}/project/${project._id}/kanban`)}
            />
          ))}
        </div>
      )}

      {/* Archived projects */}
      <ArchivedProjectsSection
        projects={archivedProjects}
        onRestore={unarchive}
        restoring={unarchiving}
      />

      {/* Edit project modal */}
      <AnimatePresence>
        {editingProject && (
          <EditProjectModal
            project={editingProject}
            workspaceId={workspaceId}
            onClose={() => setEditingProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectPage;