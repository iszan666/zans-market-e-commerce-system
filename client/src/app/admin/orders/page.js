'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import {
    Check,
    X,
    Info,
    ExternalLink,
    ShoppingBag,
    Clock,
    Truck,
    CreditCard,
    Search,
    Filter,
    ArrowUpRight,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders');
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders');
            console.error('Error fetching orders', error);
        } finally {
            setLoading(false);
        }
    };

    const deliverHandler = async (orderId) => {
        try {
            await api.put(`/orders/${orderId}/deliver`);
            toast.success('Order marked as delivered!');
            fetchOrders(); // Refresh list
        } catch (error) {
            toast.error('Failed to update status');
            console.error(error);
        }
    };

    const StatusBadge = ({ condition, trueText, falseText, icon: Icon, activeColor }) => (
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border font-bold text-[10px] uppercase tracking-widest ${condition
                ? `bg-${activeColor}-500/10 text-${activeColor}-400 border-${activeColor}-500/20`
                : 'bg-white/5 text-gray-500 border-white/5'
            }`}>
            {condition ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            <span>{condition ? trueText : falseText}</span>
        </div>
    );

    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.user && order.user.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                <p className="text-gray-500 font-medium animate-pulse">Syncing logistics data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Order Management</h1>
                        <p className="text-gray-500 font-medium text-sm">Monitor sales performance and fulfillment</p>
                    </div>
                </div>

                <div className="flex bg-[#111] border border-white/10 rounded-2xl p-4 divide-x divide-white/10">
                    <div className="px-6 text-center">
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Total Orders</p>
                        <p className="text-2xl font-black text-white">{orders.length}</p>
                    </div>
                    <div className="px-6 text-center">
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-1">Pending Delivery</p>
                        <p className="text-2xl font-black text-blue-400">{orders.filter(o => !o.isDelivered).length}</p>
                    </div>
                </div>
            </header>

            {/* Content Table Container */}
            <div className="bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                {/* Table Toolbar */}
                <div className="p-6 border-b border-white/5 bg-white/5 backdrop-blur-md flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search orders or customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition">
                            <Filter className="w-4 h-4 mr-2" /> Filter By Status
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/50 border-b border-white/10">
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Order Info</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] hidden md:table-cell">Customer</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] text-center">Payments</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] text-center">Fulfillment</th>
                                <th className="px-6 py-5 text-xs font-bold text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <AnimatePresence>
                                {filteredOrders.map((order, index) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        {/* Order Info */}
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-black text-sm uppercase tracking-tighter">#{order._id.substring(0, 8)}</p>
                                                    <p className="text-gray-500 text-[10px] font-bold mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Customer */}
                                        <td className="px-6 py-5 hidden md:table-cell">
                                            <div className="max-w-[150px]">
                                                <p className="text-gray-200 font-bold truncate">{order.user ? order.user.name : 'Unknown'}</p>
                                                <div className="flex items-center mt-1 text-[10px] font-bold text-blue-500/60 uppercase tracking-widest">
                                                    <CreditCard className="w-3 h-3 mr-1" />
                                                    {order.paymentMethod}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Payments */}
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center space-y-2">
                                                <p className="text-lg font-black text-white">${order.totalPrice}</p>
                                                <StatusBadge
                                                    condition={order.isPaid}
                                                    trueText="Paid"
                                                    falseText="Unpaid"
                                                    activeColor="green"
                                                />
                                            </div>
                                        </td>

                                        {/* Fulfillment */}
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col items-center space-y-2">
                                                <StatusBadge
                                                    condition={order.isDelivered}
                                                    trueText="Delivered"
                                                    falseText="Processing"
                                                    activeColor="blue"
                                                />
                                                {!order.isDelivered && order.isPaid && (
                                                    <button
                                                        onClick={() => deliverHandler(order._id)}
                                                        className="text-[10px] font-black text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/30 uppercase tracking-widest transition"
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                )}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-5 text-right">
                                            <Link
                                                href={`/order/${order._id}`}
                                                className="p-3 rounded-xl bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white transition inline-flex items-center shadow-lg active:scale-90"
                                            >
                                                <ArrowUpRight className="w-5 h-5 mr-2" />
                                                <span className="text-xs font-black uppercase tracking-widest">Details</span>
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="py-32 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Info className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your search query or filter settings.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

