import { cn } from "../../utils/cn.js";

const Input = ({ label, error, className = "", style = {}, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      )}
      <input
        className={cn(
          "w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 sm:py-2.5 text-sm",
          "focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className
        )}
        style={{ fontSize: "16px", ...style }}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1 break-words">{error}</p>}
    </div>
  );
};

export default Input;