'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MOCK_PRODUCTS, Product } from '@/lib/mock-data';
import { getProductImageUrl } from '@/lib/utils/product-images';
import { useCart } from '@/lib/cart-context';
import { formatCurrency } from '@/lib/utils';
import {
  Star,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  MessageSquare,
  Send,
  Loader2,
  Lock
} from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, revRes] = await Promise.all([
          fetch(`/api/products/${productId}`),
          fetch(`/api/reviews?productId=${productId}`),
        ]);

        const prodData = await prodRes.json();
        const revData = await revRes.json();

        if (prodRes.ok && prodData.data) {
          const p = prodData.data;
          setProduct({
            id: p.id,
            name: p.name,
            sku: p.sku || `SKU-${p.id.slice(0, 6)}`,
            category: p.category?.name || 'Smart Hardware',
            price: Number(p.price),
            rating: p.rating || 4.8,
            reviewCount: p.reviews?.length || 1,
            stock: p.totalStock !== undefined ? p.totalStock : 45,
            reorderPoint: 10,
            inStock: (p.totalStock !== undefined ? p.totalStock : 45) > 0,
            image: getProductImageUrl(p.imageUrl, p.category?.slug || p.category?.name),
            description: p.description || '',
            features: [' studio-grade processing', 'Ultra-low latency', 'High durability'],
            specs: { 'Model SKU': p.sku, Partition: p.category?.name || 'Smart Tech' },
            supplier: p.supplier?.name || 'Apex Audio Tech',
          });
        } else {
          const fallback = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
          setProduct(fallback);
        }

        if (revRes.ok && revData.data) {
          setReviews(revData.data);
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
        const fallback = MOCK_PRODUCTS.find((p) => p.id === productId) || MOCK_PRODUCTS[0];
        setProduct(fallback);
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadData();
    }
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSubmittingReview(true);
    setReviewMsg('');

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productId: product.id,
          rating: newRating,
          title: newTitle || 'Great product!',
          comment: newComment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');

      setReviewMsg('Thank you! Your review has been submitted.');
      setNewComment('');
      setNewTitle('');
      
      // Update reviews list
      setReviews((prev) => [
        {
          id: data.data?.id || `rev-${Date.now()}`,
          author: data.data?.author || 'Verified Buyer',
          rating: newRating,
          title: newTitle || 'Great product!',
          comment: newComment,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err: any) {
      setReviewMsg(err.message || 'Error submitting review. Please sign in first.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-teal-300 animate-pulse text-sm">Loading Product Details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = MOCK_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div className="flex flex-col min-h-screen bg-navy-gradient text-slate-100 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-mono text-teal-300 hover:text-teal-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Storefront
        </button>

        {/* Product Details Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Gallery Image */}
          <div className="lg:col-span-6 bg-navy-900/80 border border-teal-500/30 rounded-3xl p-6 relative overflow-hidden h-[400px] lg:h-[480px] shadow-2xl backdrop-blur-xl">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>

          {/* Right Product Specs & Actions */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {product.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{product.sku}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-white">{product.rating}</span>
                <span className="text-xs text-slate-300">({reviews.length || product.reviewCount} customer reviews)</span>
              </div>

              {/* Pricing & Stock */}
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl font-extrabold font-mono text-white">
                  {formatCurrency(product.price)}
                </span>
                <div className="ml-auto">
                  {product.stock <= product.reorderPoint ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" /> Low Stock ({product.stock} left)
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 rounded-full bg-teal-950/60 text-teal-300 border border-teal-800/60 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4 pt-6 border-t border-teal-500/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-teal-500/30 bg-navy-950 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-mono font-bold text-white text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
                >
                  <ShoppingCart className="w-4 h-4 text-navy-950" /> Add {quantity} to Cart
                </button>
              </div>

              {/* Delivery info */}
              <div className="grid grid-cols-3 gap-3 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2 bg-navy-950/60 p-3 rounded-xl border border-teal-500/20">
                  <Truck className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 bg-navy-950/60 p-3 rounded-xl border border-teal-500/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>2 Year Warranty</span>
                </div>
                <div className="flex items-center gap-2 bg-navy-950/60 p-3 rounded-xl border border-teal-500/20">
                  <RotateCcw className="w-4 h-4 text-teal-300 shrink-0" />
                  <span>30 Days Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Write Review Form */}
          <div className="lg:col-span-5 bg-navy-900/80 border border-teal-500/20 rounded-3xl p-6 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <MessageSquare className="w-5 h-5 text-teal-400" /> Write a Customer Review
            </div>

            {reviewMsg && (
              <div className="p-3 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs">
                {reviewMsg}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Star Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Review Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Excellent studio audio quality!"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 bg-navy-950 border border-teal-500/30 rounded-xl text-white outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Review Comment</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your experience with this retail hardware product..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full p-2.5 bg-navy-950 border border-teal-500/30 rounded-xl text-white outline-none focus:border-teal-400"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {submittingReview ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Product Review
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Customer Reviews List */}
          <div className="lg:col-span-7 bg-navy-900/80 border border-teal-500/20 rounded-3xl p-6 space-y-4 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white">Verified Customer Reviews ({reviews.length})</h2>
            
            {reviews.length === 0 ? (
              <p className="text-slate-400 text-xs py-4">No reviews yet for this product. Be the first to share your feedback!</p>
            ) : (
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-navy-950/70 border border-teal-500/20 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{rev.author}</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.title && <h4 className="font-bold text-teal-300 text-xs">{rev.title}</h4>}
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <h2 className="text-2xl font-bold text-white">Related Products in Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
