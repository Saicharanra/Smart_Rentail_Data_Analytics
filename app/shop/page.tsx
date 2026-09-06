'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductFilters } from '@/components/product/ProductFilters';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { ShoppingBag } from 'lucide-react';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<number>(60000);
  const [sortBy, setSortBy] = useState<string>('featured');

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      const matchesCategory =
        selectedCategory === 'All' || prod.category === selectedCategory;
      const matchesSearch =
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = prod.price <= priceRange;

      return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, searchQuery, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange(60000);
    setSortBy('featured');
  };

  return (
    <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header (H1: 32px, bold, Poppins/Montserrat) */}
        <div className="mb-8 bg-navy-900/80 border border-teal-500/30 rounded-3xl p-8 backdrop-blur-md">
          <div className="flex items-center gap-2 ui-caption text-[14px] font-medium text-teal-300 uppercase tracking-widest mb-2 font-mono">
            <ShoppingBag className="w-4 h-4 text-teal-400" /> Premium Product Storefront
          </div>
          <h1 className="ui-h1 text-[32px] font-bold text-white tracking-tight">
            Explore Smart Devices & Gear
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
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              resetFilters={resetFilters}
            />
          </div>

          {/* Product Grid Main Section */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between bg-navy-900/60 border border-teal-500/20 px-4 py-3 rounded-2xl ui-caption text-[14px] text-slate-300">
              <span>
                Showing <strong className="text-white">{filteredProducts.length}</strong> products
              </span>
              <span className="font-mono text-teal-300 font-semibold">In Stock & Verified</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-navy-900/60 border border-teal-500/20 rounded-3xl p-12 text-center space-y-4">
                <p className="ui-body text-[16px] text-slate-200">No products found matching your filters.</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-navy-950 ui-btn text-[18px] font-semibold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
