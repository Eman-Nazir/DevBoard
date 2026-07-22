import { motion } from "framer-motion";

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 sm:py-20 text-center px-4"
    >
      {Icon && (
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 flex-shrink-0">
          <Icon size={22} className="text-gray-600" />
        </div>
      )}
      {title && (
        <h3 className="text-white font-medium text-base mb-2 break-words">{title}</h3>
      )}
      {description && (
        <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-6 break-words">
          {description}
        </p>
      )}
      {action && action}
    </motion.div>
  );
};

export default EmptyState;