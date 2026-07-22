import { Link } from "react-router-dom";
import { Kanban, BarChart2 } from "lucide-react";


const ProjectTabBar = ({ workspaceId, projectId, activeTab }) => (
  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
    <Link
      to={`/workspace/${workspaceId}/project/${projectId}/kanban`}
      className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
        activeTab === "kanban"
          ? "border-violet-500 text-violet-400"
          : "border-transparent text-gray-500 hover:text-gray-300"
      }`}
    >
      <Kanban size={14} />
      Kanban
    </Link>
    <Link
      to={`/workspace/${workspaceId}/project/${projectId}/analytics`}
      className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
        activeTab === "analytics"
          ? "border-violet-500 text-violet-400"
          : "border-transparent text-gray-500 hover:text-gray-300"
      }`}
    >
      <BarChart2 size={14} />
      Analytics
    </Link>
  </div>
);

export default ProjectTabBar;