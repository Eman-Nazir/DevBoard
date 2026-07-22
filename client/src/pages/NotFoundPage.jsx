import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 sm:p-6">
      <div className="text-center w-full max-w-xs sm:max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8 sm:mb-12">
          <div className="w-7 h-7 bg-violet-600 rounded-md flex items-center justify-center flex-shrink-0">
            <LayoutDashboard size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight truncate">DevBoard</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 404 number */}
          <p className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-violet-400 to-violet-700 mb-4 sm:mb-6 leading-none">
            404
          </p>

          <h1 className="text-white text-xl sm:text-2xl font-semibold mb-3">
            Page not found
          </h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2 sm:px-0">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-500 text-white font-medium px-5 py-3 sm:py-2.5 rounded-xl text-sm transition-all sm:hover:-translate-y-0.5"
            >
              <LayoutDashboard size={15} className="flex-shrink-0" />
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-700 text-gray-300 font-medium px-5 py-3 sm:py-2.5 rounded-xl text-sm transition-colors"
            >
              <ArrowLeft size={15} className="flex-shrink-0" />
              Go back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;