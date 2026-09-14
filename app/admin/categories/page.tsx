'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FolderTree,
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getProductImageUrl } from '@/lib/utils/product-images';

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  productCount: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/categories?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search]);

  const handleDeleteCategory = async (cat: CategoryRecord) => {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ type: 'success', message: 'Category deleted successfully.' });
        fetchCategories();
      } else {
        setToast({ type: 'error', message: data.message || 'Could not delete category.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Server error while deleting category.' });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
            <FolderTree className="w-4 h-4 text-emerald-400" /> Taxonomy & Partitions
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Product Categories ({categories.length})
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage product category partitions, descriptions, banner artwork, and product assignments.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Link>
      </div>

      {toast && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
              : 'bg-red-950/80 border border-red-800 text-red-300'
          }`}
        >
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="p-1 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name, slug..."
            className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500 text-xs"
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> Querying category partitions...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <FolderTree className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-semibold text-white">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-5 space-y-4 flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                      <Image
                        src={getProductImageUrl(cat.imageUrl, cat.slug, idx)}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800 text-[10px] font-mono font-bold">
                      {cat.productCount} Products
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm">{cat.name}</h3>
                    <span className="text-[10px] font-mono text-slate-500 block">slug: {cat.slug}</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {cat.description || 'No description provided for this category partition.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                  <Link
                    href={`/categories/${cat.id}`}
                    className="text-[11px] text-slate-400 hover:text-white font-mono flex items-center gap-1"
                  >
                    View Catalog <Package className="w-3 h-3 text-blue-400" />
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-white transition-colors"
                      title="Edit Category"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
