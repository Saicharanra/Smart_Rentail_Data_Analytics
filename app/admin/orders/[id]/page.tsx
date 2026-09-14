'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  Save,
  Loader2
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getProductImageUrl } from '@/lib/utils/product-images';

interface AdminOrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: string;
  trackingNumber?: string;
  createdAt: string;
  customer: {
    id: string;
    user: { name: string; email: string };
  };
  items: Array<{
    id: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    product: { name: string; sku: string; imageUrl?: string };
  }>;
  payments: Array<{
    id: string;
    method: string;
    status: string;
    transactionId?: string;
    amount: number;
  }>;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<AdminOrderDetail | null>(null);
  const [status, setStatus] = useState('PROCESSING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/orders/${orderId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.data);
          setStatus(data.data.status);
          setTrackingNumber(data.data.trackingNumber || '');
        } else {
          setError(data.message || 'Order not found.');
        }
      } catch (err: any) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setToastMsg(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status,
          trackingNumber,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMsg('Order status and tracking number updated successfully!');
        if (order) {
          setOrder({ ...order, status, trackingNumber });
        }
      } else {
        alert(data.message || 'Failed to update order.');
      }
    } catch (err) {
      alert('Error updating order status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2 font-sans">
        <Clock className="w-5 h-5 animate-spin text-blue-400" /> Fetching Order Details & Customer Info...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-slate-900 border border-red-800/60 rounded-3xl p-10 text-center space-y-4 max-w-xl mx-auto my-12 font-sans">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Order Record Not Found</h2>
        <p className="text-xs text-slate-300">{error || 'The requested order does not exist.'}</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Order Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Order Directory
      </Link>

      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{order.orderNumber}</h1>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                order.status === 'DELIVERED'
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : order.status === 'SHIPPED'
                  ? 'bg-blue-950/80 text-blue-400 border border-blue-800'
                  : order.status === 'CANCELLED'
                  ? 'bg-red-950/80 text-red-400 border border-red-800'
                  : 'bg-amber-950/80 text-amber-400 border border-amber-800'
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Placed on: {new Date(order.createdAt).toLocaleString()} • Customer:{' '}
            <strong className="text-white">{order.customer.user.name}</strong> ({order.customer.user.email})
          </p>
        </div>

        <button
          onClick={() => alert(`Simulated Invoice PDF generated for ${order.orderNumber}`)}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-blue-400" /> Export Invoice
        </button>
      </div>

      {toastMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {toastMsg}
        </div>
      )}

      {/* Grid: Order Update Form & Customer Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Status Update Form */}
        <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-400" /> Order Status & Tracking Management
          </h3>

          <form onSubmit={handleUpdateOrder} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Order Status Transition *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-blue-500 outline-none text-xs"
              >
                <option value="PENDING">PENDING</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="TRK-AZU-9921448"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-blue-500 outline-none text-xs"
              />
            </div>

            <div className="sm:col-span-2 pt-2 flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Order Status
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Shipping Destination Summary */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3 backdrop-blur-md text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm border-b border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-blue-400" /> Shipping Destination
          </div>
          <p className="text-slate-300 leading-relaxed">{order.shippingAddress}</p>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-slate-500 block">Recipient Customer</span>
            <span className="font-semibold text-white">{order.customer.user.name}</span>
          </div>
        </div>
      </div>

      {/* Items Breakdown Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Ordered Line Items</h3>

        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                <Image
                  src={getProductImageUrl(item.product.imageUrl, undefined, idx)}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-white truncate">{item.product.name}</h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  {item.product.sku} • Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                </span>
              </div>
              <span className="text-xs font-bold font-mono text-white">{formatCurrency(item.totalPrice)}</span>
            </div>
          ))}
        </div>

        {/* Payment Summary */}
        <div className="pt-4 border-t border-slate-800 max-w-sm ml-auto space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="font-mono text-white">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Tax (8%)</span>
            <span className="font-mono text-white">{formatCurrency(order.tax)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Shipping Fee</span>
            <span className="font-mono text-white">{order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-slate-300 font-bold pt-2 border-t border-slate-800 text-sm">
            <span>Total Paid</span>
            <span className="font-mono text-emerald-400">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
