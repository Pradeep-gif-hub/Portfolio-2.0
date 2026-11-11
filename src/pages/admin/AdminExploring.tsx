import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { Plus, Edit2, Trash2, Search, X, Save, Eye, EyeOff } from 'lucide-react';

import { AdminLayout } from '../../components/admin/AdminLayout';

import { ProtectedRoute } from '../../components/admin/ProtectedRoute';

import { Button } from '../../components/ui/Button';



interface ExploringItem {

 _id: string;

 title: string;

 description?: string;

 isActive: boolean;

 order: number;

 createdAt: string;

 updatedAt: string;

}



export const AdminExploring = () => {

 const [items, setItems] = useState<ExploringItem[]>([]);

 const [loading, setLoading] = useState(true);

 const [editingId, setEditingId] = useState<string | null>(null);

 const [formData, setFormData] = useState({

  title: '',

  description: '',

  isActive: true,

  order: 0,

 });



 useEffect(() => {

  fetchItems();

 }, []);



 const fetchItems = async () => {

  try {

   const token = sessionStorage.getItem('admin_token');

   console.log('Fetching with token:', token ? 'Token exists' : 'No token');

   

   const response = await fetch('/api/admin/exploring', {

    headers: {

     Authorization: `Bearer ${token}`,

    },

   });

   

   console.log('Response status:', response.status);

   const data = await response.json();

   console.log('Response data:', data);

   

   if (data.success) {

    setItems(data.data);

    console.log('Items set:', data.data.length);

   } else {

    console.error('API returned success=false:', data.error);

   }

  } catch (error) {

   console.error('Error fetching exploring items:', error);

  } finally {

   setLoading(false);

  }

 };



 const handleSubmit = async (e: React.FormEvent) => {

  e.preventDefault();

  

  try {

   const token = sessionStorage.getItem('admin_token');

   const url = editingId

    ? `/api/admin/exploring?id=${editingId}`

    : '/api/admin/exploring';

   

   const method = editingId ? 'PUT' : 'POST';

   

   const response = await fetch(url, {

    method,

    headers: {

     'Content-Type': 'application/json',

     Authorization: `Bearer ${token}`,

    },

    body: JSON.stringify(formData),

   });



   const data = await response.json();

   

   if (data.success) {

    await fetchItems();

    resetForm();

   } else {

    alert(data.error || 'Failed to save item');

   }

  } catch (error) {

   console.error('Error saving exploring item:', error);

   alert('Failed to save item');

  }

 };



 const handleEdit = (item: ExploringItem) => {

  setEditingId(item._id);

  setFormData({

   title: item.title,

   description: item.description || '',

   isActive: item.isActive,

   order: item.order,

  });

 };



 const handleDelete = async (id: string) => {

  if (!confirm('Are you sure you want to delete this item?')) {

   return;

  }



  try {

   const token = sessionStorage.getItem('admin_token');

   const response = await fetch(`/api/admin/exploring?id=${id}`, {

    method: 'DELETE',

    headers: {

     Authorization: `Bearer ${token}`,

    },

   });



   const data = await response.json();

   

   if (data.success) {

    await fetchItems();

   } else {

    alert(data.error || 'Failed to delete item');

   }

  } catch (error) {

   console.error('Error deleting exploring item:', error);

   alert('Failed to delete item');

  }

 };



 const handleToggle = async (id: string) => {

  try {

   const token = sessionStorage.getItem('admin_token');

   const response = await fetch(`/api/admin/exploring?id=${id}&action=toggle`, {

    method: 'PATCH',

    headers: {

     Authorization: `Bearer ${token}`,

    },

   });



   const data = await response.json();

   

   if (data.success) {

    await fetchItems();

   } else {

    alert(data.error || 'Failed to toggle item');

   }

  } catch (error) {

   console.error('Error toggling exploring item:', error);

   alert('Failed to toggle item');

  }

 };



 const resetForm = () => {

  setEditingId(null);

  setFormData({

   title: '',

   description: '',

   isActive: true,

   order: 0,

  });

 };



 const [searchTerm, setSearchTerm] = useState('');

 const [showModal, setShowModal] = useState(false);



 const filteredItems = items.filter(item =>

  item.title.toLowerCase().includes(searchTerm.toLowerCase())

 );



 const handleCreate = () => {

  resetForm();

  setShowModal(true);

 };



 const handleEditClick = (item: ExploringItem) => {

  handleEdit(item);

  setShowModal(true);

 };



 if (loading) {

  return (

   <ProtectedRoute>

    <AdminLayout>

      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-theme-border border-t-theme-accent"></div>
      </div>
    </AdminLayout>
   </ProtectedRoute>
  );
 }

 return (
  <ProtectedRoute>
   <AdminLayout>
    <div className="max-w-7xl mx-auto">
     {/* Header */}
     <div className="flex items-center justify-between mb-8">
      <div>
       <h1 className="heading-2 mb-1">Exploring</h1>
       <p className="text-theme-muted text-sm">
        Manage the "Currently Exploring" section - what you're actively learning
       </p>
      </div>
      <Button onClick={handleCreate} variant="primary" className="flex items-center gap-2">
       <Plus size={18} />
       Add New
      </Button>
     </div>

     {/* Search Bar */}
     <div className="bg-theme-surface p-4 rounded-[10px] border border-theme-border shadow-card mb-6">
      <div className="relative">
       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-muted" size={18} />
       <input
        type="text"
        placeholder="Search exploring items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 bg-theme-subtle border border-theme-border-strong rounded-lg focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg focus:outline-none text-theme-text placeholder:text-theme-muted"
       />
      </div>
     </div>

     {/* Items Grid */}
     {filteredItems.length === 0 ? (
      <div className="bg-theme-surface p-12 rounded-[10px] border border-theme-border shadow-card text-center">
       <p className="text-theme-muted text-base">
        {searchTerm ? 'No items match your search' : 'No exploring items yet. Create your first one!'}
       </p>
      </div>
     ) : (
      <div className="grid gap-4">
       {filteredItems.map((item) => (
        <div
         key={item._id}
         className="surface-card p-6 hover:border-theme-accent/70 transition-colors"
        >
         <div className="flex items-start justify-between">
          <div className="flex-1">
           <div className="flex items-center gap-3 mb-2">
            <span className="text-theme-muted font-mono text-sm">#{item.order}</span>
            <h3 className="heading-4">{item.title}</h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
             item.isActive
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
              : 'bg-theme-subtle text-theme-muted'
            }`}>
             {item.isActive ? 'Active' : 'Inactive'}
            </span>
           </div>
           {item.description && (
            <p className="text-theme-muted text-sm mb-3">{item.description}</p>
           )}
           <p className="text-xs text-theme-muted">
            Updated: {new Date(item.updatedAt).toLocaleDateString()}
           </p>
          </div>
          <div className="flex gap-1 ml-4">
           <button
            onClick={() => handleToggle(item._id)}
            className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-theme-muted hover:text-theme-text"
            title={item.isActive ? 'Deactivate' : 'Activate'}
           >
            {item.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
           </button>
           <button
            onClick={() => handleEditClick(item)}
            className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-theme-accent"
           >
            <Edit2 size={18} />
           </button>
           <button
            onClick={() => handleDelete(item._id)}
            className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-rose-600 dark:text-rose-400"
           >
            <Trash2 size={18} />
           </button>
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
         onClick={() => setShowModal(false)}
        />
        <motion.div
         initial={{ opacity: 0, scale: 0.96 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 0.96 }}
         className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
         <div className="bg-theme-surface p-6 md:p-8 rounded-[10px] border border-theme-border shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
           <h2 className="heading-3">
            {editingId ? 'Edit Item' : 'Add New Item'}
           </h2>
           <button
            onClick={() => setShowModal(false)}
            className="p-2 hover:bg-theme-subtle rounded-lg transition-colors text-theme-muted hover:text-theme-text"
           >
            <X size={20} />
           </button>
          </div>

          <form onSubmit={(e) => { handleSubmit(e); setShowModal(false); }} className="space-y-5">
           <div>
            <label className="block text-sm font-medium mb-2 text-theme-text">
             Title <span className="text-rose-500">*</span>
            </label>
            <input
             type="text"
             value={formData.title}
             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
             className="w-full px-4 py-2.5 bg-theme-subtle border border-theme-border-strong rounded-lg focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg focus:outline-none text-theme-text"
             placeholder="e.g., Natural Language Processing"
             required
            />
           </div>

           <div>
            <label className="block text-sm font-medium mb-2 text-theme-text">
             Description (1-2 lines max)
            </label>
            <textarea
             value={formData.description}
             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
             className="w-full px-4 py-2.5 bg-theme-subtle border border-theme-border-strong rounded-lg focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg focus:outline-none text-theme-text"
             placeholder="Optional: Brief description of what you're exploring"
             rows={2}
            />
           </div>

           <div className="grid grid-cols-2 gap-4">
            <div>
             <label className="block text-sm font-medium mb-2 text-theme-text">Order</label>
             <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 bg-theme-subtle border border-theme-border-strong rounded-lg focus:border-theme-accent focus:ring-2 focus:ring-theme-accent/60 focus:ring-offset-2 focus:ring-offset-theme-bg focus:outline-none text-theme-text"
              min="1"
             />
             <p className="text-xs text-theme-muted mt-1">Lower numbers appear first</p>
            </div>

            <div>
             <label className="block text-sm font-medium mb-2 text-theme-text">Status</label>
             <div className="flex items-center gap-4 mt-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-theme-text">
               <input
                type="radio"
                checked={formData.isActive}
                onChange={() => setFormData({ ...formData, isActive: true })}
                className="w-4 h-4 text-theme-accent focus:ring-theme-accent"
               />
               <span>Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-theme-text">
               <input
                type="radio"
                checked={!formData.isActive}
                onChange={() => setFormData({ ...formData, isActive: false })}
                className="w-4 h-4 text-theme-accent focus:ring-theme-accent"
               />
               <span>Inactive</span>
              </label>
             </div>
            </div>
           </div>

           <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary" className="flex items-center gap-2 flex-1">
             <Save size={16} />
             {editingId ? 'Update' : 'Create'}
            </Button>
            <Button
             type="button"
             variant="secondary"
             onClick={() => setShowModal(false)}
             className="px-6"
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

