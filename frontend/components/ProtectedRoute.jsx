import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

/**
 * Guard wrapper for authenticated routes.
 * Redirects unauthenticated users to `/login`.
 * Restricts access to admin pages if `adminOnly` is enabled.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-teal-50">
        <Loader2 className="h-12 w-12 animate-spin text-teal-700" />
        <p className="mt-4 text-sm font-medium text-teal-850">Securing your connection...</p>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page and preserve attempted route path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== "admin") {
    // Deny access if page requires admin role but user is a regular customer
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
export { ProtectedRoute };
