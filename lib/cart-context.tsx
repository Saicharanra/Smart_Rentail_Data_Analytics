'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, X } from 'lucide-react';
import { Product } from './mock-data';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Initialize cart empty by default
  useEffect(() => {
    setCart([]);
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const userInfo = typeof window !== 'undefined' ? localStorage.getItem('user_info') : null;

    if (!token && !userInfo) {
      setShowLoginModal(true);
      return;
    }

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 15;
  const totalPrice = subtotal + tax + shipping;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        tax,
        shipping,
        totalPrice,
      }}
    >
      {children}

      {/* Login Required Modal Overlay */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="bg-navy-900 border border-teal-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 mx-auto flex items-center justify-center border border-teal-500/30 shadow-lg shadow-teal-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="ui-h2 text-[24px] font-bold text-white tracking-tight">Sign In Required</h3>
              <p className="ui-caption text-[14px] text-slate-300 leading-relaxed">
                Please sign in to your account to add items to your cart and complete your order.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <Link
                href="/login"
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[16px] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
              >
                Sign In to Account <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/register"
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-white ui-caption text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors border border-teal-500/20"
              >
                Create Account
              </Link>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="ui-caption text-[13px] text-slate-400 hover:text-white transition-colors block mx-auto pt-1"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
