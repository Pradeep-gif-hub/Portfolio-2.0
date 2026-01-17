import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Save } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';
import { Button } from '../../components/ui/Button';
import { experienceApi } from '../../utils/api';

interface Experience {
  _id?: string;
  role: string;
  company: string;
  logo: string;
  duration: string;
  points: string[];
  techStack: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const AdminExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [formData, setFormData] = useState<Experience>({
    role: '',
    company: '',
    logo: '',
    duration: '',
    points: [],
    techStack: [],
    featured: false,
  });
  const [pointsInput, setPointsInput] = useState('');
  const [techStackInput, setTechStackInput] = useState('');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await experienceApi.getAll();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (error) {
      alert('Failed to load experiences');
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredExperiences = Array.isArray(experiences) ? experiences.filter(exp =>
    exp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.company.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        await experienceApi.delete(id);
        setExperiences(experiences.filter(e => e._id !== id));
      } catch (error) {
        // Error occurred while deleting experience
        alert('Failed to delete experience');
      }
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingExp(exp);
    setFormData(exp);
    setPointsInput(exp.points.join('\n'));
    setTechStackInput(exp.techStack.join(', '));
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingExp(null);
    setFormData({
      role: '',
      company: '',
      logo: '',
      duration: '',
      points: [],
      techStack: [],
      featured: false,
    });
    setPointsInput('');
    setTechStackInput('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const expData = {
        ...formData,
        points: pointsInput.split('\n').map(s => s.trim()).filter(Boolean),
        techStack: techStackInput.split(',').map(s => s.trim()).filter(Boolean),
      };
      
      if (editingExp?._id) {
        const updated = await experienceApi.update(editingExp._id, expData);
        setExperiences(experiences.map(e => e._id === editingExp._id ? updated : e));
      } else {
        const created = await experienceApi.create(expData);
        setExperiences([created, ...experiences]);
      }
      setShowModal(false);
    } catch (error) {
      // Error occurred while saving experience
      alert('Failed to save experience');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Experience</h1>
              <p className="text-text-secondary">Manage your work experience</p>
            </div>
            <Button onClick={handleCreate} className="btn-neon flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Plus size={20} />
              New Experience
            </Button>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary text-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
              <p className="mt-4 text-text-secondary">Loading experiences...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExperiences.map((exp) => (
                <motion.div
                  key={exp._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect p-6 rounded-xl hover:border-accent-primary/30 border-2 border-transparent transition-all"
                >
                  <div className="flex items-start gap-4">
                    <img src={exp.logo} alt={exp.company} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                          <p className="text-accent-primary mb-2">{exp.company}</p>
                          <p className="text-sm text-text-tertiary mb-3">{exp.duration}</p>
                          <div className="flex flex-wrap gap-2">
                            {exp.techStack.slice(0, 5).map((tech, idx) => (
                              <span key={idx} className="px-2 py-1 bg-accent-primary/10 rounded text-accent-primary text-sm">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(exp)}
                            className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-accent-primary"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(exp._id!)}
                            className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-dark-900 rounded-xl p-4 md:p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingExp ? 'Edit Experience' : 'Add New Experience'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-dark-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Role / Position *</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Company *</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Logo URL *</label>
                      <input
                        type="url"
                        value={formData.logo}
                        onChange={(e) => handleInputChange('logo', e.target.value)}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        placeholder="https://example.com/logo.png"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Duration *</label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        placeholder="Jan 2022 - Present"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Key Points (one per line)</label>
                    <textarea
                      value={pointsInput}
                      onChange={(e) => setPointsInput(e.target.value)}
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary font-mono text-sm"
                      rows={6}
                      placeholder="Led development of microservices&#10;Implemented CI/CD pipelines&#10;Mentored team of 5 developers"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      placeholder="React, Node.js, TypeScript, AWS"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        className="w-4 h-4 rounded border-dark-700 bg-dark-800 text-accent-primary focus:ring-accent-primary"
                      />
                      <span className="text-sm">Featured</span>
                    </label>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="btn-neon flex items-center gap-2">
                      <Save size={16} />
                      {editingExp ? 'Update' : 'Create'} Experience
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </AdminLayout>
    </ProtectedRoute>
  );
};
