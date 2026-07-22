import { motion } from "framer-motion";
import { GitBranch, Archive, Search, Download } from "lucide-react";
import { cn } from "../../utils/cn.js";
import ProjectTabBar from "../project/ProjectTabBar.jsx";
import TaskFilterToggle from "./TaskFilterToggle.jsx";
import PriorityFilterDropdown from "./PriorityFilterDropdown.jsx";
import OnlinePresence from "./OnlinePresence.jsx";

const ROLE_STYLES = {
  admin: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  member: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  viewer: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

const KanbanPageHeader = ({
  project, workspaceId, projectId,
  myRole, archiving, onArchive,
  completionPct, doneTasks, totalTasks,
  taskFilter, setTaskFilter, myTasksCount,
  priorityFilter, setPriorityFilter,
  searchQuery, setSearchQuery,
  onlineMembers, onExportCsv,
}) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex-shrink-0 border-b border-gray-800"
  >
    {/* Top row */}
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between px-4 sm:px-6 py-3 gap-3">
    
      <div className="min-w-0 flex-1">
        <h1 className="text-white font-semibold text-base truncate">{project.name}</h1>
        {project.description && (
          <p className="text-gray-500 text-xs truncate">{project.description}</p>
        )}
        {project.githubRepo && (
          <a
            href={project.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs transition-colors mt-1 min-w-0"
          >
            <GitBranch size={12} className="flex-shrink-0" />
            <span className="truncate">
              {project.githubRepo.replace("https://github.com/", "")}
            </span>
          </a>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:justify-end flex-shrink-0">
       
        <OnlinePresence members={onlineMembers} />

        {/* Progress */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-violet-500 rounded-full"
            />
          </div>
          <span className="text-gray-500 text-xs whitespace-nowrap">
            {doneTasks}/{totalTasks} done
          </span>
        </div>

        {/* Role badge */}
        <span className={cn(
          "text-xs px-2.5 py-1 rounded-full font-medium border flex-shrink-0",
          ROLE_STYLES[myRole] || ROLE_STYLES.viewer
        )}>
          {myRole}
        </span>

        {/* Export CSV */}
        <button
          onClick={onExportCsv}
          title="Export tasks to CSV"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 border border-gray-800 transition-all flex-shrink-0"
        >
          <Download size={13} />
          <span className="hidden md:block">Export</span>
        </button>

        {/* Archive  admin only */}
        {myRole === "admin" && (
          <button
            onClick={onArchive}
            disabled={archiving}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-amber-400 hover:bg-amber-400/10 border border-gray-800 hover:border-amber-400/20 transition-all flex-shrink-0"
          >
            <Archive size={13} />
            <span className="hidden md:block">Archive</span>
          </button>
        )}
      </div>
    </div>

    {/* Tab row + filter toggle */}
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-4 sm:px-6 pb-2.5 gap-2.5">
      <div className="overflow-x-auto no-scrollbar">
        <ProjectTabBar workspaceId={workspaceId} projectId={projectId} activeTab="kanban" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[140px] sm:flex-initial">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="bg-gray-800/60 border border-transparent focus:border-violet-500/50 text-white placeholder-gray-500 rounded-md pl-7 pr-3 py-1.5 text-xs w-full sm:w-40 sm:focus:w-52 transition-all focus:outline-none"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <PriorityFilterDropdown value={priorityFilter} onChange={setPriorityFilter} />

          <TaskFilterToggle
            taskFilter={taskFilter}
            setTaskFilter={setTaskFilter}
            totalTasks={totalTasks}
            myTasksCount={myTasksCount}
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export default KanbanPageHeader;