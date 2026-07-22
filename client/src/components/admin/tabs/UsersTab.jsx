import { Search, UserX, ShieldCheck } from "lucide-react";
import AdminTable from "../AdminTable.jsx";
import { timeAgo } from "../../../utils/formatDate.js";

const UsersTab = ({
  usersData, usersLoading, usersPage, setUsersPage,
  search, setSearch, handleDeleteUser, deleting,
}) => {
  const columns = [
    {
      key: "user",
      label: "User",
      width: "4fr",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden flex-shrink-0">
            {user.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : user.name?.[0]?.toUpperCase()
            }
          </div>
          <span className="text-white text-sm font-medium truncate">{user.name}</span>
          {user.isSuperAdmin && (
            <span className="flex items-center gap-1 text-xs bg-violet-400/10 text-violet-400 border border-violet-400/20 px-1.5 py-0.5 rounded-full flex-shrink-0">
              <ShieldCheck size={10} />
              Admin
            </span>
          )}
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      width: "3fr",
      render: (user) => <span className="text-gray-400 text-sm truncate">{user.email}</span>,
    },
    {
      key: "workspaceCount",
      label: "Workspaces",
      width: "2fr",
      align: "center",
      render: (user) => (
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">
          {user.workspaceCount}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      width: "2fr",
      render: (user) => <span className="text-gray-500 text-xs">{timeAgo(user.createdAt)}</span>,
    },
    {
      key: "action",
      label: "Action",
      width: "1fr",
      align: "right",
      render: (user) => (
        user.isSuperAdmin ? (
          <span className="text-gray-700 text-xs italic block text-right pr-1.5" title="Super admin accounts can't be deleted">
            protected
          </span>
        ) : (
          <button
            onClick={() => handleDeleteUser(user._id, user.name)}
            disabled={deleting}
            className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title="Delete user"
          >
            <UserX size={14} />
          </button>
        )
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3">
          <h2 className="text-white font-semibold text-base">All Users</h2>
          {usersData?.pagination?.totalCount !== undefined && (
            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
              {usersData.pagination.totalCount}
            </span>
          )}
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setUsersPage(1); }}
            placeholder="Search by name or email..."
            className="bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-violet-500 w-full transition"
          />
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={usersData?.users || []}
        isLoading={usersLoading}
        emptyMessage="No users found"
        page={usersPage}
        totalPages={usersData?.pagination?.totalPages}
        totalCount={usersData?.pagination?.totalCount}
        hasMore={usersData?.pagination?.hasMore}
        onPrev={() => setUsersPage((p) => Math.max(1, p - 1))}
        onNext={() => setUsersPage((p) => p + 1)}
      />
    </div>
  );
};

export default UsersTab;