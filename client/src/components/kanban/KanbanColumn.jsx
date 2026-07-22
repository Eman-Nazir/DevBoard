import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard.jsx";
import { cn } from "../../utils/cn.js";

const KanbanColumn = ({ column, tasks, onAddTask, onEditTask, activeId, canEdit = true }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", column },
  });

  const taskIds = tasks.map((t) => t._id);

  return (
  
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: column.color }} />
          <span className="text-white font-medium text-sm truncate">{column.title}</span>
          <span className="text-gray-600 text-xs bg-gray-800 px-1.5 py-0.5 rounded-full flex-shrink-0">
            {tasks.length}
          </span>
        </div>
        {canEdit && (
          <button
            onClick={() => onAddTask(column.id)}
            className="p-1.5 sm:p-1 rounded-md text-gray-500 hover:text-white hover:bg-gray-800 active:bg-gray-800 transition-colors flex-shrink-0"
            title={`Add task to ${column.title}`}
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 min-h-[200px] rounded-xl p-2 transition-colors duration-200 space-y-2",
          isOver && canEdit
            ? "bg-violet-500/10 border-2 border-dashed border-violet-500/40"
            : "bg-gray-900/50 border-2 border-transparent"
        )}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={onEditTask}
                isDragging={activeId === task._id}
              />
            ))}
          </AnimatePresence>
        </SortableContext>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-28"
          >
            <p className="text-gray-700 text-xs">
              {canEdit ? "Drop tasks here" : "No tasks"}
            </p>
          </motion.div>
        )}

        {canEdit && (
          <button
            onClick={() => onAddTask(column.id)}
            className="w-full flex items-center gap-2 px-3 py-2.5 sm:py-2 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-gray-800 active:bg-gray-800 transition-colors text-xs"
          >
            <Plus size={13} className="flex-shrink-0" />
            Add task
          </button>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;