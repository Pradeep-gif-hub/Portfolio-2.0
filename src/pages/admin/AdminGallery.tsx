import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';
import { Button } from '../../components/ui/Button';

interface GalleryItem {
  _id?: string;
  title: string;
  image: string;
  description?: string;
  category?: string;
  date?: string;
}

// API functions
const galleryApi = {
  getAll: async () => {
    const response = await fetch('/api/admin/content?type=gallery', {
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}` }
    });
    if (!response.ok) throw new Error('Failed to fetch gallery');
    const data = await response.json();
    return data.data;
  },
  create: async (item: Omit<GalleryItem, '_id'>) => {
    const response = await fetch('/api/admin/content?type=gallery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to create gallery item');
    const data = await response.json();
    return data.data;
  },
  update: async (item: GalleryItem) => {
    const response = await fetch('/api/admin/content?type=gallery', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}`
      },
      body: JSON.stringify({ id: item._id, ...item }),
    });
    if (!response.ok) throw new Error('Failed to update gallery item');
    const data = await response.json();
    return data.data;
  },
  delete: async (id: string) => {
    const response = await fetch(`/api/admin/content?type=gallery&id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${sessionStorage.getItem('admin_token')}` }
    });
    if (!response.ok) throw new Error('Failed to delete gallery item');
    return response.json();
  },
};

export const AdminGallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<Omit<GalleryItem, '_id'>>({
    title: '',
    image: '',
    description: '',
    category: '',
    date: '',
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryApi.getAll();
      setGallery(Array.isArray(data) ? data : []);
    } catch (error) {

      alert('Failed to load gallery');
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem?._id) {
        await galleryApi.update({ ...formData, _id: editingItem._id });
        alert('Gallery item updated successfully!');
      } else {
        await galleryApi.create(formData);
        alert('Gallery item created successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchGallery();
    } catch (error) {
      // Error occurred while saving gallery item
      alert('Failed to save gallery item');
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      image: item.image,
      description: item.description || '',
      category: item.category || '',
      date: item.date || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      await galleryApi.delete(id);
      alert('Gallery item deleted successfully!');
      fetchGallery();
    } catch (error) {
      // Error occurred while deleting gallery item
      alert('Failed to delete gallery item');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      image: '',
      description: '',
      category: '',
      date: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-theme-border border-t-theme-accent mx-auto"></div>
            <p className="mt-4 text-theme-muted text-sm">Loading gallery...</p>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="heading-2 mb-1">Gallery Management</h1>
              <p className="text-theme-muted text-sm">Manage your portfolio gallery images</p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              variant="primary"
              className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus size={18} />
              Add Gallery Item
            </Button>
          </div>

          {gallery.length === 0 ? (
            <div className="surface-card p-12 text-center">
              <ImageIcon size={56} className="mx-auto mb-4 text-theme-muted" />
              <h3 className="heading-3 mb-2">No Gallery Items</h3>
              <p className="text-theme-muted text-sm mb-6">Get started by adding your first gallery image</p>
              <Button onClick={() => setShowModal(true)} variant="primary">
                Add Gallery Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div
                  key={item._id}
                  className="surface-card overflow-hidden"
                >
                  <div className="relative aspect-square bg-theme-subtle">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.category && (
                      <span className="absolute top-2 right-2 px-2.5 py-0.5 bg-theme-surface border border-theme-border text-theme-accent text-xs font-medium rounded-full">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="heading-4 mb-1.5">{item.title}</h3>
                    {item.description && (
                      <p className="text-theme-muted text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-theme-border">
                      <div className="text-xs text-theme-muted">
                        {item.date && <span>{new Date(item.date).toLocaleDateString()}</span>}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 hover:bg-theme-subtle text-theme-accent rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id!)}
                          className="p-2 hover:bg-theme-subtle text-rose-600 dark:text-rose-400 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          <AnimatePresence>
            {showModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-40"
                  onClick={handleCloseModal}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  className="fixed inset-0 flex items-center justify-center z-50 p-4"
                >
                  <div className="bg-theme-surface border border-theme-border p-6 rounded-[10px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-card">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="heading-3">
                        {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
                      </h2>
                      <button
                        onClick={handleCloseModal}
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
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-theme-text">Image URL *</label>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                          required
                        />
                        <p className="text-xs text-theme-muted mt-1">
                          Use <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-theme-accent hover:underline">ImgBB</a> for free image hosting
                        </p>
                        {formData.image && (
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="mt-2 w-full h-48 object-cover rounded-lg border border-theme-border"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-theme-text">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          placeholder="Brief description of the image..."
                          className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-theme-text">Category</label>
                          <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g., Personal, Professional"
                            className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-theme-text">Date</label>
                          <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 bg-theme-subtle border border-theme-border-strong rounded-lg focus:outline-none focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg text-theme-text"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button type="submit" variant="primary" className="flex-1 flex items-center justify-center gap-2">
                          <Save size={18} />
                          {editingItem ? 'Update' : 'Create'}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={handleCloseModal}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  );
};
