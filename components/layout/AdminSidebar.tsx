'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  ShoppingBag,
  Users,
  Truck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products Catalog', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Inventory & Reorders', href: '/admin/inventory', icon: Warehouse },
  { label: 'Customer Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Customer Directory', href: '/admin/customers', icon: Users },
  { label: 'Suppliers & Vendors', href: '/admin/suppliers', icon: Truck },
  { label: 'Azure Synapse BI', href: '/admin/analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`sticky top-0 h-screen bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-20 px-5 border-b border-slate-900 flex items-center justify-between">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div>
                <h2 className="font-bold text-white tracking-tight text-sm">
                  AURA<span className="text-blue-500">ADMIN</span>
                </h2>
                <span className="text-[9px] font-mono text-slate-500 block">
                  Azure BI Portal
                </span>
              </div>
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 mx-auto"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-3">
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile & Store Shortcut Footer */}
      <div className="p-3 border-t border-slate-900 space-y-2">
        <Link
          href="/shop"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400 shrink-0" />
          {!collapsed && <span>View Storefront</span>}
        </Link>

        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-500/30">
              AD
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">Admin Portal</p>
                <span className="text-[10px] text-slate-500 block truncate">saicharan@azure.bi</span>
              </div>
            )}
          </div>
          {!collapsed && (
            <Link href="/" className="text-slate-500 hover:text-slate-300 p-1" title="Logout">
              <LogOut className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
