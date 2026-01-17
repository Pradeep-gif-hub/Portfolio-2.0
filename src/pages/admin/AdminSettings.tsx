import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Star } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';
import { Button } from '../../components/ui/Button';
import { projectApi, experienceApi, certificationApi } from '../../utils/api';

interface Settings {
  fullName: string;
  tagline: string;
  bio: string;
  profileImage: string;
  resumeUrl?: string;
  whatIDo?: string;
  focusArea?: string;
  achievements?: string[];
  email: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  buyMeACoffee?: string;
  discord?: string;
  spotify?: string;
}

interface Project {
  _id: string;
  title: string;
  featured?: boolean;
}

interface Experience {
  _id: string;
  company: string;
  role: string;
  featured?: boolean;
}

interface Certification {
  _id: string;
  title: string;
  issuer: string;
  featured?: boolean;
}

// Settings API functions
async function getSettings() {
  const response = await fetch('/api/admin/content?type=settings', {
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}` }
  });
  if (!response.ok) throw new Error('Failed to fetch settings');
  const data = await response.json();
  return data.data;
}

async function updateSettings(settings: Settings) {
  const response = await fetch('/api/admin/content?type=settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
    },
    body: JSON.stringify(settings),
  });
  if (!response.ok) throw new Error('Failed to update settings');
  const data = await response.json();
  return data.data;
}

export const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'featured'>('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    fullName: '',
    tagline: '',
    bio: '',
    profileImage: '',
    resumeUrl: '',
    whatIDo: '',
    focusArea: '',
    achievements: [],
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    twitter: '',
    buyMeACoffee: '',
    discord: '',
    spotify: '',
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    fetchAllSettingsData();
    fetchAllContent();
  }, []);

  const fetchAllSettingsData = async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings({
        fullName: data.fullName || '',
        tagline: data.tagline || '',
        bio: data.bio || '',
        profileImage: data.profileImage || '',
        resumeUrl: data.resumeUrl || '',
        whatIDo: data.whatIDo || '',
        focusArea: data.focusArea || '',
        achievements: data.achievements || [],
        email: data.email || '',
        phone: data.phone || '',
        github: data.github || '',
        linkedin: data.linkedin || '',
        twitter: data.twitter || '',
        buyMeACoffee: data.buyMeACoffee || '',
        discord: data.discord || '',
        spotify: data.spotify || '',
      });
    } catch (error) {
      alert('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllContent = async () => {
    try {
      const [projectsData, experiencesData, certificationsData] = await Promise.all([
        projectApi.getAll(),
        experienceApi.getAll(),
        certificationApi.getAll(),
      ]);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setExperiences(Array.isArray(experiencesData) ? experiencesData : []);
      setCertifications(Array.isArray(certificationsData) ? certificationsData : []);
    } catch (error) {
      // Failed to fetch content
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Filter out empty achievements before saving
      const settingsToSave = {
        ...settings,
        achievements: settings.achievements?.filter(line => line.trim()) || []
      };
      await updateSettings(settingsToSave);
      alert('Settings saved successfully!');
    } catch (error) {
      // Error occurred while saving settings
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeaturedProject = async (id: string) => {
    try {
      const project = projects.find(p => p._id === id);
      if (!project) {

        return;
      }
      const currentFeatured = project.featured || false;
      const newValue = !currentFeatured;
      const updatePayload = { featured: newValue };
      await projectApi.update(id, updatePayload);
      // Refetch all projects to ensure consistency
      const updatedData = await projectApi.getAll();
      setProjects(Array.isArray(updatedData) ? updatedData : []);
    } catch (error) {
      // Error occurred while toggling featured project
      alert('Failed to update project');
    }
  };

  const toggleFeaturedExperience = async (id: string) => {
    try {
      const exp = experiences.find(e => e._id === id);
      if (!exp) {

        return;
      }
      const currentFeatured = exp.featured || false;
      const newValue = !currentFeatured;
      const updatePayload = { featured: newValue };
      await experienceApi.update(id, updatePayload);
      // Refetch all experiences to ensure consistency
      const updatedData = await experienceApi.getAll();
      setExperiences(Array.isArray(updatedData) ? updatedData : []);
    } catch (error) {
      // Error occurred while toggling featured experience
      alert('Failed to update experience');
    }
  };

  const toggleFeaturedCertification = async (id: string) => {
    try {
      const cert = certifications.find(c => c._id === id);
      if (!cert) {

        return;
      }
      const currentFeatured = cert.featured || false;
      const newValue = !currentFeatured;
      const updatePayload = { featured: newValue };
      await certificationApi.update(id, updatePayload);
      // Refetch all certifications to ensure consistency
      const updatedData = await certificationApi.getAll();
      setCertifications(Array.isArray(updatedData) ? updatedData : []);
    } catch (error) {
      // Error occurred while toggling featured certification
      alert('Failed to update certification');
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'featured', label: 'Featured Content', icon: Star },
  ];

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading settings...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Portfolio Settings</h1>
              <p className="text-text-secondary">Manage your personal info and homepage display</p>
            </div>
            <Button onClick={handleSave} disabled={saving} className="btn-neon flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-6 border-b border-dark-700">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 border-b-2 transition-all whitespace-nowrap text-sm sm:text-base ${
                  activeTab === id
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-text-secondary hover:text-white'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass-effect p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={settings.fullName}
                        onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tagline *</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      placeholder="Full-Stack Developer | Tech Enthusiast"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Bio *</label>
                    <textarea
                      value={settings.bio}
                      onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                      rows={6}
                      placeholder="Write a compelling bio about yourself..."
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      required
                    />
                  </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="tel"
                        value={settings.phone || ''}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      />
                    </div>


                  <div>
                    <label className="block text-sm font-medium mb-2">Profile Image URL *</label>
                    <input
                      type="url"
                      value={settings.profileImage}
                      onChange={(e) => setSettings({ ...settings, profileImage: e.target.value })}
                      placeholder="https://example.com/profile.jpg"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      required
                    />
                    {settings.profileImage && (
                      <img
                        src={settings.profileImage}
                        alt="Profile preview"
                        className="mt-2 w-32 h-32 rounded-full object-cover"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Resume URL</label>
                    <input
                      type="url"
                      value={settings.resumeUrl || ''}
                      onChange={(e) => setSettings({ ...settings, resumeUrl: e.target.value })}
                      placeholder="https://example.com/resume.pdf"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">What I Do</label>
                    <textarea
                      value={settings.whatIDo || ''}
                      onChange={(e) => setSettings({ ...settings, whatIDo: e.target.value })}
                      rows={3}
                      placeholder="Brief description of what you do..."
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Focus Area</label>
                    <input
                      type="text"
                      value={settings.focusArea || ''}
                      onChange={(e) => setSettings({ ...settings, focusArea: e.target.value })}
                      placeholder="e.g., Web Development, AI/ML, Mobile Apps"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Achievements & Highlights</label>
                    <textarea
                      value={settings.achievements?.join('\n') || ''}
                      onChange={(e) => setSettings({ ...settings, achievements: e.target.value.split('\n') })}
                      rows={5}
                      placeholder="One achievement per line&#10;🏆 Won Best Project Award 2024&#10;🎓 Completed 50+ online courses&#10;💼 Led team of 5 developers"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary font-mono text-sm"
                    />
                    <p className="text-xs text-text-tertiary mt-1">Enter one achievement per line. These will appear in the About page.</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Social Links</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub</label>
                    <input
                      type="url"
                      value={settings.github || ''}
                      onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={settings.linkedin || ''}
                      onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Twitter</label>
                    <input
                      type="url"
                      value={settings.twitter || ''}
                      onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                      placeholder="https://twitter.com/username"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Buy Me a Coffee</label>
                    <input
                      type="url"
                      value={settings.buyMeACoffee || ''}
                      onChange={(e) => setSettings({ ...settings, buyMeACoffee: e.target.value })}
                      placeholder="https://www.buymeacoffee.com/username"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Discord</label>
                    <input
                      type="text"
                      value={settings.discord || ''}
                      onChange={(e) => setSettings({ ...settings, discord: e.target.value })}
                      placeholder="username#1234"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Spotify Profile</label>
                    <input
                      type="url"
                      value={settings.spotify || ''}
                      onChange={(e) => setSettings({ ...settings, spotify: e.target.value })}
                      placeholder="https://open.spotify.com/user/username"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Featured Content Tab */}
          {activeTab === 'featured' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Featured Projects */}
              <div className="glass-effect p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Featured Projects</h3>
                <p className="text-text-secondary mb-4">
                  Toggle projects to display on the homepage ({(projects || []).filter(p => p.featured).length} featured)
                </p>
                {(projects || []).length === 0 ? (
                  <p className="text-text-secondary">No projects available</p>
                ) : (
                  <div className="space-y-2">
                    {(projects || []).map((project) => (
                      <div
                        key={project._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                      >
                        <span className="break-words">{project.title}</span>
                        <button
                          onClick={() => toggleFeaturedProject(project._id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            project.featured || false
                              ? 'bg-accent-primary text-white'
                              : 'bg-dark-700 text-text-secondary hover:bg-dark-600'
                          }`}
                        >
                          {project.featured || false ? '★ Featured' : 'Add'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Experience */}
              <div className="glass-effect p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Featured Experience</h3>
                <p className="text-text-secondary mb-4">
                  Toggle work experiences to display on the homepage ({(experiences || []).filter(e => e.featured).length} featured)
                </p>
                {(experiences || []).length === 0 ? (
                  <p className="text-text-secondary">No experiences available</p>
                ) : (
                  <div className="space-y-2">
                    {(experiences || []).map((exp) => (
                      <div
                        key={exp._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-medium break-words">{exp.role}</div>
                          <div className="text-sm text-text-secondary">{exp.company}</div>
                        </div>
                        <button
                          onClick={() => toggleFeaturedExperience(exp._id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            exp.featured || false
                              ? 'bg-accent-primary text-white'
                              : 'bg-dark-700 text-text-secondary hover:bg-dark-600'
                          }`}
                        >
                          {exp.featured || false ? '★ Featured' : 'Add'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Featured Certifications */}
              <div className="glass-effect p-4 sm:p-6 rounded-xl">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Featured Certifications</h3>
                <p className="text-text-secondary mb-4">
                  Toggle certifications to display on the homepage ({(certifications || []).filter(c => c.featured).length} featured)
                </p>
                {(certifications || []).length === 0 ? (
                  <p className="text-text-secondary">No certifications available</p>
                ) : (
                  <div className="space-y-2">
                    {(certifications || []).map((cert) => (
                      <div
                        key={cert._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-medium break-words">{cert.title}</div>
                          <div className="text-sm text-text-secondary">{cert.issuer}</div>
                        </div>
                        <button
                          onClick={() => toggleFeaturedCertification(cert._id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all flex-shrink-0 ${
                            cert.featured || false
                              ? 'bg-accent-primary text-white'
                              : 'bg-dark-700 text-text-secondary hover:bg-dark-600'
                          }`}
                        >
                          {cert.featured || false ? '★ Featured' : 'Add'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
