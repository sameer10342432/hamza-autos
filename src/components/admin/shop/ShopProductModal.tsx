/**
 * Hamza Autos - Admin Product Form Modal
 * Add & Edit Products with SKU validation, multiple motorcycle compatibility, and image gallery
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Bike, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { 
  ShopProduct, 
  ShopCategory, 
  MotorcycleModelSpec, 
  BikeCompatibility,
  ProductCondition
} from '../../../types/shop';

interface ShopProductModalProps {
  product: ShopProduct | null; // null if adding new
  categories: ShopCategory[];
  bikeModels: MotorcycleModelSpec[];
  onClose: () => void;
  onSave: (data: Partial<ShopProduct>) => Promise<void>;
}

export const ShopProductModal: React.FC<ShopProductModalProps> = ({
  product,
  categories,
  bikeModels,
  onClose,
  onSave
}) => {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('Crown Lifan');
  const [condition, setCondition] = useState<ProductCondition>('New (OEM / Genuine)');
  const [price, setPrice] = useState<number | ''>('');
  const [discountedPrice, setDiscountedPrice] = useState<number | ''>('');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(4);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [warrantyText, setWarrantyText] = useState('');
  const [weightKg, setWeightKg] = useState<number | ''>('');

  // Images state
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<Array<{ id: string; url: string; alt: string; isPrimary: boolean }>>([]);

  // Motorcycle Compatibility state
  const [compatibleBikes, setCompatibleBikes] = useState<BikeCompatibility[]>([]);
  const [compBrand, setCompBrand] = useState<string>('Honda');
  const [compModel, setCompModel] = useState<string>('CD 70');
  const [compNotes, setCompNotes] = useState<string>('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setCategoryId(product.categoryId);
      setBrand(product.brand);
      setCondition(product.condition);
      setPrice(product.price);
      setDiscountedPrice(product.discountedPrice || '');
      setStockQuantity(product.stockQuantity);
      setLowStockThreshold(product.lowStockThreshold);
      setIsFeatured(product.isFeatured);
      setIsPublished(product.isPublished);
      setShortDescription(product.shortDescription || '');
      setDescription(product.description || '');
      setWarrantyText(product.warrantyText || '');
      setWeightKg(product.weightKg || '');
      setImages(product.images || []);
      setCompatibleBikes(product.compatibleBikes || []);
    } else {
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
      setImages([
        {
          id: 'img-def',
          url: '/assets/images/services/motorcycle-spare-parts.webp',
          alt: 'Motorcycle spare parts',
          isPrimary: true
        }
      ]);
      setCompatibleBikes([
        { brand: 'Honda', model: 'CD 70', engineCc: '70cc' },
        { brand: 'United', model: 'US 70', engineCc: '70cc' }
      ]);
    }
  }, [product, categories]);

  const handleAddImage = () => {
    if (!imageUrl.trim()) return;
    const newImg = {
      id: `img-${Date.now()}`,
      url: imageUrl.trim(),
      alt: name || 'Product photograph',
      isPrimary: images.length === 0
    };
    setImages(prev => [...prev, newImg]);
    setImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  const handleAddBikeCompatibility = () => {
    if (!compBrand || !compModel) return;
    const foundModel = bikeModels.find(m => m.brand === compBrand && m.modelName === compModel);
    const newEntry: BikeCompatibility = {
      brand: compBrand as any,
      model: compModel,
      engineCc: foundModel?.engineCc,
      notes: compNotes.trim() || undefined
    };
    setCompatibleBikes(prev => [...prev, newEntry]);
    setCompNotes('');
  };

  const handleRemoveBikeCompatibility = (index: number) => {
    setCompatibleBikes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a product title.');
      return;
    }
    if (!sku.trim()) {
      setError('Please provide a unique SKU identifier.');
      return;
    }
    if (!price || Number(price) <= 0) {
      setError('Please provide a valid product selling price in PKR.');
      return;
    }

    const selectedCategoryObj = categories.find(c => c.id === categoryId);

    try {
      setSaving(true);
      await onSave({
        name: name.trim(),
        sku: sku.trim().toUpperCase(),
        categoryId: categoryId || 'scat-engine-parts',
        categoryName: selectedCategoryObj?.name || 'Engine Parts',
        brand: brand.trim(),
        condition,
        price: Number(price),
        discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
        stockQuantity: Number(stockQuantity) || 0,
        lowStockThreshold: Number(lowStockThreshold) || 4,
        isFeatured,
        isPublished,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        warrantyText: warrantyText.trim(),
        weightKg: weightKg ? Number(weightKg) : undefined,
        images: images.length > 0 ? images : [
          {
            id: 'img-fallback',
            url: '/assets/images/services/motorcycle-spare-parts.webp',
            alt: name.trim(),
            isPrimary: true
          }
        ],
        compatibleBikes
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving product.');
    } finally {
      setSaving(false);
    }
  };

  const uniqueBrands = Array.from(new Set(bikeModels.map(m => m.brand)));
  const filteredModels = bikeModels.filter(m => m.brand === compBrand);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {product ? 'Edit Spare Part Details' : 'Add New Spare Part to Catalog'}
            </h3>
            <p className="text-xs text-slate-500">Configure pricing, verified bike fitments, and stock limits</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Crown Lifan Complete Cylinder Block & Piston Kit – 70cc"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">SKU Part Number *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. HA-ENG-CD70-01"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 uppercase"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Manufacturer / Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Crown Lifan, FCC Japan, NGK"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              >
                <option value="New (OEM / Genuine)">New (OEM / Genuine)</option>
                <option value="New (High-Grade Aftermarket)">New (High-Grade Aftermarket)</option>
                <option value="Refurbished / Tested">Refurbished / Tested</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Price (PKR) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="2850"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Discount Price (PKR)</label>
              <input
                type="number"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="2650"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-red-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                placeholder="10"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Low-Stock Alert</label>
              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                placeholder="4"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-amber-700"
              />
            </div>
          </div>

          {/* Verified Bike Compatibility Builder */}
          <div className="space-y-3 p-4 bg-red-50/50 rounded-2xl border border-red-200/70">
            <div className="flex items-center gap-2">
              <Bike className="w-4 h-4 text-red-600" />
              <label className="font-extrabold text-slate-900 uppercase tracking-wider">
                Motorcycle Compatibility
              </label>
            </div>

            {/* List of currently added models */}
            <div className="flex flex-wrap gap-2">
              {compatibleBikes.map((cb, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-red-200 text-xs font-semibold text-slate-800 shadow-2xs">
                  <span>{cb.brand} {cb.model} {cb.notes ? `(${cb.notes})` : ''}</span>
                  <button type="button" onClick={() => handleRemoveBikeCompatibility(idx)} className="text-slate-400 hover:text-red-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {compatibleBikes.length === 0 && (
                <span className="text-xs text-slate-400 italic">No compatible models assigned yet.</span>
              )}
            </div>

            {/* Add model row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-red-100">
              <select
                value={compBrand}
                onChange={(e) => {
                  setCompBrand(e.target.value);
                  const first = bikeModels.find(m => m.brand === e.target.value);
                  setCompModel(first ? first.modelName : '');
                }}
                className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-medium"
              >
                {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>

              <select
                value={compModel}
                onChange={(e) => setCompModel(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-medium"
              >
                {filteredModels.map(m => <option key={m.id} value={m.modelName}>{m.modelName}</option>)}
              </select>

              <input
                type="text"
                value={compNotes}
                onChange={(e) => setCompNotes(e.target.value)}
                placeholder="Notes e.g. Euro 2 only"
                className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5"
              />

              <button
                type="button"
                onClick={handleAddBikeCompatibility}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Bike</span>
              </button>
            </div>
          </div>

          {/* Product Images Gallery */}
          <div className="space-y-3">
            <label className="block font-bold text-slate-700">Product Photographs</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL or asset path (e.g. /assets/images/services/motorcycle-spare-parts.webp)"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold cursor-pointer hover:bg-slate-800"
              >
                Add Image
              </button>
            </div>

            {/* Previews */}
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className={`relative w-20 h-20 rounded-xl border-2 overflow-hidden ${img.isPrimary ? 'border-red-600 ring-2 ring-red-100' : 'border-slate-200'}`}>
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(i)}
                        className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="text-[10px] bg-rose-600 text-white p-1 rounded-full cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  {img.isPrimary && (
                    <span className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[9px] font-bold text-center">Primary</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description & Warranty */}
          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain engineering details, material quality, and installation recommendations..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Inspection Warranty Text</label>
                <input
                  type="text"
                  value={warrantyText}
                  onChange={(e) => setWarrantyText(e.target.value)}
                  placeholder="e.g. 7-Day Return / Inspection Warranty"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Parcel Weight (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 0.85"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
              />
              <span>Published on Website</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
              />
              <span>Feature on Homepage</span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20 cursor-pointer"
            >
              {saving ? 'Saving...' : product ? 'Update Product' : 'Add to Catalog'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
