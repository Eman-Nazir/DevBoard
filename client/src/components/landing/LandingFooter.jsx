import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

const LandingFooter = () => (
  <footer className="border-t border-gray-800/60 py-10 px-6 bg-gray-950">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-6 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-md flex items-center justify-center">
            <LayoutDashboard size={14} className="text-white" />
          </div>
          <span className="text-white font-semibold text-sm">DevBoard</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Features</a>
          <a href="#stack" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Stack</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Pricing</a>
          <Link to="/login" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Sign in</Link>
          <Link to="/register" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">Register</Link>
        </div>
      </div>
      <div className="border-t border-gray-800/60 pt-6 flex items-center justify-between flex-wrap gap-3">
        <p className="text-gray-700 text-xs">
          Built with React · Node.js · MongoDB · Socket.io · Tailwind CSS
        </p>
        <p className="text-gray-700 text-xs">DevBoard — Project management for dev teams</p>
      </div>
    </div>
  </footer>
);

export default LandingFooter;