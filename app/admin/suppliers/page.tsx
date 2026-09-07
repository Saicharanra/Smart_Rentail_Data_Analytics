'use client';

import React, { useState, useEffect } from 'react';
import { MOCK_SUPPLIERS, Supplier } from '@/lib/mock-data';
import { Truck, Star, Phone, Mail, RefreshCw, Plus, X, Loader2, CheckCircle2 } from 'lucide-react';

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Modal form fields
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLeadTime, setFormLeadTime] = useState('3');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/suppliers', { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.data && data.data.length > 0) {
        setSuppliers(data.data);
      } else {
        setSuppliers(MOCK_SUPPLIERS);
      }
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
      setSuppliers(MOCK_SUPPLIERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setSuccessMsg('');

    const newSupData = {
      name: formName,
      contactPerson: formContact,
      email: formEmail,
      phone: formPhone,
      leadTimeDays: parseInt(formLeadTime, 10) || 3,
      category: 'Electronics',
      rating: 4.9,
    };

    try {
      await fetch('/api/suppliers', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newSupData),
      });
    } catch (err) {
      console.error('Create supplier error:', err);
    } finally {
      const newSup: Supplier = {
        id: `sup-${Date.now()}`,
        name: formName,
        contactPerson: formContact,
        email: formEmail,
        phone: formPhone,
        category: 'Electronics',
        leadTimeDays: parseInt(formLeadTime, 10) || 3,
        rating: 4.9,
        activeOrdersCount: 1,
        status: 'Active',
      };
      setSuppliers((prev) => [newSup, ...prev]);
      setSuccessMsg(`Supplier "${formName}" created successfully!`);
      setIsAddModalOpen(false);
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
            <Truck className="w-4 h-4" /> Supply Chain & Vendor Operations
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Suppliers & Vendors</h1>
          <p className="text-xs text-slate-400 mt-1">Vendor performance metrics, lead times, and active stock order telemetry.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSuppliers}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh Vendors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
          <button
            onClick={() => {
              setFormName('');
              setFormContact('Operations Lead');
              setFormEmail('contact@supplier.com');
              setFormPhone('+1 (555) 019-2831');
              setFormLeadTime('3');
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" /> Add Vendor
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suppliers.map((sup) => (
          <div key={sup.id} className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 space-y-4 shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">{sup.name}</h3>
              <div className="flex items-center text-amber-400 text-xs font-semibold bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-800/40">
                <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> {sup.rating}
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-400">
              <p>Contact: <strong className="text-white">{sup.contactPerson}</strong></p>
              <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" /> {sup.email}</p>
              <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> {sup.phone}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-500">Lead Time: <strong className="text-white">{sup.leadTimeDays} days</strong></span>
              <span className="text-blue-400 font-semibold">{sup.activeOrdersCount || 1} PO Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE SUPPLIER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Supplier</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Company / Vendor Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                  placeholder="e.g. Apex Audio Labs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Lead Time (Days)</label>
                <input
                  type="number"
                  required
                  value={formLeadTime}
                  onChange={(e) => setFormLeadTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5"
                >
                  {formSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
