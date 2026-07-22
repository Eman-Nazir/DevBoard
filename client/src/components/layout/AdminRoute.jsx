import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore.js";
import { useGetMe } from "../../hooks/useAuth.js";

/**
 * AdminRoute  guards /admin specifically.
 * - Not logged in                 redirect to /login
 * - Logged in, user not loaded    render nothing yet (avoids a false
 *                                   "not admin" redirect while the store
 *                                   is still hydrating)
 * - Logged in, NOT a super admin  toast "Access denied" + redirect to /dashboard
 * - Logged in, IS a super admin   render the admin page
 */
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  // Validate token on mount  same as ProtectedRoute does
  useGetMe();
  const isDeniedAccess = isAuthenticated && !!user && !user.isSuperAdmin;

  useEffect(() => {
    if (isDeniedAccess) {
      toast.error("Access denied — Super Admins only");
    }
  }, [isDeniedAccess]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!user) {
    return null;
  }

  if (isDeniedAccess) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;