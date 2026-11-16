import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  Image as ImageIcon, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  RefreshCw, 
  Eye, 
  File, 
  X,
  Plus
} from 'lucide-react';
import { AdminApiService } from '../../services/adminApiService';

export interface MediaFile {
  name: string;
  folder: string;
  size: number;
  updatedAt: string;
  url: string;
  extension: string;
}

export const MediaLibrarySection: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await AdminApiService.getMediaFiles(selectedFolder);
      if (res.success) {
        setFiles(res.files || []);
        if (res.folders) setFolders(res.folders);
      }
    } catch (e) {
      console.error('Fetch media failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedFolder]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 15 * 1024 * 1024) {
      alert('File is too large. Max file size is 15MB.');
      return;
    }

    setUploadProgress(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await AdminApiService.uploadMediaFile({
          fileName: selected.name,
          fileData: base64,
          folder: selectedFolder || 'general'
        });
        if (res.success) {
          fetchFiles();
        }
      } catch (err: any) {
        alert(`Upload error: ${err.message}`);
      } finally {
        setUploadProgress(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(selected);
  };

  const handleDelete = async (filePath: string) => {
    if (!window.confirm('Are you sure you want to delete this media file?')) return;
    try {
      const res = await AdminApiService.deleteMediaFile(filePath);
      if (res.success) {
        setFiles(prev => prev.filter(f => f.url !== filePath));
        if (previewFile?.url === filePath) setPreviewFile(null);
      }
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-red-500" />
            Media Library & Asset Manager
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Store and organize workshop photos, blog featured graphics, and banner assets in <code>uploads/</code>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadProgress}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
          >
            <Upload className={`w-4 h-4 ${uploadProgress ? 'animate-bounce' : ''}`} />
            {uploadProgress ? 'Uploading...' : 'Upload Media'}
          </button>
        </div>
      </div>

      {/* Folder bar & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search media by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedFolder('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedFolder === '' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Media
          </button>
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap capitalize transition-colors ${
                selectedFolder === folder ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-red-500" />
            Loading media files...
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="p-12 text-center">
            <Folder className="w-10 h-10 text-slate-700 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-300">No media found</h3>
            <p className="text-xs text-slate-500 mt-1">Upload images or documents to display them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => {
              const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);
              return (
                <div
                  key={file.url}
                  className="group relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col"
                >
                  <div
                    className="aspect-square bg-slate-900 flex items-center justify-center cursor-pointer overflow-hidden relative"
                    onClick={() => setPreviewFile(file)}
                  >
                    {isImage ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as any).src = '/assets/images/home/motorcycle-workshop-hero.jpg';
                        }}
                      />
                    ) : (
                      <File className="w-10 h-10 text-slate-600" />
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCopyUrl(file.url); }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                        title="Copy Public URL"
                      >
                        {copiedUrl === file.url ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(file.url); }}
                        className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white"
                        title="Delete File"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 text-xs flex-1 flex flex-col justify-between">
                    <p className="font-medium text-slate-300 truncate text-[11px]" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{file.folder}</span>
                      <span>{formatSize(file.size)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white truncate max-w-md">{previewFile.name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video bg-black/60 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Folder</span>
                <span className="text-slate-300 font-medium">{previewFile.folder}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Size</span>
                <span className="text-slate-300 font-medium">{formatSize(previewFile.size)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block mb-1">Public URL</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={window.location.origin + previewFile.url}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono"
                  />
                  <button
                    onClick={() => handleCopyUrl(previewFile.url)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copiedUrl === previewFile.url ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
