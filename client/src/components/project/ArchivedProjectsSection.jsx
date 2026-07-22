import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, ChevronDown } from "lucide-react";
import ArchivedProjectCard from "./ArchivedProjectCard.jsx";

const ArchivedProjectsSection = ({ projects, onRestore, restoring }) => {
  const [open, setOpen] = useState(false);

  if (projects.length === 0) return null;

  return (
    <div className="mt-8 sm:mt-10">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors mb-4"
      >
        <Archive size={14} />
        <span>Archived projects ({projects.length})</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {projects.map((project, i) => (
                <ArchivedProjectCard
                  key={project._id}
                  project={project}
                  delay={i * 0.05}
                  onRestore={onRestore}
                  restoring={restoring}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArchivedProjectsSection;