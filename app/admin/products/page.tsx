'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  Filter,
  RefreshCw,
  PowerOff,
  Power
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/utils/product-images';

interface ProductRecord {
  id: string;
  sku: string;
  name: string;
  categoryName: string;
  categorySlug: string;
  categoryId: string;
  supplierName: string;
  price: number;
  totalStock: number;
  stockStatus: string;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedCategory !== 'All') params.set('categoryId', selectedCategory);

      const res = await fetch(`/api/admin/products?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok && data.data) {
        setCategories(data.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, selectedCategory, selectedStatus]);

  const handleToggleStatus = async (product: ProductRecord) => {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({
          type: 'success',
          message: `Product "${product.name}" has been ${product.isActive ? 'deactivated' : 'activated'}.`,
        });
        fetchProducts();
      } else {
        setToast({ type: 'error', message: data.message || 'Failed to update status.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to toggle product status.' });
    }
  };

  const handleDeleteProduct = async (product: ProductRecord) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ type: 'success', message: 'Product deleted successfully.' });
        fetchProducts();
      } else {
        // Handle Delete Safety Warning
        if (data.details?.canDeactivate) {
          if (confirm(`${data.message}\n\nWould you like to deactivate this product now instead?`)) {
            handleToggleStatus(product);
          }
        } else {
          setToast({ type: 'error', message: data.message || 'Could not delete product.' });
        }
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Server error while attempting product deletion.' });
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedStatus === 'Active') return p.isActive;
    if (selectedStatus === 'Inactive') return !p.isActive;
    return true;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 mb-1">
            <Package className="w-4 h-4 text-blue-400" /> Enterprise Catalog Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Products Catalog ({filteredProducts.length})
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage SKUs, categories, pricing, stock levels, and product availability status.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Product
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

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, SKU..."
            className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-4 h-4 text-blue-400" /> Category:
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> Querying product catalog records...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-semibold text-white">No products found</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
                <tr>
                  <th className="pb-3.5 font-semibold">Product Item</th>
                  <th className="pb-3.5 font-semibold">Category & Supplier</th>
                  <th className="pb-3.5 font-semibold text-right">Price</th>
                  <th className="pb-3.5 font-semibold text-center">Total Stock</th>
                  <th className="pb-3.5 font-semibold text-center">Status</th>
                  <th className="pb-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                          <Image
                            src={getProductImageUrl(p.imageUrl, p.categorySlug || p.categoryName, idx)}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-xs truncate max-w-xs">{p.name}</h4>
                          <span className="text-[10px] text-blue-400 font-mono block">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-300">
                      <span className="font-semibold text-white block">{p.categoryName}</span>
                      <span className="text-[10px] text-slate-500 block">{p.supplierName}</span>
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-white text-sm">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="py-4 text-center font-mono">
                      <span
                        className={`font-bold block text-sm ${
                          p.totalStock === 0
                            ? 'text-red-400'
                            : p.stockStatus === 'LOW STOCK'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {p.totalStock}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">{p.stockStatus}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.isActive
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-white transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(p)}
                          className={`p-2 rounded-lg transition-colors ${
                            p.isActive
                              ? 'bg-slate-800 hover:bg-amber-500/20 text-amber-400'
                              : 'bg-slate-800 hover:bg-emerald-500/20 text-emerald-400'
                          }`}
                          title={p.isActive ? 'Deactivate Product' : 'Activate Product'}
                        >
                          {p.isActive ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
