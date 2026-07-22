import { Link } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import { NAV_LINKS } from "../../data/landingContent.js";

const NavBar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 bg-violet-600 rounded-md flex items-center justify-center flex-shrink-0">
          <LayoutDashboard size={14} className="text-white" />
        </div>
        <span className="text-white font-semibold text-sm tracking-tight truncate">DevBoard</span>
      </div>
      <div className="hidden sm:flex items-center gap-1 bg-white/[0.03] border border-white/5 rounded-full p-1">
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="relative text-gray-400 hover:text-white text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors duration-200 hover:bg-white/[0.06]"
          >
            {label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors whitespace-nowrap">Sign in</Link>
        <Link to="/register" className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-3 sm:px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap">
          Get started
        </Link>
      </div>
    </div>
  </nav>
);

export default NavBar;