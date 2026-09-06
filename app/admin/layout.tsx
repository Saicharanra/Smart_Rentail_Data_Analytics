'use client';

import React from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { Bell, Search, User, Sparkles } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
              Azure Synapse BI Engine
            </span>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <span className="text-xs text-slate-400 hidden sm:block font-mono">
              Cluster: <strong className="text-emerald-400">synapse-dw-prod-01</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400 w-52 focus-within:w-64 focus-within:border-blue-500 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <input
                type="text"
                placeholder="Search metrics, orders..."
                className="bg-transparent border-none outline-none w-full text-white placeholder-slate-500"
              />
            </div>

            {/* Notification Bell */}
            <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500" />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
                SA
              </div>
              <div className="hidden xl:block text-left">
                <span className="text-xs font-semibold text-white block">Senior BI Lead</span>
                <span className="text-[10px] text-slate-500 block">saicharan@azure.bi</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body Content */}
        <main className="p-6 lg:p-10 flex-1 space-y-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
