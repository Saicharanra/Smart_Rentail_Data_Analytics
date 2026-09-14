'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Warehouse,
  Package,
  Store as StoreIcon,
  Clock,
  ShieldCheck,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface InventoryDetail {
  id: string;
  quantity: number;
  reservedQuantity: number;
  reorderLevel: number;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    imageUrl?: string;
    category?: { name: string };
    supplier?: { name: string };
  };
  store: {
    id: string;
    name: string;
    code: string;
    address: string;
    city: string;
    state: string;
    isOnline: boolean;
  };
}

export default function AdminInventoryDetailPage() {
  const params = useParams();
  const inventoryId = params?.id as string;

  const [item, setItem] = useState<InventoryDetail | null>(null);
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
    if (!inventoryId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/inventory/${inventoryId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setItem(data.data);
        } else {
          setError(data.message || 'Inventory record not found.');
        }
      } catch (err: any) {
        setError('Failed to load inventory item.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [inventoryId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2 font-sans">
        <Clock className="w-5 h-5 animate-spin text-amber-400" /> Fetching Stock Detail & Store Context...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="bg-slate-900 border border-red-800/60 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto my-12 font-sans">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Inventory Item Not Found</h2>
        <p className="text-xs text-slate-300">{error || 'The requested inventory item does not exist.'}</p>
        <Link
          href="/admin/inventory"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Inventory Matrix
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <Link
        href="/admin/inventory"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Inventory Matrix
      </Link>

      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{item.product.name}</h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
                item.quantity === 0
                  ? 'bg-red-950/80 text-red-400 border border-red-800'
                  : item.quantity <= item.reorderLevel
                  ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
              }`}
            >
              {item.quantity === 0 ? 'CRITICAL OUT' : item.quantity <= item.reorderLevel ? 'LOW STOCK' : 'IN STOCK'}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            SKU: <span className="text-blue-400 font-bold">{item.product.sku}</span> • Store Hub:{' '}
            <span className="text-white font-semibold">{item.store.name} ({item.store.code})</span>
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-1 backdrop-blur-md">
          <span className="text-slate-500 block">Available Quantity</span>
          <span className="text-xl font-bold font-mono text-emerald-400">{item.quantity} Units</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-1 backdrop-blur-md">
          <span className="text-slate-500 block">Reserved Stock</span>
          <span className="text-xl font-bold font-mono text-amber-400">{item.reservedQuantity} Units</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-1 backdrop-blur-md">
          <span className="text-slate-500 block">Reorder Safety Level</span>
          <span className="text-xl font-bold font-mono text-blue-400">{item.reorderLevel} Units</span>
        </div>
      </div>

      {/* Product & Store Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3 backdrop-blur-md">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" /> Product Specification
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Unit Price</span>
              <span className="font-mono font-bold text-white">{formatCurrency(Number(item.product.price))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category Partition</span>
              <span className="font-semibold text-white">{item.product.category?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Supplier Vendor</span>
              <span className="font-semibold text-white">{item.product.supplier?.name || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3 backdrop-blur-md">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <StoreIcon className="w-4 h-4 text-emerald-400" /> Store Facility Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Store Name</span>
              <span className="font-semibold text-white">{item.store.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location</span>
              <span className="font-semibold text-white">{item.store.address}, {item.store.city}, {item.store.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type</span>
              <span className="font-mono text-blue-400">{item.store.isOnline ? 'Online Fulfillment Hub' : 'Physical Store'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
