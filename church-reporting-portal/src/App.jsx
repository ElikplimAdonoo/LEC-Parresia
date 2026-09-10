import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { ProfileSetupPage } from "./pages/ProfileSetupPage";
import { PendingApprovalPage } from "./pages/PendingApprovalPage";
import { ReportFormPage } from "./pages/ReportFormPage";
import { PastorDashboard } from "./pages/PastorDashboard";
import { ZonalDashboard } from "./pages/ZonalDashboard";
import { ExecutiveDashboard } from "./pages/ExecutiveDashboard";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

const HomeRedirect = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Loading portal session...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!profile) return <Navigate to="/setup" replace />;
  if (!profile.approved && profile.role !== "EXECUTIVE") return <Navigate to="/pending" replace />;

  if (profile.role === "EXECUTIVE") return <Navigate to="/executive" replace />;
  if (profile.role === "ZONAL_HEAD") return <Navigate to="/zonal" replace />;
  return <Navigate to="/submit" replace />;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/setup" element={<ProfileSetupPage />} />
            <Route path="/pending" element={<PendingApprovalPage />} />

            <Route
              path="/submit"
              element={
                <ProtectedRoute allowedRoles={["BRANCH_PASTOR", "EXECUTIVE"]}>
                  <ReportFormPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/pastor"
              element={
                <ProtectedRoute allowedRoles={["BRANCH_PASTOR", "EXECUTIVE"]}>
                  <PastorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/zonal"
              element={
                <ProtectedRoute allowedRoles={["ZONAL_HEAD", "EXECUTIVE"]}>
                  <ZonalDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/executive"
              element={
                <ProtectedRoute allowedRoles={["EXECUTIVE"]}>
                  <ExecutiveDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
