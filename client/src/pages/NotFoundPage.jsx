import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-7 h-7 bg-violet-600 rounded-md flex items-center justify-center">
            <LayoutDashboard size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight">DevBoard</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* 404 number */}
          <p className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-violet-400 to-violet-700 mb-6 leading-none">
            404
          </p>

          <h1 className="text-white text-2xl font-semibold mb-3">
            Page not found
          </h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5"
            >
              <LayoutDashboard size={15} />
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              <ArrowLeft size={15} />
              Go back
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;