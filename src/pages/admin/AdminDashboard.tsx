import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, FileText, Briefcase, Award, TrendingUp, Wrench, Settings, Image, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';

interface Stats {
  projects: number;
  blogs: number;
  experience: number;
  certifications: number;
  tools: number;
  gallery: number;
  places: number;
  lastUpdated: string;
}

const StatCard = ({ icon: Icon, label, value, link }: any) => (
  <Link to={link}>
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="surface-card p-6 hover:border-theme-accent/70 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-theme-accent-soft">
          <Icon size={22} className="text-theme-accent" />
        </div>
        <TrendingUp size={18} className="text-theme-muted" />
      </div>
      <h3 className="text-3xl font-semibold text-theme-text mb-1">{value}</h3>
      <p className="text-theme-muted text-sm">{label}</p>
    </motion.div>
  </Link>
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    projects: 0,
    blogs: 0,
    experience: 0,
    certifications: 0,
    tools: 0,
    gallery: 0,
    places: 0,
    lastUpdated: new Date().toLocaleDateString(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('admin_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [projects, blogs, experience, certifications, tools, gallery, places] = await Promise.all([
        fetch('/api/admin/content?type=projects', { headers }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/content?type=blogs', { headers }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/content?type=experience', { headers }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/content?type=certifications', { headers }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/content?type=tools', { headers }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/content?type=gallery', { headers }).then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/admin/content?type=places', { headers }).then(r => r.json()).catch(() => ({ data: [] })),
      ]);

      setStats({
        projects: Array.isArray(projects) ? projects.length : projects.data?.length || 0,
        blogs: Array.isArray(blogs) ? blogs.length : blogs.data?.length || 0,
        experience: Array.isArray(experience) ? experience.length : experience.data?.length || 0,
        certifications: Array.isArray(certifications) ? certifications.length : certifications.data?.length || 0,
        tools: Array.isArray(tools) ? tools.length : tools.data?.length || 0,
        gallery: Array.isArray(gallery) ? gallery.length : gallery.data?.length || 0,
        places: Array.isArray(places) ? places.length : places.data?.length || 0,
        lastUpdated: new Date().toLocaleDateString(),
      });
    } catch (error) {
      // Error occurred while fetching stats
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="heading-2 mb-1">Dashboard</h1>
                <p className="text-theme-muted text-sm">
                  Welcome back! Here's an overview of your portfolio.
                </p>
              </div>
              <Link
                to="/admin/settings"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-theme-accent text-theme-accent-contrast hover:bg-theme-accent-hover transition-colors text-sm font-medium"
              >
                <Settings size={18} />
                Portfolio Settings
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-theme-border border-t-theme-accent mx-auto"></div>
              <p className="mt-4 text-theme-muted text-sm">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatCard
                  icon={FolderKanban}
                  label="Total Projects"
                  value={stats.projects}
                  link="/admin/projects"
                />
                <StatCard
                  icon={FileText}
                  label="Blog Posts"
                  value={stats.blogs}
                  link="/admin/blogs"
                />
                <StatCard
                  icon={Briefcase}
                  label="Work Experience"
                  value={stats.experience}
                  link="/admin/experience"
                />
                <StatCard
                  icon={Award}
                  label="Certifications"
                  value={stats.certifications}
                  link="/admin/certifications"
                />
                <StatCard
                  icon={MapPin}
                  label="Visited Places"
                  value={stats.places}
                  link="/admin/places"
                />
                <StatCard
                  icon={Wrench}
                  label="Tech Stack Tools"
                  value={stats.tools}
                  link="/admin/tools"
                />
                <StatCard
                  icon={Image}
                  label="Gallery Images"
                  value={stats.gallery}
                  link="/admin/gallery"
                />
              </div>

              {/* Quick Actions */}
              <div className="surface-card p-6">
                <h2 className="heading-3 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  <Link
                    to="/admin/projects"
                    className="p-4 bg-theme-subtle border border-theme-border rounded-lg hover:border-theme-muted transition-colors text-center"
                  >
                    <FolderKanban className="mx-auto mb-2 text-theme-accent" size={22} />
                    <span className="text-xs font-medium text-theme-text">Manage Projects</span>
                  </Link>
                  <Link
                    to="/admin/blogs"
                    className="p-4 bg-theme-subtle border border-theme-border rounded-lg hover:border-theme-muted transition-colors text-center"
                  >
                    <FileText className="mx-auto mb-2 text-theme-accent" size={22} />
                    <span className="text-xs font-medium text-theme-text">Write Blog</span>
                  </Link>
                  <Link
                    to="/admin/experience"
                    className="p-4 bg-theme-subtle border border-theme-border rounded-lg hover:border-theme-muted transition-colors text-center"
                  >
                    <Briefcase className="mx-auto mb-2 text-theme-accent" size={22} />
                    <span className="text-xs font-medium text-theme-text">Add Experience</span>
                  </Link>
                  <Link
                    to="/admin/places"
                    className="p-4 bg-theme-subtle border border-theme-border rounded-lg hover:border-theme-muted transition-colors text-center"
                  >
                    <MapPin className="mx-auto mb-2 text-theme-accent" size={22} />
                    <span className="text-xs font-medium text-theme-text">Manage Places</span>
                  </Link>
                  <Link
                    to="/admin/certifications"
                    className="p-4 bg-theme-subtle border border-theme-border rounded-lg hover:border-theme-muted transition-colors text-center"
                  >
                    <Award className="mx-auto mb-2 text-theme-accent" size={22} />
                    <span className="text-xs font-medium text-theme-text">Add Certificate</span>
                  </Link>
                  <Link
                    to="/admin/tools"
                    className="p-4 bg-theme-subtle border border-theme-border rounded-lg hover:border-theme-muted transition-colors text-center"
                  >
                    <Wrench className="mx-auto mb-2 text-theme-accent" size={22} />
                    <span className="text-xs font-medium text-theme-text">Manage Tools</span>
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="p-4 bg-theme-subtle border border-theme-border rounded-lg hover:border-theme-muted transition-colors text-center"
                  >
                    <Settings className="mx-auto mb-2 text-theme-accent" size={22} />
                    <span className="text-xs font-medium text-theme-text">Settings</span>
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Last Updated */}
          <div className="mt-6 text-center text-theme-muted text-xs">
            Last updated: {stats.lastUpdated}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
