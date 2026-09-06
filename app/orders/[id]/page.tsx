'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MOCK_ORDERS } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  PackageCheck,
  Clock,
  MapPin,
  CreditCard,
  Download
} from 'lucide-react';

export default function OrderTrackingDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const order = MOCK_ORDERS.find((o) => o.id === orderId) || MOCK_ORDERS[0];

  const steps = [
    { name: 'Order Placed & Confirmed', time: order.date, completed: true },
    { name: 'Payment Verified & Packaged', time: '15 mins later', completed: true },
    { name: 'Shipped from Distribution Hub', time: order.estimatedDelivery ? 'Next Day' : 'In Transit', completed: order.status === 'Shipped' || order.status === 'Delivered' },
    { name: 'Delivered to Address', time: order.estimatedDelivery || 'In Progress', completed: order.status === 'Delivered' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Order History
        </Link>

        {/* Header Summary */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">{order.id}</h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                {order.status}
              </span>
            </div>
            <p className="text-slate-400 text-xs">
              Tracking Number: <span className="font-mono text-blue-400">{order.trackingNumber}</span>
            </p>
          </div>

          <button
            onClick={() => alert('Invoice PDF Download Simulated')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" /> Download Invoice
          </button>
        </div>

        {/* Shipment Progress Bar Timeline */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
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
          <div className="lg:col-span-8 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Items in Shipment</h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white truncate">{item.productName}</h4>
                    <span className="text-xs text-slate-400 font-mono">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Payment Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <MapPin className="w-4 h-4 text-blue-400" /> Shipping Destination
              </div>
              <p className="text-slate-300 leading-relaxed">{order.shippingAddress}</p>
              <div className="pt-3 border-t border-slate-800">
                <span className="text-slate-500 block">Recipient</span>
                <span className="font-semibold text-white">{order.customerName}</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <CreditCard className="w-4 h-4 text-emerald-400" /> Payment Summary
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Method</span>
                <span className="text-white font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                <span>Total Paid</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
