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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
            <p className="mt-4 text-text-secondary">Loading gallery...</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Gallery Management</h1>
              <p className="text-text-secondary">Manage your portfolio gallery images</p>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="btn-neon flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus size={20} />
              Add Gallery Item
            </Button>
          </div>

          {gallery.length === 0 ? (
            <div className="glass-effect p-12 rounded-xl text-center">
              <ImageIcon size={64} className="mx-auto mb-4 text-text-secondary" />
              <h3 className="text-xl font-bold mb-2">No Gallery Items</h3>
              <p className="text-text-secondary mb-6">Get started by adding your first gallery image</p>
              <Button onClick={() => setShowModal(true)} className="btn-neon">
                Add Gallery Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-effect rounded-xl overflow-hidden"
                >
                  <div className="relative aspect-square">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.category && (
                      <span className="absolute top-2 right-2 px-3 py-1 bg-accent-primary/90 text-white text-xs rounded-full">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    {item.description && (
                      <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-text-secondary">
                        {item.date && <span>{new Date(item.date).toLocaleDateString()}</span>}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-dark-800 hover:bg-accent-primary rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id!)}
                          className="p-2 bg-dark-800 hover:bg-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                  onClick={handleCloseModal}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="fixed inset-0 flex items-center justify-center z-50 p-4"
                >
                  <div className="glass-effect p-6 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">
                        {editingItem ? 'Edit Gallery Item' : 'Add Gallery Item'}
                      </h2>
                      <button
                        onClick={handleCloseModal}
                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
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
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Image URL *</label>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                          required
                        />
                        <p className="text-xs text-text-secondary mt-1">
                          Use <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:underline">ImgBB</a> for free image hosting
                        </p>
                        {formData.image && (
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="mt-2 w-full h-48 object-cover rounded-lg"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={3}
                          placeholder="Brief description of the image..."
                          className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Category</label>
                          <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g., Personal, Professional"
                            className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Date</label>
                          <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg focus:outline-none focus:border-accent-primary"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button type="submit" className="btn-neon flex-1 flex items-center justify-center gap-2">
                          <Save size={20} />
                          {editingItem ? 'Update' : 'Create'}
                        </Button>
                        <Button
                          type="button"
                          onClick={handleCloseModal}
                          className="flex-1 bg-dark-700 hover:bg-dark-600"
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
