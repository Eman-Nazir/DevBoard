import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useParams } from "react-router-dom";
import { useCreateProject } from "../../hooks/useWorkspace.js";

const schema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().max(500).optional(),
  githubRepo: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

const CreateProjectModal = ({ onClose }) => {
  const { workspaceId } = useParams();
  const { mutate: createProject, isPending } = useCreateProject(workspaceId);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => createProject(data, { onSuccess: onClose });

  if (!workspaceId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md z-10 text-center">
          <p className="text-gray-400 text-sm">Please select a workspace first.</p>
          <button onClick={onClose} className="mt-4 text-violet-400 text-sm hover:underline">Close</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-md z-10"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">New project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Project name</label>
            <input
              {...register("name")}
              placeholder="e.g. Website Redesign"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Description <span className="text-gray-600">(optional)</span></label>
            <textarea
              {...register("description")}
              placeholder="What are you building?"
              rows={2}
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">GitHub repo <span className="text-gray-600">(optional)</span></label>
            <input
              {...register("githubRepo")}
              placeholder="https://github.com/user/repo"
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition"
            />
            {errors.githubRepo && <p className="text-red-400 text-xs mt-1">{errors.githubRepo.message}</p>}
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg py-2.5 text-sm transition-colors">Cancel</button>
            <button type="submit" disabled={isPending} className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 text-sm transition-colors">
              {isPending ? "Creating..." : "Create project"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateProjectModal;