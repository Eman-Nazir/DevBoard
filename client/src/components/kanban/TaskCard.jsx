import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Calendar, AlertCircle, Tag, GripVertical } from "lucide-react";
import { formatDate } from "../../utils/formatDate.js";
import { PRIORITY_COLORS } from "../../utils/constants.js";

const TaskCard = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: { type: "Task", task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isOverdue =
    task.dueDate &&
    task.columnId !== "done" &&
    new Date(task.dueDate) < new Date();

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        layout
        onClick={() => onClick(task)}
        className={`
          group relative bg-gray-800 border rounded-xl p-3.5 cursor-pointer
          hover:border-gray-600 transition-all select-none
          ${isDragging
            ? "shadow-2xl shadow-black/50 border-violet-500/50"
            : "border-gray-700"
          }
        `}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 text-gray-600 hover:text-gray-400"
        >
          <GripVertical size={14} />
        </div>

        <div className="pl-3">
          {/* Priority + Labels */}
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </span>
            {task.labels?.slice(0, 2).map((label) => (
              <span
                key={label}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 flex items-center gap-1"
              >
                <Tag size={9} />
                {label}
              </span>
            ))}
            {task.labels?.length > 2 && (
              <span className="text-xs text-gray-500">+{task.labels.length - 2}</span>
            )}
          </div>

          {/* Title */}
          <p className="text-white text-sm font-medium leading-snug mb-3 line-clamp-2">
            {task.title}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2">
            {task.dueDate && (
              <span className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-400" : "text-gray-500"}`}>
                {isOverdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
                {formatDate(task.dueDate)}
              </span>
            )}

            {task.assignees?.length > 0 && (
              <div className="flex -space-x-1.5 ml-auto">
                {task.assignees.slice(0, 3).map((assignee) => (
                  <div
                    key={assignee._id}
                    title={assignee.name}
                    className="w-6 h-6 rounded-full bg-violet-600 border-2 border-gray-800 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                  >
                    {assignee.name?.[0]?.toUpperCase()}
                  </div>
                ))}
                {task.assignees.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-gray-400 text-xs font-semibold">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskCard;