'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters } from '@/components/product/ProductFilters';
import { MOCK_PRODUCTS, Product } from '@/lib/mock-data';
import { getProductImageUrl } from '@/lib/utils/product-images';
import { ShoppingBag, ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(60000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(MOCK_PRODUCTS.length);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProductsFromAPI() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.set('search', searchQuery);
        if (selectedCategory && selectedCategory !== 'All') queryParams.set('category', selectedCategory);
        if (priceRange) queryParams.set('maxPrice', priceRange.toString());
        if (sortBy) queryParams.set('sortBy', sortBy);
        queryParams.set('page', page.toString());
        queryParams.set('limit', '9');

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        const data = await res.json();

        if (res.ok && data.data && data.data.length > 0) {
          const mapped: Product[] = data.data.map((p: any, idx: number) => ({
            id: p.id,
            name: p.name,
            sku: p.sku || `SKU-${p.id.slice(0, 6)}`,
            category: p.category?.name || 'Smart Electronics',
            price: Number(p.price),
            rating: p.rating || 4.8,
            reviewCount: p.reviewCount || 12,
            stock: p.totalStock !== undefined ? p.totalStock : 50,
            reorderPoint: p.reorderPoint || 15,
            inStock: (p.totalStock !== undefined ? p.totalStock : 50) > 0,
            image: getProductImageUrl(p.imageUrl, p.category?.slug || p.category?.name, idx),
            description: p.description || '',
            features: [],
            specs: {},
            supplier: p.supplier?.name || 'Apex Audio Tech',
          }));
          setProducts(mapped);
          if (data.pagination) {
            setTotalPages(data.pagination.totalPages || 1);
            setTotalCount(data.pagination.totalCount || mapped.length);
          }
        } else {
          // Fallback to MOCK_PRODUCTS filtering if API returns empty set
          const filteredMock = MOCK_PRODUCTS.filter((prod) => {
            const matchesCat = selectedCategory === 'All' || prod.category === selectedCategory;
            const matchesSearch =
              prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesPrice = prod.price <= priceRange;
            return matchesCat && matchesSearch && matchesPrice;
          }).sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0;
          });

          setProducts(filteredMock);
          setTotalCount(filteredMock.length);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Failed to fetch storefront products:', err);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    fetchProductsFromAPI();
  }, [selectedCategory, searchQuery, priceRange, sortBy, page]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange(60000);
    setSortBy('featured');
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Page Header */}
        <div className="bg-navy-900/80 border border-teal-500/30 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2 ui-caption text-[14px] font-medium text-teal-300 uppercase tracking-widest mb-2 font-mono">
            <ShoppingBag className="w-4 h-4 text-teal-400" /> Premium Product Storefront
          </div>
          <h1 className="ui-h1 text-[32px] sm:text-[40px] font-bold text-white tracking-tight">
            Explore Smart Devices & Retail Hardware
          </h1>
          <p className="ui-body text-[16px] text-slate-200 mt-2 max-w-2xl">
            Browse our curated collection of studio-grade audio hardware, ergonomic office setups, biometric wearables, and smart home automation hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <ProductFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={(cat) => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              searchQuery={searchQuery}
              setSearchQuery={(q) => {
                setSearchQuery(q);
                setPage(1);
              }}
              priceRange={priceRange}
              setPriceRange={(p) => {
                setPriceRange(p);
                setPage(1);
              }}
              sortBy={sortBy}
              setSortBy={(s) => {
                setSortBy(s);
                setPage(1);
              }}
              resetFilters={resetFilters}
            />
          </div>

          {/* Product Grid Main Section */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between bg-navy-900/60 border border-teal-500/20 px-5 py-3.5 rounded-2xl ui-caption text-[14px] text-slate-300">
              <span>
                Showing <strong className="text-white font-mono">{products.length}</strong> of{' '}
                <strong className="text-white font-mono">{totalCount}</strong> products
              </span>
              <span className="font-mono text-teal-300 font-semibold text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Server-Filtered DirectQuery
              </span>
            </div>

            {loading ? (
              <div className="py-20 text-center text-teal-300 animate-pulse text-sm flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading Product Storefront...
              </div>
            ) : products.length === 0 ? (
              <div className="bg-navy-900/60 border border-teal-500/20 rounded-3xl p-12 text-center space-y-4">
                <p className="ui-body text-[16px] text-slate-200">No products found matching your filters.</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[16px] font-semibold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 pt-6">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      className="px-4 py-2.5 rounded-xl bg-navy-900 border border-teal-500/30 text-white text-xs font-semibold disabled:opacity-40 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <span className="text-xs font-mono text-slate-300">
                      Page <strong className="text-white">{page}</strong> of {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      className="px-4 py-2.5 rounded-xl bg-navy-900 border border-teal-500/30 text-white text-xs font-semibold disabled:opacity-40 flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
