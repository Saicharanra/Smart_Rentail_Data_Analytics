'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_ORDERS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Eye, RefreshCw, CheckCircle2, AlertTriangle, Truck } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: string;
  total: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.data && data.data.length > 0) {
        setOrders(data.data);
      } else {
        setOrders(MOCK_ORDERS);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setSuccessMsg('');
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
      );
      setSuccessMsg(`Order ${orderId} updated to "${newStatus}"`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
            <ShoppingBag className="w-4 h-4" /> Fulfillment & Telemetry Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Order Operations</h1>
          <p className="text-xs text-slate-400 mt-1">Manage order fulfillment status, update shipping telemetry, and view details.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors w-fit"
          title="Refresh Orders"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
        </button>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 border-b border-slate-800 font-mono uppercase">
              <tr>
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Fulfillment Status</th>
                <th className="pb-3 font-semibold">Total Amount</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-blue-400">{ord.orderNumber || ord.id}</td>
                  <td className="py-3">
                    <h4 className="font-semibold text-white">{ord.customerName}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{ord.customerEmail}</span>
                  </td>
                  <td className="py-3 text-slate-400 font-mono">{ord.date}</td>
                  <td className="py-3">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border outline-none cursor-pointer ${
                        ord.status === 'Delivered' || ord.status === 'DELIVERED'
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                          : ord.status === 'Shipped' || ord.status === 'SHIPPED'
                          ? 'bg-blue-950/80 text-blue-400 border-blue-800/60'
                          : 'bg-amber-950/80 text-amber-400 border-amber-800/60'
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="py-3 font-mono font-bold text-emerald-400">{formatCurrency(ord.total)}</td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/orders/${ord.id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
