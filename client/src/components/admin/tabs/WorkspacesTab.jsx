import AdminTable from "../AdminTable.jsx";
import { timeAgo } from "../../../utils/formatDate.js";

const WorkspacesTab = ({ wsData, wsLoading, wsPage, setWsPage }) => {
  const columns = [
    {
      key: "workspace",
      label: "Workspace",
      width: "4fr",
      render: (ws) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400 text-sm font-bold flex-shrink-0">
            {ws.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{ws.name}</p>
            {ws.description && (
              <p className="text-gray-600 text-xs truncate">{ws.description}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      label: "Owner",
      width: "3fr",
      render: (ws) => (
        <div className="flex items-center gap-2">
          {ws.owner ? (
            <>
              <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {ws.owner.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-gray-400 text-sm truncate">{ws.owner.name}</span>
            </>
          ) : (
            <>
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 text-xs flex-shrink-0">
                ?
              </div>
              <span className="text-gray-600 text-sm italic">Deleted user</span>
            </>
          )}
        </div>
      ),
    },
    {
      key: "memberCount",
      label: "Members",
      width: "2fr",
      align: "center",
      render: (ws) => (
        <span className="text-xs bg-blue-400/10 text-blue-400 px-2 py-1 rounded-full">
          {ws.memberCount}
        </span>
      ),
    },
    {
      key: "projectCount",
      label: "Projects",
      width: "2fr",
      align: "center",
      render: (ws) => (
        <span className="text-xs bg-violet-400/10 text-violet-400 px-2 py-1 rounded-full">
          {ws.projectCount}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      width: "1fr",
      render: (ws) => <span className="text-gray-500 text-xs">{timeAgo(ws.createdAt)}</span>,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-white font-semibold text-base">All Workspaces</h2>
        {wsData?.pagination?.totalCount !== undefined && (
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
            {wsData.pagination.totalCount}
          </span>
        )}
      </div>

      <AdminTable
        columns={columns}
        data={wsData?.workspaces || []}
        isLoading={wsLoading}
        emptyMessage="No workspaces found"
        page={wsPage}
        totalPages={wsData?.pagination?.totalPages}
        totalCount={wsData?.pagination?.totalCount}
        hasMore={wsData?.pagination?.hasMore}
        onPrev={() => setWsPage((p) => Math.max(1, p - 1))}
        onNext={() => setWsPage((p) => p + 1)}
      />
    </div>
  );
};

export default WorkspacesTab;