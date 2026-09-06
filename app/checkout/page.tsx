'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/utils';
import {
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, tax, shipping, totalPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'paypal'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderPlaced(true);
      clearCart();
    }, 1500);
  };

  if (orderPlaced) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
            Order Confirmed & Verified
          </span>
          <h1 className="text-3xl font-extrabold text-white">Order Placed Successfully!</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Order <strong className="text-white font-mono">#ORD-2026-9041</strong> has been confirmed. A confirmation receipt and tracking timeline have been sent to your email.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/orders/ORD-2026-9041"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20"
            >
              Track Order Timeline
            </Link>
            <Link
              href="/shop"
              className="px-6 py-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight border-b border-slate-800 pb-4">
          Checkout & Order Confirmation
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping & Payment Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Shipping Info */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Truck className="w-5 h-5 text-blue-400" />
                Shipping Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-400">First Name</label>
                  <input
                    type="text"
                    required
                    defaultValue="Eleanor"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Last Name</label>
                  <input
                    type="text"
                    required
                    defaultValue="Vance"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-400">Street Address</label>
                  <input
                    type="text"
                    required
                    defaultValue="742 Evergreen Terrace"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">City</label>
                  <input
                    type="text"
                    required
                    defaultValue="Seattle"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Zip Code</label>
                  <input
                    type="text"
                    required
                    defaultValue="98101"
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                Payment Options
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border text-xs font-semibold text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple')}
                  className={`p-4 rounded-2xl border text-xs font-semibold text-center transition-all ${
                    paymentMethod === 'apple'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-2xl border text-xs font-semibold text-center transition-all ${
                    paymentMethod === 'paypal'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  PayPal
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-3 pt-2 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400">Card Number</label>
                    <input
                      type="text"
                      defaultValue="•••• •••• •••• 4242"
                      className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-400">Expiry</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400">CVC</label>
                      <input
                        type="text"
                        defaultValue="888"
                        className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary & Submit */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 h-fit space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">
              Review Total
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax (8%)</span>
                <span className="font-mono text-slate-200">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping</span>
                <span className="font-mono text-slate-200">
                  {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="font-mono text-emerald-400">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold text-center shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Place Order ({formatCurrency(totalPrice)})
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-bit SSL Encrypted Transaction</span>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
