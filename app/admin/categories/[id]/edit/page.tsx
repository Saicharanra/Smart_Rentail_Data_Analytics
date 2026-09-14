'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, FolderTree, AlertCircle } from 'lucide-react';

export default function AdminEditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.id as string;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/categories/${categoryId}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setName(data.data.name);
          setSlug(data.data.slug);
          setDescription(data.data.description || '');
          setImageUrl(data.data.imageUrl || '');
        } else {
          setError(data.message || 'Category not found.');
        }
      } catch (err: any) {
        setError('Failed to load category.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name,
          slug,
          description,
          imageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/admin/categories');
      } else {
        setError(data.message || 'Failed to update category.');
      }
    } catch (err: any) {
      setError('An error occurred while updating category.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs animate-pulse flex items-center justify-center gap-2 font-sans">
        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" /> Loading category editor...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans">
      <Link
        href="/admin/categories"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Categories
      </Link>

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-md space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1">
            <FolderTree className="w-4 h-4" /> Edit Category Partition
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Edit Category: {name}</h1>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Category Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">URL Slug *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-emerald-500 outline-none text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Banner Artwork Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:border-emerald-500 outline-none text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <Link
              href="/admin/categories"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating Category...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
