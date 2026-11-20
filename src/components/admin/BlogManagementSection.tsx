import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  Tag, 
  Folder, 
  Image as ImageIcon, 
  Globe, 
  Save, 
  X,
  ExternalLink,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';
import { checkDuplicateAssignment } from '../../utils/imageRegistry';

export interface BlogPostData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  status: 'published' | 'draft' | 'scheduled';
  author: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  views?: number;
}

export const BlogManagementSection: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPostData[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [activeBlog, setActiveBlog] = useState<BlogPostData | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<Partial<BlogPostData>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'Engine Repair',
    tags: ['Engine', 'Maintenance'],
    status: 'draft',
    author: 'Master Mechanic Hamza',
    readTime: '4 min read',
    seoTitle: '',
    seoDescription: '',
    keywords: []
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const [blogsRes, catsRes, tagsRes] = await Promise.all([
        AdminApiService.getBlogs({ search, category: selectedCategory, status: selectedStatus }),
        AdminApiService.getBlogCategories(),
        AdminApiService.getBlogTags()
      ]);

      if (blogsRes.success) setBlogs(blogsRes.blogs || []);
      if (catsRes.success) setCategories(catsRes.categories || []);
      if (tagsRes.success) setAvailableTags(tagsRes.tags || []);
    } catch (err: any) {
      console.error('Failed to load blog data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [search, selectedCategory, selectedStatus]);

  const handleOpenNew = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '## Overview\n\nWrite your informative motorcycle guide here.\n\n### Key Tips\n- Regular oil changes\n- Check spark plugs\n- Proper chain lubrication',
      featuredImage: '',
      category: categories[0]?.name || 'Engine Repair',
      tags: ['Maintenance'],
      status: 'draft',
      author: 'Master Mechanic Hamza',
      readTime: '4 min read',
      seoTitle: '',
      seoDescription: '',
      keywords: ['bike repair', 'badami bagh', 'motorcycle mechanic']
    });
    setActiveBlog(null);
    setIsEditing(true);
  };

  const handleEditBlog = (blog: BlogPostData) => {
    setActiveBlog(blog);
    setFormData({
      ...blog,
      keywords: blog.keywords || []
    });
    setIsEditing(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: !activeBlog ? generateSlug(val) : prev.slug,
      seoTitle: !prev.seoTitle ? `${val} | Hamza Autos Lahore` : prev.seoTitle
    }));
  };

  const handleSave = async (statusOverride?: 'published' | 'draft') => {
    if (!formData.title?.trim()) {
      alert('Blog title is required.');
      return;
    }

    if (formData.featuredImage) {
      const dup = checkDuplicateAssignment(formData.featuredImage, activeBlog?.id);
      if (dup.isDuplicate) {
        const proceed = window.confirm(`Warning: This photograph is already assigned to "${dup.matchedItem?.section}" (${dup.matchedItem?.route}).\n\nTo ensure 100% unique imagery, each section must have a distinct photograph.\n\nDo you want to save anyway?`);
        if (!proceed) return;
      }
    }

    const payload = {
      ...formData,
      status: statusOverride || formData.status || 'draft',
      slug: formData.slug || generateSlug(formData.title),
      readTime: formData.readTime || `${Math.max(1, Math.ceil((formData.content?.split(/\s+/).length || 100) / 180))} min read`
    };

    try {
      if (activeBlog?.id) {
        const res = await AdminApiService.updateBlog(activeBlog.id, payload);
        if (res.success) {
          showNotice('Blog updated successfully.');
          setIsEditing(false);
          fetchBlogs();
        }
      } else {
        const res = await AdminApiService.createBlog(payload);
        if (res.success) {
          showNotice('New blog created successfully.');
          setIsEditing(false);
          fetchBlogs();
        }
      }
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await AdminApiService.deleteBlog(id);
      if (res.success) {
        showNotice('Blog deleted.');
        fetchBlogs();
      }
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-red-500" />
            Blog Post Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, publish and optimize informative motorcycle repair articles for SEO & audience engagement.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Write New Blog
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

      {/* Editor Modal / View */}
      {isEditing ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/10 text-red-400">
                {activeBlog ? 'Edit Article' : 'New Article'}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {formData.title || 'Untitled Article'}
              </h3>
            </div>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Article Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. 5 Signs Your Honda 70 Needs an Immediate Engine Overhaul"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-400">
                  <span className="text-slate-600 font-mono mr-1">/blog/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                    className="w-full bg-transparent text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                  placeholder="Short engaging description for cards & search previews..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Article Content (Markdown Supported)
                </label>
                <textarea
                  rows={12}
                  value={formData.content}
                  onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                  placeholder="Write complete markdown content with headings, lists, and advice..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-red-500"
                />
              </div>

              {/* SEO Live Preview */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-blue-400" />
                  Google Search Snippet Preview
                </span>
                <div className="text-xs">
                  <div className="text-[11px] text-emerald-400 truncate">
                    https://hamzaautos.com.pk/blog/{formData.slug || 'example-slug'}
                  </div>
                  <div className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer truncate">
                    {formData.seoTitle || formData.title || 'Hamza Autos Article Title'}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                    {formData.seoDescription || formData.excerpt || 'Read expert motorcycle repair tips from Hamza Autos Badami Bagh Lahore.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Controls (1 Col) */}
            <div className="space-y-5">
              {/* Publishing Status */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Publishing</h4>
                
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as any }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="draft">Draft (Private)</option>
                    <option value="published">Published (Public)</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Author</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData(p => ({ ...p, author: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Est. Read Time</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData(p => ({ ...p, readTime: e.target.value }))}
                    placeholder="e.g. 5 min read"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleSave('draft')}
                    className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={() => handleSave('published')}
                    className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                  >
                    Publish Now
                  </button>
                </div>
              </div>

              {/* Taxonomy: Category & Tags */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-amber-500" />
                  Category & Tags
                </h4>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Primary Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={(formData.tags || []).join(', ')}
                    onChange={(e) => setFormData(p => ({
                      ...p,
                      tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    }))}
                    placeholder="Tuning, Honda 70, Engine..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Featured Image with Live Duplicate Detection */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                    Featured Image
                  </h4>
                  <span className="text-[10px] text-slate-500">100% Unique Rule Enforced</span>
                </div>

                <input
                  type="text"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData(p => ({ ...p, featuredImage: e.target.value }))}
                  placeholder="/assets/images/blog/blog-engine-problems.jpg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />

                {(() => {
                  const dupCheck = formData.featuredImage 
                    ? checkDuplicateAssignment(formData.featuredImage, activeBlog?.id)
                    : { isDuplicate: false, message: '' };

                  return dupCheck.isDuplicate ? (
                    <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/50 text-amber-300 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        Duplicate Image Detected
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        This photograph is already assigned to:
                        <span className="text-white font-semibold block mt-0.5">
                          {dupCheck.matchedItem?.section} ({dupCheck.matchedItem?.route})
                        </span>
                      </p>
                      <p className="text-[10px] text-amber-400/80">
                        Strict No-Duplicate Rule: Every blog article must have its own distinct photograph.
                      </p>
                    </div>
                  ) : null;
                })()}

                {formData.featuredImage && (
                  <div className="rounded-lg overflow-hidden border border-slate-800 aspect-video bg-black/40">
                    <img
                      src={formData.featuredImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = '/assets/images/blog/blog-engine-problems.jpg';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* SEO Meta Fields */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  SEO Customization
                </h4>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Custom Meta Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle || ''}
                    onChange={(e) => setFormData(p => ({ ...p, seoTitle: e.target.value }))}
                    placeholder="Custom SEO Title Tag..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Custom Meta Description</label>
                  <textarea
                    rows={2}
                    value={formData.seoDescription || ''}
                    onChange={(e) => setFormData(p => ({ ...p, seoDescription: e.target.value }))}
                    placeholder="Meta description for search engines..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id || c.name} value={c.name}>{c.name}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300"
        >
          <option value="">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Blogs List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-500">Loading blogs from JSON storage...</div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No Articles Found</h3>
            <p className="text-xs text-slate-500 mt-1">Click "Write New Blog" above to create your first article.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    <img
                      src={blog.featuredImage || '/assets/images/home/motorcycle-workshop-hero.jpg'}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = '/assets/images/home/motorcycle-workshop-hero.jpg';
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        blog.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {blog.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {blog.category}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] text-slate-500">
                        {blog.readTime || '3 min read'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white hover:text-red-400 transition-colors cursor-pointer" onClick={() => handleEditBlog(blog)}>
                      {blog.title}
                    </h4>

                    <p className="text-xs text-slate-400 line-clamp-1 max-w-2xl">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleEditBlog(blog)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    title="Delete Blog"
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
