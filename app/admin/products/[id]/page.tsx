'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Edit,
  Package,
  IndianRupee,
  Warehouse,
  ShoppingBag,
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/utils/product-images';

interface SingleProductDetail {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  costPrice?: number;
  imageUrl?: string;
  isActive: boolean;
  category: { id: string; name: string; slug: string };
  supplier?: { id: string; name: string };
  totalStock: number;
  orderCount: number;
  reviewCount: number;
  inventoryItems: Array<{
    id: string;
    quantity: number;
    reorderLevel: number;
    store: { name: string; code: string };
  }>;
}

export default function AdminProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<SingleProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
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
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/products/${productId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProduct(data.data);
        } else {
          setError(data.message || 'Product not found.');
        }
      } catch (err: any) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2 font-sans">
        <Clock className="w-5 h-5 animate-spin text-blue-400" /> Fetching Product Details & Inventory Matrix...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-slate-900 border border-red-800/60 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto my-12 font-sans">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <p className="text-xs text-slate-300">{error || 'The requested product does not exist.'}</p>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
      </Link>

      {/* Product Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
            <Image
              src={getProductImageUrl(product.imageUrl, product.category?.slug || product.category?.name)}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{product.name}</h1>
              <span
                className={`text-xs font-mono font-bold px-3 py-0.5 rounded-full uppercase ${
                  product.isActive
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              SKU: <span className="text-blue-400">{product.sku}</span> • Category:{' '}
              <span className="text-white font-semibold">{product.category.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
          >
            <Edit className="w-4 h-4" /> Edit Product
          </Link>
        </div>
      </div>

      {/* Details & Specs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Product Description & Specs</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs border-t border-slate-800">
            <div>
              <span className="text-slate-500 block">Retail Price</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{formatCurrency(product.price)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Cost Price</span>
              <span className="font-mono text-slate-300 text-sm">
                {product.costPrice ? formatCurrency(product.costPrice) : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Supplier</span>
              <span className="font-semibold text-white">{product.supplier?.name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Total Orders</span>
              <span className="font-mono font-bold text-white">{product.orderCount}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Reviews Count</span>
              <span className="font-mono font-bold text-white">{product.reviewCount}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Category Partition</span>
              <span className="font-semibold text-blue-400">{product.category.name}</span>
            </div>
          </div>
        </div>

        {/* Store Inventory Matrix */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-amber-400" /> Store Stock Breakdown
          </h3>

          <div className="space-y-3">
            {product.inventoryItems.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No inventory records configured for stores.</p>
            ) : (
              product.inventoryItems.map((inv) => (
                <div key={inv.id} className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{inv.store.name}</span>
                    <span className="font-mono font-bold text-emerald-400">{inv.quantity} units</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block">Reorder Level: {inv.reorderLevel}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
