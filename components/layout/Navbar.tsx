'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ShoppingCart,
  LayoutDashboard,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Truck,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<{ id: string; email: string; name?: string; role: string } | null>(null);

  // Sync authentication state from localStorage
  const syncAuthState = () => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    syncAuthState();

    const handleAuthChange = () => syncAuthState();
    window.addEventListener('auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setUser(null);
    window.dispatchEvent(new Event('auth_change'));
    router.push('/login');
  };

  const isNavActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-navy-900/90 border-b border-teal-500/20 shadow-md">
      {/* Top Banner Notice */}
      <div className="bg-navy-950 py-1.5 px-4 text-center border-b border-teal-500/10 hidden sm:block">
        <p className="ui-caption text-[13px] text-teal-200/90 flex items-center justify-center gap-2">
          <Truck className="w-3.5 h-3.5 text-teal-400" />
          <span>Free Express Shipping on Orders Over ₹5,000 • 30-Day Money Back Guarantee</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-300 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-navy-900 rounded-[10px] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-teal-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-heading font-extrabold text-white tracking-tight text-xl leading-tight">
              SMART<span className="text-teal-400">RETAIL</span>
            </div>
            <span className="ui-caption text-[11px] text-teal-200/70 font-mono tracking-wider block">
              Premium Smart Devices
            </span>
          </div>
        </Link>

        {/* Global Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 ui-caption font-medium">
          <Link
            href="/"
            className={`px-4 py-2 rounded-xl transition-colors ${
              pathname === '/'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40'
                : 'text-slate-200 hover:text-white hover:bg-navy-800/80'
            }`}
          >
            Home
          </Link>
          <Link
            href="/shop"
            className={`px-4 py-2 rounded-xl transition-colors ${
              isNavActive('/shop') || isNavActive('/products')
                ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40'
                : 'text-slate-200 hover:text-white hover:bg-navy-800/80'
            }`}
          >
            Shop Catalog
          </Link>
          <Link
            href="/categories"
            className={`px-4 py-2 rounded-xl transition-colors ${
              isNavActive('/categories')
                ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40'
                : 'text-slate-200 hover:text-white hover:bg-navy-800/80'
            }`}
          >
            Categories
          </Link>
          <Link
            href="/orders"
            className={`px-4 py-2 rounded-xl transition-colors ${
              isNavActive('/orders')
                ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40'
                : 'text-slate-200 hover:text-white hover:bg-navy-800/80'
            }`}
          >
            Order Tracking
          </Link>
          <Link
            href="/reviews"
            className={`px-4 py-2 rounded-xl transition-colors ${
              isNavActive('/reviews')
                ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40'
                : 'text-slate-200 hover:text-white hover:bg-navy-800/80'
            }`}
          >
            Reviews
          </Link>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
              }
            }}
            className="hidden lg:flex items-center gap-2 bg-navy-800/90 border border-teal-500/30 rounded-xl px-3.5 py-2 ui-caption text-slate-300 w-48 focus-within:w-60 focus-within:border-teal-400 transition-all"
          >
            <Search className="w-4 h-4 shrink-0 text-teal-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-white placeholder-slate-400 ui-caption"
            />
          </form>

          {/* Cart Icon Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-teal-500/30 text-white transition-all"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5 text-teal-300" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-teal-500 text-white font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-navy-900 shadow-md">
                {totalItems}
              </span>
            )}
          </button>

          {/* Dynamic Authentication Header Controls */}
          {user ? (
            <div className="flex items-center gap-2.5">
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 border border-teal-500/30 text-teal-300 ui-caption text-[13px] font-semibold transition-all shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" /> Admin
                </Link>
              )}
              {/* Profile Photo Only Badge */}
              <Link
                href="/profile"
                className="relative group p-0.5 rounded-full bg-gradient-to-tr from-teal-400 via-teal-300 to-emerald-400 shadow-md shadow-teal-500/20 hover:scale-105 transition-all duration-200"
                title={`Account Profile (${user.name || user.email})`}
              >
                <div className="w-9 h-9 rounded-full bg-navy-950 flex items-center justify-center text-teal-300 font-bold text-sm font-heading border border-navy-900 overflow-hidden">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-teal-400 border-2 border-navy-900 rounded-full" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-navy-800 hover:bg-red-500/20 border border-teal-500/30 text-slate-300 hover:text-red-300 transition-all hidden sm:flex"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-caption font-semibold transition-all shadow-md shadow-teal-500/20"
              title="Sign In to Account"
            >
              <User className="w-4 h-4 text-navy-950" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-navy-800 border border-teal-500/30 text-slate-200 md:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-b border-teal-500/30 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-slate-100 hover:bg-navy-800 ui-body font-medium"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-slate-100 hover:bg-navy-800 ui-body font-medium"
          >
            Shop Catalog
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-slate-100 hover:bg-navy-800 ui-body font-medium"
          >
            Categories
          </Link>
          <Link
            href="/orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-lg text-slate-100 hover:bg-navy-800 ui-body font-medium"
          >
            Order Tracking
          </Link>

          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-lg bg-teal-500/20 text-teal-300 ui-body font-semibold"
              >
                My Account ({user.name || user.email})
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg bg-navy-800 text-teal-300 ui-body font-semibold"
                >
                  Admin Portal
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2.5 rounded-lg bg-red-950/60 text-red-300 ui-body font-semibold flex items-center justify-between"
              >
                <span>Sign Out</span>
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-lg bg-teal-500 text-navy-950 ui-btn font-semibold text-center"
            >
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
