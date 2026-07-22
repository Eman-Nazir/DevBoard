import AdminLogsFeed from "../AdminLogsFeed.jsx";

const LogsTab = ({ logsData, logsLoading, logsPage, setLogsPage }) => (
  <div>
    <div className="flex items-center gap-3 mb-6">
      <h2 className="text-white font-semibold text-base">Admin Action Log</h2>
      {logsData?.pagination?.totalCount !== undefined && (
        <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
          {logsData.pagination.totalCount}
        </span>
      )}
    </div>

    <AdminLogsFeed logs={logsData?.logs || []} isLoading={logsLoading} />

    {logsData?.pagination?.totalPages > 1 && (
      <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
        <p className="text-gray-500 text-xs">
          Page {logsPage} of {logsData.pagination.totalPages} · {logsData.pagination.totalCount} entries
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
            disabled={logsPage === 1}
            className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 rounded-lg transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setLogsPage((p) => p + 1)}
            disabled={!logsData?.pagination?.hasMore}
            className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-gray-300 rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    )}
  </div>
);

export default LogsTab;