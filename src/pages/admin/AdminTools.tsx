import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Save, Eye, EyeOff } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';
import { Button } from '../../components/ui/Button';

interface Tool {
  _id?: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Design' | 'Other';
  logo: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
  showOnHomepage: boolean;
  order: number;
}

// API functions
const toolApi = {
  getAll: async () => {
    const response = await fetch('/api/admin/content?type=tools', {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch tools');
    return response.json();
  },
  create: async (tool: any) => {
    const response = await fetch('/api/admin/content?type=tools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: JSON.stringify(tool),
    });
    if (!response.ok) throw new Error('Failed to create tool');
    return response.json();
  },
  update: async (id: string, updates: any) => {
    const response = await fetch('/api/admin/content?type=tools', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!response.ok) throw new Error('Failed to update tool');
    return response.json();
  },
  delete: async (id: string) => {
    const response = await fetch(`/api/admin/content?type=tools&id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}` }
    });
    if (!response.ok) throw new Error('Failed to delete tool');
    return response.json();
  },
};

export const AdminTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState<Tool>({
    name: '',
    category: 'Frontend',
    logo: '',
    proficiency: 'Intermediate',
    yearsOfExperience: 0,
    showOnHomepage: true,
    order: 0,
  });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const result = await toolApi.getAll();
      const data = result.data || result;
      setTools(Array.isArray(data) ? data : []);
    } catch (error) {
      alert('Failed to load tools');
      setTools([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTools = Array.isArray(tools) ? tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || tool.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) : [];

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this tool?')) {
      try {
        await toolApi.delete(id);
        setTools(tools.filter(t => t._id !== id));
      } catch (error) {
        // Error occurred while deleting tool
        alert('Failed to delete tool');
      }
    }
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData(tool);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingTool(null);
    setFormData({
      name: '',
      category: 'Frontend',
      logo: '',
      proficiency: 'Intermediate',
      yearsOfExperience: 0,
      showOnHomepage: true,
      order: tools.length,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTool?._id) {
        const updated = await toolApi.update(editingTool._id, formData);
        setTools(tools.map(t => t._id === editingTool._id ? updated : t));
      } else {
        const created = await toolApi.create(formData);
        setTools([...tools, created]);
      }
      setShowModal(false);
    } catch (error) {
      // Error occurred while saving tool
      alert('Failed to save tool');
    }
  };

  const categoryColors = {
    Frontend: 'bg-theme-accent-soft text-theme-accent',
    Backend: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    Database: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    DevOps: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    Design: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300',
    Other: 'bg-theme-subtle text-theme-muted',
  };

  const proficiencyColors = {
    Beginner: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    Intermediate: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    Advanced: 'bg-theme-accent-soft text-theme-accent',
    Expert: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="heading-2 mb-1">Tools & Technologies</h1>
              <p className="text-theme-muted text-sm">Manage your technical skills</p>
            </div>
            <Button onClick={handleCreate} variant="primary" className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Plus size={18} />
              Add Tool
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-theme-surface border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text placeholder:text-theme-muted"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-theme-surface border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
            >
              <option>All</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Database</option>
              <option>DevOps</option>
              <option>Design</option>
              <option>Other</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-theme-border border-t-theme-accent mx-auto"></div>
              <p className="mt-4 text-theme-muted text-sm">Loading tools...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <div
                  key={tool._id}
                  className="surface-card p-5 hover:border-theme-accent/70 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <img src={tool.logo} alt={tool.name} className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${tool.name}&background=1F3A34&color=fff`; }} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-theme-text">{tool.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[tool.category]}`}>
                          {tool.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${proficiencyColors[tool.proficiency]}`}>
                          {tool.proficiency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {tool.yearsOfExperience && (
                    <p className="text-xs text-theme-muted mb-3">
                      {tool.yearsOfExperience} {tool.yearsOfExperience === 1 ? 'year' : 'years'} exp.
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-theme-border">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {tool.showOnHomepage ? (
                        <Eye size={15} className="text-theme-accent" />
                      ) : (
                        <EyeOff size={15} className="text-theme-muted" />
                      )}
                      <span className="text-xs text-theme-muted">Order: {tool.order}</span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(tool)}
                        className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-theme-accent"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(tool._id!)}
                        className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-rose-600 dark:text-rose-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.96, y: 12 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 12 }}
                className="surface-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-3">
                    {editingTool ? 'Edit Tool' : 'Add New Tool'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-theme-muted hover:text-theme-text"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">Tool Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                      >
                        <option>Frontend</option>
                        <option>Backend</option>
                        <option>Database</option>
                        <option>DevOps</option>
                        <option>Design</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-theme-text">Logo URL *</label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                      className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                      required
                    />
                    {formData.logo && (
                      <img src={formData.logo} alt="Preview" className="mt-2 w-16 h-16 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">Proficiency *</label>
                      <select
                        value={formData.proficiency}
                        onChange={(e) => setFormData({ ...formData, proficiency: e.target.value as any })}
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">Years of Experience</label>
                      <input
                        type="number"
                        value={formData.yearsOfExperience || ''}
                        onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">Display Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                      />
                    </div>
                    <div className="flex items-center pt-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showOnHomepage}
                          onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                          className="w-4 h-4 rounded border-theme-border bg-theme-subtle text-theme-accent focus:ring-theme-accent"
                        />
                        <span className="text-sm text-theme-text">Show on Homepage</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="flex items-center gap-2">
                      <Save size={16} />
                      {editingTool ? 'Update' : 'Create'} Tool
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
