/**
 * Hamza Autos - Admin Shop Categories Tab
 * Manage spare parts taxonomy: Add, Edit, Delete categories and view product counts
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CheckCircle2, RefreshCw, X, FolderTree } from 'lucide-react';
import { ShopCategory } from '../../../types/shop';
import { ShopService } from '../../../services/shopService';

export const ShopCategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ShopCategory | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await ShopService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenModal = (cat?: ShopCategory) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setDescription(cat.description);
      setImage(cat.image);
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
      setImage('/assets/images/services/motorcycle-spare-parts.webp');
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      if (editingCategory) {
        await ShopService.updateAdminCategory(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
          image: image.trim() || undefined
        });
        setToast(`Updated category "${name}".`);
      } else {
        await ShopService.createAdminCategory({
          name: name.trim(),
          description: description.trim(),
          image: image.trim() || '/assets/images/services/motorcycle-spare-parts.webp'
        });
        setToast(`Created category "${name}".`);
      }
      setTimeout(() => setToast(null), 3000);
      setModalOpen(false);
      await loadCategories();
    } catch (err: any) {
      alert(err.message || 'Error saving category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: ShopCategory) => {
    if (!window.confirm(`Delete category "${cat.name}"? Products inside will remain in database.`)) {
      return;
    }
    try {
      await ShopService.deleteAdminCategory(cat.id);
      setToast(`Deleted category "${cat.name}".`);
      setTimeout(() => setToast(null), 3000);
      await loadCategories();
    } catch (err: any) {
      alert(err.message || 'Error deleting category.');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Motorcycle Spare Parts Categories</h2>
          <p className="text-xs text-slate-500 mt-1">Organise spare parts taxonomy for Pakistani commuter motorcycle models</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 text-xs truncate" title={c.name}>{c.name}</h4>
                <div className="text-[11px] text-slate-400 font-mono">{c.slug}</div>
                <span className="inline-block mt-1 bg-red-50 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded">
                  {c.productCount || 0} active parts
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
              {c.description || 'No description provided.'}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => handleOpenModal(c)}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
                title="Edit Category"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(c)}
                className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                title="Delete Category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Engine Parts"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of parts in this category..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image Asset Path / URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/assets/images/services/motorcycle-spare-parts.webp"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
