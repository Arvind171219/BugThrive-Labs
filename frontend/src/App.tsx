import { Navigate, Route, Routes } from "react-router-dom";

import { GuestRoute, ProtectedRoute } from "@/auth/routes";
import { AppLayout } from "@/components/layout/AppLayout";
import { allNavItems } from "@/components/layout/navigation";
import { AchievementsPage } from "@/pages/AchievementsPage";
import { BrowseLabsPage } from "@/pages/BrowseLabsPage";
import { CertificatesPage } from "@/pages/CertificatesPage";
import { CourseDetailPage } from "@/pages/CourseDetailPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LearningPathDetailPage } from "@/pages/LearningPathDetailPage";
import { LearningPathsPage } from "@/pages/LearningPathsPage";
import { LoginPage } from "@/pages/LoginPage";
import { MyLearningPage } from "@/pages/MyLearningPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { SectionPage } from "@/pages/SectionPage";

const implemented = new Set(["/dashboard", "/labs", "/learning-paths", "/my-learning", "/achievements", "/certificates"]);
const placeholderRoutes = allNavItems.filter((item) => !implemented.has(item.path));

export default function App() {
  return (
    <Routes>
      {/* Public: signed-in users are redirected to /dashboard */}
      <Route element={<GuestRoute />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Everything else requires a valid session */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="labs" element={<BrowseLabsPage />} />
          <Route path="learning-paths" element={<LearningPathsPage />} />
          <Route path="learning-paths/:pathId" element={<LearningPathDetailPage />} />
          <Route path="my-learning" element={<MyLearningPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="courses/:slug" element={<CourseDetailPage />} />
          <Route path="courses/:slug/sections/:sectionId" element={<SectionPage />} />
          {placeholderRoutes.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<PlaceholderPage title={item.label} description={item.description} icon={item.icon} />}
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
