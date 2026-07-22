import { motion } from "framer-motion";

const AdminTable = ({
  columns,
  data = [],
  isLoading,
  emptyMessage = "No data found",
  page,
  totalPages,
  totalCount,
  hasMore,
  onPrev,
  onNext,
  skeletonRows = 8,
}) => {
  return (
    <div>
      {/* Horizontal scroll on narrow screens instead of overflowing */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto">
        <div className="min-w-[720px]">
          {/* Header */}
          <div className="grid gap-4 px-5 py-3 border-b border-gray-800"
            style={{ gridTemplateColumns: columns.map((c) => c.width || "1fr").join(" ") }}
          >
            {columns.map((col) => (
              <div key={col.key} className={`min-w-0 text-xs font-medium text-gray-500 uppercase tracking-wider ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : ""}`}>
                {col.label}
              </div>
            ))}
          </div>

          {/* Body */}
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(skeletonRows)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-800/50 rounded-lg animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="py-16 text-center text-gray-600 text-sm">{emptyMessage}</div>
          ) : (
            data.map((row, i) => (
              <motion.div
                key={row._id || i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid gap-4 px-5 py-4 border-b border-gray-800 last:border-0 items-center hover:bg-gray-800/20 transition-colors"
                style={{ gridTemplateColumns: columns.map((c) => c.width || "1fr").join(" ") }}
              >
                {columns.map((col) => (
                 
                  <div key={col.key} className={`min-w-0 ${col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : ""}`}>
                    {col.render ? col.render(row) : <span className="text-gray-400 text-sm truncate block">{row[col.key]}</span>}
                  </div>
                ))}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
          <p className="text-gray-500 text-xs">
            Page {page} of {totalPages} · {totalCount} total
          </p>
          <div className="flex gap-2">
            <button
              onClick={onPrev}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 rounded-lg transition-colors"
            >
              Previous
            </button>
            <button
              onClick={onNext}
              disabled={!hasMore}
              className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;