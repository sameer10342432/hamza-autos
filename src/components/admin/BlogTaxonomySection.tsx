import React, { useState, useEffect } from 'react';
import { Folder, Tag, Plus, Trash2, Edit2, CheckCircle, X, Save } from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

interface BlogTaxonomySectionProps {
  type: 'categories' | 'tags';
}

export const BlogTaxonomySection: React.FC<BlogTaxonomySectionProps> = ({ type }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const isCategory = type === 'categories';

  const fetchData = async () => {
    setLoading(true);
    try {
      if (isCategory) {
        const res = await AdminApiService.getBlogCategories();
        if (res.success) setItems(res.categories || []);
      } else {
        const res = await AdminApiService.getBlogTags();
        if (res.success) setItems(res.tags || []);
      }
    } catch (err: any) {
      console.error('Fetch taxonomy failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  const generateSlug = (val: string) => val.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^\w-]/g, '');

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingItem(null);
    setFormName('');
    setFormSlug('');
    setFormDesc('');
  };

  const handleOpenEdit = (item: any) => {
    setIsNew(false);
    setEditingItem(item);
    setFormName(item.name);
    setFormSlug(item.slug || generateSlug(item.name));
    setFormDesc(item.description || '');
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      alert('Name is required.');
      return;
    }

    const slug = formSlug || generateSlug(formName);
    let updatedList = [...items];

    if (isNew) {
      const newItem = {
        id: slug,
        name: formName.trim(),
        slug,
        description: formDesc.trim(),
        count: 0
      };
      updatedList.push(newItem);
    } else if (editingItem) {
      updatedList = updatedList.map(item => {
        if (item.id === editingItem.id || item.name === editingItem.name) {
          return {
            ...item,
            name: formName.trim(),
            slug,
            description: formDesc.trim()
          };
        }
        return item;
      });
    }

    try {
      if (isCategory) {
        await AdminApiService.saveBlogCategories(updatedList);
      } else {
        await AdminApiService.saveBlogTags(updatedList);
      }
      setItems(updatedList);
      setIsNew(false);
      setEditingItem(null);
      showNotice(`${isCategory ? 'Category' : 'Tag'} saved successfully.`);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async (target: any) => {
    if (!window.confirm(`Delete ${isCategory ? 'category' : 'tag'} "${target.name}"?`)) return;
    const filtered = items.filter(i => (i.id ? i.id !== target.id : i.name !== target.name));
    try {
      if (isCategory) {
        await AdminApiService.saveBlogCategories(filtered);
      } else {
        await AdminApiService.saveBlogTags(filtered);
      }
      setItems(filtered);
      showNotice('Item removed.');
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            {isCategory ? <Folder className="w-5 h-5 text-amber-500" /> : <Tag className="w-5 h-5 text-blue-500" />}
            {isCategory ? 'Blog Categories Management' : 'Blog Tags Management'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organize articles into structured {isCategory ? 'categories' : 'topic tags'} for visitor navigation and SEO crawlability.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add {isCategory ? 'Category' : 'Tag'}
        </button>
      </div>

      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            {notice}
          </span>
          <button onClick={() => setNotice(null)} className="text-emerald-400/80 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editor Drawer */}
      {(isNew || editingItem) && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">
              {isNew ? `Create New ${isCategory ? 'Category' : 'Tag'}` : `Edit ${isCategory ? 'Category' : 'Tag'}`}
            </h3>
            <button
              onClick={() => { setIsNew(false); setEditingItem(null); }}
              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Name *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (isNew) setFormSlug(generateSlug(e.target.value));
                }}
                placeholder={isCategory ? 'e.g. Engine Overhaul' : 'e.g. Fuel Average'}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Slug</label>
              <input
                type="text"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Brief description for SEO archive pages..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => { setIsNew(false); setEditingItem(null); }}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold"
            >
              <Save className="w-3.5 h-3.5" />
              Save {isCategory ? 'Category' : 'Tag'}
            </button>
          </div>
        </div>
      )}

      {/* Items Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading {type}...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">No {type} defined yet. Click above to add one.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {items.map((item, idx) => (
              <div
                key={item.id || item.slug || idx}
                className="p-4 hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{item.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      /{item.slug || generateSlug(item.name)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-400 max-w-xl">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
