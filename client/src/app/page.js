'use client';

import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import { Sparkles, ArrowRight, ShoppingBag, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load products. Checking connection...');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-black to-[#0a0a0a] border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        <div className="relative px-8 py-20 md:py-32 md:px-16 flex flex-col items-start gap-6 max-w-4xl mx-auto text-center md:text-left md:mx-0">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4 mr-2" /> New Arrivals
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
            Unleash Innovation <br /> with Premium Tech
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Discover the latest generation of devices designed to elevate your workflow, gaming, and daily life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full md:w-auto">
            <button className="px-8 py-3.5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition transform active:scale-95">
              Shop Collection
            </button>
            <button className="px-8 py-3.5 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition flex items-center justify-center">
              View Deals <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Latest Products</h2>
            <p className="text-gray-400">Hand-picked essentials just for you.</p>
          </div>
          <Link href="/products" className="text-blue-400 hover:text-blue-300 hidden md:block">
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl bg-[#0a0a0a] border border-white/5 shadow-inner flex flex-col items-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/5">
              <ShoppingBag className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Your Shop is Ready!</h3>
            <p className="text-gray-400 text-center mb-10 max-w-md leading-relaxed selection:bg-blue-500/30">
              It looks like you haven't added any products yet. {user?.isAdmin ? "Ready to launch your first tech masterpiece?" : "Stay tuned! Our premium collection is coming soon."}
            </p>
            {user?.isAdmin ? (
              <Link
                href="/admin/products"
                className="group px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-blue-500 hover:text-white transition-all duration-300 flex items-center shadow-xl hover:shadow-blue-500/20 active:scale-95"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Manage Products
              </Link>
            ) : (
              <div className="text-sm font-semibold uppercase tracking-widest text-blue-500/50 flex items-center">
                <span className="w-10 h-px bg-blue-500/20 mr-4"></span>
                Coming Soon
                <span className="w-10 h-px bg-blue-500/20 ml-4"></span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Features Banner */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="p-8 rounded-2xl bg-[#111] border border-white/10 hover:border-blue-500/30 transition duration-300">
          <h3 className="font-bold text-xl mb-2 text-white">Free Shipping</h3>
          <p className="text-gray-400 text-sm">On all orders over $100. Fast delivery directly to your doorstep.</p>
        </div>
        <div className="p-8 rounded-2xl bg-[#111] border border-white/10 hover:border-purple-500/30 transition duration-300">
          <h3 className="font-bold text-xl mb-2 text-white">Secure Payment</h3>
          <p className="text-gray-400 text-sm">Your payment information is processed securely. We don't store your details.</p>
        </div>
        <div className="p-8 rounded-2xl bg-[#111] border border-white/10 hover:border-pink-500/30 transition duration-300">
          <h3 className="font-bold text-xl mb-2 text-white">24/7 Support</h3>
          <p className="text-gray-400 text-sm">Need help? Our expert support team is available around the clock.</p>
        </div>
      </section>
    </div>
  );
}
