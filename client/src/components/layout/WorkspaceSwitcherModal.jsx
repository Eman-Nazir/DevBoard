import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Building2, CornerDownLeft } from "lucide-react";
import { useGetMyWorkspaces } from "../../hooks/useWorkspace.js";

const WorkspaceSwitcherModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { data: workspaces = [] } = useGetMyWorkspaces();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return workspaces;
    const q = query.toLowerCase();
    return workspaces.filter((ws) => ws.name.toLowerCase().includes(q));
  }, [workspaces, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const goTo = (ws) => {
    navigate(`/workspace/${ws._id}`);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      goTo(filtered[activeIndex]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -8 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-800">
          <Search size={15} className="text-gray-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jump to a workspace..."
            className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm focus:outline-none"
          />
          <kbd className="text-xs text-gray-600 bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5">esc</kbd>
        </div>

        <div className="max-h-72 overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-6">No workspaces found</p>
          ) : (
            filtered.map((ws, i) => (
              <button
                key={ws._id}
                onClick={() => goTo(ws)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === activeIndex ? "bg-gray-800" : "hover:bg-gray-800/60"
                }`}
              >
                <div className="w-7 h-7 rounded-md bg-violet-600/20 flex items-center justify-center text-violet-400 text-xs font-bold flex-shrink-0">
                  {ws.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-white text-sm truncate flex-1">{ws.name}</span>
                {i === activeIndex && (
                  <CornerDownLeft size={12} className="text-gray-600 flex-shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex items-center gap-3 px-4 py-2 border-t border-gray-800 text-gray-600 text-xs">
          <span className="flex items-center gap-1">
            <kbd className="bg-gray-800 border border-gray-700 rounded px-1 py-0.5">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="bg-gray-800 border border-gray-700 rounded px-1 py-0.5">↵</kbd> select
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkspaceSwitcherModal;