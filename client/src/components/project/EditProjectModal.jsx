import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useUpdateProject } from "../../hooks/useWorkspace.js";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  description: z.string().max(500).optional(),
  githubRepo: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

const EditProjectModal = ({ project, workspaceId, onClose }) => {
  const { mutate: updateProject, isPending } = useUpdateProject(workspaceId, project._id);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: project.name || "",
      description: project.description || "",
      githubRepo: project.githubRepo || "",
    },
  });

  const onSubmit = (data) => {
    updateProject(data, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="
          bg-gray-900 border border-gray-800 w-full
          max-w-full sm:max-w-md
          max-h-[92vh] sm:max-h-[90vh]
          overflow-y-auto
          rounded-t-2xl sm:rounded-xl
          p-4 sm:p-6
        "
      >
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h3 className="text-white font-semibold text-base">Edit project</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-white p-1.5 sm:p-1 rounded-md hover:bg-gray-800 active:bg-gray-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Project name</label>
            <input
              {...register("name")}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 text-sm sm:text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
              style={{ fontSize: "16px" }}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="What is this project for?"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition resize-none"
              style={{ fontSize: "16px" }}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">GitHub repo (optional)</label>
            <input
              {...register("githubRepo")}
              placeholder="https://github.com/you/repo"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
              style={{ fontSize: "16px" }}
            />
            {errors.githubRepo && <p className="text-red-400 text-xs mt-1">{errors.githubRepo.message}</p>}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 active:bg-gray-700 text-gray-300 font-medium px-4 py-3 sm:py-2.5 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-500 disabled:opacity-50 text-white font-medium px-4 py-3 sm:py-2.5 rounded-lg text-sm transition-colors"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditProjectModal;