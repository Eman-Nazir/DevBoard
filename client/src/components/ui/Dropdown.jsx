import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn.js";

/**
 * Dropdown — accessible dropdown menu.
 *
 * Usage:
 * <Dropdown trigger={<button>Open</button>}>
 *   <Dropdown.Item onClick={...}>Edit</Dropdown.Item>
 *   <Dropdown.Item onClick={...} danger>Delete</Dropdown.Item>
 * </Dropdown>
 */
const Dropdown = ({ trigger, children, align = "right" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const alignClass = align === "right" ? "right-0" : "left-0";

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute top-full mt-1.5 z-50 min-w-[160px] bg-gray-900 border border-gray-800 rounded-xl shadow-xl shadow-black/30 overflow-hidden py-1",
              alignClass
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Dropdown.Item = ({ children, onClick, danger = false, icon: Icon }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors text-left",
      danger
        ? "text-red-400 hover:bg-red-400/10"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    )}
  >
    {Icon && <Icon size={14} />}
    {children}
  </button>
);

Dropdown.Divider = () => (
  <div className="my-1 border-t border-gray-800" />
);

export default Dropdown;