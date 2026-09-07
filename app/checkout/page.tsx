'use client';

import React, { useState, useEffect } from 'react';
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
  ShoppingBag,
  AlertTriangle,
  Loader2
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, tax, shipping, totalPrice, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<string>('CREDIT_CARD');
  const [fullName, setFullName] = useState('Eleanor Vance');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Seattle');
  const [state, setState] = useState('WA');
  const [postalCode, setPostalCode] = useState('98101');
  const [phone, setPhone] = useState('+1 (555) 019-2831');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Prefill profile if available
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile', { headers: getAuthHeaders() });
        const data = await res.json();
        if (res.ok && data.data) {
          const user = data.data;
          if (user.name) setFullName(user.name);
          if (user.customer) {
            if (user.customer.phone) setPhone(user.customer.phone);
            if (user.customer.address) setAddress(user.customer.address);
            if (user.customer.city) setCity(user.customer.city);
            if (user.customer.state) setState(user.customer.state);
            if (user.customer.postalCode) setPostalCode(user.customer.postalCode);
          }
        }
      } catch (err) {
        // Ignore prefill error
      }
    }
    loadProfile();
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const shippingAddressString = `${fullName}, ${address}, ${city}, ${state} ${postalCode}, Phone: ${phone}`;

    const orderPayload = {
      shippingAddress: shippingAddressString,
      paymentMethod,
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setCreatedOrder(data.data);
      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdOrder) {
    return (
      <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
        <Navbar />
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 mx-auto flex items-center justify-center animate-bounce shadow-xl shadow-teal-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-mono px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
            Transactional Order Verified & Inventory Updated
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Order Placed Successfully!</h1>
          <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            Order <strong className="text-teal-300 font-mono">#{createdOrder.orderNumber || createdOrder.id}</strong> has been created. Stock levels have been adjusted automatically.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href={`/orders/${createdOrder.id}`}
              className="px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-navy-950 rounded-2xl text-sm font-bold shadow-lg shadow-teal-500/20 flex items-center gap-2"
            >
              View Order Details <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/orders"
              className="px-6 py-3.5 bg-navy-800 hover:bg-navy-700 border border-teal-500/30 text-white rounded-2xl text-sm font-semibold"
            >
              View My Orders
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight border-b border-teal-500/20 pb-4">
          Checkout & Order Confirmation
        </h1>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 shadow-lg">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shipping & Payment Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Shipping Info */}
            <div className="bg-navy-900/80 border border-teal-500/20 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <Truck className="w-5 h-5 text-teal-400" />
                Delivery Information
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-300 font-semibold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 bg-navy-950 border border-teal-500/30 rounded-xl text-white outline-none focus:border-teal-400"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-slate-300 font-semibold">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 bg-navy-950 border border-teal-500/30 rounded-xl text-white outline-none focus:border-teal-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 bg-navy-950 border border-teal-500/30 rounded-xl text-white outline-none focus:border-teal-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-3 bg-navy-950 border border-teal-500/30 rounded-xl text-white outline-none focus:border-teal-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full p-3 bg-navy-950 border border-teal-500/30 rounded-xl text-white outline-none focus:border-teal-400 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 bg-navy-950 border border-teal-500/30 rounded-xl text-white outline-none focus:border-teal-400 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-navy-900/80 border border-teal-500/20 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-2 font-bold text-white text-base">
                <CreditCard className="w-5 h-5 text-teal-400" />
                Simulated Payment Options
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-4 rounded-2xl border text-xs font-semibold text-center transition-all ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                      : 'bg-navy-950 border-teal-500/20 text-slate-400'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('APPLE_PAY')}
                  className={`p-4 rounded-2xl border text-xs font-semibold text-center transition-all ${
                    paymentMethod === 'APPLE_PAY'
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                      : 'bg-navy-950 border-teal-500/20 text-slate-400'
                  }`}
                >
                  Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PAYPAL')}
                  className={`p-4 rounded-2xl border text-xs font-semibold text-center transition-all ${
                    paymentMethod === 'PAYPAL'
                      ? 'bg-teal-500/20 border-teal-400 text-teal-300'
                      : 'bg-navy-950 border-teal-500/20 text-slate-400'
                  }`}
                >
                  PayPal
                </button>
              </div>

              {paymentMethod === 'CREDIT_CARD' && (
                <div className="space-y-3 pt-2 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Card Number (Simulated)</label>
                    <input
                      type="text"
                      defaultValue="•••• •••• •••• 4242"
                      className="w-full p-3 bg-navy-950 border border-teal-500/30 rounded-xl text-white font-mono outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">Expiry</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full p-3 bg-navy-950 border border-teal-500/30 rounded-xl text-white font-mono outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-300 font-semibold">CVC</label>
                      <input
                        type="text"
                        defaultValue="888"
                        className="w-full p-3 bg-navy-950 border border-teal-500/30 rounded-xl text-white font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary & Submit */}
          <div className="lg:col-span-4 bg-navy-900/90 border border-teal-500/30 rounded-3xl p-6 h-fit space-y-6 backdrop-blur-xl shadow-2xl">
            <h2 className="text-lg font-bold text-white border-b border-teal-500/20 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-mono text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Tax (8%)</span>
                <span className="font-mono text-white">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Shipping</span>
                <span className="font-mono text-white">
                  {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-teal-500/20">
                <span>Grand Total</span>
                <span className="font-mono text-teal-300">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 text-xs font-bold text-center shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-navy-950" /> Processing Order...
                </span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-navy-950" /> Place Order ({formatCurrency(totalPrice)})
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Transactional Prisma $transaction Protection</span>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
