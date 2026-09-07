'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBag, Truck, CheckCircle2, Clock, ChevronRight, Package, AlertCircle } from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  total: number;
  shippingAddress: string;
  trackingNumber: string;
  paymentMethod: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/orders', { headers: getAuthHeaders() });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          setError(data.message || 'Failed to fetch order history');
        }
      } catch (err: any) {
        console.error('Failed to load orders', err);
        setError('An unexpected error occurred while loading your orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
            <ShoppingBag className="w-4 h-4" /> Customer Orders
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Order History & Tracking</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track live shipment statuses, estimated delivery windows, and item order history.
          </p>
        </div>

        {/* Content State */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-32 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-950/40 border border-red-800/60 rounded-3xl p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Unable to Load Orders</h3>
            <p className="text-sm text-red-300 max-w-md mx-auto">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <Package className="w-16 h-16 text-slate-600 mx-auto" />
            <h3 className="text-xl font-bold text-white">No Orders Placed Yet</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              You have not placed any orders yet. Browse our storefront catalog to discover trending electronics and apparel!
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20"
              >
                Start Shopping Now <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white font-mono text-base">{order.orderNumber || order.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        order.status === 'DELIVERED'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : order.status === 'SHIPPED'
                          ? 'bg-blue-950/60 text-blue-400 border border-blue-800/60'
                          : order.status === 'CANCELLED'
                          ? 'bg-red-950/60 text-red-400 border border-red-800/60'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-4">
                    <span>Ordered on: <strong className="text-slate-200">{order.date}</strong></span>
                    <span>Items: <strong className="text-slate-200">{order.items?.length || 0}</strong></span>
                    <span>Payment: <strong className="text-slate-200">{order.paymentMethod}</strong></span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total Amount</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    Track Order <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
