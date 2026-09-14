'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Package, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminNewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);

  const [name, setName] = useState('');
  const [sku, setSku] = useState(`SKU-RET-${Math.floor(1000 + Math.random() * 9000)}`);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stock, setStock] = useState('50');
  const [isActive, setIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {
    async function loadFormData() {
      try {
        const [catRes, supRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/suppliers', { headers: getAuthHeaders() }),
        ]);

        const catData = await catRes.json();
        if (catRes.ok && catData.data) {
          setCategories(catData.data);
          if (catData.data.length > 0) setCategoryId(catData.data[0].id);
        }

        const supData = await supRes.json();
        if (supRes.ok && supData.data) {
          setSuppliers(supData.data);
          if (supData.data.length > 0) setSupplierId(supData.data[0].id);
        }
      } catch (err) {}
    }
    loadFormData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          sku,
          description,
          price: parseFloat(price),
          costPrice: costPrice ? parseFloat(costPrice) : undefined,
          categoryId,
          supplierId: supplierId || undefined,
          imageUrl: imageUrl || undefined,
          stock: parseInt(stock, 10) || 50,
          isActive,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/products');
      } else {
        setError(data.message || 'Failed to create product.');
      }
    } catch (err: any) {
      setError('An error occurred while creating the product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
      </Link>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 mb-1">
            <Package className="w-4 h-4" /> Catalog Expansion
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Create New Retail Product</h1>
          <p className="text-slate-400 text-xs mt-1">
            Specify SKU, pricing, category partition, supplier link, and initial stock quantities.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Product Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex ANC Wireless Headphones"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">SKU Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU-RET-1001"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-blue-500 outline-none text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Product Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="High performance enterprise retail product specification..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Retail Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="249.99"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Cost Price (₹)</label>
              <input
                type="number"
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="149.99"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Initial Online Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-blue-500 outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Category Partition *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Supplier Vendor</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Product Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-blue-500 outline-none text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
            />
            <label htmlFor="isActive" className="font-semibold text-slate-300 cursor-pointer">
              Product Active & Published on Storefront
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <Link
              href="/admin/products"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Product...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save & Publish Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
