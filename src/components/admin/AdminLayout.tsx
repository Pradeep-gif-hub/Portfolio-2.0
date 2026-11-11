import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileText, 
  Briefcase, 
  Award, 
  LogOut, 
  Menu, 
  X,
  Wrench,
  Settings,
  Image,
  Compass,
  MapPin,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/blogs', label: 'Blogs', icon: FileText },
  { path: '/admin/experience', label: 'Experience', icon: Briefcase },
  { path: '/admin/certifications', label: 'Certifications', icon: Award },
  { path: '/admin/places', label: 'Places', icon: MapPin },
  { path: '/admin/exploring', label: 'Exploring', icon: Compass },
  { path: '/admin/gallery', label: 'Gallery', icon: Image },
  { path: '/admin/tools', label: 'Tools', icon: Wrench },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-64 bg-theme-surface border-r border-theme-border z-50"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-lg font-semibold text-theme-text">Admin Panel</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-theme-muted hover:text-theme-accent"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-theme-accent-soft text-theme-accent'
                          : 'text-theme-muted hover:bg-theme-subtle hover:text-theme-text'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors w-full mt-8"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-200 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="bg-theme-surface border-b border-theme-border px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-theme-muted hover:text-theme-accent"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-theme-muted">Admin</span>
            <div className="w-8 h-8 rounded-full bg-theme-accent-soft border border-theme-border flex items-center justify-center text-theme-accent font-semibold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
