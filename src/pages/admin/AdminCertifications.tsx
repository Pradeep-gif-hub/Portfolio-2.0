import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Save } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';
import { Button } from '../../components/ui/Button';
import { certificationApi } from '../../utils/api';

interface Certification {
  _id?: string;
  title: string;
  issuer: string;
  year: number;
  month?: string;
  link?: string;
  image?: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration?: string;
  projectBased: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const AdminCertifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [formData, setFormData] = useState<Certification>({
    title: '',
    issuer: '',
    year: new Date().getFullYear(),
    month: '',
    link: '',
    image: '',
    skills: [],
    difficulty: 'Intermediate',
    duration: '',
    projectBased: false,
    featured: false,
  });
  const [skillsInput, setSkillsInput] = useState('');

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      setLoading(true);
      const data = await certificationApi.getAll();
      setCertifications(Array.isArray(data) ? data : []);
    } catch (error) {
      // Error occurred while fetching certifications
      alert('Failed to load certifications: ' + (error as Error).message);
      setCertifications([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCerts = Array.isArray(certifications) ? certifications.filter(cert =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      try {
        await certificationApi.delete(id);
        setCertifications(certifications.filter(c => c._id !== id));
      } catch (error) {
        // Error occurred while deleting certification
        alert('Failed to delete certification');
      }
    }
  };

  const handleEdit = (cert: Certification) => {
    setEditingCert(cert);
    setFormData(cert);
    setSkillsInput(cert.skills.join(', '));
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      year: new Date().getFullYear(),
      month: '',
      link: '',
      image: '',
      skills: [],
      difficulty: 'Intermediate',
      duration: '',
      projectBased: false,
      featured: false,
    });
    setSkillsInput('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const certData = {
        ...formData,
        skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean),
      };
      
      if (editingCert?._id) {
        const updated = await certificationApi.update(editingCert._id, certData);
        setCertifications(certifications.map(c => c._id === editingCert._id ? updated : c));
      } else {
        const created = await certificationApi.create(certData);
        setCertifications([created, ...certifications]);
      }
      setShowModal(false);
    } catch (error) {
      // Error occurred while saving certification
      alert('Failed to save certification');
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
              <h1 className="heading-2 mb-1">Certifications</h1>
              <p className="text-theme-muted text-sm">Manage your certifications</p>
            </div>
            <Button onClick={handleCreate} variant="primary" className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Plus size={18} />
              Add Certification
            </Button>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
            <input
              type="text"
              placeholder="Search certifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-theme-surface border border-theme-border rounded-lg focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent text-theme-text placeholder:text-theme-muted"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-theme-border border-t-theme-accent mx-auto"></div>
              <p className="mt-4 text-theme-muted text-sm">Loading certifications...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCerts.map((cert) => (
                <div
                  key={cert._id}
                  className="bg-theme-surface p-6 rounded-[10px] hover:border-theme-muted border border-theme-border shadow-card transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                        {cert.image && (
                          <img 
                            src={cert.image} 
                            alt={cert.issuer}
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cert.issuer)}&size=48&background=1F3A34&color=fff&bold=true`;
                            }}
                            className="w-12 h-12 rounded-lg object-cover border border-theme-border flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <h3 className="heading-4 break-words">{cert.title}</h3>
                          <p className="text-theme-accent text-sm">{cert.issuer}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-theme-muted mb-3">
                        <span>{cert.month ? `${cert.month} ${cert.year}` : cert.year}</span>
                        {cert.duration && (
                          <>
                            <span>•</span>
                            <span>{cert.duration}</span>
                          </>
                        )}
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-theme-accent-soft rounded-full text-theme-accent text-xs font-medium">
                          {cert.difficulty}
                        </span>
                        {cert.projectBased && (
                          <>
                            <span>•</span>
                            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-full text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                              Project-Based
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cert.skills.slice(0, 4).map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 bg-theme-subtle border border-theme-border rounded-full text-xs text-theme-muted whitespace-nowrap">
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 4 && (
                          <span className="px-2 py-0.5 text-theme-muted text-xs">
                            +{cert.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(cert)}
                        className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-theme-accent"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cert._id!)}
                        className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-rose-600 dark:text-rose-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
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
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.96, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 12 }}
                className="bg-theme-surface border border-theme-border rounded-[10px] p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-3">
                    {editingCert ? 'Edit Certification' : 'Create New Certification'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-theme-muted hover:text-theme-text"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-theme-text">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-2 bg-theme-subtle border border-theme-border rounded-lg focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent text-theme-text"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">Issuer *</label>
                      <input
                        type="text"
                        value={formData.issuer}
                        onChange={(e) => handleInputChange('issuer', e.target.value)}
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border rounded-lg focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent text-theme-text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">Year *</label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border rounded-lg focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent text-theme-text"
                        min="1990"
                        max={new Date().getFullYear() + 1}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">Month</label>
                      <input
                        type="text"
                        value={formData.month || ''}
                        onChange={(e) => handleInputChange('month', e.target.value)}
                        placeholder="e.g., January"
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border rounded-lg focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent text-theme-text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">Duration</label>
                      <input
                        type="text"
                        value={formData.duration || ''}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        placeholder="e.g., 3 months"
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border rounded-lg focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent text-theme-text"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-theme-text">Certificate Link</label>
                    <input
                      type="url"
                      value={formData.link || ''}
                      onChange={(e) => handleInputChange('link', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2 bg-theme-subtle border border-theme-border rounded-lg focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent text-theme-text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-theme-text">Certificate Image URL</label>
                    <input
                      type="url"
                      value={formData.image || ''}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://i.ibb.co/..."
                      className="w-full px-4 py-2 bg-theme-subtle border border-theme-border rounded-lg focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent text-theme-text"
                    />
                    <p className="text-xs text-theme-muted mt-1">Upload to ImgBB and paste direct link</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-theme-text">Skills (comma-separated)</label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="React, Node.js, MongoDB"
                      className="w-full px-4 py-2 bg-theme-subtle border border-theme-border rounded-lg focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent text-theme-text"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">Difficulty</label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border rounded-lg focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent text-theme-text"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.projectBased}
                          onChange={(e) => handleInputChange('projectBased', e.target.checked)}
                          className="w-4 h-4 rounded border-theme-border bg-theme-subtle text-theme-accent focus:ring-theme-accent"
                        />
                        <span className="text-sm text-theme-text">Project-Based</span>
                      </label>
                    </div>
                    <div className="flex items-center pt-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured || false}
                          onChange={(e) => handleInputChange('featured', e.target.checked)}
                          className="w-4 h-4 rounded border-theme-border bg-theme-subtle text-theme-accent focus:ring-theme-accent"
                        />
                        <span className="text-sm text-theme-text">Featured</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex items-center gap-2">
                      <Save size={16} />
                      {editingCert ? 'Update' : 'Create'} Certification
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
