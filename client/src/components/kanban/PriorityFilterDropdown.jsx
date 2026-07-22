import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Check } from "lucide-react";
import { cn } from "../../utils/cn.js";

const PRIORITIES = [
  { value: "all", label: "All priorities" },
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const PriorityFilterDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const activeLabel = PRIORITIES.find((p) => p.value === value)?.label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors border",
          value !== "all"
            ? "bg-violet-600/20 text-violet-400 border-violet-500/30"
            : "bg-gray-800/60 text-gray-400 border-transparent hover:text-gray-200"
        )}
      >
        <SlidersHorizontal size={12} />
        {value === "all" ? "Priority" : activeLabel}
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full mt-1.5 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-20 py-1",
            "left-0 sm:left-auto sm:right-0",
            "w-40 min-w-[10rem] max-w-[calc(100vw-2rem)]"
          )}
        >
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              onClick={() => { onChange(p.value); setOpen(false); }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 sm:py-1.5 text-xs text-gray-300 hover:bg-gray-800 active:bg-gray-800 hover:text-white transition-colors"
            >
              <span className="truncate">{p.label}</span>
              {value === p.value && <Check size={12} className="text-violet-400 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityFilterDropdown;