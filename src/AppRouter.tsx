import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { GalleryPage } from "./pages/GalleryPage";
import { BlogPage } from "./pages/BlogPage";
import { AboutPage } from "./pages/AboutPage";
import { LinksPage } from "./pages/LinksPage";
import { CertificationsPage } from "./pages/CertificationsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ExperienceDetailPage from "./pages/ExperienceDetailPage";
import CertificationDetailPage from "./pages/CertificationDetailPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProjects } from "./pages/admin/AdminProjects";
import { AdminBlogs } from "./pages/admin/AdminBlogs";
import { AdminExperience } from "./pages/admin/AdminExperience";
import { AdminCertifications } from "./pages/admin/AdminCertifications";
import { AdminGallery } from "./pages/admin/AdminGallery";
import { AdminTools } from "./pages/admin/AdminTools";
import { AdminSettings } from "./pages/admin/AdminSettings";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Admin Login - Outside App layout (no navbar/footer) */}
            <Route path="/admin-login" element={<AdminLoginPage />} />
            
            {/* Admin Panel Routes - No navbar/footer */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/blogs" element={<AdminBlogs />} />
            <Route path="/admin/experience" element={<AdminExperience />} />
            <Route path="/admin/certifications" element={<AdminCertifications />} />
            <Route path="/admin/gallery" element={<AdminGallery />} />
            <Route path="/admin/tools" element={<AdminTools />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            {/* Main routes with App layout */}
            <Route path="/" element={<App />}>
              <Route index element={<HomePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="project/:id" element={<ProjectDetailPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogDetailPage />} />
              <Route path="certifications" element={<CertificationsPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="links" element={<LinksPage />} />
              <Route path="experience/:id" element={<ExperienceDetailPage />} />
              <Route path="certification/:id" element={<CertificationDetailPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};
