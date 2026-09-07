'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  User,
  Mail,
  ShieldCheck,
  CreditCard,
  LogOut,
  ShoppingBag,
  LayoutDashboard,
  CheckCircle2,
  Package,
  ArrowRight,
  MapPin,
  Phone,
  Save,
  Loader2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ProfileData {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  customer?: {
    id: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
    segment: string | null;
  } | null;
}

export default function CustomerProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('USA');

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/profile', { headers: getAuthHeaders() });
      const data = await res.json();
      if (res.ok && data.success) {
        setProfile(data.data);
        setName(data.data.name || '');
        if (data.data.customer) {
          setPhone(data.data.customer.phone || '');
          setAddress(data.data.customer.address || '');
          setCity(data.data.customer.city || '');
          setState(data.data.customer.state || '');
          setPostalCode(data.data.customer.postalCode || '');
          setCountry(data.data.customer.country || 'USA');
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to fetch profile' });
      }
    } catch (err: any) {
      console.error('Failed to load profile', err);
      setMessage({ type: 'error', text: 'Error connecting to profile server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          phone,
          address,
          city,
          state,
          postalCode,
          country,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Profile & delivery details saved successfully!' });
        // Synchronize local storage user info
        const storedUser = localStorage.getItem('user_info');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            parsed.name = name;
            localStorage.setItem('user_info', JSON.stringify(parsed));
            window.dispatchEvent(new Event('auth_change'));
          } catch (e) {}
        }
        await fetchProfile();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Server error while saving profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    window.dispatchEvent(new Event('auth_change'));
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="ui-caption text-[14px] text-teal-300 animate-pulse flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading Account Profile...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
        <Navbar />
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-20 text-center space-y-6">
          <div className="bg-navy-900/90 border border-teal-500/30 rounded-3xl p-10 shadow-2xl space-y-4 backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 mx-auto flex items-center justify-center border border-teal-500/30">
              <User className="w-8 h-8" />
            </div>
            <h1 className="ui-h1 text-[28px] font-bold text-white">Not Signed In</h1>
            <p className="ui-body text-[16px] text-slate-300 max-w-md mx-auto">
              Please sign in to view your account details, order history, and saved preferences.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[18px] font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
              >
                Sign In Now <ArrowRight className="w-5 h-5 text-navy-950" />
              </Link>
            </div>
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
        {/* Account Banner */}
        <div className="bg-navy-900/90 border border-teal-500/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-300 p-0.5 shadow-xl shrink-0">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center text-teal-300 font-bold text-2xl font-heading">
                {profile.name ? profile.name.charAt(0).toUpperCase() : profile.email.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="ui-h1 text-[28px] font-bold text-white tracking-tight">
                  {profile.name || 'Smart Retail Customer'}
                </h1>
                <span className="ui-caption text-[12px] font-mono font-bold px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  {profile.role} ROLE
                </span>
                {profile.customer?.segment && (
                  <span className="ui-caption text-[12px] font-mono font-bold px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {profile.customer.segment} Segment
                  </span>
                )}
              </div>
              <p className="ui-caption text-[14px] text-slate-300 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-4 h-4 text-teal-400" /> {profile.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {profile.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 ui-caption text-[14px] font-semibold flex items-center gap-2 transition-all shadow-md"
              >
                <LayoutDashboard className="w-4 h-4 text-navy-950" /> Admin Portal
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-xl bg-navy-800 hover:bg-red-500/20 border border-teal-500/30 text-red-300 hover:text-red-200 ui-caption text-[14px] font-semibold flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Edit Profile Form */}
          <div className="lg:col-span-8 bg-navy-900/80 border border-teal-500/20 rounded-3xl p-8 space-y-6 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
              <div>
                <h2 className="ui-h2 text-[22px] font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-400" /> Account & Shipping Address
                </h2>
                <p className="ui-caption text-[13px] text-slate-400 mt-0.5">
                  Update your contact details and default shipping address for seamless express checkout.
                </p>
              </div>
            </div>

            {message && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                  message.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                    : 'bg-red-950/80 border border-red-800 text-red-300'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                {message.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-teal-500/30 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-teal-400" /> Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-teal-500/30 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" /> Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Retail Ave, Suite 100"
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-teal-500/30 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Seattle"
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-teal-500/30 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">State / Region</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="WA"
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-teal-500/30 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
                  />
                </div>

                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-300">Postal Code</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="98101"
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-teal-500/30 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="USA"
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-teal-500/30 text-white text-sm focus:outline-none focus:border-teal-400 transition-colors"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-navy-950" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-navy-950" /> Save Profile Details
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Side Cards */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Navigation Card */}
            <div className="bg-navy-900/80 border border-teal-500/20 rounded-3xl p-6 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-2 ui-h3 text-[20px] font-medium text-white">
                <ShoppingBag className="w-5 h-5 text-teal-400" /> Orders & Shopping
              </div>
              <p className="ui-caption text-[14px] text-slate-300">
                Track live order statuses, estimated shipping dates, and view past purchases.
              </p>
              <div className="pt-2 space-y-2">
                <Link
                  href="/orders"
                  className="w-full py-3 rounded-xl bg-navy-800 hover:bg-teal-500/20 border border-teal-500/30 text-white ui-caption text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Package className="w-4 h-4 text-teal-300" /> View Order History
                </Link>
                <Link
                  href="/reviews"
                  className="w-full py-3 rounded-xl bg-navy-800 hover:bg-teal-500/20 border border-teal-500/30 text-white ui-caption text-[14px] font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" /> View My Reviews
                </Link>
              </div>
            </div>

            {/* Account Security Card */}
            <div className="bg-navy-900/80 border border-teal-500/20 rounded-3xl p-6 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-2 ui-h3 text-[20px] font-medium text-white">
                <ShieldCheck className="w-5 h-5 text-teal-400" /> Security & Session
              </div>
              <div className="space-y-3 ui-caption text-[14px]">
                <div className="flex justify-between items-center bg-navy-950/80 p-3 rounded-xl border border-teal-500/20">
                  <span className="text-slate-300">Authentication</span>
                  <span className="text-teal-300 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> JWT Session
                  </span>
                </div>
                <div className="flex justify-between items-center bg-navy-950/80 p-3 rounded-xl border border-teal-500/20">
                  <span className="text-slate-300">Account Role</span>
                  <span className="text-white font-mono font-semibold">{profile.role}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
