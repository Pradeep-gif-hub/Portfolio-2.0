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
    Frontend: 'bg-blue-500/20 text-blue-400',
    Backend: 'bg-green-500/20 text-green-400',
    Database: 'bg-purple-500/20 text-purple-400',
    DevOps: 'bg-orange-500/20 text-orange-400',
    Design: 'bg-pink-500/20 text-pink-400',
    Other: 'bg-gray-500/20 text-gray-400',
  };

  const proficiencyColors = {
    Beginner: 'bg-yellow-500/20 text-yellow-400',
    Intermediate: 'bg-blue-500/20 text-blue-400',
    Advanced: 'bg-purple-500/20 text-purple-400',
    Expert: 'bg-green-500/20 text-green-400',
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tools & Technologies</h1>
              <p className="text-text-secondary">Manage your technical skills</p>
            </div>
            <Button onClick={handleCreate} className="btn-neon flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Plus size={20} />
              Add Tool
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary text-white"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary text-white"
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
              <p className="mt-4 text-text-secondary">Loading tools...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect p-4 rounded-xl hover:border-accent-primary/30 border-2 border-transparent transition-all"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <img src={tool.logo} alt={tool.name} className="w-12 h-12 object-contain" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${tool.name}&background=random`; }} />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{tool.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${categoryColors[tool.category]}`}>
                          {tool.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${proficiencyColors[tool.proficiency]}`}>
                          {tool.proficiency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {tool.yearsOfExperience && (
                    <p className="text-sm text-text-secondary mb-3">
                      {tool.yearsOfExperience} {tool.yearsOfExperience === 1 ? 'year' : 'years'} exp.
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {tool.showOnHomepage ? (
                        <Eye size={16} className="text-green-400" />
                      ) : (
                        <EyeOff size={16} className="text-gray-400" />
                      )}
                      <span className="text-xs text-text-secondary">Order: {tool.order}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tool)}
                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-accent-primary"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(tool._id!)}
                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Modal continues in next message due to length */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-dark-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingTool ? 'Edit Tool' : 'Add New Tool'}
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
                      <label className="block text-sm font-medium mb-2">Tool Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
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
                    <label className="block text-sm font-medium mb-2">Logo URL *</label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      required
                    />
                    {formData.logo && (
                      <img src={formData.logo} alt="Preview" className="mt-2 w-16 h-16 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Proficiency *</label>
                      <select
                        value={formData.proficiency}
                        onChange={(e) => setFormData({ ...formData, proficiency: e.target.value as any })}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>Expert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Years of Experience</label>
                      <input
                        type="number"
                        value={formData.yearsOfExperience || ''}
                        onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Display Order</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      />
                    </div>
                    <div className="flex items-center pt-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showOnHomepage}
                          onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                          className="w-4 h-4 rounded border-dark-700 bg-dark-800 text-accent-primary"
                        />
                        <span className="text-sm">Show on Homepage</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" className="btn-neon flex items-center gap-2">
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
