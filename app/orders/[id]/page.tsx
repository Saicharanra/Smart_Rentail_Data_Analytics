'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatCurrency } from '@/lib/utils';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  PackageCheck,
  Clock,
  MapPin,
  CreditCard,
  Download,
  AlertCircle
} from 'lucide-react';

interface SingleOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  status: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  shippingAddress: string;
  trackingNumber: string;
  createdAt: string;
  customer?: {
    user?: {
      name?: string;
      email?: string;
    };
  };
  items: Array<{
    id: string;
    productId: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    product?: {
      name?: string;
      imageUrl?: string;
    };
  }>;
  payments: Array<{
    method: string;
    status: string;
    transactionId: string;
  }>;
}

export default function OrderTrackingDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<SingleOrder | null>(null);
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
    if (!orderId) return;

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.data);
        } else {
          setError(data.message || 'Order not found or access forbidden.');
        }
      } catch (err: any) {
        console.error('Failed to fetch order details', err);
        setError('An unexpected error occurred while fetching order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-slate-400 font-semibold text-sm animate-pulse flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" /> Fetching Live Order Status & Tracking...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 space-y-6 text-center">
          <div className="bg-slate-900/80 border border-red-800/60 rounded-3xl p-10 space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Order Unavailable</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              {error || 'We could not find the requested order or you do not have permission to view it.'}
            </p>
            <div className="pt-2">
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to My Orders
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const dateFormatted = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const steps = [
    { name: 'Order Placed & Confirmed', time: dateFormatted, completed: true },
    { name: 'Payment Verified & Packaged', time: 'Completed', completed: true },
    {
      name: 'Shipped from Distribution Hub',
      time: order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'In Transit' : 'Pending',
      completed: order.status === 'SHIPPED' || order.status === 'DELIVERED',
    },
    {
      name: 'Delivered to Destination',
      time: order.status === 'DELIVERED' ? 'Delivered' : 'In Progress',
      completed: order.status === 'DELIVERED',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Order History
        </Link>

        {/* Header Summary */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 backdrop-blur-md">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{order.orderNumber || order.id}</h1>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  order.status === 'DELIVERED'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                    : order.status === 'SHIPPED'
                    ? 'bg-blue-950/80 text-blue-400 border border-blue-800/80'
                    : order.status === 'CANCELLED'
                    ? 'bg-red-950/80 text-red-400 border border-red-800/80'
                    : 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-slate-400 text-xs font-mono">
              Tracking Number: <span className="text-blue-400">{order.trackingNumber || 'Pending Assignment'}</span>
            </p>
          </div>

          <button
            onClick={() => alert(`Invoice PDF download initiated for Order #${order.orderNumber}`)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" /> Download Invoice
          </button>
        </div>

        {/* Shipment Progress Bar Timeline */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6 backdrop-blur-md">
          <h2 className="text-lg font-bold text-white">Live Tracking Timeline</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col space-y-2 relative">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      step.completed
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <h4 className={`text-xs font-semibold ${step.completed ? 'text-white' : 'text-slate-500'}`}>
                    {step.name}
                  </h4>
                </div>
                <span className="text-[11px] text-slate-500 pl-11 font-mono">{step.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Address Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items Table */}
          <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 backdrop-blur-md">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Items in Shipment</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                    <Image
                      src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
                      alt={item.product?.name || 'Product Item'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{item.product?.name || 'Retail Item'}</h4>
                    <span className="text-xs text-slate-400 font-mono">
                      Qty: {item.quantity} × {formatCurrency(item.unitPrice)}
                    </span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">{formatCurrency(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3 text-xs backdrop-blur-md">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <MapPin className="w-4 h-4 text-blue-400" /> Shipping Destination
              </div>
              <p className="text-slate-300 leading-relaxed">{order.shippingAddress}</p>
              <div className="pt-3 border-t border-slate-800">
                <span className="text-slate-500 block">Recipient</span>
                <span className="font-semibold text-white">{order.customer?.user?.name || 'Valued Customer'}</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3 text-xs backdrop-blur-md">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <CreditCard className="w-4 h-4 text-emerald-400" /> Payment Breakdown
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Method</span>
                <span className="text-white font-medium">{order.payments[0]?.method || 'CREDIT_CARD'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-mono">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (8%)</span>
                <span className="text-white font-mono">{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping Fee</span>
                <span className="text-white font-mono">{order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span className="font-bold text-white">Total Paid</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
