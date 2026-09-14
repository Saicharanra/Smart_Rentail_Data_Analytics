'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Package, AlertCircle } from 'lucide-react';

export default function AdminEditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
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
    async function loadProductAndData() {
      try {
        setLoading(true);
        const [catRes, supRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/suppliers', { headers: getAuthHeaders() }),
          fetch(`/api/admin/products/${productId}`, { headers: getAuthHeaders() }),
        ]);

        const catData = await catRes.json();
        if (catRes.ok && catData.data) setCategories(catData.data);

        const supData = await supRes.json();
        if (supRes.ok && supData.data) setSuppliers(supData.data);

        const prodData = await prodRes.json();
        if (prodRes.ok && prodData.data) {
          const p = prodData.data;
          setName(p.name);
          setSku(p.sku);
          setDescription(p.description);
          setPrice(String(p.price));
          setCostPrice(p.costPrice ? String(p.costPrice) : '');
          setCategoryId(p.categoryId);
          setSupplierId(p.supplierId || '');
          setImageUrl(p.imageUrl || '');
          setIsActive(p.isActive);
        } else {
          setError(prodData.message || 'Product not found.');
        }
      } catch (err) {
        setError('Failed to load product for editing.');
      } finally {
        setLoading(false);
      }
    }

    if (productId) loadProductAndData();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
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
          isActive,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/products');
      } else {
        setError(data.message || 'Failed to update product.');
      }
    } catch (err: any) {
      setError('An error occurred while updating the product.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2 font-sans">
        <Loader2 className="w-5 h-5 animate-spin text-blue-400" /> Loading product editor...
      </div>
    );
  }

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
            <Package className="w-4 h-4" /> Edit Catalog Record
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Edit Product: {name}</h1>
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
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Retail Price (₹) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating Product...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
