import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn.js";

const VARIANTS = {
  primary: "bg-violet-600 hover:bg-violet-500 active:bg-violet-500 text-white",
  secondary: "bg-gray-800 hover:bg-gray-700 active:bg-gray-700 text-gray-300",
  danger: "bg-red-600/10 hover:bg-red-600/20 active:bg-red-600/20 border border-red-600/30 text-red-400",
  ghost: "hover:bg-gray-800 active:bg-gray-800 text-gray-400 hover:text-white",
};

const SIZES = {
  sm: "px-3 py-2 sm:py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 sm:py-2 text-sm rounded-lg",
  lg: "px-5 py-3 sm:py-2.5 text-sm rounded-xl",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
        VARIANTS[variant],
        SIZES[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin flex-shrink-0" />}
      {children}
    </button>
  );
};

export default Button;