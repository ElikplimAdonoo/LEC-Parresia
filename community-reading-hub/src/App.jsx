import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { LibraryPage } from "./pages/LibraryPage";
import { ReaderPage } from "./pages/ReaderPage";
import { BookshelfPage } from "./pages/BookshelfPage";
import { PlansPage } from "./pages/PlansPage";
import { CommunityPage } from "./pages/CommunityPage";
import { SuspendedPage } from "./pages/SuspendedPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/suspended" element={<SuspendedPage />} />

            <Route
              path="/read/:id"
              element={
                <ProtectedRoute>
                  <ReaderPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/shelf"
              element={
                <ProtectedRoute>
                  <BookshelfPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/plans"
              element={
                <ProtectedRoute>
                  <PlansPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <CommunityPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
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