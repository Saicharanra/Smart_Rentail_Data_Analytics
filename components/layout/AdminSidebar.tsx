'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  ShoppingBag,
  Users,
  Truck,
  Store as StoreIcon,
  CreditCard,
  MessageSquare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Suppliers', href: '/admin/suppliers', icon: Truck },
  { label: 'Stores', href: '/admin/stores', icon: StoreIcon },
  { label: 'Inventory', href: '/admin/inventory', icon: Warehouse },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user_info');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin' || pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    window.dispatchEvent(new Event('auth_change'));
    router.push('/login');
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand Header */}
        <div className="h-20 px-5 border-b border-slate-900 flex items-center justify-between">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                A
              </div>
              <div>
                <h2 className="font-bold text-white tracking-tight text-sm flex items-center gap-1">
                  AURA<span className="text-blue-500">ADMIN</span>
                </h2>
                <span className="text-[9px] font-mono text-slate-500 block">
                  Smart Retail Platform
                </span>
              </div>
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                {(!collapsed || mobileOpen) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer User & Storefront Link */}
      <div className="p-3 border-t border-slate-900 space-y-2">
        <Link
          href="/shop"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />
          {(!collapsed || mobileOpen) && <span>View Customer Storefront</span>}
        </Link>

        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 border border-slate-900">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-500/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'AD'}
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Admin User'}</p>
                <span className="text-[10px] text-slate-500 block truncate">{user?.email || 'admin@retail.bi'}</span>
              </div>
            )}
          </div>
          {(!collapsed || mobileOpen) && (
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 p-1.5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Toggle Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/90 border-b border-slate-800 px-4 flex items-center justify-between z-40 backdrop-blur-md">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <span className="font-bold text-white text-sm">AURA ADMIN</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-slate-950 border-r border-slate-800 z-50 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex sticky top-0 h-screen bg-slate-950 border-r border-slate-800/80 flex-col transition-all duration-300 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}
