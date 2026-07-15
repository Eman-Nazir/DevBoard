import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn.js";

const SIZES = {
  sm: 14,
  md: 20,
  lg: 28,
};

const Spinner = ({ size = "md", className = "" }) => {
  return (
    <Loader2
      size={SIZES[size]}
      className={cn("animate-spin text-violet-400", className)}
    />
  );
};

export const FullPageSpinner = () => (
  <div className="min-h-screen bg-gray-950 flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

export default Spinner;