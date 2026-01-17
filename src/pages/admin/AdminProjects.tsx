import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Save, ExternalLink, Github, Linkedin, UserPlus } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';
import { Button } from '../../components/ui/Button';
import { projectApi } from '../../utils/api';

interface Contributor {
  name: string;
  github?: string;
  linkedin?: string;
}

interface Project {
  _id?: string;
  title: string;
  description: string;
  keyFeatures: string[];
  tech: string[];
  github: string;
  live: string;
  image: string;
  featured: boolean;
  status: 'completed' | 'in-progress' | 'planning';
  timeline?: string;
  contributors: Contributor[];
  createdAt?: string;
  updatedAt?: string;
}

export const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>({
    title: '',
    description: '',
    keyFeatures: [],
    tech: [],
    github: '',
    live: '',
    image: '',
    featured: false,
    status: 'in-progress',
    timeline: '',
    contributors: [],
  });
  const [featuresInput, setFeaturesInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [contributorGithub, setContributorGithub] = useState('');
  const [contributorLinkedin, setContributorLinkedin] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectApi.getAll();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      // Error occurred while fetching projects
      alert('Failed to load projects: ' + (error as Error).message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = Array.isArray(projects) ? projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await projectApi.delete(id);
        setProjects(projects.filter(p => p._id !== id));
      } catch (error) {
        // Error occurred while deleting project
        alert('Failed to delete project');
      }
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setFeaturesInput(project.keyFeatures.join('\n'));
    setTechInput(project.tech.join(', '));
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      keyFeatures: [],
      tech: [],
      github: '',
      live: '',
      image: '',
      featured: false,
      status: 'in-progress',
      timeline: '',
      contributors: [],
    });
    setFeaturesInput('');
    setTechInput('');
    setContributorName('');
    setContributorGithub('');
    setContributorLinkedin('');
    setShowModal(true);
  };

  const addContributor = () => {
    if (contributorName.trim()) {
      setFormData({
        ...formData,
        contributors: [
          ...formData.contributors,
          {
            name: contributorName.trim(),
            github: contributorGithub.trim() || undefined,
            linkedin: contributorLinkedin.trim() || undefined,
          }
        ]
      });
      setContributorName('');
      setContributorGithub('');
      setContributorLinkedin('');
    }
  };

  const removeContributor = (index: number) => {
    setFormData({
      ...formData,
      contributors: formData.contributors.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        keyFeatures: featuresInput.split('\n').map(s => s.trim()).filter(Boolean),
        tech: techInput.split(',').map(s => s.trim()).filter(Boolean),
      };
      
      if (editingProject?._id) {
        const updated = await projectApi.update(editingProject._id, projectData);
        setProjects(projects.map(p => p._id === editingProject._id ? updated : p));
      } else {
        const created = await projectApi.create(projectData);
        setProjects([created, ...projects]);
      }
      setShowModal(false);
    } catch (error) {
      // Error occurred while saving project
      alert('Failed to save project');
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const statusColors = {
    completed: 'bg-green-500/20 text-green-400',
    'in-progress': 'bg-yellow-500/20 text-yellow-400',
    planning: 'bg-blue-500/20 text-blue-400'
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Projects</h1>
              <p className="text-text-secondary">Manage your portfolio projects</p>
            </div>
            <Button onClick={handleCreate} className="btn-neon flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Plus size={20} />
              Add Project
            </Button>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary text-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
              <p className="mt-4 text-text-secondary">Loading projects...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect rounded-xl overflow-hidden hover:border-accent-primary/30 border-2 border-transparent transition-all"
                >
                  <div className="relative h-48">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&size=400&background=0891b2&color=fff&bold=true`;
                      }}
                      className="w-full h-full object-cover"
                    />
                    {project.featured && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-accent-primary text-white text-xs font-bold rounded-full">
                        FEATURED
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold mb-1 break-words">{project.title}</h3>
                        <p className="text-text-secondary text-sm line-clamp-2">{project.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[project.status]}`}>
                        {project.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <div className="flex gap-2">
                        <a href={project.github} target="_blank" rel="noopener noreferrer" 
                           className="p-1.5 hover:bg-dark-700 rounded transition-colors text-text-secondary hover:text-white">
                          <Github size={14} />
                        </a>
                        <a href={project.live} target="_blank" rel="noopener noreferrer"
                           className="p-1.5 hover:bg-dark-700 rounded transition-colors text-text-secondary hover:text-white">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.slice(0, 4).map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-dark-800 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="px-2 py-1 text-text-secondary text-xs">
                          +{project.tech.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex-1 p-2 hover:bg-dark-700 rounded-lg transition-colors text-accent-primary flex items-center justify-center gap-2"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project._id!)}
                        className="flex-1 p-2 hover:bg-dark-700 rounded-lg transition-colors text-red-400 flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
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
                className="bg-dark-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingProject ? 'Edit Project' : 'Create New Project'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-dark-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Key Features (one per line)</label>
                    <textarea
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                      placeholder="Real-time messaging&#10;User authentication&#10;File sharing"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary font-mono text-sm"
                      rows={5}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="React, Node.js, MongoDB, Socket.io"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">GitHub URL *</label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Live Demo URL *</label>
                      <input
                        type="url"
                        value={formData.live}
                        onChange={(e) => handleInputChange('live', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Project Image URL *</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://i.ibb.co/..."
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      required
                    />
                    <p className="text-xs text-text-tertiary mt-1">Upload to ImgBB and paste direct link</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Timeline (e.g., January 2024 - March 2024)</label>
                    <input
                      type="text"
                      value={formData.timeline || ''}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      placeholder="January 2024 - March 2024"
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                    />
                  </div>

                  {/* Contributors Section */}
                  <div className="border border-dark-700 rounded-lg p-4 bg-dark-800/50">
                    <label className="text-sm font-medium mb-3 flex items-center gap-2">
                      <UserPlus size={16} className="text-accent-primary" />
                      Contributors
                    </label>
                    
                    {/* Add Contributor Form */}
                    <div className="space-y-3 mb-3">
                      <input
                        type="text"
                        value={contributorName}
                        onChange={(e) => setContributorName(e.target.value)}
                        placeholder="Contributor Name"
                        className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary text-sm"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="url"
                          value={contributorGithub}
                          onChange={(e) => setContributorGithub(e.target.value)}
                          placeholder="GitHub URL (optional)"
                          className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary text-sm"
                        />
                        <input
                          type="url"
                          value={contributorLinkedin}
                          onChange={(e) => setContributorLinkedin(e.target.value)}
                          placeholder="LinkedIn URL (optional)"
                          className="w-full px-4 py-2 bg-dark-900 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary text-sm"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addContributor}
                        className="px-4 py-2 bg-accent-primary/20 text-accent-primary rounded-lg hover:bg-accent-primary/30 transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <UserPlus size={14} />
                        Add Contributor
                      </button>
                    </div>

                    {/* Contributors List */}
                    {formData.contributors.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-text-tertiary mb-2">Added Contributors:</p>
                        {formData.contributors.map((contributor, index) => (
                          <div key={index} className="flex items-center justify-between bg-dark-900 p-3 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{contributor.name}</p>
                              <div className="flex gap-2 mt-1">
                                {contributor.github && (
                                  <a href={contributor.github} target="_blank" rel="noopener noreferrer" 
                                     className="text-xs text-text-secondary hover:text-accent-primary flex items-center gap-1">
                                    <Github size={12} />
                                    GitHub
                                  </a>
                                )}
                                {contributor.linkedin && (
                                  <a href={contributor.linkedin} target="_blank" rel="noopener noreferrer"
                                     className="text-xs text-text-secondary hover:text-accent-primary flex items-center gap-1">
                                    <Linkedin size={12} />
                                    LinkedIn
                                  </a>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeContributor(index)}
                              className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      >
                        <option value="completed">Completed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="planning">Planning</option>
                      </select>
                    </div>
                    <div className="flex items-center pt-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => handleInputChange('featured', e.target.checked)}
                          className="w-4 h-4 rounded border-dark-700 bg-dark-800 text-accent-primary focus:ring-accent-primary"
                        />
                        <span className="text-sm">Featured Project</span>
                      </label>
                    </div>
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
                      {editingProject ? 'Update' : 'Create'} Project
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
