'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/api';
import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    AlertCircle,
    ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-[#111] border border-white/10 p-6 rounded-3xl hover:border-white/20 transition-all group relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-${color}-500/10 transition-colors`}></div>

        <div className="flex items-start justify-between mb-4 relative">
            <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex items-center text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
            </div>
        </div>

        <div className="relative">
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
        </div>
    </motion.div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0,
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');

                setStats({
                    products: data.products,
                    orders: data.orders,
                    users: data.users,
                    revenue: data.revenue,
                    loading: false,
                    error: null
                });
            } catch (err) {
                console.error('Dashboard error:', err);
                setStats(prev => ({ ...prev, loading: false, error: 'Failed to load dashboard data' }));
            }
        };

        fetchStats();
    }, []);

    if (stats.loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (stats.error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{stats.error}</h3>
                <button
                    onClick={() => window.location.reload()}
                    className="text-blue-400 hover:text-blue-300 transition font-medium"
                >
                    Try again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Dashboard</h1>
                    <p className="text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Last updated: {new Date().toLocaleTimeString()}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-white text-black font-bold rounded-xl hover:bg-blue-500 hover:text-white transition flex items-center shadow-lg active:scale-95">
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Export Data
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value={stats.products}
                    icon={Package}
                    color="blue"
                    delay={0.1}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.orders}
                    icon={ShoppingCart}
                    color="purple"
                    delay={0.2}
                />
                <StatCard
                    title="Total Users"
                    value={stats.users}
                    icon={Users}
                    color="pink"
                    delay={0.3}
                />
                <StatCard
                    title="Total Revenue"
                    value={`$${stats.revenue}`}
                    icon={DollarSign}
                    color="green"
                    delay={0.4}
                />
            </div>

            {/* Quick Actions / Activity Feed Placeholder */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#111] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white">Recent Sales Activity</h2>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-3 py-1.5 rounded-full">Live Feed</span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <TrendingUp className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-gray-500 max-w-xs leading-relaxed">
                            Sales charts and detailed interaction history will appear here as orders are placed.
                        </p>
                    </div>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-8 text-center">Quick Actions</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Add New Product', href: '/admin/products', icon: Package },
                            { label: 'View All Orders', href: '/admin/orders', icon: ShoppingCart },
                            { label: 'Manage Customers', href: '/admin/users', icon: Users }
                        ].map((action, i) => (
                            <a
                                key={i}
                                href={action.href}
                                className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-white/10 transition group"
                            >
                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 mr-4">
                                    <action.icon className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-gray-300 group-hover:text-white transition">{action.label}</span>
                                <ArrowUpRight className="w-4 h-4 ml-auto text-gray-600 group-hover:text-blue-400 transition" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
