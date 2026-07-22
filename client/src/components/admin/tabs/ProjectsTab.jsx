import { FolderKanban } from "lucide-react";
import AdminTable from "../AdminTable.jsx";
import { timeAgo } from "../../../utils/formatDate.js";

const ProjectsTab = ({ projData, projLoading, projPage, setProjPage }) => {
  const columns = [
    {
      key: "project",
      label: "Project",
      width: "5fr",
      render: (project) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 flex-shrink-0">
            <FolderKanban size={14} />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{project.name}</p>
            {project.description && (
              <p className="text-gray-600 text-xs truncate">{project.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "workspace",
      label: "Workspace",
      width: "3fr",
      render: (project) => (
        <span className="text-gray-400 text-sm truncate">{project.workspace?.name || "—"}</span>
      ),
    },
    {
      key: "taskCount",
      label: "Tasks",
      width: "2fr",
      align: "center",
      render: (project) => (
        <span className="text-xs bg-teal-400/10 text-teal-400 px-2 py-1 rounded-full">
          {project.taskCount}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      width: "2fr",
      render: (project) => <span className="text-gray-500 text-xs">{timeAgo(project.createdAt)}</span>,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-white font-semibold text-base">All Projects</h2>
        {projData?.pagination?.totalCount !== undefined && (
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
            {projData.pagination.totalCount}
          </span>
        )}
      </div>

      <AdminTable
        columns={columns}
        data={projData?.projects || []}
        isLoading={projLoading}
        emptyMessage="No projects found"
        page={projPage}
        totalPages={projData?.pagination?.totalPages}
        totalCount={projData?.pagination?.totalCount}
        hasMore={projData?.pagination?.hasMore}
        onPrev={() => setProjPage((p) => Math.max(1, p - 1))}
        onNext={() => setProjPage((p) => p + 1)}
      />
    </div>
  );
};

export default ProjectsTab;