import { cn } from "../../utils/cn.js";

const VARIANTS = {
  default: "bg-gray-800 text-gray-400 border border-gray-700",
  violet: "bg-violet-400/10 text-violet-400 border border-violet-400/20",
  green: "bg-green-400/10 text-green-400 border border-green-400/20",
  red: "bg-red-400/10 text-red-400 border border-red-400/20",
  amber: "bg-amber-400/10 text-amber-400 border border-amber-400/20",
  blue: "bg-blue-400/10 text-blue-400 border border-blue-400/20",
};

const Badge = ({ children, variant = "default", className = "" }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full max-w-full truncate",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;