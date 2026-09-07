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
  ShieldCheck,
  Tag,
  CheckCircle2,
  Sparkles
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
    <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 selection:bg-teal-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-teal-500/20 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300">
                <ShoppingBag className="w-6 h-6" />
              </span>
              <h1 className="ui-h1 text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white tracking-tight">
                Shopping Cart
              </h1>
            </div>
            <p className="ui-caption text-sm text-slate-300 mt-2.5 font-sans leading-relaxed">
              Review your selected smart devices and quantities before proceeding to secure checkout.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-teal-300 hover:text-teal-200 bg-navy-800/80 hover:bg-navy-700/80 px-4 py-2.5 rounded-xl border border-teal-500/30 transition-all w-fit shadow-md shadow-teal-500/5"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 sm:p-16 text-center space-y-5 border border-teal-500/25 shadow-2xl">
            <div className="w-20 h-20 rounded-3xl bg-navy-800/90 border border-teal-500/30 mx-auto flex items-center justify-center text-teal-300 shadow-xl shadow-teal-500/10">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="ui-h2 text-xl sm:text-2xl font-heading font-bold text-white">Your Cart is Currently Empty</h2>
              <p className="ui-body text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                Discover our catalog of high-performance smart electronics, workplace solutions, and biometric wearables.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-teal-500 hover:bg-teal-400 text-navy-950 rounded-xl ui-btn text-base font-semibold transition-all shadow-lg shadow-teal-500/25"
            >
              <Sparkles className="w-5 h-5" /> Explore Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="glass-card glass-card-hover rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 border border-teal-500/20 shadow-xl transition-all group"
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-navy-950 shrink-0 border border-teal-500/25 shadow-md group-hover:border-teal-400/40 transition-colors">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Product Detailed Information */}
                  <div className="flex-1 min-w-0 space-y-1.5 w-full">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-teal-300 uppercase tracking-wider bg-teal-500/15 px-2.5 py-0.5 rounded-md border border-teal-500/30">
                        <Tag className="w-3 h-3 text-teal-400" />
                        {product.category}
                      </span>
                      {product.sku && (
                        <span className="text-[11px] font-mono text-slate-400 bg-navy-950/60 px-2 py-0.5 rounded border border-slate-700/50">
                          {product.sku}
                        </span>
                      )}
                    </div>

                    <Link href={`/products/${product.id}`} className="block">
                      <h3 className="ui-h3 text-base sm:text-lg font-heading font-bold text-white tracking-tight leading-snug hover:text-teal-300 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-3 text-xs sm:text-sm pt-0.5">
                      <span className="font-mono font-medium text-slate-300">
                        Unit Price: <strong className="text-teal-200 font-semibold">{formatCurrency(product.price)}</strong>
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="font-mono text-xs text-slate-500 line-through">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Controls & Price Block */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-teal-500/10">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-teal-500/30 bg-navy-950/90 rounded-xl p-1 shadow-inner">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3.5 font-mono font-bold text-white text-sm sm:text-base min-w-[2.5rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total Price & Delete Button */}
                    <div className="flex items-center gap-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="ui-caption text-[11px] text-slate-400 font-sans uppercase tracking-wider">Item Total</span>
                        <span className="ui-h3 text-base sm:text-xl font-heading font-mono font-bold text-teal-300">
                          {formatCurrency(product.price * quantity)}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                        title="Remove item from cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4 glass-panel rounded-3xl p-6 sm:p-7 space-y-6 border border-teal-500/30 shadow-2xl sticky top-28">
              <h2 className="ui-h2 text-lg sm:text-xl font-heading font-bold text-white border-b border-teal-500/20 pb-4 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="ui-caption text-xs font-mono font-bold text-teal-300 bg-teal-500/20 px-2.5 py-1 rounded-full border border-teal-500/30">
                  {cart.reduce((s, i) => s + i.quantity, 0)} Items
                </span>
              </h2>

              <div className="space-y-3.5 ui-caption text-sm font-sans">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-slate-100 text-base">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-mono font-semibold text-slate-100 text-base">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Express Shipping</span>
                  <span className="font-mono font-bold text-teal-300 text-base">
                    {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-base font-bold text-white pt-4 border-t border-teal-500/20">
                  <span className="font-heading">Total Due</span>
                  <span className="ui-h2 text-xl font-heading font-mono text-teal-300">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-base font-bold text-center shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 group"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5 text-navy-950 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-center gap-2 pt-2 text-xs font-sans text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>256-bit SSL Encrypted & Protected</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

