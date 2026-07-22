import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className={`relative bg-gray-900 border border-gray-800 w-full ${maxWidth} max-h-[92vh] sm:max-h-[85vh] rounded-t-2xl sm:rounded-2xl z-10 flex flex-col overflow-hidden`}
          >
            {/* Drag handle, mobile only */}
            <div className="flex justify-center pt-2 pb-1 sm:hidden flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-700" />
            </div>

            {title && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-800 flex-shrink-0">
                <h2 className="text-white font-semibold text-base truncate pr-2">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="text-gray-500 hover:text-white transition-colors p-2 sm:p-1 rounded-md hover:bg-gray-800 active:bg-gray-800 flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="p-4 sm:p-6 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;