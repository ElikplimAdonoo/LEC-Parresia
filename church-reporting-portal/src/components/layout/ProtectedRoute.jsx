import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 gap-3">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium">Verifying credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profile) {
    return <Navigate to="/setup" replace />;
  }

  if (!profile.approved && profile.role !== "EXECUTIVE") {
    return <Navigate to="/pending" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    // Redirect to proper role dashboard
    if (profile.role === "EXECUTIVE") return <Navigate to="/executive" replace />;
    if (profile.role === "ZONAL_HEAD") return <Navigate to="/zonal" replace />;
    if (profile.role === "BRANCH_PASTOR") return <Navigate to="/pastor" replace />;
    return <Navigate to="/pending" replace />;
  }

  return children;
};
