import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, FileText, Briefcase, Award, TrendingUp, Wrench, Settings, Image } from 'lucide-react';
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
  lastUpdated: string;
}

const StatCard = ({ icon: Icon, label, value, color, link }: any) => (
  <Link to={link}>
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-effect p-6 rounded-xl border-2 border-dark-700 hover:border-accent-primary/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}/20`}>
          <Icon size={24} className={`text-${color}`} />
        </div>
        <TrendingUp size={20} className="text-green-400" />
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-text-secondary text-sm">{label}</p>
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

      const [projects, blogs, experience, certifications, tools, gallery] = await Promise.all([
        fetch('/api/admin/content?type=projects', { headers }).then(r => r.json()),
        fetch('/api/admin/content?type=blogs', { headers }).then(r => r.json()),
        fetch('/api/admin/content?type=experience', { headers }).then(r => r.json()),
        fetch('/api/admin/content?type=certifications', { headers }).then(r => r.json()),
        fetch('/api/admin/content?type=tools', { headers }).then(r => r.json()),
        fetch('/api/admin/content?type=gallery', { headers }).then(r => r.json()),
      ]);

      setStats({
        projects: Array.isArray(projects) ? projects.length : projects.data?.length || 0,
        blogs: Array.isArray(blogs) ? blogs.length : blogs.data?.length || 0,
        experience: Array.isArray(experience) ? experience.length : experience.data?.length || 0,
        certifications: Array.isArray(certifications) ? certifications.length : certifications.data?.length || 0,
        tools: Array.isArray(tools) ? tools.length : tools.data?.length || 0,
        gallery: Array.isArray(gallery) ? gallery.length : gallery.data?.length || 0,
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-text-secondary">
                  Welcome back! Here's an overview of your portfolio.
                </p>
              </div>
              <Link to="/admin/settings" className="btn-neon flex items-center gap-2 px-6 py-3">
                <Settings size={20} />
                Portfolio Settings
              </Link>
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
              <p className="mt-4 text-text-secondary">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                  icon={FolderKanban}
                  label="Total Projects"
                  value={stats.projects}
                  color="accent-primary"
                  link="/admin/projects"
                />
                <StatCard
                  icon={FileText}
                  label="Blog Posts"
                  value={stats.blogs}
                  color="blue-500"
                  link="/admin/blogs"
                />
                <StatCard
                  icon={Briefcase}
                  label="Work Experience"
                  value={stats.experience}
                  color="purple-500"
                  link="/admin/experience"
                />
                <StatCard
                  icon={Award}
                  label="Certifications"
                  value={stats.certifications}
                  color="green-500"
                  link="/admin/certifications"
                />
                <StatCard
                  icon={Wrench}
                  label="Tech Stack Tools"
                  value={stats.tools}
                  color="orange-500"
                  link="/admin/tools"
                />
                <StatCard
                  icon={Image}
                  label="Gallery Images"
                  value={stats.gallery}
                  color="pink-500"
                  link="/admin/gallery"
                />
              </div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-effect p-6 rounded-xl"
              >
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Link
                    to="/admin/projects"
                    className="p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors text-center"
                  >
                    <FolderKanban className="mx-auto mb-2 text-accent-primary" size={24} />
                    <span className="text-sm">Manage Projects</span>
                  </Link>
                  <Link
                    to="/admin/blogs"
                    className="p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors text-center"
                  >
                    <FileText className="mx-auto mb-2 text-blue-500" size={24} />
                    <span className="text-sm">Write Blog</span>
                  </Link>
                  <Link
                    to="/admin/experience"
                    className="p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors text-center"
                  >
                    <Briefcase className="mx-auto mb-2 text-purple-500" size={24} />
                    <span className="text-sm">Add Experience</span>
                  </Link>
                  <Link
                    to="/admin/certifications"
                    className="p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors text-center"
                  >
                    <Award className="mx-auto mb-2 text-green-500" size={24} />
                    <span className="text-sm">Add Certificate</span>
                  </Link>
                  <Link
                    to="/admin/tools"
                    className="p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors text-center"
                  >
                    <Wrench className="mx-auto mb-2 text-orange-500" size={24} />
                    <span className="text-sm">Manage Tools</span>
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors text-center"
                  >
                    <Settings className="mx-auto mb-2 text-yellow-500" size={24} />
                    <span className="text-sm">Settings</span>
                  </Link>
                </div>
              </motion.div>
            </>
          )}

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-text-tertiary text-sm"
          >
            Last updated: {stats.lastUpdated}
          </motion.div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
