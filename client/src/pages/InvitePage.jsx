import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle, Loader2, LayoutDashboard } from "lucide-react";
import axiosInstance from "../api/axiosInstance.js";
import useAuthStore from "../store/authStore.js";

/**
 * InvitePage
 * Handles the workspace join-by-invite-code flow.
 * URL: /invite/:code
 *
 * If user is logged in → join workspace automatically
 * If not logged in → redirect to register with return URL
 */
const InvitePage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/register?redirect=/invite/${code}`);
      return;
    }

    const joinWorkspace = async () => {
      try {
        const res = await axiosInstance.post(`/workspaces/join/${code}`);
        const workspace = res.data?.data?.workspace;
        setWorkspaceName(workspace?.name || "the workspace");
        setStatus("success");

        // Redirect to workspace after 2s
        setTimeout(() => {
          navigate(`/workspace/${workspace._id}`);
        }, 2000);
      } catch (err) {
        const msg = err.response?.data?.message || "Invalid or expired invite link";
        setMessage(msg);
        setStatus("error");
      }
    };

    joinWorkspace();
  }, [code, isAuthenticated]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xs sm:max-w-sm text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8 sm:mb-10">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight truncate">DevBoard</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8"
        >
          {/* Loading */}
          {status === "loading" && (
            <>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-violet-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Loader2 size={22} className="text-violet-400 animate-spin" />
              </div>
              <h1 className="text-white font-semibold text-base sm:text-lg mb-2">Joining workspace...</h1>
              <p className="text-gray-500 text-sm">Please wait a moment.</p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={22} className="text-green-400" />
              </div>
              <h1 className="text-white font-semibold text-base sm:text-lg mb-2">You're in!</h1>
              <p className="text-gray-400 text-sm mb-1 break-words">
                You've joined <span className="text-white font-medium">{workspaceName}</span>.
              </p>
              <p className="text-gray-600 text-xs">Redirecting you now...</p>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircle size={22} className="text-red-400" />
              </div>
              <h1 className="text-white font-semibold text-base sm:text-lg mb-2">Invite failed</h1>
              <p className="text-gray-400 text-sm mb-6 break-words">{message}</p>
              <Link
                to="/dashboard"
                className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 active:bg-violet-500 text-white font-medium py-3 sm:py-2.5 rounded-xl text-sm transition-colors"
              >
                <Users size={15} className="flex-shrink-0" />
                Go to Dashboard
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default InvitePage;