import { motion } from "framer-motion";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { useDeleteWorkspace } from "../../hooks/useWorkspace.js";

const DangerZoneSection = ({ workspaceId, workspaceName }) => {
  const { mutate: deleteWorkspace, isPending: deleting } = useDeleteWorkspace();

  const handleDeleteWorkspace = () => {
    if (!window.confirm(`Delete "${workspaceName}"? This will permanently delete all projects and tasks. This cannot be undone.`)) return;
    deleteWorkspace(workspaceId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-red-900/50 rounded-xl overflow-hidden"
    >
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-red-900/30">
        <h2 className="text-red-400 font-medium text-sm flex items-center gap-2">
          <AlertTriangle size={14} className="flex-shrink-0" />
          Danger zone
        </h2>
        <p className="text-gray-500 text-xs mt-0.5">
          These actions are permanent and cannot be undone.
        </p>
      </div>
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-white text-sm font-medium mb-0.5">Delete workspace</p>
          <p className="text-gray-500 text-xs">
            Permanently deletes this workspace, all projects, and all tasks.
          </p>
        </div>
        <button
          onClick={handleDeleteWorkspace}
          disabled={deleting}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600/20 active:bg-red-600/20 border border-red-600/30 text-red-400 font-medium px-4 py-2.5 sm:py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex-shrink-0"
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          {deleting ? "Deleting..." : "Delete workspace"}
        </button>
      </div>
    </motion.div>
  );
};

export default DangerZoneSection;