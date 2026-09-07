'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { MOCK_CATEGORIES, MOCK_PRODUCTS, Product } from '@/lib/mock-data';
import { getProductImageUrl } from '@/lib/utils/product-images';
import { FolderTree, ArrowLeft, Search, Filter, Sparkles, Layers } from 'lucide-react';

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    async function fetchCategoryDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/categories/${categoryId}`);
        const data = await res.json();
        if (res.ok && data.data) {
          setCategory(data.data);
          if (data.data.products && data.data.products.length > 0) {
            const mappedProds: Product[] = data.data.products.map((p: any, idx: number) => ({
              id: p.id,
              name: p.name,
              sku: p.sku || `SKU-${p.id.slice(0, 6)}`,
              category: data.data.name,
              price: Number(p.price),
              rating: p.rating || 4.8,
              reviewCount: p.reviewCount || 15,
              stock: p.totalStock !== undefined ? p.totalStock : 40,
              reorderPoint: 10,
              inStock: (p.totalStock !== undefined ? p.totalStock : 40) > 0,
              image: getProductImageUrl(p.imageUrl, data.data.slug || data.data.name, idx),
              description: p.description || '',
              features: [],
              specs: {},
              supplier: 'Smart Retail Direct',
            }));
            setProducts(mappedProds);
          } else {
            // Fallback to mock products for this category
            const categoryName = data.data.name;
            const filteredMock = MOCK_PRODUCTS.filter(
              (p) => p.category.toLowerCase() === categoryName.toLowerCase()
            );
            setProducts(filteredMock.length > 0 ? filteredMock : MOCK_PRODUCTS);
          }
        } else {
          // Fallback mock category matching
          const foundCat = MOCK_CATEGORIES.find(
            (c) => c.id === categoryId || c.slug === categoryId || c.name.toLowerCase() === categoryId.toLowerCase()
          );
          if (foundCat) {
            setCategory(foundCat);
            const filteredMock = MOCK_PRODUCTS.filter(
              (p) => p.category.toLowerCase() === foundCat.name.toLowerCase()
            );
            setProducts(filteredMock.length > 0 ? filteredMock : MOCK_PRODUCTS);
          } else {
            setCategory({
              name: categoryId.replace(/-/g, ' ').toUpperCase(),
              description: 'Collection of smart electronics and hardware.',
              itemCount: MOCK_PRODUCTS.length,
            });
            setProducts(MOCK_PRODUCTS);
          }
        }
      } catch (err) {
        console.error('Failed to load category details:', err);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    if (categoryId) {
      fetchCategoryDetails();
    }
  }, [categoryId]);

  const filteredProducts = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Back Link */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-xs font-mono text-teal-300 hover:text-teal-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Categories
        </Link>

        {/* Category Header Banner */}
        <div className="bg-navy-900/90 border border-teal-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-4 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-mono font-bold border border-teal-500/30">
                <Layers className="w-3.5 h-3.5" /> Category Partition
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {category?.name || 'Category Collection'}
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                {category?.description || 'Browse curated products in this retail category.'}
              </p>
            </div>
            <div className="bg-navy-950/80 border border-teal-500/20 px-6 py-4 rounded-2xl text-center shrink-0">
              <span className="text-2xl font-extrabold text-white font-mono block">
                {filteredProducts.length}
              </span>
              <span className="text-xs text-teal-300 font-mono">Available SKUs</span>
            </div>
          </div>
        </div>

        {/* Search & Sort Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-navy-900/80 border border-teal-500/20 p-4 rounded-2xl backdrop-blur-md">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search category products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-navy-950 border border-teal-500/30 rounded-xl text-xs text-white placeholder-slate-400 outline-none focus:border-teal-400"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-300 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-navy-950 border border-teal-500/30 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-teal-400"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 text-center text-teal-300 animate-pulse text-sm">
            Loading category products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-navy-900/80 border border-teal-500/20 rounded-3xl p-12 text-center space-y-4">
            <p className="text-slate-300 text-sm">No products found matching your search filter.</p>
            <button
              onClick={() => setSearch('')}
              className="px-4 py-2 rounded-xl bg-teal-500 text-navy-950 font-semibold text-xs"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
