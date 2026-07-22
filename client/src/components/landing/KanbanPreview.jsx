import { motion } from "framer-motion";
import { KANBAN_PREVIEW_COLUMNS } from "../../data/landingContent.js";

const KanbanPreview = () => (
  <div className="relative w-full max-w-2xl mx-auto mt-16 px-4 sm:px-0">
    <div className="absolute inset-0 bg-violet-600/20 blur-3xl rounded-3xl" />

    <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-950">
        <div className="w-3 h-3 rounded-full bg-red-500/60" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
        <div className="w-3 h-3 rounded-full bg-green-500/60" />
        <div className="flex-1 mx-4 h-5 bg-gray-800 rounded-md" />
        <div className="w-16 h-5 bg-violet-600/40 rounded-md" />
      </div>

      <div className="flex gap-3 p-4 overflow-x-auto">
        {KANBAN_PREVIEW_COLUMNS.map((col, ci) => (
          <div key={ci} className="w-40 sm:w-auto sm:flex-1 flex-shrink-0 sm:flex-shrink min-w-0">
            <div className="flex items-center gap-1.5 mb-2.5 px-1">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
              <span className="text-white text-xs font-medium truncate">{col.title}</span>
              <span className="text-gray-600 text-xs bg-gray-800 px-1.5 rounded-full ml-auto flex-shrink-0">{col.count}</span>
            </div>
            <div className="space-y-2">
              {col.tasks.map((task, ti) => (
                <motion.div
                  key={ti}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.15 + ti * 0.1 }}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-2.5"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        background: col.color + "20",
                        color: col.color,
                        fontSize: "10px",
                      }}
                    >
                      {ti === 0 ? "high" : "medium"}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs font-medium break-words">{task}</p>
                  <div className="flex items-center justify-end mt-2">
                    <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs flex-shrink-0">
                      {["A", "B", "C"][ci]}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default KanbanPreview;