'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/utils';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    tax,
    shipping,
    totalPrice,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-navy-900 border-l border-teal-500/30 text-slate-100 flex flex-col justify-between shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-teal-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-teal-300" />
                  <h3 className="ui-h3 text-[20px] font-medium text-white">Your Shopping Cart</h3>
                  <span className="ui-caption text-[12px] font-mono font-bold bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl bg-navy-800 text-slate-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-navy-800 border border-teal-500/30 flex items-center justify-center text-teal-300">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h4 className="ui-h3 text-[20px] font-medium text-white">Your cart is empty</h4>
                    <p className="ui-body text-[16px] text-slate-300 max-w-xs">
                      Explore our premium smart retail products catalog to add items.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="mt-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[18px] font-semibold rounded-xl"
                    >
                      Browse Catalog
                    </button>
                  </div>
                ) : (
                  cart.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 bg-navy-950/70 p-3.5 rounded-2xl border border-teal-500/20"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-navy-900 shrink-0 border border-teal-500/20">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="ui-body text-[16px] font-medium text-white truncate">
                          {product.name}
                        </h4>
                        <span className="ui-caption text-[14px] text-teal-300 block font-mono">
                          {formatCurrency(product.price)}
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-teal-500/30 bg-navy-900 rounded-lg">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="p-1 hover:bg-navy-800 text-slate-300 hover:text-white"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2.5 ui-caption text-[14px] font-mono font-bold text-white">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="p-1 hover:bg-navy-800 text-slate-300 hover:text-white"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="ui-body text-[16px] font-bold font-mono text-white block">
                          {formatCurrency(product.price * quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="mt-2 p-1 text-slate-400 hover:text-red-400 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary & Checkout Actions */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-teal-500/20 bg-navy-950/90 space-y-4">
                  <div className="space-y-2 ui-caption text-[14px]">
                    <div className="flex justify-between text-slate-300">
                      <span>Subtotal</span>
                      <span className="font-mono text-white">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Estimated Tax (8%)</span>
                      <span className="font-mono text-white">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Express Shipping</span>
                      <span className="font-mono text-teal-300 font-semibold">
                        {shipping === 0 ? 'FREE' : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between ui-body text-[16px] font-bold text-white pt-2 border-t border-teal-500/20">
                      <span>Total Amount</span>
                      <span className="font-mono text-teal-300">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href="/cart"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-3 rounded-xl border border-teal-500/30 bg-navy-800 hover:bg-navy-700 ui-caption text-[14px] font-semibold text-white text-center transition-colors flex items-center justify-center gap-1"
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[18px] font-semibold text-center shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-1"
                    >
                      Checkout <ArrowRight className="w-4 h-4 text-navy-950" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
