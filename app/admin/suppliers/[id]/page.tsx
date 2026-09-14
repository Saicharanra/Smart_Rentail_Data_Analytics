'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Truck,
  Mail,
  Phone,
  MapPin,
  Star,
  Package,
  Clock,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface SupplierDetail {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: string;
  leadTimeDays: number;
  rating: number;
  status: string;
  productCount: number;
  products: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    isActive: boolean;
  }>;
}

export default function AdminSupplierDetailPage() {
  const params = useParams();
  const supplierId = params?.id as string;

  const [supplier, setSupplier] = useState<SupplierDetail | null>(null);
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
    if (!supplierId) return;

    const fetchSupplierDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/suppliers/${supplierId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSupplier(data.data);
        } else {
          setError(data.message || 'Supplier not found.');
        }
      } catch (err: any) {
        setError('Failed to load supplier details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierDetail();
  }, [supplierId]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2 font-sans">
        <Clock className="w-5 h-5 animate-spin text-blue-400" /> Fetching Supplier & Product Catalog...
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="bg-slate-900 border border-red-800/60 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto my-12 font-sans">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Supplier Not Found</h2>
        <p className="text-xs text-slate-300">{error || 'The requested supplier does not exist.'}</p>
        <Link
          href="/admin/suppliers"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Suppliers Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <Link
        href="/admin/suppliers"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Suppliers Directory
      </Link>

      {/* Supplier Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{supplier.name}</h1>
            <span className="px-3 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold uppercase">
              {supplier.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Category Specialty: <span className="text-blue-400 font-semibold">{supplier.category}</span>
          </p>
        </div>

        <Link
          href={`/admin/suppliers/${supplier.id}/edit`}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          <Edit className="w-4 h-4" /> Edit Supplier
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-1 backdrop-blur-md">
          <span className="text-slate-500 block">Lead Time</span>
          <span className="text-lg font-bold font-mono text-white">{supplier.leadTimeDays} Days</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-1 backdrop-blur-md">
          <span className="text-slate-500 block">Vendor Rating</span>
          <span className="text-lg font-bold font-mono text-amber-400 flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400" /> {supplier.rating} / 5.0
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-1 backdrop-blur-md">
          <span className="text-slate-500 block">Supplied Products</span>
          <span className="text-lg font-bold font-mono text-blue-400">{supplier.productCount} SKUs</span>
        </div>
      </div>

      {/* Contact Details & Address */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md text-xs">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Contact & Logistics Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <span className="text-slate-500 block">Contact Person</span>
            <span className="font-semibold text-white">{supplier.contactPerson || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Email</span>
            <span className="font-mono text-blue-400">{supplier.email || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Phone</span>
            <span className="font-mono text-white">{supplier.phone || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Address</span>
            <span className="font-semibold text-white">{supplier.address || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Supplied Products List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-blue-400" /> Supplied Catalog Items ({supplier.products.length})
        </h3>

        {supplier.products.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No products currently assigned to this supplier.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
                <tr>
                  <th className="pb-3 font-semibold">SKU</th>
                  <th className="pb-3 font-semibold">Product Name</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Price</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {supplier.products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40">
                    <td className="py-3 font-mono text-blue-400 font-bold">{p.sku}</td>
                    <td className="py-3 font-semibold text-white">{p.name}</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.isActive ? 'bg-emerald-950/80 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(Number(p.price))}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-[11px] font-semibold transition-colors"
                      >
                        View Product
                      </Link>
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
