import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Save, ExternalLink, Github, Linkedin, UserPlus, ChevronUp, ChevronDown } from 'lucide-react';
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
  order?: number;
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

  const reorderProject = async (projectId: string, direction: 'up' | 'down') => {
    try {
      const projectIndex = projects.findIndex(p => p._id === projectId);
      if (projectIndex === -1) return;

      if (direction === 'up' && projectIndex === 0) return;
      if (direction === 'down' && projectIndex === projects.length - 1) return;

      const swapIndex = direction === 'up' ? projectIndex - 1 : projectIndex + 1;
      
      const currentProject = projects[projectIndex];
      const swapProject = projects[swapIndex];
      
      // Use actual order values, with fallback to incrementing values
      const currentOrder = currentProject.order ?? (projectIndex + 1);
      const swapOrder = swapProject.order ?? (swapIndex + 1);

      // Swap order values in database
      await projectApi.update(currentProject._id!, { ...currentProject, order: swapOrder });
      await projectApi.update(swapProject._id!, { ...swapProject, order: currentOrder });

      // Refresh projects from server to ensure consistent sort
      await fetchProjects();
    } catch (error) {
      console.error('Reorder failed:', error);
      alert('Failed to reorder project');
    }
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
        await projectApi.update(editingProject._id, projectData);
      } else {
        await projectApi.create(projectData);
      }
      
      // Refresh projects from server to ensure correct order
      await fetchProjects();
      setShowModal(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save project: ' + (error as Error).message);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const statusColors = {
    completed: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300',
    'in-progress': 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
    planning: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
  };

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="heading-2 mb-1">Projects</h1>
              <p className="text-theme-muted text-sm">Manage your portfolio projects</p>
            </div>
            <Button onClick={handleCreate} variant="primary" className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Plus size={18} />
              Add Project
            </Button>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-theme-surface border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text placeholder:text-theme-muted"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-theme-border border-t-theme-accent mx-auto"></div>
              <p className="mt-4 text-theme-muted text-sm">Loading projects...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="surface-card overflow-hidden hover:border-theme-accent/70 transition-colors"
                >
                  <div className="relative h-48 bg-theme-subtle border-b border-theme-border">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title)}&size=400&background=1F3A34&color=fff&bold=true`;
                      }}
                      className="w-full h-full object-cover"
                    />
                    {project.featured && (
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-theme-accent text-theme-accent-contrast text-xs font-semibold rounded-full">
                        FEATURED
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="heading-4 mb-1 break-words">{project.title}</h3>
                        <p className="text-theme-muted text-sm line-clamp-2">{project.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                        {project.status.replace('-', ' ').toUpperCase()}
                      </span>
                      <div className="flex gap-1">
                        <a href={project.github} target="_blank" rel="noopener noreferrer" 
                           className="p-1.5 hover:bg-theme-subtle rounded transition-colors text-theme-muted hover:text-theme-text">
                          <Github size={14} />
                        </a>
                        <a href={project.live} target="_blank" rel="noopener noreferrer"
                           className="p-1.5 hover:bg-theme-subtle rounded transition-colors text-theme-muted hover:text-theme-text">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech.slice(0, 4).map((tech, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-theme-accent-soft text-theme-accent rounded-full text-xs font-medium">
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 4 && (
                        <span className="px-2 py-0.5 text-theme-muted text-xs">
                          +{project.tech.length - 4} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-theme-border">
                      <button
                        onClick={() => reorderProject(project._id!, 'up')}
                        disabled={filteredProjects.indexOf(project) === 0}
                        className="p-2 hover:bg-theme-subtle disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors text-theme-accent flex items-center justify-center"
                        title="Move up"
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => reorderProject(project._id!, 'down')}
                        disabled={filteredProjects.indexOf(project) === filteredProjects.length - 1}
                        className="p-2 hover:bg-theme-subtle disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors text-theme-accent flex items-center justify-center"
                        title="Move down"
                      >
                        <ChevronDown size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex-1 p-2 hover:bg-theme-subtle rounded-lg transition-colors text-theme-accent text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Edit2 size={15} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project._id!)}
                        className="flex-1 p-2 hover:bg-theme-subtle rounded-lg transition-colors text-rose-600 dark:text-rose-400 text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Trash2 size={15} />
                        Delete
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
                className="surface-card p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-3">
                    {editingProject ? 'Edit Project' : 'Create New Project'}
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
                      className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-theme-text">Description *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-theme-text">Key Features (one per line)</label>
                    <textarea
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                      placeholder="Real-time messaging&#10;User authentication&#10;File sharing"
                      className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg font-mono text-sm text-theme-text"
                      rows={5}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-theme-text">Tech Stack (comma-separated)</label>
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="React, Node.js, MongoDB, Socket.io"
                      className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">GitHub URL *</label>
                      <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        placeholder="https://github.com/..."
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-theme-text">Live Demo URL *</label>
                      <input
                        type="url"
                        value={formData.live}
                        onChange={(e) => handleInputChange('live', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-theme-text">Project Image URL *</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://i.ibb.co/..."
                      className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                      required
                    />
                    <p className="text-xs text-theme-muted mt-1">Upload to ImgBB and paste direct link</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-theme-text">Timeline (e.g., January 2024 - March 2024)</label>
                    <input
                      type="text"
                      value={formData.timeline || ''}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      placeholder="January 2024 - March 2024"
                      className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                    />
                  </div>

                  {/* Contributors Section */}
                  <div className="border border-theme-border rounded-lg p-4 bg-theme-subtle">
                    <label className="text-sm font-medium mb-3 flex items-center gap-2 text-theme-text">
                      <UserPlus size={16} className="text-theme-accent" />
                      Contributors
                    </label>
                    
                    {/* Add Contributor Form */}
                    <div className="space-y-3 mb-3">
                      <input
                        type="text"
                        value={contributorName}
                        onChange={(e) => setContributorName(e.target.value)}
                        placeholder="Contributor Name"
                        className="w-full px-4 py-2 bg-theme-surface border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-sm text-theme-text"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="url"
                          value={contributorGithub}
                          onChange={(e) => setContributorGithub(e.target.value)}
                          placeholder="GitHub URL (optional)"
                          className="w-full px-4 py-2 bg-theme-surface border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-sm text-theme-text"
                        />
                        <input
                          type="url"
                          value={contributorLinkedin}
                          onChange={(e) => setContributorLinkedin(e.target.value)}
                          placeholder="LinkedIn URL (optional)"
                          className="w-full px-4 py-2 bg-theme-surface border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-sm text-theme-text"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addContributor}
                        className="px-4 py-2 bg-theme-accent-soft text-theme-accent rounded-lg hover:border-theme-muted border border-theme-border transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <UserPlus size={14} />
                        Add Contributor
                      </button>
                    </div>

                    {/* Contributors List */}
                    {formData.contributors.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-theme-muted mb-2">Added Contributors:</p>
                        {formData.contributors.map((contributor, index) => (
                          <div key={index} className="flex items-center justify-between bg-theme-surface border border-theme-border p-3 rounded-lg">
                            <div>
                              <p className="font-medium text-sm text-theme-text">{contributor.name}</p>
                              <div className="flex gap-2 mt-1">
                                {contributor.github && (
                                  <a href={contributor.github} target="_blank" rel="noopener noreferrer" 
                                     className="text-xs text-theme-muted hover:text-theme-accent flex items-center gap-1">
                                    <Github size={12} />
                                    GitHub
                                  </a>
                                )}
                                {contributor.linkedin && (
                                  <a href={contributor.linkedin} target="_blank" rel="noopener noreferrer"
                                     className="text-xs text-theme-muted hover:text-theme-accent flex items-center gap-1">
                                    <Linkedin size={12} />
                                    LinkedIn
                                  </a>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeContributor(index)}
                              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-lg transition-colors"
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
                      <label className="block text-sm font-medium mb-2 text-theme-text">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
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
                          className="w-4 h-4 rounded border-theme-border bg-theme-subtle text-theme-accent focus:ring-theme-accent"
                        />
                        <span className="text-sm text-theme-text">Featured Project</span>
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
