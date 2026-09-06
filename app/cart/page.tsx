'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/utils';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    tax,
    shipping,
    totalPrice,
  } = useCart();

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Shopping Cart</h1>
            <p className="text-slate-400 text-xs mt-1">Review your selected items before proceeding to secure checkout.</p>
          </div>
          <Link
            href="/shop"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-500">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Your Cart is Currently Empty</h2>
            <p className="text-slate-400 text-xs max-w-md mx-auto">
              Choose from our selection of premium smart retail devices to add them to your cart.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-mono text-blue-400 uppercase">{product.category}</span>
                    <h3 className="text-base font-bold text-white truncate">{product.name}</h3>
                    <span className="text-xs text-slate-400 block font-mono">{formatCurrency(product.price)} each</span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-slate-800 bg-slate-950 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-mono font-bold text-white text-xs">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price & Delete */}
                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold font-mono text-white">
                      {formatCurrency(product.price * quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 h-fit space-y-6">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">Order Summary</h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-mono text-slate-200">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono text-slate-200">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Express Shipping</span>
                  <span className="font-mono text-slate-200">
                    {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-slate-800">
                  <span>Total Due</span>
                  <span className="font-mono text-emerald-400">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold text-center block shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
