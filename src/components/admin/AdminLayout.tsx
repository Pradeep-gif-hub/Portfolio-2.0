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
  Image
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
    <div className="min-h-screen bg-dark-950 text-white">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-64 bg-dark-900 border-r border-dark-700 z-50"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl font-bold text-accent-primary">Admin Panel</h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-text-secondary hover:text-accent-primary"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-accent-primary/20 text-accent-primary'
                          : 'text-text-secondary hover:bg-dark-800 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors w-full mt-8"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="bg-dark-900 border-b border-dark-700 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-text-secondary hover:text-accent-primary"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">Admin</span>
            <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold">
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
