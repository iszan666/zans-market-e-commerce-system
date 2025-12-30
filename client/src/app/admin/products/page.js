'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { Edit, Trash2, Plus, Info, Search, Filter, Package, ExternalLink, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error) {
            toast.error('Failed to load products');
            console.error('Error fetching products', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter((p) => p._id !== id));
                toast.success(`${name} deleted successfully`);
            } catch (error) {
                console.error(error);
                toast.error('Failed to delete product');
            }
        }
    };

    const createProductHandler = async () => {
        try {
            const { data: createdProduct } = await api.post('/products');
            toast.success('Product placeholder created');
            router.push(`/admin/products/${createdProduct._id}/edit`);
        } catch (error) {
            console.error(error);
            toast.error('Failed to create product');
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-500 font-medium animate-pulse">Syncing product data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                        <Package className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Products</h1>
                        <p className="text-gray-500 font-medium">Manage and monitor your shop inventory</p>
                    </div>
                </div>
                <button
                    onClick={createProductHandler}
                    className="flex items-center justify-center bg-white text-black font-extrabold px-6 py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition transform active:scale-95 shadow-xl shadow-white/5 group"
                >
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                    Create New Item
                </button>
            </header>

            {/* Content Table Container */}
            <div className="bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                {/* Table Toolbar */}
                <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-md flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, category or brand..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition">
                            <Filter className="w-4 h-4 mr-2" /> Filter
                        </button>
                        <div className="text-xs font-bold text-gray-600 bg-white/5 px-4 py-3 rounded-xl border border-white/10 uppercase tracking-widest whitespace-nowrap">
                            {products.length} Total Items
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/50 border-b border-white/10">
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Product Info</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] hidden md:table-cell">Details</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Price</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {products.map((product, index) => (
                                    <motion.tr
                                        key={product._id}
                                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        {/* Product Info Column */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center">
                                                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 group-hover:border-blue-500/30 transition-colors bg-black">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                                                    />
                                                </div>
                                                <div className="ml-5 max-w-xs md:max-w-md">
                                                    <p className="text-white font-black text-lg group-hover:text-blue-400 transition-colors line-clamp-1">{product.name}</p>
                                                    <div className="flex items-center mt-1 space-x-3">
                                                        <span className="text-[10px] font-bold bg-white/5 text-gray-500 px-2 py-0.5 rounded uppercase tracking-tighter">ID: {product._id.substring(0, 8)}...</span>
                                                        <a href={`/product/${product._id}`} target="_blank" className="text-gray-600 hover:text-white transition flex items-center text-[10px] font-bold uppercase tracking-widest">
                                                            View Shop <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Details Column */}
                                        <td className="px-6 py-5 hidden md:table-cell">
                                            <div className="flex flex-col space-y-1">
                                                <span className="text-sm font-bold text-gray-300">{product.brand}</span>
                                                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">{product.category}</span>
                                            </div>
                                        </td>

                                        {/* Price Column */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-baseline">
                                                <span className="text-blue-500 text-xs font-black mr-1">$</span>
                                                <span className="text-xl font-black text-white">{product.price}</span>
                                            </div>
                                        </td>

                                        {/* Actions Column */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link
                                                    href={`/admin/products/${product._id}/edit`}
                                                    className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition transform active:scale-90"
                                                >
                                                    <Edit className="w-5 h-5" />
                                                </Link>
                                                <button
                                                    onClick={() => deleteHandler(product._id, product.name)}
                                                    className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition transform active:scale-90"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {products.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 text-center flex flex-col items-center"
                    >
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Package className="w-12 h-12 text-gray-700" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No products available</h3>
                        <p className="text-gray-500 max-w-xs mb-8">Get started by creating your first digital masterwork for the store.</p>
                        <button
                            onClick={createProductHandler}
                            className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-blue-500 hover:text-white transition shadow-xl"
                        >
                            Quick Start Guide
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Pagination / Footer Placeholder */}
            <div className="flex items-center justify-between px-8 py-6 bg-[#111] border border-white/10 rounded-[2rem] text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
                <div className="flex items-center space-x-2">
                    <span className="text-white">Page 1</span> of 1
                </div>
                <div className="flex items-center space-x-6">
                    <button className="opacity-30 cursor-not-allowed">Previous</button>
                    <button className="opacity-30 cursor-not-allowed">Next</button>
                </div>
            </div>
        </div>
    );
}

