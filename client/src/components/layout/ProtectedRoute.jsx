import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/authStore.js";
import { useGetMe } from "../../hooks/useAuth.js";

/**
 * ProtectedRoute — guards all authenticated pages.
 *
 * Two layers of protection:
 * 1. isAuthenticated — fast check from localStorage (instant, no flicker)
 * 2. useGetMe — validates the token is still accepted by the server on mount
 *    If the token has expired and refresh also fails, axiosInstance fires
 *    auth:logout → authStore clears → isAuthenticated becomes false → redirect.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  // Validate token on mount — runs silently in background
  // If it fails, axiosInstance + authStore handle the redirect automatically
  useGetMe();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;