import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Flag } from "lucide-react";
import { useCreateTask } from "../../hooks/useTask.js";

const PRIORITIES = ["low", "medium", "high", "urgent"];

const PRIORITY_COLORS = {
  low: "text-green-400",
  medium: "text-yellow-400",
  high: "text-orange-400",
  urgent: "text-red-400",
};

const AddTaskForm = ({ workspaceId, projectId, columnId, onClose }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const submittingRef = useRef(false); //  prevents double submit
  const { mutate: createTask, isPending } = useCreateTask(workspaceId, projectId);

  const handleSubmit = () => {
    if (!title.trim() || submittingRef.current) return;
    submittingRef.current = true;

    createTask(
      { title: title.trim(), columnId, priority },
      {
        onSuccess: () => {
          submittingRef.current = false;
          onClose();
        },
        onError: () => {
          submittingRef.current = false;
        },
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-gray-800 border border-gray-700 rounded-xl p-3 space-y-2.5"
    >
      <textarea
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Task title..."
        rows={2}
        className="w-full bg-transparent text-white text-sm placeholder-gray-600 resize-none focus:outline-none leading-snug"
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              title={p}
              className={`p-1 rounded transition-colors ${priority === p ? "bg-gray-700" : "hover:bg-gray-700/50"}`}
            >
              <Flag
                size={12}
                className={`${PRIORITY_COLORS[p]} ${priority === p ? "fill-current" : ""}`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <X size={13} />
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!title.trim() || isPending}
            className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            {isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddTaskForm;