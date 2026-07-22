import { motion } from "framer-motion";

const Section = ({ title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
  >
    <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-800">
      <h2 className="text-white font-medium text-sm break-words">{title}</h2>
      {description && <p className="text-gray-500 text-xs mt-0.5 break-words">{description}</p>}
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </motion.div>
);

export default Section;