import { Users, User } from "lucide-react";
import { cn } from "../../utils/cn.js";

const TaskFilterToggle = ({ taskFilter, setTaskFilter, totalTasks, myTasksCount }) => (
  <div className="flex items-center gap-1 bg-gray-800/60 rounded-lg p-1 flex-shrink-0">
    <button
      onClick={() => setTaskFilter("all")}
      className={cn(
        "flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
        taskFilter === "all" ? "bg-gray-700 text-white" : "text-gray-500 hover:text-gray-300"
      )}
    >
      <Users size={12} />
      <span className="hidden sm:inline">All tasks</span>
      <span className="sm:hidden">All</span>
      <span className="bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded-full text-xs">
        {totalTasks}
      </span>
    </button>
    <button
      onClick={() => setTaskFilter("mine")}
      className={cn(
        "flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
        taskFilter === "mine" ? "bg-violet-600/30 text-violet-400" : "text-gray-500 hover:text-gray-300"
      )}
    >
      <User size={12} />
      <span className="hidden sm:inline">My tasks</span>
      <span className="sm:hidden">Mine</span>
      <span className={cn(
        "px-1.5 py-0.5 rounded-full text-xs",
        taskFilter === "mine" ? "bg-violet-600/40 text-violet-300" : "bg-gray-600 text-gray-300"
      )}>
        {myTasksCount}
      </span>
    </button>
  </div>
);

export default TaskFilterToggle;