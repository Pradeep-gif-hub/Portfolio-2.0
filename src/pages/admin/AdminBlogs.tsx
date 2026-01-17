import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, X, Save } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';
import { Button } from '../../components/ui/Button';
import { blogApi } from '../../utils/api';

// Blog type matching the MongoDB model
interface Blog {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  tldr: string;
  author: string;
  authorAvatar?: string;
  content: string;
  tags: string[];
  keyTakeaways: string[];
  references: { title: string; url: string }[];
  cta: { text: string; link: string };
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  canonicalUrl: string;
  readTime: number;
  createdAt?: string;
  updatedAt?: string;
}

export const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState<Blog>({
    title: '',
    slug: '',
    summary: '',
    tldr: '',
    author: '',
    content: '',
    tags: [],
    keyTakeaways: [],
    references: [],
    cta: { text: '', link: '' },
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
    readTime: 5,
  });
  // Store raw string values for tags and takeaways to allow comma input
  const [tagsInput, setTagsInput] = useState('');
  const [takeawaysInput, setTakeawaysInput] = useState('');

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogApi.getAll();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      // Error occurred while fetching blogs
      alert('Failed to load blogs: ' + (error as Error).message);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = Array.isArray(blogs) ? blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogApi.delete(id);
        setBlogs(blogs.filter(b => b._id !== id));
      } catch (error) {
        // Error occurred while deleting blog
        alert('Failed to delete blog');
      }
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData(blog);
    setTagsInput(blog.tags.join(', '));
    setTakeawaysInput(blog.keyTakeaways.join(', '));
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      summary: '',
      tldr: '',
      author: '',
      content: '',
      tags: [],
      keyTakeaways: [],
      references: [],
      cta: { text: '', link: '' },
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      readTime: 5,
    });
    setTagsInput('');
    setTakeawaysInput('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert input strings to arrays
      const blogData = {
        ...formData,
        tags: tagsInput.split(',').map(s => s.trim()).filter(Boolean),
        keyTakeaways: takeawaysInput.split(',').map(s => s.trim()).filter(Boolean),
      };
      
      if (editingBlog?._id) {
        // Update existing blog
        const updated = await blogApi.update(editingBlog._id, blogData);
        setBlogs(blogs.map(b => b._id === editingBlog._id ? updated : b));
      } else {
        // Create new blog
        const created = await blogApi.create(blogData);
        setBlogs([created, ...blogs]);
      }
      setShowModal(false);
    } catch (error) {
      // Error occurred while saving blog
      alert('Failed to save blog');
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
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Blog Posts</h1>
              <p className="text-text-secondary">Manage your blog content</p>
            </div>
            <Button onClick={handleCreate} className="btn-neon flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
              <Plus size={20} />
              New Post
            </Button>
          </div>

          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary text-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
              <p className="mt-4 text-text-secondary">Loading blogs...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect p-4 sm:p-6 rounded-xl hover:border-accent-primary/30 border-2 border-transparent transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 break-words">{blog.title}</h3>
                      <p className="text-text-secondary mb-4 line-clamp-2">{blog.summary}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-text-tertiary">
                        <span>{new Date(blog.createdAt || '').toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{blog.readTime} min read</span>
                        <span>•</span>
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-accent-primary/10 rounded text-accent-primary whitespace-nowrap">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-accent-primary"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id!)}
                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-red-400"
                      >
                        <Trash2 size={16} />
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
                className="bg-dark-900 rounded-xl p-4 md:p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-dark-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label className="block text-sm font-medium mb-2">Slug *</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Summary *</label>
                    <textarea
                      value={formData.summary}
                      onChange={(e) => handleInputChange('summary', e.target.value)}
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      rows={2}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">TL;DR *</label>
                    <input
                      type="text"
                      value={formData.tldr}
                      onChange={(e) => handleInputChange('tldr', e.target.value)}
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Content * (Markdown supported)</label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary font-mono text-sm"
                      rows={10}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Author *</label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Read Time (minutes)</label>
                      <input
                        type="number"
                        value={formData.readTime}
                        onChange={(e) => handleInputChange('readTime', parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      placeholder="React, TypeScript, Web Development"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Key Takeaways (comma-separated)</label>
                    <input
                      type="text"
                      value={takeawaysInput}
                      onChange={(e) => setTakeawaysInput(e.target.value)}
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      placeholder="Learning point 1, Learning point 2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Meta Title *</label>
                      <input
                        type="text"
                        value={formData.metaTitle}
                        onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Canonical URL *</label>
                      <input
                        type="url"
                        value={formData.canonicalUrl}
                        onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                        className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Description *</label>
                    <textarea
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                      className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                      rows={2}
                      required
                    />
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
                      {editingBlog ? 'Update' : 'Create'} Blog
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
