'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Loader2,
  X,
  IndianRupee
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: string;
  trackingNumber?: string;
  itemsCount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedStatus !== 'All') params.set('status', selectedStatus);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, selectedStatus]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ type: 'success', message: `Order status updated to ${newStatus}.` });
        fetchOrders();
      } else {
        setToast({ type: 'error', message: data.message || 'Failed to update order status.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Server error while updating order status.' });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-400 mb-1">
            <ShoppingBag className="w-4 h-4 text-blue-400" /> Order Fulfillment Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Customer Orders ({orders.length})
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Track order processing, update shipment statuses, assign tracking numbers, and view transaction history.
          </p>
        </div>
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
            placeholder="Search order #, tracking #, customer..."
            className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-4 h-4 text-blue-400" /> Order Status:
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="All">All Order Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Orders Directory Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> Querying order records...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm space-y-2">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-semibold text-white">No customer orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
                <tr>
                  <th className="pb-3.5 font-semibold">Order Number</th>
                  <th className="pb-3.5 font-semibold">Customer</th>
                  <th className="pb-3.5 font-semibold">Date</th>
                  <th className="pb-3.5 font-semibold text-center">Items</th>
                  <th className="pb-3.5 font-semibold text-center">Order Status</th>
                  <th className="pb-3.5 font-semibold text-right">Total Amount</th>
                  <th className="pb-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4">
                      <span className="font-bold font-mono text-blue-400 block text-xs">{ord.orderNumber}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{ord.paymentMethod}</span>
                    </td>
                    <td className="py-4 text-slate-300">
                      <span className="font-bold text-white block text-xs">{ord.customerName}</span>
                      <span className="text-[10px] text-slate-500">{ord.customerEmail}</span>
                    </td>
                    <td className="py-4 text-slate-400 font-mono">{ord.createdAt}</td>
                    <td className="py-4 text-center font-mono font-bold text-white">{ord.itemsCount}</td>
                    <td className="py-4 text-center">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider outline-none border cursor-pointer ${
                          ord.status === 'DELIVERED'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                            : ord.status === 'SHIPPED'
                            ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                            : ord.status === 'CANCELLED'
                            ? 'bg-red-950/80 text-red-400 border-red-800'
                            : 'bg-amber-950/80 text-amber-400 border-amber-800'
                        }`}
                      >
                        <option value="PENDING" className="bg-slate-950 text-white">PENDING</option>
                        <option value="PROCESSING" className="bg-slate-950 text-white">PROCESSING</option>
                        <option value="SHIPPED" className="bg-slate-950 text-white">SHIPPED</option>
                        <option value="DELIVERED" className="bg-slate-950 text-white">DELIVERED</option>
                        <option value="CANCELLED" className="bg-slate-950 text-white">CANCELLED</option>
                      </select>
                    </td>
                    <td className="py-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect Order
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
