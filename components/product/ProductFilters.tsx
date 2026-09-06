'use client';

import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { MOCK_CATEGORIES } from '@/lib/mock-data';

interface ProductFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  priceRange: number;
  setPriceRange: (p: number) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  resetFilters: () => void;
}

export function ProductFilters({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  resetFilters,
}: ProductFiltersProps) {
  return (
    <div className="bg-navy-900/80 border border-teal-500/30 rounded-2xl p-6 space-y-6 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
        <div className="flex items-center gap-2 ui-h3 text-[20px] font-medium text-white">
          <Filter className="w-5 h-5 text-teal-300" />
          Filter Catalog
        </div>
        <button
          onClick={resetFilters}
          className="ui-caption text-[14px] text-slate-300 hover:text-teal-300 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label className="ui-caption text-[14px] font-semibold text-slate-200 block">Search Products</label>
        <div className="relative">
          <Search className="w-4 h-4 text-teal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Name, SKU, or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 bg-navy-950 border border-teal-500/30 rounded-xl ui-caption text-[14px] text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
          />
        </div>
      </div>

      {/* Categories Selection */}
      <div className="space-y-2">
        <label className="ui-caption text-[14px] font-semibold text-slate-200 block">Categories</label>
        <div className="space-y-1.5">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl ui-caption text-[14px] transition-colors flex justify-between items-center ${
              selectedCategory === 'All'
                ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40'
                : 'text-slate-300 hover:bg-navy-800/80 hover:text-white'
            }`}
          >
            <span>All Categories</span>
            <span className="font-mono text-[12px] text-teal-400/80">12</span>
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl ui-caption text-[14px] transition-colors flex justify-between items-center ${
                selectedCategory === cat.name
                  ? 'bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40'
                  : 'text-slate-300 hover:bg-navy-800/80 hover:text-white'
              }`}
            >
              <span>{cat.name}</span>
              <span className="font-mono text-[12px] text-teal-400/80">{cat.itemCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Filter Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center ui-caption text-[14px]">
          <label className="font-semibold text-slate-200">Max Price Filter</label>
          <span className="font-mono font-bold text-teal-300">₹{priceRange.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="60000"
          step="1000"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-teal-400 bg-navy-950 rounded-lg cursor-pointer h-2"
        />
      </div>

      {/* Sort Option */}
      <div className="space-y-2 pt-2 border-t border-teal-500/20">
        <label className="ui-caption text-[14px] font-semibold text-slate-200 block">Sort Order</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-navy-950 border border-teal-500/30 rounded-xl ui-caption text-[14px] text-white focus:outline-none focus:border-teal-400"
        >
          <option value="featured">Featured & Trending</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
}
