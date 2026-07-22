const KanbanPageSkeleton = () => (
  <div className="h-full flex flex-col -m-6">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
      <div className="h-7 w-48 bg-gray-800 rounded-lg animate-pulse" />
      <div className="h-8 w-28 bg-gray-800 rounded-lg animate-pulse" />
    </div>
    <div className="flex gap-5 p-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="w-72 flex-shrink-0">
          <div className="h-6 w-24 bg-gray-800 rounded animate-pulse mb-3" />
          <div className="space-y-2">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="h-20 bg-gray-800/60 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default KanbanPageSkeleton;