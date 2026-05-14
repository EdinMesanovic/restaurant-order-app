import { Navigate, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/app/layout/app-layout";
import { ProtectedRoute } from "@/components/routing/protected-route";

import NotFound from "@/pages/NotFound";
import Sample from "@/pages/Sample";
import ComingSoon from "@/pages/ComingSoon";
import LoginPage from "@/pages/Login";
import Dashboard from "./pages/Dashboard";

export default function Router() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pos" element={<Navigate to="/dashboard" replace />} />

          <Route path="pages">
            <Route path="sample" element={<Sample />} />
            <Route path="feature" element={<ComingSoon />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}
